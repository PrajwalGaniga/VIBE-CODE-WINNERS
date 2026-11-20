import React, { useState, useEffect } from 'react';

/**
 * AudioPlayer — Subtle background ambient music player.
 *
 * Synchronized with #bgm preloaded audio element in index.html.
 * Plays immediately on load (or on first user gesture) at volume 0.22.
 * The toggle button accurately reflects whether audio is actually playing.
 */
export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = document.getElementById('bgm') || new Audio('/assets/bgm.mpeg');
    audio.volume = 0.22;
    audio.loop = true;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Initial check: if already playing from index.html script
    if (!audio.paused) {
      setIsPlaying(true);
    } else {
      // Attempt immediate play
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    // In case browser policy blocked until first gesture, unlock on any interaction
    const unlockOnGesture = () => {
      if (audio.dataset?.userMuted === 'true') return;
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    const events = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'scroll', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, unlockOnGesture, { passive: true, once: true });
    });

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      events.forEach((evt) => {
        window.removeEventListener(evt, unlockOnGesture);
      });
    };
  }, []);

  const toggleSound = () => {
    const audio = document.getElementById('bgm');
    if (!audio) return;

    if (audio.paused) {
      if (audio.dataset) audio.dataset.userMuted = 'false';
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      if (audio.dataset) audio.dataset.userMuted = 'true';
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
        title={isPlaying ? 'Music is ON (Click to turn off)' : 'Music is OFF (Click to turn on)'}
        className="group relative flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-xl border border-white/15 bg-white/[0.08] hover:bg-white/[0.18] text-white/75 hover:text-white transition-all shadow-[0_8px_24px_rgba(0,0,0,0.5)] active:scale-95"
      >
        {isPlaying ? (
          <>
            {/* Equalizer animation */}
            <span className="flex items-end gap-[2px] h-3.5 w-3.5" aria-hidden="true">
              <span className="w-[2px] h-full bg-[#709be0] rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-[2px] h-2/3 bg-[#709be0] rounded-full animate-[pulse_0.9s_ease-in-out_infinite]" />
              <span className="w-[2px] h-4/5 bg-[#709be0] rounded-full animate-[pulse_0.75s_ease-in-out_infinite]" />
            </span>
            <span className="font-heading text-[10px] tracking-widest uppercase text-white/80">
              MUSIC ON
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
              MUSIC OFF
            </span>
          </>
        )}
      </button>
    </div>
  );
}