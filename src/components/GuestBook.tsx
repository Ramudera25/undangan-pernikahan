import React, { useEffect, useMemo, useRef, useState } from 'react';
import Avatar from './Avatar';
import FlowerOrnament from './FlowerOrnament';
import { couple, rsvpEventChoices, rsvpWhatsApp, storageKeys } from '../data/wedding';
import { seedComments } from '../data/seedComments';
import { getGuestName } from '../utils/getGuestName';
import {
  formatCommentDate,
  parseComment,
  readComments,
  sortComments,
  writeComments,
  type Attendance,
  type Gender,
  type GuestComment,
} from '../utils/commentStore';
import {
  getDefaultUcapanAdapter,
  sanitizeUcapanInput,
  type UcapanAdapter,
} from '../utils/firebaseUcapanAdapter';

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
];

const ATTENDANCE_OPTIONS: Attendance[] = ['Hadir', 'Tidak Hadir', 'Masih Ragu'];

/** Kunci penyimpanan konfirmasi kehadiran (RSVP) di browser. */
const RSVP_STORAGE_KEY = 'undangan-bayu-lilik-rsvp';

type RsvpEntry = {
  name: string;
  attendance: Attendance;
  guests: number;
  event: string;
  createdAt: string;
};

function readRsvps(): RsvpEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RSVP_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RsvpEntry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as RsvpEntry).name === 'string' &&
        typeof (e as RsvpEntry).createdAt === 'string',
    );
  } catch {
    return [];
  }
}

type FirebaseState = 'loading' | 'ready' | 'error';

/**
 * Kolom komentar tamu — tanpa login.
 *
 * Ucapan disimpan di Firebase Realtime Database (path
 * `ucapan/undangan-bayu-lilik`) sehingga terlihat SEMUA tamu secara
 * real-time. Bila Firebase belum siap (rules path `ucapan/` belum dipasang
 * atau jaringan gagal), ucapan jatuh ke `localStorage` perangkat pengirim.
 *
 * Avatar mengikuti jenis kelamin yang dipilih pengirim. Komentar bawaan
 * (`seedComments`) hanya untuk tampilan awal: selalu di bawah entri tamu,
 * tidak disimpan ke database maupun `localStorage`.
 */
