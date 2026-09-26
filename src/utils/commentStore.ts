/**
 * Penyimpanan ucapan/komentar tamu.
 *
 * Catatan penting: tanpa backend, komentar hanya bisa disimpan di
 * `localStorage` perangkat pengirim — bukan buku tamu bersama yang terlihat
 * oleh semua tamu. Semua akses storage divalidasi bentuknya supaya data lama /
 * data yang rusak tidak membuat halaman error, dan fungsi-fungsinya menerima
 * objek `StorageLike` supaya bisa diuji tanpa browser.
 */

import { storageKeys } from '../data/wedding';

export type Gender = 'L' | 'P' | 'netral';
export type Attendance = 'Hadir' | 'Tidak Hadir' | 'Masih Ragu';

export type GuestComment = {
  id: string;
  name: string;
  gender: Gender;
  message: string;
  attendance: Attendance | null;
  /** ISO 8601, dipakai untuk mengurutkan. */
  createdAt: string;
};

export const MAX_COMMENTS = 200;

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const GENDERS: Gender[] = ['L', 'P', 'netral'];
const ATTENDANCES: Attendance[] = ['Hadir', 'Tidak Hadir', 'Masih Ragu'];

const isString = (v: unknown): v is string => typeof v === 'string';
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Tanggal tampilan, mis. `24 Okt 2026`. */
export function formatCommentDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Validasi satu entri komentar. Mengembalikan `null` kalau bentuknya tidak sah,
 * sehingga entri rusak dari penyimpanan lama diabaikan alih-alih dirender.
 */
export function parseComment(input: unknown): GuestComment | null {
  if (!isRecord(input)) return null;

  const name = isString(input.name) ? input.name.trim() : '';
  const message = isString(input.message)
    ? input.message.trim()
    : isString(input.msg)
      ? input.msg.trim()
      : '';
  if (!name || !message) return null;

  const gender: Gender = GENDERS.includes(input.gender as Gender)
    ? (input.gender as Gender)
    : 'netral';

  const attendance: Attendance | null = ATTENDANCES.includes(input.attendance as Attendance)
    ? (input.attendance as Attendance)
    : null;

  let createdAt = isString(input.createdAt) ? input.createdAt : '';
  if (!createdAt || Number.isNaN(new Date(createdAt).getTime())) {
    // Data versi lama menyimpan tanggal yang sudah terformat, bukan ISO.
    const legacy = isString(input.date) ? input.date : '';
    const parsed = legacy ? new Date(legacy) : null;
    createdAt = parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
  }

  const id = isString(input.id) && input.id ? input.id : `${name}-${createdAt}`.toLowerCase();

  return { id, name: name.slice(0, 60), gender, message: message.slice(0, 500), attendance, createdAt };
}

function parseList(raw: string | null): GuestComment[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item) => parseComment(item))
    .filter((c): c is GuestComment => c !== null);
}

/** Urutkan terbaru lebih dulu. */
export function sortComments(list: GuestComment[]): GuestComment[] {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * Baca komentar dari storage, sekaligus memigrasikan data kunci lama
 * (undangan versi sebelumnya) ke kunci baru lalu menghapus kunci lamanya.
 */
export function readComments(storage: StorageLike | null = safeStorage()): GuestComment[] {
  if (!storage) return [];

  let legacy: GuestComment[] = [];
  storageKeys.legacyComments.forEach((key) => {
    const raw = storage.getItem(key);
    if (!raw) return;
    legacy = legacy.concat(parseList(raw));
    storage.removeItem(key);
  });

  const current = parseList(storage.getItem(storageKeys.comments));
  if (!legacy.length) return sortComments(current);

  const seen = new Set(current.map((c) => c.id));
  const merged = current.concat(legacy.filter((c) => !seen.has(c.id)));
  const result = sortComments(merged).slice(0, MAX_COMMENTS);
  writeComments(result, storage);
  return result;
}

export function writeComments(
  list: GuestComment[],
  storage: StorageLike | null = safeStorage(),
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(storageKeys.comments, JSON.stringify(sortComments(list).slice(0, MAX_COMMENTS)));
    return true;
  } catch {
    // Kuota penuh atau storage diblokir mode privat — komentar tetap tampil di sesi ini.
    return false;
  }
}

/** Storage aman: di SSR / mode privat browser bisa `null`. */
export function safeStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
