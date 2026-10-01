import { describe, expect, it } from 'vitest';
import {
  LocalStorageAdapter,
  MemoryAdapter,
  parseBlessing,
  sanitizeBlessingInput,
  sortBlessings,
  type Blessing,
} from '../src/utils/blessingAdapter';
import type { StorageLike } from '../src/utils/commentStore';

/** Storage palsu dalam-memori untuk menguji adapter tanpa browser. */
function fakeStorage(seed?: Record<string, string>): StorageLike & { data: Record<string, string> } {
  const data: Record<string, string> = { ...(seed ?? {}) };
  return {
    data,
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => {
      data[k] = v;
    },
    removeItem: (k: string) => {
      delete data[k];
    },
  };
}

describe('parseBlessing', () => {
  it('menerima entri yang sah', () => {
    const b = parseBlessing({ id: 'a', name: ' Sari ', message: ' Selamat! ', createdAt: '2026-10-01T10:00:00+07:00' });
    expect(b).toMatchObject({ id: 'a', name: 'Sari', message: 'Selamat!' });
  });

  it('menolak nama / pesan kosong', () => {
    expect(parseBlessing({ name: '', message: 'x' })).toBeNull();
    expect(parseBlessing({ name: 'x', message: '   ' })).toBeNull();
    expect(parseBlessing(null)).toBeNull();
  });

  it('memotong nama & pesan yang terlalu panjang', () => {
    const b = parseBlessing({ name: 'x'.repeat(100), message: 'y'.repeat(900), createdAt: '2026-10-01T10:00:00+07:00' });
    expect(b?.name).toHaveLength(60);
    expect(b?.message).toHaveLength(500);
  });

  it('mengisi createdAt bila tidak valid', () => {
    const b = parseBlessing({ name: 'A', message: 'B', createdAt: 'bukan-tanggal' });
    expect(b).not.toBeNull();
    expect(Number.isNaN(new Date(b!.createdAt).getTime())).toBe(false);
  });
});

describe('sortBlessings', () => {
  it('mengurutkan terbaru lebih dulu tanpa mengubah array asli', () => {
    const a: Blessing = { id: 'a', name: 'A', message: 'm', createdAt: '2026-10-01T08:00:00+07:00' };
    const b: Blessing = { id: 'b', name: 'B', message: 'm', createdAt: '2026-10-02T08:00:00+07:00' };
    const src = [a, b];
    const sorted = sortBlessings(src);
    expect(sorted.map((x) => x.id)).toEqual(['b', 'a']);
    expect(src[0].id).toBe('a');
  });
});

describe('sanitizeBlessingInput', () => {
  it('membersihkan spasi dan menolak input kosong', () => {
    expect(sanitizeBlessingInput({ name: '  Sari ', message: ' Doa terbaik ' })).toEqual({
      name: 'Sari',
      message: 'Doa terbaik',
    });
    expect(sanitizeBlessingInput({ name: ' ', message: 'x' })).toBeNull();
  });
});

describe('MemoryAdapter', () => {
  it('list kosong di awal, add menyimpan dan mengembalikan entri', async () => {
    const adapter = new MemoryAdapter();
    expect(await adapter.list()).toEqual([]);
    const saved = await adapter.add({ name: 'Sari', message: 'Langgeng selalu!' });
    expect(saved.name).toBe('Sari');
    expect(saved.id).toMatch(/^doa-/);
    const list = await adapter.list();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(saved.id);
  });

  it('menolak input kosong dengan error', async () => {
    const adapter = new MemoryAdapter();
    await expect(adapter.add({ name: '', message: 'x' })).rejects.toThrow();
  });
});

describe('LocalStorageAdapter', () => {
  it('membaca daftar yang tersimpan dan mengabaikan entri rusak', async () => {
    const storage = fakeStorage({
      'kunci-doa': JSON.stringify([
        { id: 'ok-1', name: 'Sari', message: 'Selamat!', createdAt: '2026-10-01T10:00:00+07:00' },
        { name: '', message: 'rusak' },
        'bukan-objek',
      ]),
    });
    const adapter = new LocalStorageAdapter('kunci-doa', storage);
    const list = await adapter.list();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Sari');
  });

  it('add menulis ke storage dan list mengembalikan terbaru dulu', async () => {
    const storage = fakeStorage();
    const adapter = new LocalStorageAdapter('kunci-doa', storage);
    await adapter.add({ name: 'Pertama', message: 'Satu' });
    await new Promise((r) => setTimeout(r, 5));
    await adapter.add({ name: 'Kedua', message: 'Dua' });
    const list = await adapter.list();
    expect(list.map((b) => b.name)).toEqual(['Kedua', 'Pertama']);
    expect(JSON.parse(storage.data['kunci-doa'])).toHaveLength(2);
  });

  it('mengembalikan daftar kosong bila storage null (SSR)', async () => {
    const adapter = new LocalStorageAdapter('kunci-doa', null);
    expect(await adapter.list()).toEqual([]);
    // add tetap mengembalikan entri walau tidak bisa disimpan
    const saved = await adapter.add({ name: 'A', message: 'B' });
    expect(saved.name).toBe('A');
  });

  it('mengembalikan daftar kosong bila isi storage bukan JSON valid', async () => {
    const storage = fakeStorage({ 'kunci-doa': '[[[tidak valid' });
    const adapter = new LocalStorageAdapter('kunci-doa', storage);
    expect(await adapter.list()).toEqual([]);
  });
});
