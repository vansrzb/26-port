import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function LoadingScreen({ onComplete, duration = 2800 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Progress ticker
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / (duration * 0.88), 1);
      const eased = 1 - Math.pow(1 - raw, 2.2);
      setProgress(Math.floor(eased * 100));
      if (raw < 1) raf = requestAnimationFrame(tick);
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

  // Canvas plasma effect — strict black & blue palette
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 160;
    canvas.width = SIZE;
    canvas.height = SIZE;

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R = SIZE / 2 - 4;

    // All arcs: blue only
    const arcCount = 6;
    const arcs = Array.from({ length: arcCount }, (_, i) => ({
      angle: (i / arcCount) * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.006,
      radius: 28 + Math.random() * 18,
      length: 0.3 + Math.random() * 0.5,
      width: 1 + Math.random() * 1.5,
      // varied blue shades: bright blue, mid blue, deep blue
      color: ['59,130,246', '96,165,250', '29,78,216'][i % 3],
    }));

    // Sparks
    const sparks: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];
    let frame = 0;

    const spawnSpark = (prog: number) => {
      if (Math.random() > 0.18 + prog * 0.004) return;
      const angle = Math.random() * Math.PI * 2;
      const r = (R * 0.3 + Math.random() * R * 0.5) * (prog / 100);
      sparks.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        life: 0,
        maxLife: 18 + Math.random() * 22,
      });
    };

    const draw = () => {
      const prog = Math.max(0, Math.min(100, progress));
      frame++;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // Clip to circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // Pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Core plasma glow — grows with progress
      const coreRadius = 6 + (prog / 100) * 38;
      const coreAlpha = 0.12 + (prog / 100) * 0.28;

      // Outer halo — blue only
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.8);
      halo.addColorStop(0, `rgba(59,130,246,${coreAlpha})`);
      halo.addColorStop(0.5, `rgba(29,78,216,${coreAlpha * 0.6})`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Inner plasma core — white-blue center fading to deep blue
      const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      inner.addColorStop(0, `rgba(219,234,254,${0.6 + (prog / 100) * 0.35})`);
      inner.addColorStop(0.35, `rgba(96,165,250,${0.45 + (prog / 100) * 0.3})`);
      inner.addColorStop(0.75, `rgba(29,78,216,${0.2 + (prog / 100) * 0.2})`);
      inner.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = inner;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting energy arcs — all blue shades
      arcs.forEach((arc) => {
        arc.angle += arc.speed * (1 + (prog / 100) * 1.4);
        const orbitR = arc.radius * (0.3 + (prog / 100) * 0.7);
        const endAngle = arc.angle + arc.length * Math.PI * 2;
        const alpha = 0.2 + (prog / 100) * 0.7;

        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, arc.angle, endAngle);
        ctx.strokeStyle = `rgba(${arc.color},${alpha})`;
        ctx.lineWidth = arc.width;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 7;
        ctx.shadowColor = `rgba(${arc.color},0.9)`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Electric tendrils — blue only
      if (prog > 15) {
        const tendrilCount = Math.floor(3 + (prog / 100) * 7);
        for (let t = 0; t < tendrilCount; t++) {
          const baseAngle = (t / tendrilCount) * Math.PI * 2 + frame * 0.015;
          const len = coreRadius + (R - coreRadius) * (prog / 100) * (0.4 + Math.sin(frame * 0.05 + t) * 0.3);
          const segments = 5;
          const alpha = 0.15 + (prog / 100) * 0.35;

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          for (let s = 0; s < segments; s++) {
            const frac = (s + 1) / segments;
            const jitter = (Math.random() - 0.5) * 10 * (1 - frac);
            const nx = cx + Math.cos(baseAngle + jitter * 0.1) * len * frac;
            const ny = cy + Math.sin(baseAngle + jitter * 0.1) * len * frac;
            ctx.lineTo(nx + jitter, ny + jitter);
          }
          ctx.strokeStyle = `rgba(147,197,253,${alpha * (Math.random() * 0.4 + 0.6)})`;
          ctx.lineWidth = 0.6 + Math.random() * 0.6;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(96,165,250,0.7)';
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Inner ring fill — bright blue arc growing clockwise
      if (prog > 5) {
        const ringR = R - 10;
        const ringAlpha = 0.2 + (prog / 100) * 0.5;
        const endA = -Math.PI / 2 + (prog / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, -Math.PI / 2, endA);
        ctx.strokeStyle = `rgba(59,130,246,${ringAlpha})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(96,165,250,0.8)';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Sparks — light blue-white
      spawnSpark(prog);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        if (s.life > s.maxLife) { sparks.splice(i, 1); continue; }
        const t2 = 1 - s.life / s.maxLife;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.2 * t2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186,219,255,${t2 * 0.9})`;
        ctx.fill();
      }

      ctx.restore();

      // Outer progress ring track — very dark blue
      ctx.beginPath();
      ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI * 2 - Math.PI / 2);
      ctx.strokeStyle = 'rgba(29,78,216,0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Outer progress ring fill — bright blue
      ctx.beginPath();
      ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + (prog / 100) * Math.PI * 2);
      ctx.strokeStyle = prog === 100 ? '#93c5fd' : 'rgba(96,165,250,0.75)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowBlur = prog === 100 ? 14 : 0;
      ctx.shadowColor = '#3b82f6';
      ctx.stroke();
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [progress]);

  const SIZE = 160;
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
            background: '#000000',
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
            @keyframes scanline {
              0%   { top: -2px; }
              100% { top: 100%; }
            }
            @keyframes plasmaRing {
              0%   { transform: rotate(0deg); opacity: 0.25; }
              50%  { opacity: 0.6; }
              100% { transform: rotate(360deg); opacity: 0.25; }
            }
            @keyframes plasmaRing2 {
              0%   { transform: rotate(0deg); opacity: 0.15; }
              50%  { opacity: 0.4; }
              100% { transform: rotate(-360deg); opacity: 0.15; }
            }
          `}</style>

          {/* Dot grid — deep blue dots on black */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            animation: 'gridDrift 24s linear infinite',
          }}/>

          {/* Scan line — blue */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.18), transparent)',
            animation: 'scanline 5s linear infinite',
          }}/>

          {/* Ambient glow — blue only */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(29,78,216,0.1) 0%, rgba(59,130,246,0.04) 50%, transparent 70%)',
            pointerEvents: 'none',
          }}/>

          {/* Corner brackets — blue */}
          {[
            { top: 24, left: 24, borderTop: '1.5px solid rgba(59,130,246,0.4)', borderLeft: '1.5px solid rgba(59,130,246,0.4)' },
            { top: 24, right: 24, borderTop: '1.5px solid rgba(59,130,246,0.4)', borderRight: '1.5px solid rgba(59,130,246,0.4)' },
            { bottom: 24, left: 24, borderBottom: '1.5px solid rgba(59,130,246,0.4)', borderLeft: '1.5px solid rgba(59,130,246,0.4)' },
            { bottom: 24, right: 24, borderBottom: '1.5px solid rgba(59,130,246,0.4)', borderRight: '1.5px solid rgba(59,130,246,0.4)' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              style={{ position: 'absolute', ...s, width: 26, height: 26 }}
            />
          ))}

          {/* MAIN LOGO CHARGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
          >
            {/* Plasma circle unit */}
            <div style={{ position: 'relative', width: SIZE, height: SIZE }}>

              {/* Rotating outer rings — blue only */}
              <div style={{
                position: 'absolute', inset: -14, borderRadius: '50%',
                border: '1px dashed rgba(59,130,246,0.22)',
                animation: 'plasmaRing 8s linear infinite',
              }}/>
              <div style={{
                position: 'absolute', inset: -22, borderRadius: '50%',
                border: '1px dashed rgba(29,78,216,0.14)',
                animation: 'plasmaRing2 12s linear infinite',
              }}/>

              {/* Done ripple — blue */}
              {done && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', inset: -8, borderRadius: '50%',
                      border: '1.5px solid rgba(96,165,250,0.55)',
                    }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                    style={{
                      position: 'absolute', inset: -8, borderRadius: '50%',
                      border: '1px solid rgba(59,130,246,0.3)',
                    }}
                  />
                </>
              )}

              {/* Canvas: plasma effect */}
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute', inset: 0,
                  width: SIZE, height: SIZE,
                  borderRadius: '50%',
                }}
              />

              {/* % counter */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}>
                <span style={{
                  fontFamily: "'Bebas Neue', serif",
                  fontSize: 36, letterSpacing: '0.04em', lineHeight: 1,
                  color: progress > 40 ? '#dbeafe' : 'rgba(191,219,254,0.9)',
                  textShadow: '0 0 22px rgba(59,130,246,0.95), 0 2px 14px rgba(0,0,0,1)',
                  transition: 'color 0.4s, text-shadow 0.4s',
                }}>
                  {progress}<span style={{ fontSize: 18, color: 'rgba(96,165,250,0.8)' }}>%</span>
                </span>
              </div>
            </div>

            {/* Name — blue shimmer only */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <h1 style={{
                fontFamily: "'Bebas Neue', serif",
                fontSize: 38, fontWeight: 400,
                letterSpacing: '0.08em', lineHeight: 1,
                margin: 0,
                background: 'linear-gradient(90deg, #1d4ed8 0%, #60a5fa 40%, #93c5fd 65%, #3b82f6 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmerName 4s linear infinite',
              }}>Ivan Brilata</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 1, background: 'rgba(59,130,246,0.3)' }}/>
                <span style={{ fontSize: 8.5, color: 'rgba(59,130,246,0.45)', letterSpacing: '0.2em' }}>
                  {done ? 'WELCOME' : 'CHARGING SYSTEMS'}
                </span>
                <div style={{ width: 16, height: 1, background: 'rgba(59,130,246,0.3)' }}/>
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
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 5, height: 5, borderRadius: '50%',
                background: done ? '#60a5fa' : '#3b82f6',
                boxShadow: `0 0 8px ${done ? '#60a5fa' : '#3b82f6'}`,
                transition: 'background 0.4s, box-shadow 0.4s',
              }}
            />
            <span style={{ fontSize: 8.5, color: 'rgba(59,130,246,0.3)', letterSpacing: '0.16em' }}>
              SYSTEMS ANALYST · FULL STACK DEV · PHILIPPINES
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}