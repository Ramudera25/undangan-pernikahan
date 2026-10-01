/**
 * Adapter Firebase Realtime Database untuk Buku Tamu / Ucapan Selamat.
 *
 * Membuat ucapan terlihat SEMUA tamu secara real-time — pola yang sama
 * dengan `FirebaseBlessingAdapter` (Pohon Doa), tetapi memakai path
 * TERPISAH: `ucapan/undangan-bayu-lilik`.
 *
 * Bentuk data di RTDB (path `ucapan/undangan-bayu-lilik/<pushId>`):
 *   { name: string, message: string, gender: 'L' | 'P' | 'netral',
 *     attendance?: 'Hadir' | 'Tidak Hadir' | 'Masih Ragu', createdAt: number }
 * `createdAt` ditulis via `serverTimestamp()` (angka ms) lalu diubah
 * menjadi ISO 8601 saat dibaca agar cocok dengan tipe `GuestComment`.
 *
 * Validasi input: name 1–60 karakter, message 1–500 karakter (trim),
 * gender salah satu dari tiga nilai, attendance salah satu dari tiga nilai
 * atau null. Security Rules di server menegakkan batas yang sama
 * (lihat `firebase-rules-ucapan.json` di root repo).
 *
 * Seed comments TIDAK ditulis ke database — mereka tetap berasal dari
 * konstanta lokal sebagai tampilan fallback di bawah entri Firebase.
 */
import { getDatabase, limitToLast, onValue, orderByChild, push, get, query, ref, serverTimestamp, type Database } from 'firebase/database';
import { getFirebaseApp } from './firebaseBlessingAdapter';
import {
  MAX_COMMENTS,
  parseComment,
  sortComments,
  type Attendance,
  type Gender,
  type GuestComment,
} from './commentStore';

/** Path data ucapan di Realtime Database — pisah dari path doa. */
export const UCAPAN_DB_PATH = 'ucapan/undangan-bayu-lilik';

/** Input dari form — id & createdAt diisi oleh adapter. */
export type NewUcapan = {
  name: string;
  message: string;
  gender?: Gender;
  attendance?: Attendance | null;
};

const GENDERS: Gender[] = ['L', 'P', 'netral'];
const ATTENDANCES: Attendance[] = ['Hadir', 'Tidak Hadir', 'Masih Ragu'];

/**
 * Bersihkan input form sebelum disimpan.
 * Meniru `parseComment`: nama 1–60, pesan 1–500, gender/attendance tervalidasi.
 */
export function sanitizeUcapanInput(input: NewUcapan): {
  name: string;
  message: string;
  gender: Gender;
  attendance: Attendance | null;
} | null {
  const name = input.name.trim().slice(0, 60);
  const message = input.message.trim().slice(0, 500);
  if (!name || !message) return null;
  const gender: Gender = GENDERS.includes(input.gender as Gender)
    ? (input.gender as Gender)
    : 'netral';
  const attendance: Attendance | null = ATTENDANCES.includes(input.attendance as Attendance)
    ? (input.attendance as Attendance)
    : null;
  return { name, message, gender, attendance };
}

/** Ubah satu entri RTDB menjadi `GuestComment`; `null` bila bentuknya tidak sah. */
function toComment(key: string, raw: unknown): GuestComment | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const rec = raw as Record<string, unknown>;
  // serverTimestamp() tersimpan sebagai angka ms — ubah ke ISO 8601.
  const createdAt =
    typeof rec.createdAt === 'number' ? new Date(rec.createdAt).toISOString() : rec.createdAt;
  return parseComment({ ...rec, id: key, createdAt });
}

/**
 * Kontrak penyimpanan ucapan realtime. Semua method async agar UI
 * (`GuestBook`) tidak peduli backend apa yang dipakai.
 */
export interface UcapanAdapter {
  /** Daftar ucapan, terbaru lebih dulu. */
  list(): Promise<GuestComment[]>;
  /** Simpan ucapan baru; mengembalikan entri lengkap yang tersimpan. */
  add(input: NewUcapan): Promise<GuestComment>;
  /** Dengarkan perubahan dari tamu lain; kembalikan fungsi unsubscribe. */
  subscribe(onChange: () => void): () => void;
}

export class FirebaseUcapanAdapter implements UcapanAdapter {
  private readonly path: string;
  private readonly db: Database;

  constructor(path: string = UCAPAN_DB_PATH) {
    this.path = path;
    // Sinkron & tanpa I/O jaringan: getDatabase hanya membuat handle.
    // I/O pertama terjadi di list()/add()/subscribe().
    this.db = getDatabase(getFirebaseApp());
  }

  private listQuery() {
    return query(ref(this.db, this.path), orderByChild('createdAt'), limitToLast(MAX_COMMENTS));
  }

  /** Daftar ucapan, terbaru lebih dulu. */
  async list(): Promise<GuestComment[]> {
    const snap = await get(this.listQuery());
    const val = snap.val();
    if (!val || typeof val !== 'object') return [];
    const items = Object.entries(val as Record<string, unknown>)
      .map(([key, raw]) => toComment(key, raw))
      .filter((c): c is GuestComment => c !== null);
    return sortComments(items);
  }

  /** Simpan ucapan baru; id diambil dari push key Firebase. */
  async add(input: NewUcapan): Promise<GuestComment> {
    const clean = sanitizeUcapanInput(input);
    if (!clean) throw new Error('Nama dan ucapan wajib diisi.');
    const payload: Record<string, unknown> = {
      name: clean.name,
      message: clean.message,
      gender: clean.gender,
      createdAt: serverTimestamp(),
    };
    if (clean.attendance) payload.attendance = clean.attendance;
    const childRef = await push(ref(this.db, this.path), payload);
    if (!childRef.key) throw new Error('Gagal menyimpan ucapan.');
    const snap = await get(childRef);
    const saved = toComment(childRef.key, snap.val());
    if (!saved) throw new Error('Gagal menyimpan ucapan.');
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

/**
 * Adapter bawaan untuk Buku Tamu.
 *
 * Di browser: coba Firebase Realtime Database dulu (ucapan realtime untuk
 * semua tamu). Bila inisialisasi Firebase gagal — atau saat SSR/build —
 * kembalikan `null` dan UI memakai penyimpanan lokal sebagai fallback.
 */
export function getDefaultUcapanAdapter(): UcapanAdapter | null {
  if (typeof window !== 'undefined') {
    try {
      return new FirebaseUcapanAdapter();
    } catch {
      /* Firebase gagal diinisialisasi — UI jatuh ke penyimpanan lokal. */
    }
  }
  return null;
}
