import { useEffect, useState } from 'react';
import { storageKeys } from '../data/wedding';

const THEME_KEY = `${storageKeys.comments}-theme`;

function currentIsDark(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(currentIsDark());
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      /* abaikan */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next ? '#09111C' : '#F5FAFE');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Aktifkan mode terang' : 'Aktifkan mode malam'}
      title={dark ? 'Mode terang' : 'Mode malam'}
      className="theme-toggle-float fixed right-4 z-40 w-12 h-12 rounded-full bg-wedding-50/90 backdrop-blur border border-wedding-300 text-wedding-600 shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
    >
      {dark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4.2" />
          <path strokeLinecap="round" d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.6 14.6A8.8 8.8 0 019.4 3.4a.7.7 0 00-.9-.9 10.5 10.5 0 1012.9 12.9.7.7 0 00-.8-.8z" />
        </svg>
      )}
    </button>
  );
}
