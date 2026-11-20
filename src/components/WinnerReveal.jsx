import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LetterByLetter, FadePhrase } from './LetterByLetter';
import winnersData from '../data/winners.json';

/**
 * WinnerReveal — Fully automatic cinematic reveal from winners.json.
 *
 * Sequence:
 *   1. Intro banner ("FINAL EVALUATION // THE MOMENT WE'VE BEEN WAITING FOR")
 *   2. Third Place  — both names, staggered letter-by-letter
 *   3. Suspense / Curiosity Interlude ("WAIT... WHO'S SWEATING RIGHT NOW? 😅")
 *   4. Second Place — both names, runner-up honors
 *   5. High-Stakes Interlude ("DEEP BREATHS EVERYONE... 👑")
 *   6. First Place  — champion spotlight, bloom, camera push-in
 *   7. Auto-progresses to FinalSection
 *
 * Winner names come exclusively from src/data/winners.json.
 * No manual buttons. All progression is automatic.
 */

// Structured reveal steps
const STEPS = [
  // Step 0: Banner
  {
    type: 'banner',
    duration: 3800,
  },
  // Step 1: 3rd Place Winner
  {
    type: 'winner',
    winnerIdx: 0,
    rankNum: 3,
    rank: 'THIRD PLACE',
    tierLabel: 'THIRD PLACE — FINALIST',
    name1: winnersData.thirdPlace.name1,
    name2: winnersData.thirdPlace.name2,
    badgeColor: '#cf9b72',
    borderColor: 'rgba(207,155,114,0.3)',
    shadowColor: 'rgba(207,155,114,0.12)',
    glowColor: 'rgba(207,155,114,0.08)',
    duration: 11000,
  },
  // Step 2: Interlude after 3rd place (funny & suspenseful, delayed for comfortable reading)
  {
    type: 'intermission',
    badge: 'SYSTEM STATUS: PALMS ARE SWEATY 😅',
    title: 'WAIT... WHO’S SWEATING RIGHT NOW?',
    subtitle: 'Third place was already legendary. But the battle for the top 2? Pure chaos.',
    teaser: 'RUNNER-UP REVEAL INCOMING IN 3... 2... 1...',
    duration: 7500,
  },
  // Step 3: 2nd Place Winner
  {
    type: 'winner',
    winnerIdx: 1,
    rankNum: 2,
    rank: 'SECOND PLACE',
    tierLabel: 'SECOND PLACE — RUNNER-UP',
    name1: winnersData.secondPlace.name1,
    name2: winnersData.secondPlace.name2,
    badgeColor: '#c8d0db',
    borderColor: 'rgba(200,208,219,0.42)',
    shadowColor: 'rgba(200,208,219,0.14)',
    glowColor: 'rgba(200,208,219,0.08)',
    duration: 11500,
  },
  // Step 4: Interlude after 2nd place (highest curiosity & suspense before #1)
  {
    type: 'intermission',
    badge: 'MISSION ALERT: PULSE CHECK REQUIRED 💓',
    title: 'DEEP BREATHS EVERYONE... 🧘‍♂️',
    subtitle: 'The judges argued over this for 30 straight minutes. Only ONE project takes the crown.',
    teaser: 'ARE YOU READY FOR THE CHAMPIONS? 🏆',
    duration: 8000,
  },
  // Step 5: 1st Place Champion
  {
    type: 'winner',
    winnerIdx: 2,
    rankNum: 1,
    rank: 'FIRST PLACE',
    tierLabel: 'FIRST PLACE — CHAMPION',
    name1: winnersData.firstPlace.name1,
    name2: winnersData.firstPlace.name2,
    badgeColor: '#f0dfa8',
    borderColor: 'rgba(240,223,168,0.7)',
    shadowColor: 'rgba(240,223,168,0.25)',
    glowColor: 'rgba(240,223,168,0.15)',
    duration: 16000,
  },
];

const EXIT_MS = 600;

