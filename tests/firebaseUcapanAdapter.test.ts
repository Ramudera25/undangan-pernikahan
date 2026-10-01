import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })),
  getApps: vi.fn(() => []),
  getDatabase: vi.fn(() => ({ type: 'database' })),
  ref: vi.fn((db: unknown, path: string) => ({ db, path })),
  query: vi.fn((r: unknown) => r),
  orderByChild: vi.fn((c: string) => ({ orderByChild: c })),
  limitToLast: vi.fn((n: number) => ({ limitToLast: n })),
  push: vi.fn(),
  get: vi.fn(),
  onValue: vi.fn(),
  serverTimestamp: vi.fn(() => ({ '.sv': 'timestamp' })),
}));

vi.mock('firebase/app', () => ({
  initializeApp: mocks.initializeApp,
  getApps: mocks.getApps,
}));

vi.mock('firebase/database', () => ({
  getDatabase: mocks.getDatabase,
  ref: mocks.ref,
  query: mocks.query,
  orderByChild: mocks.orderByChild,
  limitToLast: mocks.limitToLast,
  push: mocks.push,
  get: mocks.get,
  onValue: mocks.onValue,
  serverTimestamp: mocks.serverTimestamp,
}));

import { UCAPAN_DB_PATH, FirebaseUcapanAdapter, sanitizeUcapanInput } from '../src/utils/firebaseUcapanAdapter';

function snapshot(val: unknown) {
  return { val: () => val };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('sanitizeUcapanInput', () => {
  it('membersihkan nama/pesan dan memvalidasi gender/attendance', () => {
    const clean = sanitizeUcapanInput({
      name: '  Siti  ',
      message: 'Selamat!',
      gender: 'P',
      attendance: 'Hadir',
    });
    expect(clean).toEqual({ name: 'Siti', message: 'Selamat!', gender: 'P', attendance: 'Hadir' });
  });

  it('gender tak dikenal menjadi netral, attendance tak dikenal menjadi null', () => {
    const clean = sanitizeUcapanInput({
      name: 'A',
      message: 'B',
      gender: 'X' as never,
      attendance: 'Mungkin' as never,
    });
    expect(clean).toMatchObject({ gender: 'netral', attendance: null });
  });

  it('menolak nama/pesan kosong dan memotong yang terlalu panjang', () => {
    expect(sanitizeUcapanInput({ name: '   ', message: 'x' })).toBeNull();
    expect(sanitizeUcapanInput({ name: 'x', message: '' })).toBeNull();
    const clean = sanitizeUcapanInput({ name: 'x'.repeat(100), message: 'y'.repeat(900) });
    expect(clean?.name).toHaveLength(60);
    expect(clean?.message).toHaveLength(500);
  });
});

describe('FirebaseUcapanAdapter', () => {
  it('memakai path ucapan/undangan-bayu-lilik saat query', async () => {
    expect(UCAPAN_DB_PATH).toBe('ucapan/undangan-bayu-lilik');
    mocks.get.mockResolvedValueOnce(snapshot(null));
    await new FirebaseUcapanAdapter().list();
    expect(mocks.ref).toHaveBeenCalledWith(expect.anything(), UCAPAN_DB_PATH);
  });

  it('list() memetakan entri RTDB menjadi GuestComment terbaru-dulu', async () => {
    mocks.get.mockResolvedValueOnce(
      snapshot({
        k1: { name: 'Ayu', message: 'Selamat!', gender: 'P', createdAt: 1759312800000 },
        k2: { name: 'Budi', message: 'Barakallah', gender: 'L', attendance: 'Hadir', createdAt: 1759399200000 },
      }),
    );
    const adapter = new FirebaseUcapanAdapter();
    const list = await adapter.list();
    expect(list.map((c) => c.id)).toEqual(['k2', 'k1']); // terbaru dulu
    expect(list[0]).toMatchObject({ name: 'Budi', message: 'Barakallah', gender: 'L', attendance: 'Hadir' });
    expect(new Date(list[0].createdAt).getTime()).toBe(1759399200000);
    expect(list[1]).toMatchObject({ name: 'Ayu', attendance: null });
  });

  it('list() mengembalikan [] bila snapshot kosong dan membuang entri rusak', async () => {
    mocks.get.mockResolvedValueOnce(snapshot(null));
    expect(await new FirebaseUcapanAdapter().list()).toEqual([]);

    mocks.get.mockResolvedValueOnce(
      snapshot({
        ok: { name: 'Citra', message: 'Langgeng!', createdAt: 1759312800000 },
        rusak: { name: '', message: 'tanpa nama' },
      }),
    );
    const list = await new FirebaseUcapanAdapter().list();
    expect(list.map((c) => c.id)).toEqual(['ok']);
  });

  it('add() menolak input kosong sebelum menyentuh Firebase', async () => {
    const adapter = new FirebaseUcapanAdapter();
    await expect(adapter.add({ name: '   ', message: 'x' })).rejects.toThrow();
    await expect(adapter.add({ name: 'x', message: '' })).rejects.toThrow();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('add() memakai serverTimestamp, menyertakan gender/attendance, id dari push key', async () => {
    const childRef = { key: 'pushKey123' };
    mocks.push.mockResolvedValueOnce(childRef);
    mocks.get.mockResolvedValueOnce(
      snapshot({ name: 'Dewi', message: 'Samawa ya!', gender: 'P', attendance: 'Hadir', createdAt: 1759312800000 }),
    );

    const adapter = new FirebaseUcapanAdapter();
    const saved = await adapter.add({ name: '  Dewi  ', message: 'Samawa ya!   ', gender: 'P', attendance: 'Hadir' });

    expect(mocks.push).toHaveBeenCalledTimes(1);
    const payload = mocks.push.mock.calls[0][1];
    expect(payload).toMatchObject({ name: 'Dewi', message: 'Samawa ya!', gender: 'P', attendance: 'Hadir' });
    expect(payload.createdAt).toEqual({ '.sv': 'timestamp' });
    expect(saved).toMatchObject({ id: 'pushKey123', name: 'Dewi', gender: 'P', attendance: 'Hadir' });
  });

  it('add() tidak mengirim attendance bila null', async () => {
    const childRef = { key: 'k1' };
    mocks.push.mockResolvedValueOnce(childRef);
    mocks.get.mockResolvedValueOnce(
      snapshot({ name: 'Eko', message: 'Halo', gender: 'netral', createdAt: 1759312800000 }),
    );

    await new FirebaseUcapanAdapter().add({ name: 'Eko', message: 'Halo' });
    const payload = mocks.push.mock.calls[0][1];
    expect(payload).not.toHaveProperty('attendance');
    expect(payload.gender).toBe('netral');
  });

  it('subscribe() mendaftarkan onValue dan unsubscribe menghentikannya', async () => {
    const off = vi.fn();
    mocks.onValue.mockReturnValueOnce(off);
    const adapter = new FirebaseUcapanAdapter();
    const cb = vi.fn();
    const unsub = adapter.subscribe(cb);
    expect(mocks.onValue).toHaveBeenCalledTimes(1);

    // simulasikan event realtime → callback dipanggil
    const listener = mocks.onValue.mock.calls[0][1];
    listener(snapshot({}));
    expect(cb).toHaveBeenCalledTimes(1);

    unsub();
    expect(off).toHaveBeenCalledTimes(1);
  });
});
