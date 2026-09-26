import React, { useEffect, useState } from 'react';

type NavItem = {
  id: string;
  /** Id section tujuan; `null` berarti gulir ke bagian pembuka (paling atas). */
  target: string | null;
  label: string;
  icon: React.ReactNode;
};

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ITEMS: NavItem[] = [
  {
    id: 'home',
    target: null,
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" {...stroke}>
        <path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8z" />
      </svg>
    ),
  },
  {
    id: 'mempelai',
    target: 'mempelai',
    label: 'Mempelai',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" {...stroke}>
        <path d="M12 20S4 14.8 4 9.3A4.3 4.3 0 0112 6.9a4.3 4.3 0 018 2.4C20 14.8 12 20 12 20z" />
      </svg>
    ),
  },
  {
    id: 'tanggal',
    target: 'tanggal',
    label: 'Tanggal',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" {...stroke}>
        <path d="M8 7V3m8 4V3M5 5h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zM3 9h18" />
      </svg>
    ),
  },
  {
    id: 'galeri',
    target: 'galeri',
    label: 'Galeri',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" {...stroke}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 16l5-4 4 3 3-2 6 4" />
        <circle cx="8.5" cy="9.5" r="1.3" />
      </svg>
    ),
  },
  {
    id: 'ucapan',
    target: 'ucapan',
    label: 'Ucapan',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" {...stroke}>
        <path d="M8 10h8M8 14h5M21 12a8 8 0 01-11.6 7.1L4 21l1.6-3.6A8 8 0 1121 12z" />
      </svg>
    ),
  },
];

/** Batas atas (px) untuk menentukan section yang sedang aktif. */
const ACTIVE_LINE = 140;

/**
 * Toolbar bawah 5 menu dengan penanda menu aktif mengikuti posisi gulir,
 * sudut membulat, latar putih kebiruan transparan, dan ruang aman ponsel.
 */
export default function BottomNav() {
  const [active, setActive] = useState('home');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Muncul setelah cover undangan dibuka.
    const reveal = () => setVisible(true);
    const cover = document.getElementById('cover-screen');
    if (cover) {
      window.addEventListener('undangan-opened', reveal, { once: true });
    } else {
      reveal();
    }

    const sections = ITEMS.filter((i) => i.target)
      .map((i) => document.getElementById(i.target as string))
      .filter((el): el is HTMLElement => el !== null);

    const update = () => {
      const y = window.scrollY + ACTIVE_LINE;
      let current = 'home';
      for (const el of sections) {
        if (el.offsetTop <= y && el.offsetTop + el.offsetHeight > y) {
          current = el.id;
          break;
        }
      }
      // Di paling atas halaman, tandai Home.
      if (window.scrollY < 120) current = 'home';
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const goTo = (item: NavItem) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
    if (!item.target) {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    const el = document.getElementById(item.target);
    if (!el) return;
    window.scrollTo({ top: el.offsetTop - 12, behavior });
  };

  return (
    <nav
      aria-label="Navigasi undangan"
      className={
        'fixed left-1/2 -translate-x-1/2 z-40 w-[min(94vw,420px)] transition-all duration-500 ' +
        (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none')
      }
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)' }}
    >
      <div className="rounded-3xl border border-wedding-300 bg-white/85 backdrop-blur-lg shadow-[0_18px_40px_-20px_rgba(36,62,80,0.45)] px-2 py-2">
        <ul className="grid grid-cols-5 gap-1">
          {ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => goTo(item)}
                  aria-current={isActive ? 'true' : undefined}
                  className={
                    'w-full flex flex-col items-center gap-1 rounded-2xl py-2 transition-colors ' +
                    (isActive
                      ? 'bg-wedding-200 text-wedding-600'
                      : 'text-ink-muted hover:bg-wedding-100 hover:text-wedding-600')
                  }
                >
                  {item.icon}
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