export default function GuestBook() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  const [attendance, setAttendance] = useState<Attendance>('Hadir');
  const [chosenEvent, setChosenEvent] = useState<string>(rsvpEventChoices[0] ?? '');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [remoteComments, setRemoteComments] = useState<GuestComment[]>([]);
  const [localComments, setLocalComments] = useState<GuestComment[]>([]);
  const [firebaseState, setFirebaseState] = useState<FirebaseState>('loading');
  const [notice, setNotice] = useState<string | null>(null);
  const [rsvpNotice, setRsvpNotice] = useState<string | null>(null);
  const adapterRef = useRef<UcapanAdapter | null>(null);

  if (!adapterRef.current) adapterRef.current = getDefaultUcapanAdapter();

  useEffect(() => {
    setName(getGuestName());
    setLocalComments(readComments());

    const adapter = adapterRef.current;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const refresh = () => {
      if (!adapter) return;
      adapter
        .list()
        .then((list) => {
          if (!cancelled) {
            setRemoteComments(list);
            setFirebaseState('ready');
          }
        })
        .catch(() => {
          if (!cancelled) setFirebaseState('error');
        });
    };

    if (adapter) {
      refresh();
      unsubscribe = adapter.subscribe(refresh);
    } else {
      setFirebaseState('error');
    }

    // Ikut memperbarui bila tab lain menulis komentar lokal.
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKeys.comments) setLocalComments(readComments());
    };
    window.addEventListener('storage', onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', onStorage);
      unsubscribe?.();
    };
  }, []);

  /**
   * Gabungan ucapan: entri Firebase (realtime) + komentar lokal, terbaru dulu;
   * seed bawaan selalu di bawah sebagai fallback, tidak ditulis ke mana pun.
   */
  const comments = useMemo(() => {
    const seen = new Set<string>();
    const merged = [...remoteComments, ...localComments].filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
    const seeds = seedComments.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
    return [...sortComments(merged), ...seeds];
  }, [remoteComments, localComments]);

  /** Simpan ucapan ke localStorage (dipakai saat Firebase tidak tersedia). */
  const saveLocal = (draft: {
    name: string;
    gender: Gender;
    attendance: Attendance | null;
    message: string;
  }): boolean => {
    const parsed = parseComment({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: draft.name,
      gender: draft.gender,
      attendance: draft.attendance,
      message: draft.message,
      createdAt: new Date().toISOString(),
    });
    if (!parsed) return false;
    const next = [parsed, ...localComments];
    setLocalComments(next);
    return writeComments(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeUcapanInput({
      name: name.trim() || 'Tamu Undangan',
      message: message.trim(),
      gender,
      attendance,
    });
    if (!clean) {
      setNotice('Nama dan ucapan perlu diisi terlebih dahulu.');
      return;
    }

    const adapter = adapterRef.current;
    if (adapter) {
      try {
        const saved = await adapter.add(clean);
        setRemoteComments((prev) =>
          sortComments([saved, ...prev.filter((c) => c.id !== saved.id)]),
        );
        setNotice('Terima kasih! Ucapan Anda sudah tampil dan terlihat semua tamu.');
        setMessage('');
        return;
      } catch {
        // Firebase gagal (mis. rules path ucapan/ belum dipasang) — jatuh ke lokal.
        setFirebaseState('error');
      }
    }

    const saved = saveLocal(clean);
    setNotice(
      saved
        ? 'Terima kasih! Ucapan Anda sudah ditampilkan di bawah.'
        : 'Ucapan tampil di perangkat ini saja karena penyimpanan browser tidak tersedia.',
    );
    setMessage('');
  };

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    const who = name.trim() || 'Tamu Undangan';
    const count = Math.min(10, Math.max(1, Math.floor(Number(guests)) || 1));
    const acara = chosenEvent ? ` pada acara ${chosenEvent}` : '';

    if (rsvpWhatsApp) {
      const text =
        `Halo, saya ${who} mengonfirmasi ${attendance}${acara} untuk pernikahan ` +
        `${couple.shortName}. Jumlah tamu: ${count} orang.`;
      window.open(`https://wa.me/${rsvpWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
      return;
    }

    // Nomor WhatsApp belum diisi: simpan konfirmasi di perangkat ini, jangan
    // buka WhatsApp dan jangan mengarang nomor tujuan.
    const entry: RsvpEntry = {
      name: who,
      attendance,
      guests: count,
      event: chosenEvent,
      createdAt: new Date().toISOString(),
    };
    try {
      const prev = readRsvps();
      window.localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify([...prev, entry]));
      setRsvpNotice(
        `Terima kasih, ${who}! Konfirmasi kehadiran untuk ${count} tamu sudah tersimpan di perangkat ini.`,
      );
    } catch {
      setRsvpNotice('Konfirmasi tidak dapat disimpan karena penyimpanan browser tidak tersedia.');
    }
  };

  const total = comments.length;
  const hadir = useMemo(
    () => comments.filter((c) => c.attendance === 'Hadir').length,
    [comments],
  );
  const realtime = firebaseState === 'ready';

  return (
    <section id="ucapan" className="py-16 px-4 max-w-md mx-auto space-y-8 scroll-mt-24">
      {/* ---------- Kepala section: bedakan dari Pohon Doa ---------- */}
      <div className="text-center space-y-2">
        <p className="text-[10px] text-wedding-600 tracking-[0.25em] uppercase font-semibold">
          💌 Buku Tamu
        </p>
        <h2 className="font-serif text-3xl text-ink">Ucapan Selamat &amp; Kehadiran</h2>
        <p className="text-sm text-ink-soft leading-relaxed max-w-sm mx-auto">
          Kolom klasik untuk menyampaikan ucapan selamat sekaligus konfirmasi kehadiran Anda.
          Semua ucapan tampil sebagai kartu di bawah ini.
        </p>
        {firebaseState !== 'loading' && (
          <p
            className={
              'inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border ' +
              (realtime
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-amber-50 text-amber-700 border-amber-200')
            }
          >
            <span
              className={'w-1.5 h-1.5 rounded-full ' + (realtime ? 'bg-green-500' : 'bg-amber-500')}
              aria-hidden="true"
            />
            {realtime ? 'Realtime — terlihat semua tamu' : 'Mode lokal — hanya di perangkat ini'}
          </p>
        )}
      </div>

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

        <label className="block">
          <span className="text-xs font-medium text-ink-soft">Jumlah tamu</span>
          <input
            type="number"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-1 w-full p-3 border border-wedding-300 rounded-lg text-sm focus:ring-2 focus:ring-wedding-600 focus:border-transparent outline-none"
          />
          <span className="block text-[10px] text-ink-muted mt-1">
            Termasuk Anda sendiri (maksimal 10).
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-wedding-600 text-white text-xs font-semibold rounded-lg hover:bg-wedding-700 transition-colors"
        >
          {rsvpWhatsApp ? 'KIRIM KONFIRMASI VIA WHATSAPP' : 'SIMPAN KONFIRMASI'}
        </button>

        {!rsvpWhatsApp && (
          <p className="text-[11px] leading-relaxed text-ink-muted text-center">
            Konfirmasi disimpan di peramban perangkat ini karena nomor WhatsApp tujuan belum
            tersedia.
          </p>
        )}

        {rsvpNotice && (
          <p role="status" className="text-[11px] leading-relaxed text-center text-wedding-600">
            {rsvpNotice}
          </p>
        )}
      </form>

      {/* ---------- Kolom komentar tanpa login ---------- */}
      <form onSubmit={handleSubmit} className="surface p-6 rounded-2xl space-y-4">
        <FlowerOrnament className="w-24 h-11 mx-auto text-wedding-400/70 -mb-1" />
        <h3 className="font-serif text-2xl text-center text-ink">Kirim Ucapan Selamat</h3>
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
          <span className="text-xs font-medium text-ink-soft">Ucapan selamat</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis ucapan selamat untuk kedua mempelai..."
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
          <h4 className="font-serif text-xl text-ink">Daftar Ucapan</h4>
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
          {realtime
            ? 'Ucapan tersimpan otomatis dan langsung terlihat oleh semua tamu secara realtime.'
            : 'Ucapan disimpan di peramban perangkat Anda. Untuk buku tamu bersama yang terlihat semua tamu, diperlukan layanan penyimpanan (backend).'}
        </p>
      </div>
    </section>
  );
}
