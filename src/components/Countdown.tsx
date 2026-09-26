import { useEffect, useState } from 'react';
import {
  countdownEvent,
  lastScheduledEvent,
  scheduleConfirmed,
} from '../data/wedding';
import {
  formatEventDate,
  getScheduleStatus,
  getTimeLeft,
  toTimestamp,
  type ScheduleStatus,
  type TimeLeft,
} from '../utils/schedule';

const LABELS: Record<keyof TimeLeft, string> = {
  days: 'Hari',
  hours: 'Jam',
  minutes: 'Menit',
  seconds: 'Detik',
};

/**
 * Hitung mundur menuju acara pertama.
 * Zona waktu diambil dari ISO acara (+07:00), jadi hitungannya benar
 * untuk tamu di zona waktu mana pun.
 */
export default function Countdown() {
  const startISO = countdownEvent.startISO;
  const endISO = lastScheduledEvent?.endISO ?? countdownEvent.endISO;

  const [now, setNow] = useState<number>(() => Date.now());
  const [status, setStatus] = useState<ScheduleStatus>(() =>
    getScheduleStatus(startISO, endISO, Date.now()),
  );

  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      setNow(t);
      setStatus(getScheduleStatus(startISO, endISO, t));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startISO, endISO]);

  if (status === 'unscheduled') {
    return (
      <div className="max-w-sm mx-auto my-8 text-center">
        <p className="font-serif text-xl text-wedding-200">Jadwal segera diumumkan</p>
        <p className="text-sm text-wedding-100/80 mt-2">
          Mohon ditunggu, detail waktu acara akan kami perbarui di halaman ini.
        </p>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div className="max-w-sm mx-auto my-8 text-center">
        <p className="font-serif text-xl text-wedding-200">Alhamdulillah, telah dilaksanakan</p>
        <p className="text-sm text-wedding-100/80 mt-2">
          Terima kasih atas kehadiran dan doa restu Bapak/Ibu/Saudara/i.
        </p>
      </div>
    );
  }

  if (status === 'ongoing') {
    return (
      <div className="max-w-sm mx-auto my-8 text-center">
        <p className="font-serif text-xl text-wedding-200">Acara sedang berlangsung</p>
        <p className="text-sm text-wedding-100/80 mt-2">
          Semoga langkah Bapak/Ibu/Saudara/i dimudahkan menuju lokasi.
        </p>
      </div>
    );
  }

  const target = toTimestamp(startISO);
  if (target === null) return null;

  const timeLeft = getTimeLeft(target, now);
  const dateText = formatEventDate(startISO as string);

  return (
    <div className="max-w-sm mx-auto my-8 text-center">
      <p className="text-[11px] tracking-[0.22em] uppercase text-wedding-200/90 font-semibold">
        Menuju {countdownEvent.label}
      </p>
      {dateText && <p className="text-sm text-wedding-100/80 mt-1">{dateText}</p>}

      <div className="grid grid-cols-4 gap-2 mt-4">
        {(Object.keys(LABELS) as Array<keyof TimeLeft>).map((key) => (
          <div
            key={key}
            className={
              'bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-wedding-300/40 ' +
              (key === 'seconds' ? 'ring-1 ring-wedding-300/50' : '')
            }
          >
            <span
              className={
                'block font-bold text-xl text-white tabular-nums ' +
                (key === 'seconds' ? 'text-wedding-200' : '')
              }
            >
              {String(timeLeft[key]).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-wedding-200">
              {LABELS[key]}
            </span>
          </div>
        ))}
      </div>

      {!scheduleConfirmed && (
        <p className="mt-4 text-[11px] text-wedding-200/75 italic">
          Jadwal di atas masih contoh dan belum dikonfirmasi.
        </p>
      )}
    </div>
  );
}
