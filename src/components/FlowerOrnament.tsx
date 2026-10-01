/**
 * Versi React dari ornamen BungaHias — untuk komponen .tsx
 * (file .astro tidak bisa diimpor langsung dari React).
 */
export default function FlowerOrnament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 56" fill="none" className={className} aria-hidden="true">
      <path
        d="M60 52 C60 42 58 36 52 30 M60 52 C60 40 64 34 72 28 M60 52 C48 48 38 46 30 40 M60 52 C72 48 82 46 90 40"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M44 44 C36 42 30 36 28 28 C36 30 42 35 44 44 Z" fill="currentColor" opacity="0.35" />
      <path d="M76 44 C84 42 90 36 92 28 C84 30 78 35 76 44 Z" fill="currentColor" opacity="0.35" />
      <g transform="translate(60 22)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-7"
            rx="5"
            ry="7.5"
            fill="currentColor"
            opacity="0.7"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle r="3.6" fill="#c9a24b" />
        <circle r="1.6" fill="#f6ecd4" />
      </g>
      <g transform="translate(28 36)">
        <circle r="4.5" fill="currentColor" opacity="0.55" />
        <path d="M0 -4.5 C-3 -8 -2 -11 0 -13 C2 -11 3 -8 0 -4.5 Z" fill="currentColor" opacity="0.55" />
      </g>
      <g transform="translate(92 36)">
        <circle r="4.5" fill="currentColor" opacity="0.55" />
        <path d="M0 -4.5 C-3 -8 -2 -11 0 -13 C2 -11 3 -8 0 -4.5 Z" fill="currentColor" opacity="0.55" />
      </g>
    </svg>
  );
}
