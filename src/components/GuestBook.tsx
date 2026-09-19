import React, { useState, useEffect } from 'react';
import { getGuestName } from '../utils/getGuestName';

const STORAGE_KEY = 'undangan-bayu-winda-ucapan';
const PHONE = '628123456789';

type Wish = { name: string; msg: string; date: string };

function readWishes(): Wish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function GuestBook() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Hadir');
  const [count, setCount] = useState(1);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setName(getGuestName());
    setWishes(readWishes());
  }, []);

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Halo, saya ${name} mengonfirmasi ${status} untuk acara pernikahan Bayu & Winda di Bojonegoro (Jumlah: ${count} orang).`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const wish: Wish = {
      name: name || 'Tamu Undangan',
      msg: message.trim(),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    const next = [wish, ...wishes].slice(0, 100);
    setWishes(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setMessage('');
  };

  return (
    <section className="py-12 px-4 max-w-md mx-auto space-y-12">
      <form
        onSubmit={handleRSVP}
        className="bg-white p-6 rounded-2xl border border-[#C5A880]/20 shadow-sm space-y-4"
      >
        <h3 className="font-serif text-xl text-center text-[#2B2625]">Konfirmasi Kehadiran</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama"
          className="w-full p-2 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-[#C5A880] focus:border-transparent outline-none"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded text-xs"
        >
          <option value="Hadir">Hadir</option>
          <option value="Tidak Hadir">Tidak Hadir</option>
        </select>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          min="1"
          max="5"
          className="w-full p-2 border border-gray-200 rounded text-xs"
        />
        <button
          type="submit"
          className="w-full py-3 bg-[#2B2625] text-[#EFE7DA] text-xs font-semibold rounded-lg hover:bg-[#3a3432] transition-colors"
        >
          KIRIM RSVP VIA WA
        </button>
      </form>

      <form
        onSubmit={handleWishSubmit}
        className="bg-white p-6 rounded-2xl border border-[#C5A880]/20 shadow-sm space-y-4"
      >
        <h3 className="font-serif text-xl text-center text-[#2B2625]">Buku Tamu & Ucapan</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis ucapan & doa..."
          className="w-full p-2 border border-gray-200 rounded text-xs h-24 focus:ring-2 focus:ring-[#C5A880] focus:border-transparent outline-none"
          maxLength={500}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-[#C5A880] text-[#2B2625] text-xs font-semibold rounded-lg hover:bg-[#b5976f] transition-colors"
        >
          KIRIM UCAPAN
        </button>

        <div className="space-y-3 mt-6 max-h-56 overflow-y-auto">
          {wishes.length === 0 ? (
            <p className="text-center text-[11px] text-gray-400 py-4">
              Belum ada ucapan. Jadilah yang pertama memberi doa terbaik untuk kami.
            </p>
          ) : (
            wishes.map((w, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-100 text-left">
                <div className="flex items-center justify-between gap-2">
                  <strong className="block text-xs text-[#2B2625]">{w.name}</strong>
                  <span className="text-[10px] text-gray-400 shrink-0">{w.date}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{w.msg}</p>
              </div>
            ))
          )}
        </div>
      </form>
    </section>
  );
}