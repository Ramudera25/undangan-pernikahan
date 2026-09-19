import React, { useState, useEffect, useRef } from 'react';

const base = import.meta.env.BASE_URL;
const audioSrc = `${base}/music.mp3`.replace(/(?<!:)\/\/+/g, '/');

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handlePlayMusic = () => {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    };

    window.addEventListener('play-invitation-music', handlePlayMusic);
    return () => window.removeEventListener('play-invitation-music', handlePlayMusic);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="metadata" />
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Jeda musik' : 'Mainkan musik'}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A880] to-[#b5976f] text-[#2B2625] shadow-xl border border-white/60 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        {isPlaying ? (
          <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
            <span className="eq-bar w-[3px] rounded-full bg-[#2B2625]" />
            <span className="eq-bar w-[3px] rounded-full bg-[#2B2625]" style={{ animationDelay: '0.25s' }} />
            <span className="eq-bar w-[3px] rounded-full bg-[#2B2625]" style={{ animationDelay: '0.5s' }} />
            <span className="eq-bar w-[3px] rounded-full bg-[#2B2625]" style={{ animationDelay: '0.15s' }} />
          </span>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <style>{`
        .eq-bar {
          height: 4px;
          animation: eq 1s ease-in-out infinite;
        }
        @keyframes eq {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .eq-bar { animation: none; height: 10px; }
        }
      `}</style>
    </>
  );
}