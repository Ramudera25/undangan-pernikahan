const DEFAULT_NAME = 'Tamu Undangan';
const MAX_LEN = 60;

/** Bersihkan input dari query param: buang tag HTML, batasi panjang. */
export function sanitizeGuestName(raw: string | null): string {
  if (!raw) return '';
  return raw.replace(/<[^>]*>/g, '').replace(/\+/g, ' ').trim().slice(0, MAX_LEN);
}

/** Nama tamu dari `?to=` (fallback `?nama=`, lalu alias lama `kpd`/`untuk`). */
export function getGuestName(): string {
  if (typeof window === 'undefined') return DEFAULT_NAME;
  const urlParams = new URLSearchParams(window.location.search);
  const raw =
    urlParams.get('to') ||
    urlParams.get('nama') ||
    urlParams.get('kpd') ||
    urlParams.get('untuk');
  let name = '';
  try {
    name = sanitizeGuestName(raw ? decodeURIComponent(raw) : '');
  } catch {
    name = sanitizeGuestName(raw);
  }
  return name || DEFAULT_NAME;
}

/** URL halaman ini dengan `?to=` terisi nama tamu saat ini (untuk dibagikan). */
export function shareUrlWithGuest(): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  const name = getGuestName();
  if (name && name !== DEFAULT_NAME) {
    url.searchParams.set('to', name);
  }
  return url.toString();
}
