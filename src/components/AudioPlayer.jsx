import React, { useState, useEffect, useRef } from 'react';

/**
 * AudioPlayer — Subtle background ambient music player.
 *
 * Requirements:
 *  - Plays /assets/bgm.mpeg on loop
 *  - Keeps low volume (0.22)
 *  - Handles browser autoplay policy by starting on first user interaction
 *  - Floating sound toggle button (bottom-right, inspired by cinematic landing pages)
 */
export function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = new Audio('/assets/bgm.mpeg');
    audio.loop = true;
    audio.volume = 0.22; // Low background volume
    audioRef.current = audio;

    // Attempt autoplay if permitted
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked by browser policy — will start on user interaction
        setIsPlaying(false);
      });

    // Start playback on first click/touch anywhere on page
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      audio.pause();
      audio.src = '';
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={toggleSound}
        aria-label={isPlaying ? 'Mute background audio' : 'Play background audio'}
        title={isPlaying ? 'Audio playing (Click to mute)' : 'Click to enable sound'}
        className="group relative flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-xl border border-white/15 bg-white/[0.08] hover:bg-white/[0.18] text-white/75 hover:text-white transition-all shadow-[0_8px_24px_rgba(0,0,0,0.5)] active:scale-95"
      >
        {isPlaying ? (
          <>
            {/* Playing equalizer animation */}
            <span className="flex items-end gap-[2px] h-3.5 w-3.5" aria-hidden="true">
              <span className="w-[2px] h-full bg-[#709be0] rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-[2px] h-2/3 bg-[#709be0] rounded-full animate-[pulse_0.9s_ease-in-out_infinite]" />
              <span className="w-[2px] h-4/5 bg-[#709be0] rounded-full animate-[pulse_0.75s_ease-in-out_infinite]" />
            </span>
            <span className="font-heading text-[10px] tracking-widest uppercase text-white/70">
              AUDIO ON
            </span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span className="font-heading text-[10px] tracking-widest uppercase text-white/50">
              AUDIO OFF
            </span>
          </>
        )}
      </button>
    </div>
  );
}