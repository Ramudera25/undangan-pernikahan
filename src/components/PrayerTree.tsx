import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { seedComments } from '../data/seedComments';
import FlowerOrnament from './FlowerOrnament';
import {
  getDefaultBlessingAdapter,
  type Blessing,
  type BlessingAdapter,
} from '../utils/blessingAdapter';

/** Doa bawaan: 10 seed comments menjadi bunga awal di pohon. */
const seedBlessings: Blessing[] = seedComments.map((c) => ({
  id: `seed-${c.id}`,
  name: c.name,
  message: c.message,
  createdAt: c.createdAt,
}));

/** Hash deterministik → posisi bunga stabil di kanopi pohon. */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Posisi bunga di dalam elips kanopi (cx 200, cy 155). */
function blessingPos(id: string): { x: number; y: number; s: number } {
  const h = hashStr(id);
  const angle = (h % 628) / 100; // 0..~2π
  const radius = 0.32 + ((h >>> 9) % 620) / 1000; // 0.32..0.94
  return {
    x: 200 + Math.cos(angle) * 138 * radius,
    y: 152 + Math.sin(angle) * 92 * radius - 6,
    s: 0.75 + ((h >>> 19) % 550) / 1000, // 0.75..1.3
  };
}

const BLOSSOM_COLORS = ['#F4A7C3', '#EE7FA8', '#F7C1D9', '#E86A9A', '#F9B4CD'];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

type Props = {
  /** Adapter penyimpanan. Default: LocalStorageAdapter (tanpa backend). */
  adapter?: BlessingAdapter;
};

/**
 * Pohon Doa — setiap ucapan menjadi bunga di pohon.
 *
 * UI hanya berbicara ke `BlessingAdapter`; ganti adapter untuk backend
 * (Firebase/Supabase) tanpa mengubah komponen ini.
 */
