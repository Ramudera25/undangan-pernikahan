import { events as weddingEvents, calendarIdentity, couple } from '../data/wedding';
import { formatEventDate, formatEventRange, icsTimestamp } from './schedule';

export type CalEvent = {
  /** Id acara dari `data/wedding.ts` — dipakai UI untuk menautkan kartu ke kalender. */
  id: string;
  uid: string;
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
};

const esc = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

/**
 * Bangun isi file .ics. `start`/`end` memakai format UTC dasar ICS
 * (lihat `icsTimestamp`), jadi zona waktu acara tidak ikut bergeser.
 */
export function buildICS(events: CalEvent[], identity = calendarIdentity): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${esc(identity.productId)}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  events.forEach((e) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.uid}@${identity.uidDomain}`,
      `DTSTAMP:${freshStamp()}`,
      `DTSTART:${e.start}`,
      `DTEND:${e.end}`,
      `SUMMARY:${esc(e.summary)}`,
      `DESCRIPTION:${esc(e.description)}`,
      `LOCATION:${esc(e.location)}`,
      'END:VEVENT',
    );
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function freshStamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(
    d.getUTCHours(),
  )}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
}

export function downloadICS(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function googleCalendarUrl(e: CalEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.summary,
    dates: `${e.start}/${e.end}`,
    details: e.description,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Ubah data acara undangan menjadi entri kalender.
 * Acara yang jadwalnya belum ditetapkan (`startISO === null`) dilewati,
 * bukan diisi tanggal karangan.
 *
 * Catatan: label "Selesai" pada timeLabel berarti acara bersifat TERBUKA
 * (jam selesai tidak ditetapkan). Karena format kalender (.ics / Google
 * Calendar) mewajibkan waktu selesai, dipakai estimasi +4 jam dari waktu
 * mulai KHUSUS untuk kolom DTEND/dates — teks yang tampil ke tamu tetap
 * memakai timeLabel asli ("08.00 – Selesai").
 */
export function calendarEvents(): CalEvent[] {
  return weddingEvents
    .filter((e) => e.startISO !== null)
    .map((e) => {
      const startISO = e.startISO as string;
      const endISO =
        e.endISO ?? new Date(new Date(startISO).getTime() + 4 * 3600_000).toISOString();
      return {
        id: e.id,
        uid: `${e.id}-${startISO.slice(0, 10)}`,
        summary: `${e.label} — ${couple.shortName}`,
        description: `${e.label} pernikahan ${couple.groom.fullName} & ${couple.bride.fullName}. ${formatEventDate(startISO)}, ${formatEventRange(startISO, e.endISO, e.timeLabel)}. Mohon doa restu.`,
        location: `${e.venue}, ${e.address}`,
        start: icsTimestamp(startISO),
        end: icsTimestamp(endISO),
      };
    });
}

/** Tautan peta berbasis alamat acara — bukan pin rumah yang dikarang. */
export function mapsUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}
