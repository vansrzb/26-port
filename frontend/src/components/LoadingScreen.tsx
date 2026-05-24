import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function LoadingScreen({ onComplete, duration = 2800 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / (duration * 0.88), 1);
      // Ease: fast start, slow near end
      const eased = 1 - Math.pow(1 - raw, 2.2);
      setProgress(Math.floor(eased * 100));
      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setExiting(true), duration * 0.92);
    const t2 = setTimeout(() => onComplete?.(), duration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // SVG circle charge fill — fill from bottom to top using clipPath
  const SIZE = 160;
  const STROKE = 3;
  const R = (SIZE - STROKE * 2) / 2;
  const CIRCUM = 2 * Math.PI * R;
  // strokeDashoffset: full = CIRCUM (empty), 0 = full
  const dashOffset = CIRCUM * (1 - progress / 100);

  // Water fill level (bottom to top): 100% = top of circle
  const fillY = SIZE - (SIZE * progress) / 100;

  const done = progress === 100;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#020409',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'DM Mono, monospace',
            overflow: 'hidden',
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');
            @keyframes gridDrift { from{background-position:0 0} to{background-position:32px 32px} }
            @keyframes shimmerName {
              0%   { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            @keyframes ripple {
              0%   { transform: scale(1);   opacity: 0.5; }
              100% { transform: scale(1.5); opacity: 0; }
            }
            @keyframes scanline {
              0%   { top: -2px; }
              100% { top: 100%; }
            }
            .wave {
              animation: waveAnim 2.2s linear infinite;
            }
            @keyframes waveAnim {
              0%   { d: path("M0,8 C40,0 80,16 160,8 L160,80 L0,80 Z"); }
              50%  { d: path("M0,12 C40,4 80,20 160,12 L160,80 L0,80 Z"); }
              100% { d: path("M0,8 C40,0 80,16 160,8 L160,80 L0,80 Z"); }
            }
          `}</style>

          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.055) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            animation: 'gridDrift 24s linear infinite',
          }}/>

          {/* Scan line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.15), transparent)',
            animation: 'scanline 5s linear infinite',
          }}/>

          {/* Ambient glow */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}/>

          {/* Corner brackets */}
          {[
            { top: 24, left: 24, borderTop: '1.5px solid rgba(96,165,250,0.35)', borderLeft: '1.5px solid rgba(96,165,250,0.35)' },
            { top: 24, right: 24, borderTop: '1.5px solid rgba(96,165,250,0.35)', borderRight: '1.5px solid rgba(96,165,250,0.35)' },
            { bottom: 24, left: 24, borderBottom: '1.5px solid rgba(96,165,250,0.35)', borderLeft: '1.5px solid rgba(96,165,250,0.35)' },
            { bottom: 24, right: 24, borderBottom: '1.5px solid rgba(96,165,250,0.35)', borderRight: '1.5px solid rgba(96,165,250,0.35)' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              style={{ position: 'absolute', ...s, width: 26, height: 26 }}
            />
          ))}

          {/* ── MAIN LOGO CHARGE ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
          >
            {/* Circle charge unit */}
            <div style={{ position: 'relative', width: SIZE, height: SIZE }}>

              {/* Ripple when done */}
              {done && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: -8, borderRadius: '50%',
                      border: '1.5px solid rgba(96,165,250,0.5)',
                    }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.7], opacity: [0.3, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut', delay: 0.25 }}
                    style={{
                      position: 'absolute',
                      inset: -8, borderRadius: '50%',
                      border: '1px solid rgba(96,165,250,0.3)',
                    }}
                  />
                </>
              )}

              {/* SVG: water fill + ring */}
              <svg
                width={SIZE} height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{ position: 'absolute', inset: 0 }}
              >
                <defs>
                  {/* Clip to circle shape */}
                  <clipPath id="circleClip">
                    <circle cx={SIZE / 2} cy={SIZE / 2} r={R} />
                  </clipPath>
                </defs>

                {/* Water fill — blue rect rising from bottom */}
                <g clipPath="url(#circleClip)">
                  <motion.rect
                    x={0}
                    y={fillY}
                    width={SIZE}
                    height={SIZE}
                    fill={done ? 'rgba(37,99,235,0.55)' : 'rgba(37,99,235,0.38)'}
                    style={{ transition: 'y 0.08s linear, fill 0.4s ease' }}
                  />
                  {/* Wave on top of fill */}
                  <motion.rect
                    x={0}
                    y={fillY - 6}
                    width={SIZE}
                    height={12}
                    fill={done ? 'rgba(96,165,250,0.45)' : 'rgba(96,165,250,0.3)'}
                    style={{ transition: 'y 0.08s linear' }}
                  />
                  {/* Shimmer inside fill */}
                  <motion.rect
                    x={-SIZE}
                    y={fillY}
                    width={SIZE * 0.6}
                    height={SIZE}
                    fill="rgba(255,255,255,0.06)"
                    animate={{ x: [-SIZE, SIZE * 1.5] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
                    style={{ transition: 'y 0.08s linear' }}
                  />
                </g>

                {/* Outer ring — always visible */}
                <circle
                  cx={SIZE / 2} cy={SIZE / 2} r={R}
                  fill="none"
                  stroke="rgba(96,165,250,0.12)"
                  strokeWidth={STROKE}
                />
                {/* Progress ring — drawn counter-clockwise from top */}
                <circle
                  cx={SIZE / 2} cy={SIZE / 2} r={R}
                  fill="none"
                  stroke={done ? '#60a5fa' : 'rgba(96,165,250,0.55)'}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUM}
                  strokeDashoffset={dashOffset}
                  transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                  style={{ transition: 'stroke-dashoffset 0.08s linear, stroke 0.4s ease' }}
                />
              </svg>

              {/* Profile photo — sits above fill */}
              <div style={{
                position: 'absolute', inset: STROKE + 2,
                borderRadius: '50%', overflow: 'hidden',
              }}>
                <img
                  src="/profile-2.png"
                  alt="Ivan"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center top',
                    display: 'block',
                    // Darken photo so the water fill reads clearly on top
                    filter: `brightness(${0.5 + (progress / 100) * 0.45}) contrast(1.05) saturate(0.85)`,
                    transition: 'filter 0.12s linear',
                  }}
                />
                {/* Dark overlay that lifts as fill rises */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(0deg, rgba(2,4,9,0) ${progress}%, rgba(2,4,9,0.45) 100%)`,
                  transition: 'background 0.08s linear',
                }}/>
              </div>

              {/* % counter — centered over photo */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}>
                <span style={{
                  fontFamily: "'Bebas Neue', serif",
                  fontSize: 36, letterSpacing: '0.04em', lineHeight: 1,
                  color: done ? '#fff' : 'rgba(220,235,255,0.92)',
                  textShadow: '0 2px 12px rgba(0,0,0,0.7)',
                  transition: 'color 0.3s',
                }}>
                  {progress}<span style={{ fontSize: 18, color: 'rgba(96,165,250,0.8)' }}>%</span>
                </span>
              </div>
            </div>

            {/* Name */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <h1 style={{
                fontFamily: "'Bebas Neue', serif",
                fontSize: 38, fontWeight: 400,
                letterSpacing: '0.08em', lineHeight: 1,
                margin: 0,
                background: 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 45%, #3b82f6 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmerName 4s linear infinite',
              }}>Ivan Brilata</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 1, background: 'rgba(96,165,250,0.25)' }}/>
                <span style={{ fontSize: 8.5, color: 'rgba(96,165,250,0.38)', letterSpacing: '0.2em' }}>
                  {done ? 'WELCOME' : 'LOADING PORTFOLIO'}
                </span>
                <div style={{ width: 16, height: 1, background: 'rgba(96,165,250,0.25)' }}/>
              </div>
            </div>
          </motion.div>

          {/* Bottom status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              position: 'absolute', bottom: 28,
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: done ? '#34d399' : '#3b82f6', boxShadow: `0 0 6px ${done ? '#34d399' : '#3b82f6'}`, transition: 'background 0.4s, box-shadow 0.4s' }}
            />
            <span style={{ fontSize: 8.5, color: 'rgba(148,163,184,0.28)', letterSpacing: '0.16em' }}>
              SYSTEMS ANALYST · FULL STACK DEV · PHILIPPINES
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}