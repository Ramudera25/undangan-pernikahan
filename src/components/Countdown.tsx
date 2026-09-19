import React, { useState, useEffect } from 'react';

export default function Countdown() {
  const targetDate = new Date('2026-10-24T08:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const tick = () => {
      const difference = targetDate - new Date().getTime();
      if (difference <= 0) {
        setFinished(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (finished) {
    return (
      <div className="max-w-sm mx-auto my-6 text-center">
        <p className="font-serif text-xl text-[#C5A880]">Alhamdulillah, telah dilaksanakan</p>
        <p className="text-xs text-gray-300 mt-2">
          Terima kasih atas kehadiran dan doa restu Bapak/Ibu/Saudara/i.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center max-w-sm mx-auto my-6">
      {Object.entries(timeLeft).map(([label, value], i) => (
        <div
          key={label}
          className={'bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-[#C5A880]/40 ' + (i === 3 ? 'ring-1 ring-[#C5A880]/40' : '')}
        >
          <span className={'block font-bold text-lg text-[#EFE7DA] ' + (i === 3 ? 'text-[#C5A880]' : '')}>
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-[10px] uppercase text-[#C5A880]">{label}</span>
        </div>
      ))}
    </div>
  );
}