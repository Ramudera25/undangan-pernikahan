/**
 * Utilitas jadwal acara: status countdown dan format waktu ICS.
 * Semua fungsi murni (tanpa akses DOM) supaya mudah diuji.
 */

export type ScheduleStatus = 'unscheduled' | 'upcoming' | 'ongoing' | 'finished';

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;
const MS_HOUR = 60 * MS_MINUTE;
const MS_DAY = 24 * MS_HOUR;

/**
 * Ubah ISO 8601 ber-zona waktu (mis. `2026-10-24T08:00:00+07:00`) menjadi
 * waktu absolut dalam milidetik. Karena offsetnya eksplisit, hasilnya sama
 * untuk semua tamu tanpa peduli zona waktu perangkat mereka.
 */
export function toTimestamp(iso: string | null): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
}

/**
 * Status rangkaian acara pada waktu `nowMs`:
 * - `unscheduled` : belum ada jadwal sama sekali
 * - `upcoming`    : belum mulai (hitung mundur berjalan)
 * - `ongoing`     : sedang berlangsung (antara mulai acara pertama & selesai acara terakhir)
 * - `finished`    : seluruh rangkaian telah selesai
 */
export function getScheduleStatus(
  startISO: string | null,
  endISO: string | null,
  nowMs: number,
): ScheduleStatus {
  const start = toTimestamp(startISO);
  const end = toTimestamp(endISO);

  if (start === null && end === null) return 'unscheduled';

  const from = start ?? end!;
  const until = end ?? start!;

  if (nowMs < from) return 'upcoming';
  if (nowMs < until) return 'ongoing';
  return 'finished';
}

/** Sisa waktu menuju `targetMs`. Nilai negatif dinormalkan menjadi 0. */
export function getTimeLeft(targetMs: number, nowMs: number): TimeLeft {
  const diff = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(diff / MS_DAY),
    hours: Math.floor((diff % MS_DAY) / MS_HOUR),
    minutes: Math.floor((diff % MS_HOUR) / MS_MINUTE),
    seconds: Math.floor((diff % MS_MINUTE) / MS_SECOND),
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Format UTC dasar untuk ICS: `20261024T010000Z`.
 * `2026-10-24T08:00:00+07:00` -> `20261024T010000Z`.
 */
export function icsTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Format tanggal tidak valid untuk kalender: ${iso}`);
  }
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** `2026-10-24T08:00:00+07:00` -> `Sabtu, 24 Oktober 2026` (zona WIB). */
export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(d);
}

/** `2026-10-24T08:00:00+07:00` -> `08.00` (zona WIB). */
export function formatEventTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  }).format(d);
}

/**
 * Rentang jam acara dalam WIB, mis. `08.00 – 10.00 WIB`.
 * Kalau jadwal belum ditetapkan, kembalikan `fallback`.
 */
export function formatEventRange(
  startISO: string | null,
  endISO: string | null,
  fallback = 'Menyusul',
): string {
  if (!startISO || !endISO) return fallback;
  const start = formatEventTime(startISO);
  const end = formatEventTime(endISO);
  if (!start || !end) return fallback;
  return `${start} – ${end} WIB`;
}
