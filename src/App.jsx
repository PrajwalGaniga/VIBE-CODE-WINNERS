import React, { useState, useEffect, useCallback } from 'react';
import { SpaceScene }         from './components/SpaceScene';
import { Header }             from './components/Header';
import { CinematicIntro }     from './components/IntroSection';
import { AnnouncementSection } from './components/AnnouncementSection';
import { CountdownSection }   from './components/CountdownSection';
import { WinnerReveal }       from './components/WinnerReveal';
import { FinalSection }       from './components/FinalSection';
import { AudioPlayer }        from './components/AudioPlayer';
import { eventConfig }        from './data/eventConfig';

export function App() {
  const targetTimestamp       = new Date(eventConfig.deadline).getTime();
  const isInitiallyPastDeadline = Date.now() >= targetTimestamp;

  const [stage, setStage]                 = useState(() => isInitiallyPastDeadline ? 'D' : 'A');
  const [isSpotlightActive, setSpotlight] = useState(false);
  const [isDimmed, setDimmed]             = useState(false);

  const navigate = useCallback((s) => {
    if (s !== 'D') { setSpotlight(false); setDimmed(false); }
    setStage(s);
  }, []);

  const handleSkip = useCallback(() => {
    navigate(Date.now() >= targetTimestamp ? 'D' : 'C');
  }, [targetTimestamp, navigate]);

  // Stage D dims the scene when TOP 1 arrives
  const handleTop1Active = useCallback((active) => {
    setSpotlight(active);
    setDimmed(active);
  }, []);

  // Keyboard: right-arrow to skip current stage
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'ArrowRight') {
        if (stage === 'A') handleSkip();
        else if (stage === 'B') navigate(Date.now() >= targetTimestamp ? 'D' : 'C');
        else if (stage === 'C') navigate('D');
      }
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [stage, navigate, handleSkip, targetTimestamp]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030509] text-white flex flex-col justify-between select-none">

      {/* Space environment — passes spotlight, dim, and astronaut phase */}
      <SpaceScene
        isSpotlightActive={isSpotlightActive}
        isDimmed={isDimmed}
        astronautPhase={stage === 'A' ? 'rise' : 'settled'}
      />

      {/* HUD Header */}
      <Header
        currentStage={stage}
        onNavigateStage={navigate}
        onSkipIntro={handleSkip}
      />

      {/* Experience */}
      <main className="relative z-10 flex-1 flex items-center justify-center pt-16 pb-10 w-full">

        {stage === 'A' && (
          <CinematicIntro
            onComplete={() => {
              const isPast = Date.now() >= targetTimestamp;
              navigate(isPast ? 'D' : 'C');
            }}
            onSkip={handleSkip}
          />
        )}

        {stage === 'B' && (
          <AnnouncementSection
            onProceed={() => navigate(Date.now() >= targetTimestamp ? 'D' : 'C')}
          />
        )}

        {stage === 'C' && (
          <CountdownSection
            onDeadlineHit={() => navigate('D')}
          />
        )}

        {stage === 'D' && (
          <WinnerReveal
            onComplete={() => { setSpotlight(false); setDimmed(false); navigate('E'); }}
            onTop1Active={handleTop1Active}
          />
        )}

        {stage === 'E' && (
          <FinalSection onReplay={() => navigate('A')} />
        )}

      </main>

      <footer className="relative z-10 py-3 text-center font-heading text-[11px] text-white/25 tracking-widest">
        VIBE CODING HACKATHON 2026
      </footer>

      {/* Background ambient audio player */}
      <AudioPlayer />
    </div>
  );
}

export default App;