export function WinnerReveal({ onComplete, onTop1Active }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);
  const timerRef = useRef(null);
  const stepIdxRef = useRef(stepIdx);
  stepIdxRef.current = stepIdx;

  const currentStep = STEPS[stepIdx] ?? STEPS[0];
  const isTop1 = currentStep.type === 'winner' && currentStep.winnerIdx === 2;

  // Notify parent when TOP 1 is active (triggers spotlight bloom + dim)
  useEffect(() => {
    onTop1Active(isTop1);
  }, [isTop1, onTop1Active]);

  // Advance to next step
  const advance = useCallback(() => {
    setExiting(true);
    timerRef.current = setTimeout(() => {
      const next = stepIdxRef.current + 1;
      if (next >= STEPS.length) {
        onComplete();
        return;
      }
      setExiting(false);
      setMounted(false);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setStepIdx(next);
        setMounted(true);
      }));
    }, EXIT_MS);
  }, [onComplete]);

  // Auto-progress based on current step duration
  useEffect(() => {
    const holdMs = currentStep.duration ?? 5000;
    timerRef.current = setTimeout(advance, holdMs);
    return () => clearTimeout(timerRef.current);
  }, [stepIdx, currentStep.duration, advance]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const exitStyle = {
    transition: `opacity ${EXIT_MS}ms ease, filter ${EXIT_MS}ms ease, transform ${EXIT_MS}ms ease`,
    opacity: exiting ? 0 : 1,
    filter: exiting ? 'blur(8px)' : 'blur(0)',
    transform: exiting ? 'scale(1.03)' : 'scale(1)',
  };

  if (!mounted) return null;

  /* ── 1. INTRO BANNER ── */
  if (currentStep.type === 'banner') {
    return (
      <div
        className="relative w-full flex flex-col items-center justify-center min-h-[70vh] z-10 text-center px-5"
        style={exitStyle}
        aria-live="polite"
      >
        <FadePhrase
          tag="p"
          delay={100}
          className="font-heading text-xs tracking-[0.3em] text-white/40 uppercase mb-4"
        >
          FINAL EVALUATION // TRANSMISSION 03
        </FadePhrase>
        <LetterByLetter
          tag="h2"
          text="THE MOMENT WE'VE"
          animClass="anim-phrase-in"
          baseDelay={300}
          charDelay={38}
          className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
          style={{ fontSize: 'clamp(2.1rem, 6.5vw, 5.2rem)' }}
        />
        <LetterByLetter
          tag="h2"
          text="BEEN WAITING FOR."
          animClass="anim-phrase-in"
          baseDelay={1100}
          charDelay={38}
          className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
          style={{ fontSize: 'clamp(2.1rem, 6.5vw, 5.2rem)' }}
        />
        <FadePhrase
          tag="p"
          delay={2200}
          className="font-heading text-base sm:text-xl text-[#709be0] mt-5 font-medium"
        >
          LET'S REVEAL THE RESULTS.
        </FadePhrase>
      </div>
    );
  }

  /* ── 2. SUSPENSE / HUMOR INTERLUDE ── */
  if (currentStep.type === 'intermission') {
    return (
      <div
        className="relative w-full flex flex-col items-center justify-center min-h-[72vh] z-10 text-center px-5 sm:px-10"
        style={exitStyle}
        aria-live="polite"
      >
        {/* Glow pill badge */}
        <div className="anim-settle-up mb-4" style={{ animationDelay: '100ms', opacity: 0 }}>
          <span className="font-heading text-xs font-semibold tracking-[0.2em] text-[#709be0] px-4 py-1.5 rounded-full border border-[#709be0]/35 bg-[#709be0]/15 uppercase">
            {currentStep.badge}
          </span>
        </div>

        {/* Humorous curiosity headline — responsive clamp so it never overflows */}
        <div className="max-w-2xl mx-auto my-3 px-2">
          <LetterByLetter
            tag="h2"
            text={currentStep.title}
            animClass="anim-letter-pop"
            baseDelay={300}
            charDelay={30}
            className="font-display font-extrabold uppercase leading-tight tracking-tight text-white block"
            style={{ fontSize: 'clamp(1.5rem, 5.2vw, 3.8rem)' }}
          />
        </div>

        {/* Narrative punchline */}
        <FadePhrase
          tag="p"
          delay={1200}
          className="font-heading text-sm sm:text-base text-white/75 max-w-xl mx-auto leading-relaxed my-2 px-3"
        >
          {currentStep.subtitle}
        </FadePhrase>

        {/* Teaser countdown */}
        <FadePhrase
          tag="div"
          delay={2500}
          className="mt-6 font-bebas text-lg sm:text-2xl tracking-widest text-[#f0dfa8]"
        >
          {currentStep.teaser}
        </FadePhrase>

        {/* Visual progress bar for interlude */}
        <AutoProgressBar duration={currentStep.duration} color="#709be0" key={`prog-${stepIdx}`} />
      </div>
    );
  }

  /* ── 3. WINNER CARD (3rd, 2nd, 1st) ── */
  const name1CharCount = currentStep.name1.length;
  const name1Duration = 400 + name1CharCount * (isTop1 ? 65 : 52);
  const name2BaseDelay = 500 + name1Duration;

  return (
    <div
      className="relative w-full flex items-center justify-center min-h-[75vh] z-10 px-4 sm:px-8"
      style={exitStyle}
      aria-live="polite"
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden backdrop-blur-2xl"
        style={{
          border: `1px solid ${currentStep.borderColor}`,
          boxShadow: `0 28px 80px ${currentStep.shadowColor}, inset 0 0 55px ${currentStep.glowColor}`,
          background: isTop1
            ? 'linear-gradient(135deg, rgba(22,32,52,0.92) 0%, rgba(10,15,28,0.95) 100%)'
            : 'rgba(14, 20, 32, 0.74)',
          animation: isTop1 ? 'cameraPushIn 13s ease-out forwards' : 'none',
        }}
      >
        {/* Giant watermark rank number */}
        <div
          className="absolute top-0 right-4 sm:right-8 font-bebas leading-none select-none pointer-events-none"
          aria-hidden="true"
          style={{
            fontSize: 'clamp(7rem, 20vw, 16rem)',
            color: `${currentStep.badgeColor}09`,
            letterSpacing: '-0.04em',
          }}
        >
          {String(currentStep.rankNum).padStart(2, '0')}
        </div>

        {/* TOP 1 cinematic spotlight overlay inside card */}
        {isTop1 && (
          <div
            className="absolute -inset-1 rounded-3xl pointer-events-none anim-spotlight"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(240,223,168,0.12) 0%, transparent 60%)' }}
          />
        )}

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-6 sm:space-y-7">

          {/* Progress dots + rank badge */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-heading font-semibold tracking-[0.14em] uppercase"
              style={{
                borderColor: `${currentStep.badgeColor}55`,
                color: currentStep.badgeColor,
                background: `${currentStep.badgeColor}12`,
              }}
            >
              <span>★</span>
              <span>{currentStep.tierLabel}</span>
            </div>

            {/* Rank progression indicators (3rd, 2nd, 1st) */}
            <div className="flex items-center gap-2">
              {[3, 2, 1].map((rankNum, i) => {
                const active = currentStep.rankNum === rankNum;
                const past = currentStep.rankNum < rankNum;
                return (
                  <span
                    key={rankNum}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: active ? 10 : 8,
                      height: active ? 10 : 8,
                      background: past ? '#709be0' : active ? '#fff' : 'rgba(255,255,255,0.18)',
                      boxShadow: active ? '0 0 8px rgba(255,255,255,0.6)' : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* RANK Title — Bebas Neue */}
          <LetterByLetter
            tag="p"
            text={currentStep.rank}
            animClass="anim-phrase-in"
            baseDelay={0}
            charDelay={80}
            style={{
              fontSize: 'clamp(2.4rem, 6.5vw, 4.8rem)',
              letterSpacing: '0.07em',
              color: currentStep.badgeColor,
            }}
            className="font-bebas leading-none block"
          />

          {/* NAMES — staggered letter-by-letter */}
          <div className="space-y-3">
            {/* Student 1 */}
            <div>
              <p className="font-heading text-[11px] tracking-[0.24em] text-white/40 uppercase mb-1.5">
                {currentStep.rank} · STUDENT 1
              </p>
              <LetterByLetter
                tag="h3"
                text={currentStep.name1}
                animClass={isTop1 ? 'anim-winner-name' : 'anim-phrase-in'}
                baseDelay={420}
                charDelay={isTop1 ? 70 : 54}
                className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
                style={{
                  fontSize: 'clamp(1.8rem, 6vw, 4.6rem)',
                  textShadow: isTop1 ? '0 0 45px rgba(255,255,255,0.22)' : 'none',
                }}
              />
            </div>

            {/* Divider */}
            <div
              className="w-16 h-px"
              style={{ background: `${currentStep.badgeColor}40` }}
            />

            {/* Student 2 */}
            <div>
              <p
                className="font-heading text-[11px] tracking-[0.24em] text-white/40 uppercase mb-1.5"
                style={{ opacity: 0, animation: `settleUp 0.5s ease ${name2BaseDelay - 200}ms forwards` }}
              >
                {currentStep.rank} · STUDENT 2
              </p>
              <LetterByLetter
                tag="h3"
                text={currentStep.name2}
                animClass={isTop1 ? 'anim-winner-name' : 'anim-letter-rise'}
                baseDelay={name2BaseDelay}
                charDelay={isTop1 ? 65 : 48}
                className="font-display font-extrabold uppercase leading-none tracking-tight block"
                style={{
                  fontSize: 'clamp(1.8rem, 6vw, 4.6rem)',
                  color: isTop1 ? '#f0dfa8' : '#d8e5ff',
                  textShadow: isTop1 ? '0 0 40px rgba(240,223,168,0.3)' : 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Auto-advance progress bar */}
        <AutoProgressBar
          duration={currentStep.duration}
          color={currentStep.badgeColor}
          key={`prog-${stepIdx}`}
        />
      </div>
    </div>
  );
}

function AutoProgressBar({ duration, color }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const start = Date.now();
    let raf;
    const tick = () => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setW(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5" aria-hidden="true">
      <div style={{ width: `${w}%`, height: '100%', background: color, transition: 'none' }} />
    </div>
  );
}