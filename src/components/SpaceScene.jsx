import React, { useEffect, useRef } from 'react';

/**
 * SpaceScene — Cinematic space environment.
 *
 * Astronaut behaviour:
 *  - Phase 1 (Intro storytelling): rises slowly from bottom of screen upward
 *  - Phase 2 (Countdown + beyond): settled gentle float near the moon
 *
 * The astronaut is always BEHIND the story text (z-index below content).
 * On mobile it starts at bottom-center and journeys upward.
 */
export function SpaceScene({ isSpotlightActive, isDimmed = false, astronautPhase = 'rise' }) {
  const canvasRef    = useRef(null);
  const planetRef    = useRef(null);
  const moonWrapRef  = useRef(null);
  const astronautRef = useRef(null);

  /* ── Starfield + Dust Canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, running = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.25,
      a: Math.random() * 0.65 + 0.2,
      speed: Math.random() * 0.009 + 0.003,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));

    const dust = Array.from({ length: 24 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.8 + 0.3,
      a: Math.random() * 0.22 + 0.04,
      vx: (Math.random() - 0.5) * 0.00007,
      vy: -Math.random() * 0.00005 - 0.00002,
    }));

    const render = () => {
      if (!running) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        if (!reduced) {
          s.a += s.speed * s.dir;
          if (s.a > 0.88) { s.a = 0.88; s.dir = -1; }
          if (s.a < 0.12) { s.a = 0.12; s.dir = 1; }
        }
        ctx.fillStyle = `rgba(220,232,255,${s.a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) {
        for (const d of dust) {
          d.x += d.vx; d.y += d.vy;
          if (d.x < -0.02) d.x = 1.02;
          if (d.y < -0.02) d.y = 1.02;
          const grd = ctx.createRadialGradient(d.x*W, d.y*H, 0, d.x*W, d.y*H, d.r * 5);
          grd.addColorStop(0, `rgba(160,195,255,${d.a})`);
          grd.addColorStop(1, 'rgba(160,195,255,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(d.x * W, d.y * H, d.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(render);
    };

    if (!reduced) render();
    else {
      const W = canvas.width, H = canvas.height;
      for (const s of stars) {
        ctx.fillStyle = 'rgba(220,232,255,0.4)';
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Desktop Mouse Parallax (moon + planet only — not astronaut) ── */
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      if (planetRef.current)
        planetRef.current.style.transform = `translate3d(${(cx*18).toFixed(2)}px,${(cy*14).toFixed(2)}px,0)`;
      if (moonWrapRef.current)
        moonWrapRef.current.style.transform = `translate3d(${(cx*28).toFixed(2)}px,${(cy*20).toFixed(2)}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Astronaut journey animation via CSS class swap ── */
  // Phase 'rise'    → astronaut3DRise (slowly emerges from bottom of screen upward to settled position)
  // Phase 'settled' → astronaut3DFloat (gentle 3D floating hero loop near the moon)
  const isSettled = astronautPhase === 'settled';

  // Rise animation duration matches total intro duration (~26s) so it journeys upward through the story beats
  const riseStyle = {
    animation: 'astronaut3DRise 26s cubic-bezier(0.22, 0.1, 0.25, 1) forwards',
  };
  const settledStyle = {
    animation: 'astronaut3DFloat 14s ease-in-out infinite',
  };

  return (
    <>
      {/* ── BACKGROUND LAYER (z-0) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">

        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_22%,#0d1830_0%,#060912_50%,#030509_100%)]" />

        {/* Starfield + dust canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Planet — distant faint */}
        <div ref={planetRef} className="absolute inset-0 will-change-transform">
          <div className="absolute top-[10%] left-[5%] sm:left-[6%] w-[clamp(50px,7vw,100px)] h-[clamp(50px,7vw,100px)] opacity-40 planet-drift">
            <img src="/assets/planet.png" alt=""
              className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 0 16px rgba(112,155,224,0.15))' }}
            />
          </div>
        </div>

        {/* Moon — cinematic background anchor */}
        <div ref={moonWrapRef} className="absolute inset-0 will-change-transform">

          {/* Mobile moon */}
          <div className="sm:hidden absolute top-[2%] right-[-14%] w-[78vw] h-[78vw] moon-float opacity-80">
            <div className="absolute -inset-[12%] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(140,180,245,0.14) 0%, transparent 70%)' }}
            />
            <img src="/assets/moon.png" alt=""
              className="w-full h-full object-contain"
              style={{ filter: 'contrast(1.1) brightness(1.04)' }}
            />
          </div>

          {/* Desktop moon */}
          <div className="hidden sm:block absolute top-[5%] right-[2%] lg:right-[4%] w-[clamp(320px,44vw,660px)] h-[clamp(320px,44vw,660px)] moon-float">
            <div className="absolute -inset-[14%] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(140,180,245,0.14) 0%, rgba(112,155,224,0.04) 55%, transparent 72%)' }}
            />
            <img src="/assets/moon.png" alt=""
              className="w-full h-full object-contain"
              style={{ filter: 'contrast(1.1) brightness(1.05) drop-shadow(0 0 55px rgba(180,210,255,0.08))' }}
            />
            {/* TOP 1 Spotlight Bloom */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280%] h-[280%] rounded-full pointer-events-none transition-opacity duration-1000 ${isSpotlightActive ? 'opacity-100 anim-spotlight' : 'opacity-0'}`}
              style={{ background: 'radial-gradient(circle, rgba(240,220,160,0.18) 0%, rgba(112,155,224,0.07) 40%, transparent 70%)' }}
            />
          </div>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 50%, transparent 35%, rgba(3,5,9,0.78) 100%)' }}
        />

        {/* Bottom horizon fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[35vh]"
          style={{ background: 'linear-gradient(to top, rgba(3,5,9,0.95), transparent)' }}
        />

        {/* Dramatic dim overlay (TOP 1 moment) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 bg-[#030509] ${isDimmed ? 'opacity-45' : 'opacity-0'}`} />
      </div>

      {/* ── ASTRONAUT — 3D CINEMATIC HERO (z-5, always BEHIND foreground text z-10) ── */}
      {/*
        3D hero composition:
          Mobile:  Positioned near moon in upper-right; during 'rise' emerges from bottom (translateY 85vh) up to translateY(0)
          Desktop: Anchored beside the moon; during 'rise' journeys from bottom up into settled orbit
          Layering: z-5 ensures all typography (z-10) is 100% visible and never obstructed.
          3D depth: Dynamic multi-layer lighting, atmospheric rim light, and 3D perspective float like the Spider-Man reference!
      */}

      {/* Mobile 3D astronaut hero */}
      <div
        className="sm:hidden fixed pointer-events-none"
        aria-hidden="true"
        style={{
          zIndex: 5,
          top: '11%',
          right: '-2%',
          width: 'clamp(175px, 48vw, 240px)',
          height: 'clamp(215px, 58vw, 300px)',
          perspective: '1000px',
        }}
      >
        {/* Soft 3D atmospheric halo / rim glow */}
        <div
          className="absolute -inset-[20%] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, rgba(112,175,255,0.18) 0%, rgba(80,130,220,0.06) 45%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* 3D animated figure */}
        <div
          className="relative w-full h-full will-change-transform"
          style={isSettled ? settledStyle : riseStyle}
        >
          <img
            src="/assets/astronaut.png"
            alt=""
            className="w-full h-full object-contain"
            style={{
              filter:
                'drop-shadow(-16px 26px 40px rgba(0,0,0,0.92)) ' +
                'drop-shadow(0 0 30px rgba(112,175,255,0.32)) ' +
                'drop-shadow(3px -3px 12px rgba(255,255,255,0.2)) ' +
                'contrast(1.1) brightness(1.05)',
            }}
          />

          {/* Visor specular highlight sweep */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 42% 32%, rgba(255,225,120,0.6) 0%, transparent 28%)',
              animation: 'visorShine 8s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Desktop 3D astronaut hero */}
      <div
        ref={astronautRef}
        className="hidden sm:block fixed pointer-events-none"
        aria-hidden="true"
        style={{
          zIndex: 5,
          top: '14%',
          right: '7%',
          width: 'clamp(220px, 17vw, 300px)',
          height: 'clamp(270px, 21vw, 370px)',
          perspective: '1200px',
        }}
      >
        {/* Atmospheric ambient glow */}
        <div
          className="absolute -inset-[22%] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 45%, rgba(112,175,255,0.16) 0%, transparent 68%)',
            filter: 'blur(24px)',
          }}
        />

        <div
          className="relative w-full h-full will-change-transform"
          style={isSettled ? settledStyle : riseStyle}
        >
          <img
            src="/assets/astronaut.png"
            alt=""
            className="w-full h-full object-contain"
            style={{
              filter:
                'drop-shadow(-20px 32px 50px rgba(0,0,0,0.88)) ' +
                'drop-shadow(0 0 36px rgba(112,175,255,0.28)) ' +
                'drop-shadow(4px -4px 16px rgba(255,255,255,0.22)) ' +
                'contrast(1.1) brightness(1.05)',
            }}
          />

          {/* Visor specular highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 42% 32%, rgba(255,225,120,0.55) 0%, transparent 30%)',
              animation: 'visorShine 8s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </>
  );
}
