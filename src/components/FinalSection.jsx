import React from 'react';
import { LetterByLetter, FadePhrase } from './LetterByLetter';
import winnersData from '../data/winners.json';

export function FinalSection({ onReplay }) {
  const podium = [
    {
      rankNum: 1,
      rank: 'FIRST PLACE',
      tierLabel: 'CHAMPIONS',
      badgeColor: '#f0dfa8',
      borderColor: 'rgba(240,223,168,0.45)',
      name1: winnersData.firstPlace.name1,
      name2: winnersData.firstPlace.name2,
    },
    {
      rankNum: 2,
      rank: 'SECOND PLACE',
      tierLabel: 'RUNNER-UP',
      badgeColor: '#c8d0db',
      borderColor: 'rgba(200,208,219,0.35)',
      name1: winnersData.secondPlace.name1,
      name2: winnersData.secondPlace.name2,
    },
    {
      rankNum: 3,
      rank: 'THIRD PLACE',
      tierLabel: 'FINALIST',
      badgeColor: '#cf9b72',
      borderColor: 'rgba(207,155,114,0.3)',
      name1: winnersData.thirdPlace.name1,
      name2: winnersData.thirdPlace.name2,
    },
  ];

  return (
    <section className="relative w-full max-w-5xl mx-auto px-5 sm:px-10 py-10 flex flex-col items-center justify-center text-center min-h-[75vh] z-10 anim-stage-enter">

      {/* Tag */}
      <FadePhrase
        tag="p"
        delay={0}
        className="font-heading text-xs tracking-[0.3em] text-[#709be0] uppercase mb-4"
      >
        CEREMONY CONCLUDED
      </FadePhrase>

      {/* Main Headline — split onto two lines with mobile-safe clamp so it NEVER clips */}
      <div className="mb-6 w-full">
        <LetterByLetter
          tag="div"
          text="MISSION"
          animClass="anim-phrase-in"
          baseDelay={150}
          charDelay={40}
          className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
          style={{ fontSize: 'clamp(2.2rem, 8.5vw, 6.5rem)', lineHeight: 1 }}
        />
        <LetterByLetter
          tag="div"
          text="ACCOMPLISHED."
          animClass="anim-phrase-in"
          baseDelay={450}
          charDelay={35}
          className="font-display font-extrabold uppercase leading-none tracking-tight text-white block"
          style={{ fontSize: 'clamp(1.9rem, 7.5vw, 5.8rem)', lineHeight: 1.05 }}
        />
      </div>

      {/* Congrats */}
      <LetterByLetter
        tag="p"
        text="CONGRATULATIONS TO ALL OUR WINNERS!"
        animClass="anim-letter-rise"
        baseDelay={1100}
        charDelay={25}
        className="font-display font-bold uppercase text-white/95 leading-tight block mb-3 px-2"
        style={{ fontSize: 'clamp(1.1rem, 3.4vw, 2.2rem)' }}
      />

      {/* Thank you */}
      <FadePhrase
        tag="p"
        delay={2200}
        className="font-heading text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 px-3"
      >
        Thank you for being part of this Vibe Coding Hackathon.<br />
        Every prompt was a spark of ingenuity.
      </FadePhrase>

      {/* Podium Cards with actual student names */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10 anim-settle-up" style={{ animationDelay: '2600ms', opacity: 0 }}>
        {podium.map((w) => (
          <div
            key={w.rankNum}
            className="p-5 sm:p-6 rounded-2xl backdrop-blur-xl text-left transition-all hover:-translate-y-1"
            style={{
              background: w.rankNum === 1 ? 'rgba(22,32,52,0.85)' : 'rgba(14,20,32,0.65)',
              border: `1px solid ${w.borderColor}`,
              boxShadow: w.rankNum === 1 ? '0 12px 35px rgba(240,223,168,0.12)' : 'none',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bebas text-xs sm:text-sm tracking-widest uppercase" style={{ color: w.badgeColor }}>
                {w.rank}
              </span>
              <span
                className="text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full uppercase"
                style={{ background: `${w.badgeColor}20`, color: w.badgeColor }}
              >
                {w.tierLabel}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-display text-lg sm:text-xl font-extrabold uppercase text-white tracking-tight">
                {w.name1}
              </h4>
              <p className="font-display text-base sm:text-lg font-bold uppercase tracking-tight" style={{ color: w.rankNum === 1 ? '#f0dfa8' : '#d8e5ff' }}>
                {w.name2}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Replay */}
      <div className="anim-settle-up" style={{ animationDelay: '3000ms', opacity: 0 }}>
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white hover:bg-white/90 text-[#030509] font-heading font-bold text-sm tracking-wider uppercase transition-all hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(255,255,255,0.14)] active:translate-y-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Replay Experience</span>
        </button>
      </div>
    </section>
  );
}