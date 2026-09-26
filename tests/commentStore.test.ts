import { beforeEach, describe, expect, it } from 'vitest';
import {
  MAX_COMMENTS,
  parseComment,
  readComments,
  sortComments,
  writeComments,
  type StorageLike,
} from '../src/utils/commentStore';
import { storageKeys } from '../src/data/wedding';

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { dump: () => Record<string, string> } {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => (store.has(k) ? (store.get(k) as string) : null),
    setItem: (k, v) => void store.set(k, v),
    removeItem: (k) => void store.delete(k),
    dump: () => Object.fromEntries(store),
  };
}

describe('parseComment', () => {
  it('menerima entri yang sah', () => {
    const c = parseComment({
      id: 'a1',
      name: 'Budi',
      gender: 'L',
      attendance: 'Hadir',
      message: 'Semoga lancar',
      createdAt: '2026-01-02T03:04:05.000Z',
    });
    expect(c).toMatchObject({
      id: 'a1',
      name: 'Budi',
      gender: 'L',
      attendance: 'Hadir',
      message: 'Semoga lancar',
    });
  });

  it('menolak bentuk data yang rusak', () => {
    expect(parseComment(null)).toBeNull();
    expect(parseComment('teks')).toBeNull();
    expect(parseComment({ name: 'Budi' })).toBeNull();
    expect(parseComment({ name: '', message: 'isi' })).toBeNull();
    expect(parseComment({ name: '   ', message: '   ' })).toBeNull();
  });

  it('menormalkan jenis kelamin & kehadiran tak dikenal', () => {
    const c = parseComment({ name: 'A', message: 'b', gender: 'X', attendance: 'Mungkin' });
    expect(c?.gender).toBe('netral');
    expect(c?.attendance).toBeNull();
  });

  it('membaca field `msg` dan tanggal lama dari versi sebelumnya', () => {
    const c = parseComment({ name: 'Lama', msg: 'Selamat', date: '2025-12-31' });
    expect(c?.message).toBe('Selamat');
    expect(Number.isNaN(new Date(c!.createdAt).getTime())).toBe(false);
  });

  it('membatasi panjang nama dan pesan', () => {
    const c = parseComment({ name: 'x'.repeat(200), message: 'y'.repeat(1000) });
    expect(c?.name.length).toBe(60);
    expect(c?.message.length).toBe(500);
  });
});

describe('readComments', () => {
  let storage: ReturnType<typeof memoryStorage>;

  beforeEach(() => {
    storage = memoryStorage();
  });

  it('mengembalikan daftar kosong bila belum ada data', () => {
    expect(readComments(storage)).toEqual([]);
  });

  it('mengabaikan JSON rusak dan entri tidak sah', () => {
    storage.setItem(storageKeys.comments, '{bukan json');
    expect(readComments(storage)).toEqual([]);

    storage.setItem(
      storageKeys.comments,
      JSON.stringify([{ name: 'Sah', message: 'ok' }, { name: 'Kosong' }, 42]),
    );
    const list = readComments(storage);
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Sah');
  });

  it('memigrasikan data kunci lama lalu menghapus kunci tersebut', () => {
    storage.setItem(
      storageKeys.legacyComments[0],
      JSON.stringify([{ name: 'Tamu Lama', msg: 'Selamat menempuh hidup baru' }]),
    );
    const list = readComments(storage);

    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ name: 'Tamu Lama', message: 'Selamat menempuh hidup baru' });
    expect(storage.getItem(storageKeys.legacyComments[0])).toBeNull();
    expect(storage.getItem(storageKeys.comments)).not.toBeNull();
  });

  it('tidak menggandakan komentar saat migrasi dijalankan dua kali', () => {
    storage.setItem(
      storageKeys.legacyComments[0],
      JSON.stringify([{ name: 'Tamu Lama', msg: 'Doa terbaik' }]),
    );
    readComments(storage);
    expect(readComments(storage)).toHaveLength(1);
  });

  it('bekerja tanpa storage (SSR / mode privat)', () => {
    expect(readComments(null)).toEqual([]);
    expect(writeComments([], null)).toBe(false);
  });
});

describe('writeComments', () => {
  it('menyimpan urut dari yang terbaru dan memotong sesuai batas', () => {
    const storage = memoryStorage();
    const list = Array.from({ length: MAX_COMMENTS + 30 }, (_, i) => ({
      id: `c${i}`,
      name: `Tamu ${i}`,
      gender: 'netral' as const,
      message: `Pesan ${i}`,
      attendance: null,
      createdAt: new Date(Date.UTC(2026, 0, 1) + i * 60000).toISOString(),
    }));

    expect(writeComments(list, storage)).toBe(true);
    const saved = readComments(storage);
    expect(saved).toHaveLength(MAX_COMMENTS);
    // Terbaru lebih dulu
    expect(saved[0].id).toBe(`c${MAX_COMMENTS + 29}`);
  });

  it('mengembalikan false bila storage menolak penulisan', () => {
    const throwing: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error('kuota penuh');
      },
      removeItem: () => {},
    };
    expect(
      writeComments(
        [
          {
            id: 'x',
            name: 'A',
            gender: 'L',
            message: 'b',
            attendance: null,
            createdAt: new Date().toISOString(),
          },
        ],
        throwing,
      ),
    ).toBe(false);
  });
});

describe('sortComments', () => {
  it('mengurutkan terbaru lebih dulu tanpa mengubah daftar asal', () => {
    const input = [
      { id: 'a', name: 'A', gender: 'L' as const, message: 'm', attendance: null, createdAt: '2026-01-01T00:00:00.000Z' },
      { id: 'b', name: 'B', gender: 'P' as const, message: 'm', attendance: null, createdAt: '2026-03-01T00:00:00.000Z' },
    ];
    const sorted = sortComments(input);
    expect(sorted.map((c) => c.id)).toEqual(['b', 'a']);
    expect(input.map((c) => c.id)).toEqual(['a', 'b']);
  });
});
