import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LetterByLetter, FadePhrase } from './LetterByLetter';

/**
 * CinematicIntro — 5-scene fully automatic storyline.
 *
 * Timing philosophy:
 *  - Each letter/char animates over ~0.5s
 *  - After the last letter lands, hold the sentence for 2.5–3.5s before exiting
 *  - Total scene time = animation completion time + reading hold time
 *  - Scenes: ~3s / 4s / 4.5s / 4s / 4s = ~19s total intro
 *
 * Text is on z-10, well above the astronaut (z-5) and scene (z-0).
 */

// SCENE_DURATIONS: how long the scene stays (ms) AFTER mount.
// Set so letter animation finishes + audience has 2.5–3.5s of comfortable reading time.
const SCENE_DURATIONS = [
  4400,  // Scene 0: "HEY, EVERYONE!" — ~1.5s reveal + 2.9s reading hold
  5200,  // Scene 1: "VIBE CODING SMALL HACKATHON." — ~2.1s reveal + 3.1s reading hold
  6400,  // Scene 2: "WHAT YOU CAN BUILD... WITH JUST A PROMPT." — key statement, ~2.8s reveal + 3.6s reading hold
  5200,  // Scene 3: "ARE YOU EXCITED? ... THE RESULTS ARE ALMOST HERE." — ~2.2s reveal + 3.0s reading hold
  5200,  // Scene 4: "TONIGHT. 9:00 PM IST." — ~2.2s reveal + 3.0s reading hold
];

// Exit transition duration in ms
const EXIT_MS = 600;

