import React, { useRef, useEffect, useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { eventConfig } from '../data/eventConfig';
import { FadePhrase } from './LetterByLetter';

function AnimatedDigit({ value }) {
  const [displayed, setDisplayed] = useState(value);
  const [flipping, setFlipping]   = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value !== prev.current) {
      setFlipping(true);
      const t = setTimeout(() => { setDisplayed(value); setFlipping(false); prev.current = value; }, 180);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className="font-bebas tabular-nums text-white leading-none"
      style={{
        fontSize: 'clamp(2.6rem, 9.5vw, 8.5rem)',
        animation: flipping ? 'digitFlip 0.3s cubic-bezier(0.16,1,0.3,1) both' : 'none',
        letterSpacing: '-0.02em',
        display: 'block',
      }}
    >
      {displayed}
    </span>
  );
}

export function CountdownSection({ onDeadlineHit }) {
  const { formattedHours, formattedMinutes, formattedSeconds, hours, minutes, isPastDeadline } =
    useCountdown(eventConfig.deadline, onDeadlineHit);

  return (
    <section className="relative w-full max-w-5xl mx-auto px-5 sm:px-10 py-8 flex items-center min-h-[75vh] z-10 anim-stage-enter">
      <div className="w-full space-y-6 sm:space-y-7">

        {/* Mission badge */}
        <div className="anim-settle-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <span className="font-heading text-[11px] font-bold tracking-[0.2em] text-[#709be0] px-4 py-1.5 rounded-full border border-[#709be0]/30 bg-[#709be0]/10 uppercase">
            MISSION: RESULTS
          </span>
        </div>

        {/* Heading — responsive */}
        <h2
          className="font-display font-extrabold uppercase leading-none tracking-tight text-white anim-settle-up"
          style={{ animationDelay: '220ms', opacity: 0, fontSize: 'clamp(1.75rem, 5.5vw, 4rem)' }}
        >
          THE RESULTS WILL BE<br />REVEALED IN
        </h2>

        {/* Timer — 3 columns, constrained to screen width */}
        <div
          className="anim-settle-up"
          style={{ animationDelay: '380ms', opacity: 0 }}
          role="timer"
          aria-live="polite"
          aria-label={`${hours} hours ${minutes} minutes remaining`}
        >
          <div
            className="inline-flex items-end gap-2 sm:gap-5 p-4 sm:p-8 rounded-2xl border border-white/10 backdrop-blur-xl max-w-full"
            style={{
              background: 'rgba(14, 20, 32, 0.68)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.65)',
            }}
          >
            {/* Hours */}
            <div className="flex flex-col items-center">
              <AnimatedDigit value={formattedHours} />
              <span className="font-heading text-[9px] sm:text-[11px] tracking-[0.22em] text-white/40 mt-1 uppercase">HRS</span>
            </div>

            <span className="font-bebas text-[clamp(2.5rem,7vw,5.5rem)] text-white/20 leading-none mb-5 select-none animate-pulse">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <AnimatedDigit value={formattedMinutes} />
              <span className="font-heading text-[9px] sm:text-[11px] tracking-[0.22em] text-white/40 mt-1 uppercase">MIN</span>
            </div>

            <span className="font-bebas text-[clamp(2.5rem,7vw,5.5rem)] text-white/20 leading-none mb-5 select-none animate-pulse">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <AnimatedDigit value={formattedSeconds} />
              <span className="font-heading text-[9px] sm:text-[11px] tracking-[0.22em] text-white/40 mt-1 uppercase">SEC</span>
            </div>
          </div>
        </div>

        {/* Meta — compact, single line */}
        <div className="font-heading text-xs text-white/45 space-y-0.5 anim-settle-up" style={{ animationDelay: '540ms', opacity: 0 }}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#709be0] flex-shrink-0" />
            <span>20 November 2026 · <strong className="text-white/70">9:00 PM IST</strong></span>
          </div>
          <p className="text-white/30 pl-3.5">
            {isPastDeadline ? 'Transmission unlocked' : `${hours}h ${minutes}m remaining`}
          </p>
        </div>

        {/* Orbital ring — desktop only */}
        <div className="hidden lg:block anim-settle-up" style={{ animationDelay: '700ms', opacity: 0 }} aria-hidden="true">
          <div className="relative w-44 h-44 opacity-25 mt-4">
            <div className="absolute inset-0 rounded-full border border-dashed border-white/25" style={{ animation: 'orbitRing 70s linear infinite' }} />
            <div className="absolute inset-5 rounded-full border border-[#709be0]/20" style={{ animation: 'orbitRing 45s linear infinite reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center font-heading text-[8px] text-white/30 tracking-widest text-center">
              <div><div>LUNAR ORBIT</div><div>01</div></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
