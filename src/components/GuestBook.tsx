import React, { useState, useEffect } from 'react';
import { getGuestName } from '../utils/getGuestName';

export default function GuestBook() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Hadir');
  const [count, setCount] = useState(1);
  const [wishes, setWishes] = useState<{ name: string; msg: string }[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setName(getGuestName());
  }, []);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = '628123456789';
    const text = `Halo, saya ${name} mengonfirmasi ${status} untuk acara pernikahan Bayu & Winda di Bojonegoro (Jumlah: ${count} orang).`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setWishes([{ name, msg: message }, ...wishes]);
    setMessage('');
  };

  return (
    <section className="py-12 px-4 max-w-md mx-auto space-y-12">
      {/* RSVP Form */}
      <form onSubmit={handleRSVP} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-serif text-xl text-center text-[#2B2625]">Konfirmasi Kehadiran</h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" className="w-full p-2 border rounded text-xs" required />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded text-xs">
          <option value="Hadir">Hadir</option>
          <option value="Tidak Hadir">Tidak Hadir</option>
        </select>
        <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min="1" max="5" className="w-full p-2 border rounded text-xs" />
        <button type="submit" className="w-full py-3 bg-[#2B2625] text-[#EFE7DA] text-xs font-semibold rounded-lg">KIRIM RSVP VIA WA</button>
      </form>

      {/* Guestbook Form */}
      <form onSubmit={handleWishSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-serif text-xl text-center text-[#2B2625]">Buku Tamu & Ucapan</h3>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis ucapan & doa..." className="w-full p-2 border rounded text-xs h-24" required />
        <button type="submit" className="w-full py-3 bg-[#C5A880] text-[#2B2625] text-xs font-semibold rounded-lg">KIRIM UCAPAN</button>

        <div className="space-y-3 mt-6 max-h-48 overflow-y-auto">
          {wishes.map((w, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded border text-left">
              <strong className="block text-xs text-[#2B2625]">{w.name}</strong>
              <p className="text-xs text-gray-600">{w.msg}</p>
            </div>
          ))}
        </div>
      </form>
    </section>
  );
}