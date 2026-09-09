export function getGuestName(): string {
  if (typeof window === 'undefined') return 'Tamu Undangan';
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('to') || urlParams.get('kpd') || urlParams.get('untuk');
  return name ? decodeURIComponent(name).replace(/\+/g, ' ') : 'Tamu Undangan';
}