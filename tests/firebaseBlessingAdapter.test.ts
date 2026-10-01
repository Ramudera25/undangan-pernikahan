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

import {
  BLESSING_DB_PATH,
  FirebaseBlessingAdapter,
} from '../src/utils/firebaseBlessingAdapter';

function snapshot(val: unknown) {
  return { val: () => val };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('FirebaseBlessingAdapter', () => {
  it('memakai path doa/undangan-bayu-lilik saat query', async () => {
    expect(BLESSING_DB_PATH).toBe('doa/undangan-bayu-lilik');
    mocks.get.mockResolvedValueOnce(snapshot(null));
    await new FirebaseBlessingAdapter().list();
    expect(mocks.ref).toHaveBeenCalledWith(expect.anything(), BLESSING_DB_PATH);
  });

  it('list() memetakan entri RTDB menjadi Blessing terbaru-dulu', async () => {
    mocks.get.mockResolvedValueOnce(
      snapshot({
        k1: { name: 'Ayu', message: 'Selamat!', createdAt: 1759312800000 },
        k2: { name: 'Budi', message: 'Barakallah', createdAt: 1759399200000 },
      }),
    );
    const adapter = new FirebaseBlessingAdapter();
    const list = await adapter.list();
    expect(list.map((b) => b.id)).toEqual(['k2', 'k1']); // terbaru dulu
    expect(list[0]).toMatchObject({ name: 'Budi', message: 'Barakallah' });
    expect(new Date(list[0].createdAt).getTime()).toBe(1759399200000);
  });

  it('list() mengembalikan [] bila snapshot kosong dan membuang entri rusak', async () => {
    mocks.get.mockResolvedValueOnce(snapshot(null));
    expect(await new FirebaseBlessingAdapter().list()).toEqual([]);

    mocks.get.mockResolvedValueOnce(
      snapshot({
        ok: { name: 'Citra', message: 'Langgeng!', createdAt: 1759312800000 },
        rusak: { name: '', message: 'tanpa nama' },
      }),
    );
    const list = await new FirebaseBlessingAdapter().list();
    expect(list.map((b) => b.id)).toEqual(['ok']);
  });

  it('add() menolak input kosong sebelum menyentuh Firebase', async () => {
    const adapter = new FirebaseBlessingAdapter();
    await expect(adapter.add({ name: '   ', message: 'x' })).rejects.toThrow();
    await expect(adapter.add({ name: 'x', message: '' })).rejects.toThrow();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('add() memakai serverTimestamp dan mengembalikan id dari push key', async () => {
    const childRef = { key: 'pushKey123' };
    mocks.push.mockResolvedValueOnce(childRef);
    mocks.get.mockResolvedValueOnce(
      snapshot({ name: 'Dewi', message: 'Samawa ya!', createdAt: 1759312800000 }),
    );

    const adapter = new FirebaseBlessingAdapter();
    const saved = await adapter.add({ name: '  Dewi  ', message: 'Samawa ya!   ' });

    expect(mocks.push).toHaveBeenCalledTimes(1);
    const payload = mocks.push.mock.calls[0][1];
    expect(payload).toMatchObject({ name: 'Dewi', message: 'Samawa ya!' });
    expect(payload.createdAt).toEqual({ '.sv': 'timestamp' });
    expect(saved).toMatchObject({ id: 'pushKey123', name: 'Dewi' });
  });

  it('add() memotong nama/pesan yang terlalu panjang seperti parseBlessing', async () => {
    const childRef = { key: 'k9' };
    mocks.push.mockResolvedValueOnce(childRef);
    mocks.get.mockResolvedValueOnce(
      snapshot({ name: 'x'.repeat(60), message: 'y'.repeat(500), createdAt: 1759312800000 }),
    );
    const saved = await new FirebaseBlessingAdapter().add({
      name: 'x'.repeat(100),
      message: 'y'.repeat(900),
    });
    expect(saved.name).toHaveLength(60);
    expect(saved.message).toHaveLength(500);
  });

  it('subscribe() mendaftarkan onValue dan unsubscribe menghentikannya', async () => {
    const off = vi.fn();
    mocks.onValue.mockReturnValueOnce(off);
    const adapter = new FirebaseBlessingAdapter();
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
