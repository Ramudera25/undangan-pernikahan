/**
 * Lapisan penyimpanan doa untuk Pohon Doa.
 *
 * Arsitektur: UI (PrayerTree) hanya berbicara ke interface `BlessingAdapter`.
 * Implementasi default saat ini adalah `LocalStorageAdapter` — doa tersimpan
 * di browser masing-masing tamu, tanpa backend.
 *
 * Untuk membuat doa terlihat SEMUA tamu secara real-time, cukup buat class
 * baru yang mengimplementasikan `BlessingAdapter` (mis. `FirebaseAdapter`
 * atau `SupabaseAdapter`) lalu oper ke komponen — tanpa mengubah satu baris
 * pun kode UI:
 *
 *   const firebase = new FirebaseAdapter({ ...config });
 *   <PrayerTree adapter={firebase} />
 *
 * ---------------------------------------------------------------------------
 * STATUS MIGRASI (1 Okt 2026): adapter Firebase SUDAH diimplementasikan di
 * `./firebaseBlessingAdapter.ts` (`FirebaseBlessingAdapter`, path
 * `doa/undangan-bayu-lilik`) dan menjadi DEFAULT via
 * `getDefaultBlessingAdapter()` — `LocalStorageAdapter` hanya fallback bila
 * inisialisasi Firebase gagal. Seed comments tetap dari konstanta lokal dan
 * TIDAK ditulis ke database.
 * ---------------------------------------------------------------------------
 * PANDUAN MIGRASI: Firebase Realtime Database (paket gratis / Spark)
 * ---------------------------------------------------------------------------
 * Kontrak yang WAJIB diimplementasikan oleh adapter Firebase:
 *
 *   class FirebaseBlessingAdapter implements BlessingAdapter {
 *     constructor(config: FirebaseConfig, path?: string)
 *     list(): Promise<Blessing[]>        // baca sekali via get(ref(db, path))
 *     add(input: NewBlessing): Promise<Blessing>
 *        // tulis via push(ref(db, path), { name, message, createdAt: serverTimestamp() })
 *        // kembalikan Blessing lengkap (pakai key hasil push sebagai id)
 *     subscribe(onChange: () => void): () => void
 *        // dengarkan via onValue(ref(db, path), ...) lalu panggil onChange();
 *        // kembalikan unsubscribe (off(...))
 *   }
 *
 * Aturan validasi di server sebaiknya meniru `parseBlessing`/`sanitizeBlessingInput`:
 * name & message wajib string tak-kosong, masing-masing maks 60 / 500 karakter.
 *
 * Field `firebaseConfig` yang NANTI DIBUTUHKAN dari user (dari Firebase Console
 * > Project settings > "Your apps" > Config):
 *   - apiKey: string        (wajib)
 *   - authDomain: string    (wajib, mis. "nama-proyek.firebaseapp.com")
 *   - databaseURL: string   (WAJIB untuk Realtime Database,
 *                            mis. "https://nama-proyek-default-rtdb.asia-southeast1.firebasedatabase.app")
 *   - projectId: string     (wajib)
 *   - appId: string         (disarankan)
 *   - messagingSenderId: string (opsional, tidak dipakai fitur ini)
 *   - storageBucket: string (opsional, tidak dipakai fitur ini)
 *
 * Selain itu user perlu menyiapkan di Firebase Console:
 *   1. Buat Realtime Database (lokasi asia-southeast1 disarankan).
 *   2. Atur Rules minimal, mis. baca publik + tulis tervalidasi:
 *        { "rules": { "doa": { ".read": true,
 *          "$id": { ".write": true,
 *            ".validate": "newData.hasChildren(['name','message','createdAt']) && ..." } } } }
 *   3. Tentukan NAMA PATH data, mis. "doa/undangan-bayu-lilik".
 * Dependensi npm yang dibutuhkan saat migrasi: `firebase` (modular SDK v10+).
 * Catatan kuota Spark gratis: 1 GB data tersimpan & 10 GB unduhan/bulan —
 * lebih dari cukup untuk ratusan doa teks.
 */

import { couple } from '../data/wedding';
import type { StorageLike } from './commentStore';
import { safeStorage } from './commentStore';
import { FirebaseBlessingAdapter } from './firebaseBlessingAdapter';

/** Satu doa/ucapan yang menjadi bunga di pohon. */
export type Blessing = {
  id: string;
  name: string;
  message: string;
  /** ISO 8601, dipakai untuk mengurutkan. */
  createdAt: string;
};

/** Input dari form — id & createdAt diisi oleh adapter. */
export type NewBlessing = {
  name: string;
  message: string;
};

/**
 * Kontrak penyimpanan doa. Semua method async agar adapter backend
 * (Firebase/Supabase) bisa dipasang tanpa mengubah UI.
 */
