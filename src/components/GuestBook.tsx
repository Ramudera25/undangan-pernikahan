import React, { useEffect, useMemo, useState } from 'react';
import Avatar from './Avatar';
import { couple, rsvpEventChoices, rsvpWhatsApp, storageKeys } from '../data/wedding';
import { getGuestName } from '../utils/getGuestName';
import {
  formatCommentDate,
  parseComment,
  readComments,
  writeComments,
  type Attendance,
  type Gender,
  type GuestComment,
} from '../utils/commentStore';

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

const ATTENDANCE_OPTIONS: Attendance[] = ['Hadir', 'Tidak Hadir', 'Masih Ragu'];

/**
 * Kolom komentar tamu — tanpa login dan tanpa backend.
 *
 * Avatar mengikuti jenis kelamin yang dipilih pengirim, lalu nama dan isi
 * komentar tampil di bawahnya. Karena tidak ada server, komentar disimpan di
 * `localStorage` perangkat pengirim (lihat catatan di bagian bawah komponen).
 */
export default function GuestBook() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  const [attendance, setAttendance] = useState<Attendance>('Hadir');
  const [chosenEvent, setChosenEvent] = useState<string>(rsvpEventChoices[0] ?? '');
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState<GuestComment[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setName(getGuestName());
    setComments(readComments());

    // Ikut memperbarui bila tab lain menulis komentar.
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKeys.comments) setComments(readComments());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const draft = parseComment({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Tamu Undangan',
      gender,
      attendance,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });
    if (!draft) {
      setNotice('Nama dan ucapan perlu diisi terlebih dahulu.');
      return;
    }

    const next = [draft, ...comments];
    setComments(next);
    const saved = writeComments(next);
    setNotice(
      saved
        ? 'Terima kasih! Ucapan Anda sudah ditampilkan di bawah.'
        : 'Ucapan tampil di perangkat ini saja karena penyimpanan browser tidak tersedia.',
    );
    setMessage('');
  };

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpWhatsApp) return;
    const who = name.trim() || 'Tamu Undangan';
    const acara = chosenEvent ? ` pada acara ${chosenEvent}` : '';
    const text = `Halo, saya ${who} mengonfirmasi ${attendance}${acara} untuk pernikahan ${couple.shortName}.`
    window.open(`https://wa.me/${rsvpWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const total = comments.length;
  const hadir = useMemo(
    () => comments.filter((c) => c.attendance === 'Hadir').length,
    [comments],
  );

  return (
    <section id="ucapan" className="py-16 px-4 max-w-md mx-auto space-y-8 scroll-mt-24">
      {/* ---------- Konfirmasi kehadiran ---------- */}
      <form onSubmit={handleRSVP} className="surface p-6 rounded-2xl space-y-4">
        <h3 className="font-serif text-2xl text-center text-ink">Konfirmasi Kehadiran</h3>

        <label className="block">
          <span className="text-xs font-medium text-ink-soft">Nama</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className="mt-1 w-full p-3 border border-wedding-300 rounded-lg text-sm focus:ring-2 focus:ring-wedding-600 focus:border-transparent outline-none"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-ink-soft">Acara yang dihadiri</span>
          <select
            value={chosenEvent}
            onChange={(e) => setChosenEvent(e.target.value)}
            className="mt-1 w-full p-3 border border-wedding-300 rounded-lg text-sm bg-white"
          >
            {rsvpEventChoices.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-ink-soft">Kehadiran</span>
          <select
            value={attendance}
            onChange={(e) => setAttendance(e.target.value as Attendance)}
            className="mt-1 w-full p-3 border border-wedding-300 rounded-lg text-sm bg-white"
          >
            {ATTENDANCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        {rsvpWhatsApp ? (
          <button
            type="submit"
            className="w-full py-3 bg-wedding-600 text-white text-xs font-semibold rounded-lg hover:bg-wedding-700 transition-colors"
          >
            KIRIM KONFIRMASI VIA WHATSAPP
          </button>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Nomor WhatsApp tujuan belum diisi"
              className="w-full py-3 bg-wedding-300 text-ink/50 text-xs font-semibold rounded-lg cursor-not-allowed"
            >
              KIRIM KONFIRMASI VIA WHATSAPP
            </button>
            <p className="text-[11px] leading-relaxed text-ink-muted text-center">
              Nomor WhatsApp tujuan belum diisi, jadi pengiriman dinonaktifkan agar Anda tidak
              diarahkan ke nomor yang salah. Silakan tuliskan ucapan pada kolom di bawah.
            </p>
          </div>
        )}
      </form>

      {/* ---------- Kolom komentar tanpa login ---------- */}
      <form onSubmit={handleSubmit} className="surface p-6 rounded-2xl space-y-4">
        <h3 className="font-serif text-2xl text-center text-ink">Ucapan &amp; Doa</h3>
        <p className="text-sm text-ink-soft text-center -mt-1">
          Tulis pesan untuk kami — tanpa perlu masuk akun apa pun.
        </p>

        {/* Pratinjau avatar mengikuti pilihan jenis kelamin */}
        <div className="flex flex-col items-center gap-2">
          <Avatar gender={gender} size={64} />
          <div className="flex gap-2">
            {GENDER_OPTIONS.map((opt) => {
              const active = gender === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setGender(opt.value)}
                  className={
                    'px-4 py-2 rounded-full text-xs font-semibold border transition-colors ' +
                    (active
                      ? 'bg-wedding-600 text-white border-wedding-600'
                      : 'bg-white text-ink-soft border-wedding-300 hover:border-wedding-400')
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-ink-muted">Avatar akan menyesuaikan pilihan Anda.</p>
        </div>

        <label className="block">
          <span className="text-xs font-medium text-ink-soft">Nama</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            maxLength={60}
            className="mt-1 w-full p-3 border border-wedding-300 rounded-lg text-sm focus:ring-2 focus:ring-wedding-600 focus:border-transparent outline-none"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-ink-soft">Ucapan &amp; doa</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis ucapan & doa untuk kami..."
            className="mt-1 w-full p-3 border border-wedding-300 rounded-lg text-sm h-28 focus:ring-2 focus:ring-wedding-600 focus:border-transparent outline-none resize-y"
            maxLength={500}
            required
          />
          <span className="block text-right text-[10px] text-ink-muted mt-1">
            {message.length}/500
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-wedding-600 text-white text-xs font-semibold rounded-lg hover:bg-wedding-700 transition-colors"
        >
          KIRIM UCAPAN
        </button>

        {notice && (
          <p role="status" className="text-[11px] text-center text-wedding-600">
            {notice}
          </p>
        )}
      </form>

      {/* ---------- Daftar komentar ---------- */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h4 className="font-serif text-xl text-ink">Buku Tamu</h4>
          <p className="text-[11px] text-ink-muted">
            {total} ucapan{total > 0 ? ` · ${hadir} hadir` : ''}
          </p>
        </div>

        {comments.length === 0 ? (
          <p className="text-center text-sm text-ink-muted py-6 bg-white/60 border border-wedding-300/70 rounded-2xl">
            Belum ada ucapan. Jadilah yang pertama memberi doa terbaik untuk kami.
          </p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-wedding-300 shadow-sm text-center"
              >
                {/* Avatar di atas, nama & komentar di bawahnya */}
                <div className="flex justify-center">
                  <Avatar gender={c.gender} size={56} />
                </div>
                <p className="mt-3 font-semibold text-sm text-ink break-words">{c.name}</p>
                <p className="text-sm text-ink-soft leading-relaxed mt-1 break-words whitespace-pre-wrap">
                  {c.message}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  {c.attendance && (
                    <span
                      className={
                        'text-[10px] px-2.5 py-1 rounded-full border font-medium ' +
                        (c.attendance === 'Hadir'
                          ? 'bg-wedding-200 text-wedding-600 border-wedding-300'
                          : 'bg-wedding-50 text-ink-muted border-wedding-300')
                      }
                    >
                      {c.attendance}
                    </span>
                  )}
                  <span className="text-[10px] text-ink-muted">
                    {formatCommentDate(c.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="text-[11px] leading-relaxed text-ink-muted text-center">
          Ucapan disimpan di peramban perangkat Anda. Untuk buku tamu bersama yang terlihat semua
          tamu, diperlukan layanan penyimpanan (backend).
        </p>
      </div>
    </section>
  );
}
