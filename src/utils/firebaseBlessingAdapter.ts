/**
 * Adapter Firebase Realtime Database untuk Pohon Doa.
 *
 * Membuat doa terlihat SEMUA tamu secara real-time. Mengimplementasikan
 * kontrak `BlessingAdapter` dari `./blessingAdapter`, sehingga UI
 * (`PrayerTree`) tidak perlu diubah.
 *
 * Bentuk data di RTDB (path `doa/undangan-bayu-lilik/<pushId>`):
 *   { name: string, message: string, createdAt: number }
 * `createdAt` ditulis via `serverTimestamp()` (angka ms) lalu diubah
 * menjadi ISO 8601 saat dibaca agar cocok dengan tipe `Blessing`.
 *
 * Validasi input meniru `sanitizeBlessingInput`: name 1–60 karakter,
 * message 1–500 karakter (sudah di-trim). Security Rules di server
 * menegakkan batas yang sama.
 *
 * Seed comments TIDAK ditulis ke database — mereka tetap berasal dari
 * konstanta lokal di `PrayerTree` sebagai bunga awal.
 */
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  limitToLast,
  onValue,
  orderByChild,
  push,
  get,
  query,
  ref,
  serverTimestamp,
  type Database,
} from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import {
  MAX_BLESSINGS,
  parseBlessing,
  sanitizeBlessingInput,
  sortBlessings,
  type Blessing,
  type BlessingAdapter,
  type NewBlessing,
} from './blessingAdapter';

/** Path data doa di Realtime Database. */
export const BLESSING_DB_PATH = 'doa/undangan-bayu-lilik';

let cachedApp: FirebaseApp | null = null;

/**
 * Inisialisasi Firebase sekali per sesi. Melempar bila config tidak valid —
 * pemanggil (getDefaultBlessingAdapter) menangkapnya untuk fallback.
 */
export function getFirebaseApp(): FirebaseApp {
  if (!cachedApp) {
    cachedApp = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
  }
  return cachedApp;
}

/** Ubah satu entri RTDB menjadi `Blessing`; `null` bila bentuknya tidak sah. */
function toBlessing(key: string, raw: unknown): Blessing | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const rec = raw as Record<string, unknown>;
  // serverTimestamp() tersimpan sebagai angka ms — ubah ke ISO 8601.
  const createdAt =
    typeof rec.createdAt === 'number' ? new Date(rec.createdAt).toISOString() : rec.createdAt;
  return parseBlessing({ ...rec, id: key, createdAt });
}

export class FirebaseBlessingAdapter implements BlessingAdapter {
  private readonly path: string;
  private readonly db: Database;

  constructor(path: string = BLESSING_DB_PATH) {
    this.path = path;
    // Sinkron & tanpa I/O jaringan: getDatabase hanya membuat handle.
    // I/O pertama terjadi di list()/add()/subscribe().
    this.db = getDatabase(getFirebaseApp());
  }

  private listQuery() {
    return query(
      ref(this.db, this.path),
      orderByChild('createdAt'),
      limitToLast(MAX_BLESSINGS),
    );
  }

  /** Daftar doa, terbaru lebih dulu. */
  async list(): Promise<Blessing[]> {
    const snap = await get(this.listQuery());
    const val = snap.val();
    if (!val || typeof val !== 'object') return [];
    const items = Object.entries(val as Record<string, unknown>)
      .map(([key, raw]) => toBlessing(key, raw))
      .filter((b): b is Blessing => b !== null);
    return sortBlessings(items);
  }

  /** Simpan doa baru; id diambil dari push key Firebase. */
  async add(input: NewBlessing): Promise<Blessing> {
    const clean = sanitizeBlessingInput(input);
    if (!clean) throw new Error('Nama dan isi doa wajib diisi.');
    const childRef = await push(ref(this.db, this.path), {
      name: clean.name,
      message: clean.message,
      createdAt: serverTimestamp(),
    });
    if (!childRef.key) throw new Error('Gagal menyimpan doa.');
    const snap = await get(childRef);
    const saved = toBlessing(childRef.key, snap.val());
    if (!saved) throw new Error('Gagal menyimpan doa.');
    return saved;
  }

  /**
   * Dengarkan perubahan dari tamu lain secara real-time.
   * Mengembalikan fungsi unsubscribe.
   */
  subscribe(onChange: () => void): () => void {
    const off = onValue(
      this.listQuery(),
      () => onChange(),
      () => {
        /* Izin/network gagal — list() terakhir tetap dipakai; tidak dilempar. */
      },
    );
    return () => off();
  }
}
