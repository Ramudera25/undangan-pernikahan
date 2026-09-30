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
        {(Object.keys(LABELS) as Array<keyof TimeLeft>).map((key) => {
          const value = String(timeLeft[key]).padStart(2, '0');
          return (
            <div key={key} className="flex flex-col items-center">
              {/* Kartu flip-clock: gelap dengan garis lipatan tengah */}
              <div className="relative w-full overflow-hidden rounded-xl bg-wedding-800 border border-white/15 shadow-[0_12px_26px_-10px_rgba(0,0,0,0.7)]">
                <div className="px-1 py-4 sm:py-5">
                  <span
                    key={value}
                    className="flip-num block font-serif text-4xl sm:text-5xl leading-none text-white tabular-nums"
                  >
                    {value}
                  </span>
                </div>
                {/* Garis lipatan horizontal di tengah kartu */}
                <div
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-black/50"
                  aria-hidden="true"
                />
                {/* Kilau paruh atas */}
                <div
                  className="absolute left-0 right-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
                {/* Rivet samping */}
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/25" aria-hidden="true" />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/25" aria-hidden="true" />
              </div>
              <span className="mt-2 text-[10px] uppercase tracking-wider text-wedding-200">
                {LABELS[key]}
              </span>
            </div>
          );
        })}
      </div>

      {!scheduleConfirmed && (
        <p className="mt-4 text-[11px] text-wedding-200/75 italic">
          Jadwal di atas masih contoh dan belum dikonfirmasi.
        </p>
      )}

      <style>{`
        .flip-num {
          display: inline-block;
          animation: flip-down 0.4s ease;
          transform-origin: center top;
        }
        @keyframes flip-down {
          from {
            transform: rotateX(-90deg);
            opacity: 0;
          }
          to {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .flip-num {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
