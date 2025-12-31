// src/components/BackgroundMusic.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import backgroundMusic from '../assets/sounds/background-music.mp3';

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1; // thoda soft rakho background ke liye
      audio.loop = true;

      // Auto play attempt (browser policy ke wajah se user interaction chahiye hota hai)
      const playAudio = () => {
        audio.play().catch(err => {
          console.log("Auto-play blocked, waiting for user interaction:", err);
        });
      };

      // Pehli baar user kuch click karega tab play hoga (browser rule)
      document.addEventListener('click', playAudio, { once: true });
      document.addEventListener('touchstart', playAudio, { once: true });

      // Cleanup
      return () => {
        document.removeEventListener('click', playAudio);
        document.removeEventListener('touchstart', playAudio);
      };
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={backgroundMusic} />

      {/* Mute/Unmute Button - fixed position */}
      <button
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-[200] glass-card p-5 rounded-full border border-white/20 backdrop-blur-md shadow-2xl hover:scale-110 transition-all"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <VolumeX className="text-gray-400" size={28} />
        ) : (
          <Volume2 className="text-[#D4AF37] animate-pulse" size={28} />
        )}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-gray-500 whitespace-nowrap">
          {isMuted ? 'Silent Mode' : 'Music On'}
        </span>
      </button>
    </>
  );
};

export default BackgroundMusic;