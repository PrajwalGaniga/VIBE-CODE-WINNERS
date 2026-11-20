import React, { useEffect } from 'react';
import { LetterByLetter, FadePhrase } from './LetterByLetter';
import { eventConfig } from '../data/eventConfig';

/** AnnouncementSection is now merged INTO CinematicIntro scene 4.
 *  This component is kept as a thin pass-through for compatibility —
 *  App.jsx still calls it for Stage B, but it auto-advances immediately
 *  into the countdown since the whole storyline lives in IntroSection now.
 *  Duration here is minimal (we just briefly show the final pre-countdown bridge).
 */
export function AnnouncementSection({ onProceed }) {
  useEffect(() => {
    const t = setTimeout(onProceed, 2000);
    return () => clearTimeout(t);
  }, [onProceed]);

  return (
    <div className="relative w-full flex items-center justify-center min-h-[70vh] z-10 px-6">
      <div className="text-center anim-stage-enter space-y-5">
        <p className="font-heading text-xs tracking-[0.3em] text-[#709be0] uppercase" style={{ animationDelay: '0ms', opacity: 0 }}>
          ORBITAL SYNCHRONISATION
        </p>
        <LetterByLetter
          tag="h2"
          text="THE WAIT IS ALMOST OVER."
          animClass="anim-letter-rise"
          baseDelay={200}
          charDelay={35}
          className="font-display text-[clamp(2.8rem,8vw,7rem)] font-extrabold uppercase leading-none tracking-tighter text-white block"
        />
      </div>
    </div>
  );
}