export function CinematicIntro({ onComplete, onSkip }) {
  const [scene, setScene]   = useState(0);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const timerRef  = useRef(null);
  const sceneRef  = useRef(0);
  sceneRef.current = scene;

  const advance = useCallback(() => {
    setExiting(true);
    timerRef.current = setTimeout(() => {
      const next = sceneRef.current + 1;
      if (next >= SCENE_DURATIONS.length) {
        onComplete();
        return;
      }
      setExiting(false);
      setMounted(false);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setScene(next);
        setMounted(true);
      }));
    }, EXIT_MS);
  }, [onComplete]);

  useEffect(() => {
    timerRef.current = setTimeout(advance, SCENE_DURATIONS[scene]);
    return () => clearTimeout(timerRef.current);
  }, [scene, advance]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const wrapStyle = {
    transition: `opacity ${EXIT_MS}ms ease, filter ${EXIT_MS}ms ease, transform ${EXIT_MS}ms ease`,
    opacity:  exiting ? 0 : 1,
    filter:   exiting ? 'blur(6px)' : 'blur(0)',
    transform: exiting ? 'scale(1.025)' : 'scale(1)',
  };

  if (!mounted) return null;

  return (
    /*
     * Foreground storytelling layer.
     * z-10 keeps text in front of astronaut (z-5) and background (z-0).
     * Positioned left-aligned, vertically centered on desktop / lower-half on mobile
     * with responsive typography so words NEVER clip or overflow on any phone width.
     */
    <div className="relative w-full flex items-end sm:items-center justify-start min-h-[80vh] z-10 px-5 sm:px-12 lg:px-16 pb-16 sm:pb-0">
      <div style={wrapStyle} className="w-full max-w-[min(92vw,680px)] overflow-visible">

        {/* ── SCENE 0: HEY, EVERYONE! ── */}
        {scene === 0 && (
          <div className="space-y-2 sm:space-y-4">
            <FadePhrase
              tag="p"
              delay={200}
              className="font-heading text-[11px] sm:text-xs tracking-[0.28em] text-[#709be0] uppercase"
            >
              TRANSMISSION 01 // WELCOME
            </FadePhrase>
            {/* Split "HEY," and "EVERYONE!" onto separate lines so "EVERYONE!" never overflows on mobile */}
            <div className="space-y-0.5 sm:space-y-1">
              <LetterByLetter
                tag="div"
                text="HEY,"
                animClass="anim-letter-pop"
                baseDelay={380}
                charDelay={72}
                className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
                style={{ fontSize: 'clamp(2rem, 8.5vw, 6.5rem)', lineHeight: 1 }}
              />
              <LetterByLetter
                tag="div"
                text="EVERYONE!"
                animClass="anim-letter-pop"
                baseDelay={700}
                charDelay={62}
                className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
                style={{ fontSize: 'clamp(2rem, 8.5vw, 6.5rem)', lineHeight: 1.05 }}
              />
            </div>
          </div>
        )}

        {/* ── SCENE 1: VIBE CODING SMALL HACKATHON ── */}
        {scene === 1 && (
          <div className="space-y-3 sm:space-y-5">
            <FadePhrase
              tag="p"
              delay={200}
              className="font-heading text-sm sm:text-xl text-white/70 leading-snug"
            >
              Hope you enjoyed today's
            </FadePhrase>
            <div className="space-y-1 sm:space-y-2">
              <LetterByLetter
                tag="div"
                text="VIBE CODING"
                animClass="anim-phrase-in"
                baseDelay={500}
                charDelay={62}
                className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
                style={{ fontSize: 'clamp(1.9rem, 7.5vw, 5.8rem)', lineHeight: 1 }}
              />
              <LetterByLetter
                tag="div"
                text="SMALL HACKATHON."
                animClass="anim-letter-rise"
                baseDelay={1350}
                charDelay={44}
                className="font-display font-bold uppercase leading-tight tracking-tight text-white/88 block"
                style={{ fontSize: 'clamp(1.2rem, 4.5vw, 3rem)', lineHeight: 1.15 }}
              />
            </div>
          </div>
        )}

        {/* ── SCENE 2: WHAT YOU CAN BUILD ── */}
        {scene === 2 && (
          <div className="space-y-3 sm:space-y-5">
            <FadePhrase
              tag="p"
              delay={200}
              className="font-heading text-xs sm:text-sm text-white/50 uppercase tracking-widest"
            >
              BUT MORE IMPORTANTLY...
            </FadePhrase>
            <div className="space-y-2">
              <LetterByLetter
                tag="div"
                text="WHAT YOU CAN BUILD"
                animClass="anim-phrase-in"
                baseDelay={500}
                charDelay={50}
                className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
                style={{ fontSize: 'clamp(1.65rem, 6.5vw, 4.8rem)', lineHeight: 1.05 }}
              />
              <LetterByLetter
                tag="div"
                text="WITH JUST A PROMPT."
                animClass="anim-letter-pop"
                baseDelay={1800}
                charDelay={56}
                className="font-display font-extrabold uppercase leading-none tracking-tight text-[#d8e5ff] block"
                style={{ fontSize: 'clamp(1.5rem, 5.8vw, 4.2rem)', lineHeight: 1.1 }}
              />
            </div>
          </div>
        )}

        {/* ── SCENE 3: ARE YOU EXCITED? ── */}
        {scene === 3 && (
          <div className="space-y-3 sm:space-y-5">
            <div className="space-y-0.5 sm:space-y-1">
              <LetterByLetter
                tag="div"
                text="ARE YOU"
                animClass="anim-letter-pop"
                baseDelay={200}
                charDelay={68}
                className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
                style={{ fontSize: 'clamp(2.1rem, 9vw, 7rem)', lineHeight: 1 }}
              />
              <LetterByLetter
                tag="div"
                text="EXCITED?"
                animClass="anim-letter-pop"
                baseDelay={720}
                charDelay={68}
                className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
                style={{ fontSize: 'clamp(2.1rem, 9vw, 7rem)', lineHeight: 1.05 }}
              />
            </div>
            <FadePhrase
              tag="p"
              delay={1800}
              className="font-heading text-sm sm:text-lg text-[#709be0] font-medium"
            >
              THE RESULTS ARE ALMOST HERE.
            </FadePhrase>
          </div>
        )}

        {/* ── SCENE 4: TONIGHT. 9:00 PM IST. ── */}
        {scene === 4 && (
          <div className="space-y-3 sm:space-y-5">
            <LetterByLetter
              tag="div"
              text="TONIGHT."
              animClass="anim-phrase-in"
              baseDelay={200}
              charDelay={82}
              className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
              style={{ fontSize: 'clamp(2.2rem, 9.5vw, 7.5rem)', lineHeight: 1 }}
            />
            <LetterByLetter
              tag="div"
              text="9:00 PM IST."
              animClass="anim-letter-pop"
              baseDelay={900}
              charDelay={72}
              className="font-bebas leading-none tracking-widest text-[#f0dfa8] block"
              style={{ fontSize: 'clamp(2rem, 7.5vw, 5.5rem)' }}
            />
            <FadePhrase
              tag="p"
              delay={2100}
              className="font-heading text-xs sm:text-base text-white/55 max-w-sm leading-relaxed"
            >
              Your creativity and hard work are about to be recognised.
            </FadePhrase>
          </div>
        )}

      </div>
    </div>
  );
}