export interface BlessingAdapter {
  /** Daftar doa, diurutkan terbaru lebih dulu. */
  list(): Promise<Blessing[]>;
  /** Simpan doa baru; mengembalikan entri lengkap yang tersimpan. */
  add(input: NewBlessing): Promise<Blessing>;
  /**
   * (Opsional) Berlangganan perubahan data dari sumber lain
   * (tab lain / realtime backend). Mengembalikan fungsi unsubscribe.
   */
  subscribe?(onChange: () => void): () => void;
}

export const MAX_BLESSINGS = 300;
export const blessingStorageKey = `undangan-${couple.slug}-doa`;

const isString = (v: unknown): v is string => typeof v === 'string';
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Validasi satu entri doa; `null` bila bentuknya tidak sah. */
export function parseBlessing(input: unknown): Blessing | null {
  if (!isRecord(input)) return null;
  const name = isString(input.name) ? input.name.trim() : '';
  const message = isString(input.message) ? input.message.trim() : '';
  if (!name || !message) return null;

  let createdAt = isString(input.createdAt) ? input.createdAt : '';
  if (!createdAt || Number.isNaN(new Date(createdAt).getTime())) {
    createdAt = new Date().toISOString();
  }
  const id = isString(input.id) && input.id
    ? input.id
    : `doa-${createdAt}-${name}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-');

  return {
    id,
    name: name.slice(0, 60),
    message: message.slice(0, 500),
    createdAt,
  };
}

function parseList(raw: string | null): Blessing[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item) => parseBlessing(item))
    .filter((b): b is Blessing => b !== null);
}

/** Urutkan terbaru lebih dulu. */
export function sortBlessings(list: Blessing[]): Blessing[] {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Bersihkan input form sebelum disimpan. */
export function sanitizeBlessingInput(input: NewBlessing): { name: string; message: string } | null {
  const name = input.name.trim().slice(0, 60);
  const message = input.message.trim().slice(0, 500);
  if (!name || !message) return null;
  return { name, message };
}

/**
 * Adapter default: menyimpan doa di `localStorage` perangkat pengirim.
 * Tanpa backend, doa hanya terlihat di perangkat yang mengirimnya.
 */
export class LocalStorageAdapter implements BlessingAdapter {
  private readonly key: string;
  private readonly storage: StorageLike | null;

  constructor(key: string = blessingStorageKey, storage?: StorageLike | null) {
    this.key = key;
    // `storage` eksplisit (termasuk `null`) dipakai apa adanya agar bisa diuji;
    // bila tidak diberikan, pakai localStorage browser yang aman.
    this.storage = storage === undefined ? safeStorage() : storage;
  }

  async list(): Promise<Blessing[]> {
    if (!this.storage) return [];
    return sortBlessings(parseList(this.storage.getItem(this.key)));
  }

  async add(input: NewBlessing): Promise<Blessing> {
    const clean = sanitizeBlessingInput(input);
    if (!clean) throw new Error('Nama dan isi doa wajib diisi.');
    const blessing: Blessing = {
      id: `doa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: clean.name,
      message: clean.message,
      createdAt: new Date().toISOString(),
    };
    const current = await this.list();
    const next = sortBlessings([blessing, ...current]).slice(0, MAX_BLESSINGS);
    try {
      this.storage?.setItem(this.key, JSON.stringify(next));
    } catch {
      // Kuota penuh / storage diblokir — doa tetap tampil di sesi ini.
    }
    return blessing;
  }

  subscribe(onChange: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: StorageEvent) => {
      if (e.key === this.key) onChange();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}

/**
 * Adapter dalam-memori — untuk pengujian dan pratinjau tanpa browser.
 * Bukan untuk produksi: datanya hilang saat halaman dimuat ulang.
 */
export class MemoryAdapter implements BlessingAdapter {
  private items: Blessing[] = [];

  async list(): Promise<Blessing[]> {
    return sortBlessings(this.items);
  }

  async add(input: NewBlessing): Promise<Blessing> {
    const clean = sanitizeBlessingInput(input);
    if (!clean) throw new Error('Nama dan isi doa wajib diisi.');
    const blessing: Blessing = {
      id: `doa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: clean.name,
      message: clean.message,
      createdAt: new Date().toISOString(),
    };
    this.items = sortBlessings([blessing, ...this.items]).slice(0, MAX_BLESSINGS);
    return blessing;
  }
}

/**
 * Adapter bawaan yang dipakai komponen bila tidak diberikan adapter lain.
 *
 * Di browser: coba Firebase Realtime Database dulu (doa realtime untuk
 * semua tamu). Bila inisialisasi Firebase gagal — atau saat SSR/build —
 * fallback ke `LocalStorageAdapter` (doa hanya di perangkat pengirim).
 */
export function getDefaultBlessingAdapter(): BlessingAdapter {
  if (typeof window !== 'undefined') {
    try {
      return new FirebaseBlessingAdapter();
    } catch {
      /* Firebase gagal diinisialisasi — lanjut ke penyimpanan lokal. */
    }
  }
  return new LocalStorageAdapter();
}
