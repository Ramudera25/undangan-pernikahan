import React, { useState, useEffect } from 'react';

export default function Countdown() {
  const targetDate = new Date('2026-10-24T08:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 text-center max-w-sm mx-auto my-6">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="bg-[#2B2625] text-[#EFE7DA] p-3 rounded-lg border border-[#C5A880]/40">
          <span className="block font-bold text-lg">{String(value).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase text-[#C5A880]">{label}</span>
        </div>
      ))}
    </div>
  );
}