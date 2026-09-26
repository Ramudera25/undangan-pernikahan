import { useEffect, useRef, useState } from 'react';
import { music } from '../data/wedding';

const base = import.meta.env.BASE_URL;
const audioSrc = `${base}/${music.src}`.replace(/(?<!:)\/\/+/g, '/');

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handlePlayMusic = () => {
      audioRef.current
        ?.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
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
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="metadata" />
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Jeda musik' : 'Mainkan musik'}
        title={music.title}
        className="float-above-nav fixed right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-wedding-500 to-wedding-600 text-white shadow-xl border border-white/70 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        {isPlaying ? (
          <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
            <span className="eq-bar w-[3px] rounded-full bg-white" />
            <span className="eq-bar w-[3px] rounded-full bg-white" style={{ animationDelay: '0.25s' }} />
            <span className="eq-bar w-[3px] rounded-full bg-white" style={{ animationDelay: '0.5s' }} />
            <span className="eq-bar w-[3px] rounded-full bg-white" style={{ animationDelay: '0.15s' }} />
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
