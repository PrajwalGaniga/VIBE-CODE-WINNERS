import React, { useState } from 'react';

export function Header({ currentStage, onNavigateStage, onSkipIntro }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-[68px] px-4 sm:px-8 lg:px-14 flex items-center justify-between z-50 border-b border-white/[0.07] bg-gradient-to-b from-[#030509]/90 to-transparent backdrop-blur-md">

        {/* Brand — ultra clean on mobile */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#709be0] shadow-[0_0_8px_#709be0] animate-pulse" />
          {/* Mobile: clean single brand name */}
          <span className="font-heading font-bold text-white text-[12px] tracking-widest uppercase sm:hidden whitespace-nowrap">
            VIBE CODING
          </span>
          {/* Desktop: full tagline */}
          <span className="hidden sm:block font-heading font-bold text-white text-[12px] tracking-widest uppercase whitespace-nowrap">
            VIBE CODING 2026
          </span>
          <span className="hidden lg:block text-white/30 text-[11px]">/</span>
          <span className="hidden lg:block font-heading text-white/50 text-[11px] tracking-wider uppercase">
            ORBIT RESULTS
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Skip — visible during intro stage */}
          {currentStage === 'A' && (
            <button
              type="button"
              onClick={onSkipIntro}
              aria-label="Skip Intro"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white text-[11px] font-heading font-medium tracking-widest uppercase transition-all shadow-[0_0_12px_rgba(255,255,255,0.08)]"
            >
              <span>Skip</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
          )}

          {/* Stages — hidden on mobile to eliminate clutter, visible on desktop */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/55 hover:text-white text-[11px] font-heading tracking-widest uppercase transition-colors hover:bg-white/[0.05]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
            <span>Stages</span>
          </button>
        </div>
      </header>

      {/* Presenter Drawer */}
      {isDrawerOpen && (
        <div className="fixed top-[58px] sm:top-[72px] right-3 sm:right-8 lg:right-14 z-50 p-3 rounded-xl border border-white/10 backdrop-blur-xl shadow-2xl"
          style={{ background: 'rgba(20,28,45,0.92)' }}>
          <div className="flex flex-col gap-1.5 text-[11px] font-heading">
            <span className="text-white/40 tracking-wider mb-1">JUMP TO</span>
            {['A','B','C','D','E'].map((s, i) => {
              const labels = ['Intro','Announcement','Countdown','Results','Closing'];
              return (
                <button key={s}
                  onClick={() => { onNavigateStage(s); setIsDrawerOpen(false); }}
                  className={`text-left px-3 py-1.5 rounded-lg border transition-all ${currentStage === s ? 'bg-[#709be0]/20 text-[#709be0] border-[#709be0]/30' : 'bg-white/[0.04] text-white/65 border-white/[0.08] hover:bg-white/[0.09]'}`}
                >
                  {s} — {labels[i]}
                </button>
              );
            })}
            <button onClick={() => setIsDrawerOpen(false)} className="text-white/30 hover:text-white mt-1 text-center text-sm">✕</button>
          </div>
        </div>
      )}
    </>
  );
}