export default function PrayerTree({ adapter }: Props) {
  const storeRef = useRef<BlessingAdapter | null>(null);
  if (!storeRef.current) storeRef.current = adapter ?? getDefaultBlessingAdapter();
  const store = storeRef.current;

  const [userBlessings, setUserBlessings] = useState<Blessing[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [selected, setSelected] = useState<Blessing | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setUserBlessings(await store.list());
    } catch {
      setUserBlessings([]);
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    refresh();
    const unsub = store.subscribe?.(() => refresh());
    return () => unsub?.();
  }, [refresh, store]);

  /** Gabungan bunga awal (seed) + doa tamu: dedupe by id, terbaru dulu. */
  const blessings = useMemo(() => {
    const seen = new Set<string>();
    const all = [...userBlessings, ...seedBlessings].filter((b) => {
      if (seen.has(b.id)) return false;
      seen.add(b.id);
      return true;
    });
    return all.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [userBlessings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    try {
      const saved = await store.add({ name, message });
      setUserBlessings((prev) => [saved, ...prev]);
      setJustAddedId(saved.id);
      setTimeout(() => setJustAddedId((cur) => (cur === saved.id ? null : cur)), 1600);
      setName('');
      setMessage('');
      setSelected(saved);
      setNotice('Terima kasih! Doa Anda telah mekar di pohon.');
    } catch {
      setNotice('Nama dan isi doa perlu diisi terlebih dahulu.');
    }
  };

  return (
    <section id="pohon-doa" className="py-16 px-4 max-w-2xl mx-auto text-center scroll-mt-24">
      <p className="text-[10px] text-wedding-600 tracking-[0.25em] uppercase font-semibold" data-reveal>
        Pohon Doa
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl text-ink mt-1 mb-3" data-reveal data-reveal-delay="80">
        Sampaikan Doa Terbaikmu
      </h2>
      <FlowerOrnament className="w-24 h-11 mx-auto text-wedding-400/70 mb-2" />
      <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed mb-2" data-reveal data-reveal-delay="160">
        Setiap doa yang Anda kirim akan mekar menjadi bunga di pohon ini.
        Ketuk bunganya untuk membaca doa dari para tamu.
      </p>

      <p className="text-xs font-semibold text-wedding-600 mb-6" data-reveal data-reveal-delay="200" aria-live="polite">
        {loading ? '…' : `🌸 ${blessings.length} doa telah terkumpul`}
      </p>

      {/* ---------- Pohon ---------- */}
      <div className="relative mx-auto max-w-md" data-reveal data-reveal-delay="240">
        <svg
          viewBox="0 0 400 470"
          role="img"
          aria-label={`Pohon doa dengan ${blessings.length} bunga`}
          className="w-full h-auto prayer-tree"
        >
          {/* Tanah */}
          <ellipse cx="200" cy="438" rx="120" ry="16" fill="currentColor" className="text-wedding-300/50" />
          <g className="tree-sway">
            {/* Batang */}
            <path
              d="M200 440 C196 380 188 330 168 290 C150 255 138 235 128 210"
              fill="none"
              stroke="#8a6d3f"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <path
              d="M200 440 C204 385 214 340 232 305 C248 275 258 255 268 232"
              fill="none"
              stroke="#a07f47"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M200 440 C200 400 200 360 200 320"
              fill="none"
              stroke="#7a5f33"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Ranting kecil */}
            <path d="M168 290 C150 275 138 262 130 245" fill="none" stroke="#8a6d3f" strokeWidth="6" strokeLinecap="round" />
            <path d="M232 305 C250 292 262 280 270 264" fill="none" stroke="#a07f47" strokeWidth="5" strokeLinecap="round" />
            {/* Kanopi daun */}
            <ellipse cx="200" cy="152" rx="150" ry="104" className="tree-canopy" />
            <ellipse cx="128" cy="190" rx="70" ry="52" className="tree-canopy" opacity="0.85" />
            <ellipse cx="272" cy="188" rx="72" ry="54" className="tree-canopy" opacity="0.85" />
            <ellipse cx="200" cy="110" rx="86" ry="52" className="tree-canopy" opacity="0.9" />

            {/* Bunga-bunga doa */}
            {blessings.map((b, i) => {
              const { x, y, s } = blessingPos(b.id);
              const color = BLOSSOM_COLORS[i % BLOSSOM_COLORS.length];
              const isNew = b.id === justAddedId;
              const isSel = selected?.id === b.id;
              return (
                <g
                  key={b.id}
                  transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})`}
                  className={'prayer-blossom' + (isNew ? ' blossom-pop' : '')}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(isSel ? null : b)}
                >
                  <title>{b.name}</title>
                  <circle r="13" fill="transparent" />
                  {[0, 72, 144, 216, 288].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="0"
                      cy="-6.5"
                      rx="4.6"
                      ry="7"
                      fill={color}
                      opacity={isSel ? 1 : 0.92}
                      transform={`rotate(${deg})`}
                      stroke={isSel ? '#c9a24b' : 'none'}
                      strokeWidth="1.4"
                    />
                  ))}
                  <circle r="3.4" fill="#c9a24b" />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Kartu detail doa saat bunga diketuk */}
        {selected && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[92%] max-w-sm surface rounded-2xl p-5 shadow-xl text-center z-10">
            <button
              onClick={() => setSelected(null)}
              aria-label="Tutup doa"
              className="absolute top-2 right-3 text-ink-muted hover:text-ink text-lg leading-none"
            >
              ×
            </button>
            <p className="font-script text-3xl gold-text leading-tight">{selected.name}</p>
            <p className="text-sm text-ink-soft leading-relaxed mt-2 whitespace-pre-wrap break-words">
              {selected.message}
            </p>
            <p className="text-[10px] text-ink-muted mt-3">{formatDate(selected.createdAt)}</p>
          </div>
        )}
      </div>

      {/* ---------- Form kirim doa ---------- */}
      <form onSubmit={handleSubmit} className="surface p-6 rounded-2xl space-y-4 mt-8 text-left" data-reveal>
        <h3 className="font-serif text-2xl text-center text-ink">Kirim Doa Anda</h3>
        <label className="block">
          <span className="text-xs font-medium text-ink-soft">Nama</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            maxLength={60}
            required
            className="mt-1 w-full p-3 border border-wedding-300 rounded-lg text-sm focus:ring-2 focus:ring-wedding-600 focus:border-transparent outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-ink-soft">Doa &amp; ucapan</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis doa terbaik untuk kedua mempelai..."
            maxLength={500}
            required
            className="mt-1 w-full p-3 border border-wedding-300 rounded-lg text-sm h-24 focus:ring-2 focus:ring-wedding-600 focus:border-transparent outline-none resize-y"
          />
          <span className="block text-right text-[10px] text-ink-muted mt-1">{message.length}/500</span>
        </label>
        <button
          type="submit"
          className="w-full py-3 bg-wedding-600 text-white text-xs font-semibold rounded-lg hover:bg-wedding-700 transition-colors"
        >
          🌸 MEKARKAN DOA SAYA
        </button>
        {notice && (
          <p role="status" className="text-[11px] text-center text-wedding-600">
            {notice}
          </p>
        )}
        <p className="text-[11px] leading-relaxed text-ink-muted text-center">
          Doa tersimpan di peramban perangkat ini. Buku doa bersama untuk semua tamu
          akan hadir setelah tersambung ke layanan penyimpanan.
        </p>
      </form>

      <style>{`
        .tree-canopy { fill: #cfe6f2; }
        html.dark .tree-canopy { fill: #1d3350; }
        .tree-sway {
          transform-origin: 200px 440px;
          animation: tree-sway 7s ease-in-out infinite;
        }
        @keyframes tree-sway {
          0%, 100% { transform: rotate(-1.1deg); }
          50% { transform: rotate(1.1deg); }
        }
        .prayer-blossom {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.25s ease;
        }
        .prayer-blossom:hover { transform-box: fill-box; }
        html.dark .prayer-blossom {
          filter: drop-shadow(0 0 7px rgba(244, 163, 201, 0.85));
        }
        .blossom-pop { animation: blossom-pop 1.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes blossom-pop {
          0% { scale: 0; opacity: 0; }
          60% { scale: 1.25; opacity: 1; }
          100% { scale: 1; opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tree-sway, .blossom-pop { animation: none; }
        }
      `}</style>
    </section>
  );
}
