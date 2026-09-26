import type { Gender } from '../utils/commentStore';

type AvatarProps = {
  gender: Gender;
  /** Ukuran dalam piksel (bujur sangkar). */
  size?: number;
  className?: string;
};

const PALETTE: Record<Gender, { bg: string; fg: string; label: string }> = {
  L: { bg: '#DCEEF8', fg: '#426B87', label: 'Tamu laki-laki' },
  P: { bg: '#FBE8EE', fg: '#C58BA0', label: 'Tamu perempuan' },
  netral: { bg: '#EAF4FB', fg: '#8296A8', label: 'Tamu undangan' },
};

/**
 * Avatar tamu tanpa login. Bentuknya mengikuti jenis kelamin yang dipilih
 * pengirim: siluet laki-laki untuk "L", siluet perempuan untuk "P".
 */
export default function Avatar({ gender, size = 56, className = '' }: AvatarProps) {
  const { bg, fg, label } = PALETTE[gender] ?? PALETTE.netral;
  const gradientId = `av-${gender}-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={label}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor={bg} />
        </linearGradient>
      </defs>

      <circle cx="24" cy="24" r="23" fill={`url(#${gradientId})`} />
      <circle cx="24" cy="24" r="23" fill="none" stroke={bg} strokeWidth="2" />

      {gender === 'P' ? (
        <>
          {/* Rambut panjang membingkai wajah */}
          <ellipse cx="24" cy="18.5" rx="10.8" ry="11.4" fill={fg} opacity="0.55" />
          <path d="M13.2 18.6c0 6.6.9 11.3 2.1 14.5h4.1c-1.7-3.1-2.6-7.5-2.6-14.5z" fill={fg} opacity="0.55" />
          <path d="M34.8 18.6c0 6.6-.9 11.3-2.1 14.5h-4.1c1.7-3.1 2.6-7.5 2.6-14.5z" fill={fg} opacity="0.55" />
          <circle cx="24" cy="20" r="7.4" fill={fg} />
          <path d="M9.9 41.2c1.7-6.5 7.3-10.3 14.1-10.3s12.4 3.8 14.1 10.3z" fill={fg} />
        </>
      ) : gender === 'L' ? (
        <>
          {/* Rambut pendek */}
          <path
            d="M24 8.8c-5.5 0-9.6 3.7-9.6 8.6 0 1.7.4 3.1 1 4.3.6-3.7 3.8-6.2 8.6-6.2s8 2.5 8.6 6.2c.6-1.2 1-2.6 1-4.3 0-4.9-4.1-8.6-9.6-8.6z"
            fill={fg}
            opacity="0.55"
          />
          <circle cx="24" cy="19.5" r="7.4" fill={fg} />
          <path d="M9.9 41.2c1.7-6.5 7.3-10.3 14.1-10.3s12.4 3.8 14.1 10.3z" fill={fg} />
        </>
      ) : (
        <>
          <circle cx="24" cy="19.5" r="7.4" fill={fg} />
          <path d="M9.9 41.2c1.7-6.5 7.3-10.3 14.1-10.3s12.4 3.8 14.1 10.3z" fill={fg} />
        </>
      )}
    </svg>
  );
}
