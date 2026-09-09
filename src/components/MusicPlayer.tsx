import React, { useState, useEffect, useRef } from 'react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState('/music.mp3');

  useEffect(() => {
    // Inject BASE_URL dynamically at runtime since this is a client-side component
    // Actually we can just use import.meta.env.BASE_URL because Vite replaces it at build time
    const base = import.meta.env.BASE_URL;
    setAudioSrc(`${base}/music.mp3`.replace(/(?<!:)\/\/+/g, '/'));

    const handlePlayMusic = () => {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    };

    window.addEventListener('play-invitation-music', handlePlayMusic);
    return () => window.removeEventListener('play-invitation-music', handlePlayMusic);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop />
      <button onClick={toggleMusic} className="fixed bottom-4 right-4 z-40 bg-[#C5A880] text-[#2B2625] p-3 rounded-full shadow-lg border border-white">
        {isPlaying ? '🎵' : '🔇'}
      </button>
    </>
  );
}
