import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

// ─── DATA ─────────────────────────────────────────────────────
const skills = [
  { label: 'System Analyst', icon: '◈', color: '#60a5fa', desc: 'BPMN · UML · ERD' },
  { label: 'Full Stack Dev',  icon: '⬡', color: '#34d399', desc: 'End-to-End · Scalable' },
  { label: 'Frontend Dev',   icon: '◎', color: '#a78bfa', desc: 'React · TypeScript' },
  { label: 'Backend Dev',    icon: '◫', color: '#fb923c', desc: 'Node · MySQL' },
];
const techStack = ['React', 'TypeScript', 'Node.js', 'MySQL', 'PHP', 'Ruby'];

// ─── ANIMATED COUNTER ─────────────────────────────────────────
function Counter({ target, delay }: { target: number; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let v = 0;
      const step = target / 36;
      const id = setInterval(() => {
        v += step;
        if (v >= target) { setN(target); clearInterval(id); }
        else setN(Math.floor(v));
      }, 28);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return <>{n}</>;
}

// ─── SKILL CARD ───────────────────────────────────────────────
function SkillCard({ s, delay }: { s: typeof skills[0]; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '13px 16px',
        background: hov ? `${s.color}0d` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hov ? s.color + '40' : s.color + '1a'}`,
        borderLeft: `2px solid ${hov ? s.color : s.color + '80'}`,
        borderRadius: 10,
        cursor: 'default',
        transition: 'all 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{ color: s.color, fontSize: 15, lineHeight: 1 }}>{s.icon}</span>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: 11,
          color: hov ? '#fff' : 'rgba(220,235,255,0.75)', fontWeight: 500,
          transition: 'color 0.2s',
        }}>{s.label}</span>
      </div>
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: 9,
        color: hov ? `${s.color}aa` : 'rgba(148,163,184,0.38)', letterSpacing: '0.08em',
        transition: 'color 0.2s',
      }}>{s.desc}</div>
    </motion.div>
  );
}

// ─── PHOTO PANEL (desktop) ────────────────────────────────────
function PhotoPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{ position: 'relative', width: '41%', minHeight: '100vh', flexShrink: 0, zIndex: 2 }}
    >
      {/* Photo */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <img
          src="/profile-3.jpg"
          alt="Ivan Brilata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // Shift right to bring the person (right-of-center in photo) toward panel center
            objectPosition: '72% 10%',
            display: 'block',
            filter: 'brightness(0.93) contrast(1.05) saturate(0.88)',
          }}
        />

        {/* TOP — kills bright sky */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(180deg, rgba(2,4,9,0.82) 0%, rgba(2,4,9,0.25) 20%, transparent 40%)',
        }}/>
        {/* BOTTOM fade-out */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(0deg, rgba(2,4,9,1) 0%, rgba(2,4,9,0.75) 10%, rgba(2,4,9,0.12) 34%, transparent 52%)',
        }}/>
        {/* RIGHT edge — blends into content panel */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(90deg, transparent 35%, rgba(2,4,9,0.45) 65%, rgba(2,4,9,1) 100%)',
        }}/>
        {/* LEFT trim */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(270deg, transparent 88%, rgba(2,4,9,0.5) 100%)',
        }}/>
        {/* Subtle blue cinematic tint */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: 'linear-gradient(160deg, rgba(37,99,235,0.08) 0%, rgba(96,165,250,0.02) 50%, rgba(37,99,235,0.06) 100%)',
        }}/>
      </div>

      {/* Left blue accent bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', left: 0, top: '8%', bottom: '8%', width: 2.5,
          background: 'linear-gradient(180deg, transparent, #60a5fa 30%, #3b82f6 70%, transparent)',
          transformOrigin: 'top', zIndex: 10,
        }}
      />

      {/* Corner brackets — top-left & bottom-left only */}
      {[
        { top: 22, left: 14, borderTop: '1.5px solid rgba(96,165,250,0.55)', borderLeft: '1.5px solid rgba(96,165,250,0.55)' },
        { bottom: 22, left: 14, borderBottom: '1.5px solid rgba(96,165,250,0.55)', borderLeft: '1.5px solid rgba(96,165,250,0.55)' },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 + i * 0.1 }}
          style={{ position: 'absolute', ...s, width: 26, height: 26, zIndex: 10 }}
        />
      ))}

      {/* Scan line */}
      <motion.div
        animate={{ top: ['5%', '92%'] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', repeatDelay: 2.5 }}
        style={{
          position: 'absolute', left: 0, right: 0, height: '1px', zIndex: 9,
          background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.25), transparent)',
        }}
      />

      {/* Bottom status info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        style={{
          position: 'absolute', bottom: 36, left: 20, zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 7,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <motion.div
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}
          />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9.5, color: 'rgba(148,163,184,0.65)', letterSpacing: '0.12em' }}>OPEN TO WORK</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <MapPin size={10} color="rgba(96,165,250,0.45)" />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9.5, color: 'rgba(100,120,160,0.5)', letterSpacing: '0.1em' }}>Philippines</span>
        </div>
      </motion.div>

      {/* Vertical watermark */}
      
    </motion.div>
  );
}

// ─── MAIN HERO ─────────────────────────────────────────────────
export default function Hero() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section style={{
      minHeight: '100vh',
      background: '#020409',
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'DM Mono, monospace',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes gridDrift { from{background-position:0 0} to{background-position:32px 32px} }
        .hero-btn { transition: all 0.22s ease; }
        .hero-btn:hover { transform: translateY(-1px); opacity: 0.9; }
      `}</style>

      {/* Dot grid background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.06) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        animation: 'gridDrift 24s linear infinite',
      }}/>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '15%',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none',
      }}/>

      {/* ── DESKTOP PHOTO PANEL ── */}
      {!mobile && <PhotoPanel />}

      {/* ── CONTENT PANEL ── */}
      <div style={{
        flex: 1, position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: mobile ? '90px 24px 60px' : '64px 52px 60px 56px',
      }}>

        {/* Label line */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}
        >
          <div style={{ width: 30, height: 1, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}/>
          <span style={{ fontSize: 10, color: 'rgba(96,165,250,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Portfolio · 2026</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Bebas Neue', Georgia, serif",
            fontWeight: 400, letterSpacing: '0.025em',
            fontSize: mobile ? 'clamp(58px, 18vw, 80px)' : 'clamp(62px, 6vw, 96px)',
            lineHeight: 0.9,
            marginBottom: 16,
          }}
        >
          <span style={{ color: '#e8f0ff', display: 'block' }}>Ivan</span>
          <span style={{
            background: 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 40%, #3b82f6 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'shimmer 5s linear infinite',
            display: 'block',
          }}>Brilata</span>
        </motion.h1>

        {/* Subtitle row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.88 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: mobile ? 18 : 26, flexWrap: 'wrap' }}
        >
          {['SYSTEM ANALYST', 'FULL STACK DEVELOPER'].map((t, i) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: mobile ? 9 : 10.5, color: 'rgba(148,163,184,0.45)', letterSpacing: '0.14em' }}>{t}</span>
              {i === 0 && <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(96,165,250,0.35)' }}/>}
            </span>
          ))}
        </motion.div>

        {/* Mobile photo — person is more centered */}
        {mobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative', width: '100%', height: 320,
              borderRadius: 14, overflow: 'hidden', marginBottom: 22,
              border: '1px solid rgba(96,165,250,0.1)',
            }}
          >
            <img
              src="/profile-3.jpg"
              alt="Ivan Brilata"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                // Shift right to center the person in the frame on mobile
                objectPosition: '68% 12%',
                display: 'block',
                filter: 'brightness(0.92) contrast(1.05) saturate(0.88)',
              }}
            />
            {/* Gradients */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,4,9,0.6) 0%, transparent 26%, transparent 52%, rgba(2,4,9,0.9) 86%, rgba(2,4,9,1) 100%)' }}/>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(2,4,9,0.35) 0%, transparent 16%, transparent 84%, rgba(2,4,9,0.35) 100%)' }}/>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(37,99,235,0.06)' }}/>
            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: 12, left: 12, width: 18, height: 18, borderTop: '1.5px solid rgba(96,165,250,0.5)', borderLeft: '1.5px solid rgba(96,165,250,0.5)' }}/>
            <div style={{ position: 'absolute', top: 12, right: 12, width: 18, height: 18, borderTop: '1.5px solid rgba(96,165,250,0.5)', borderRight: '1.5px solid rgba(96,165,250,0.5)' }}/>
            <div style={{ position: 'absolute', bottom: 12, left: 12, width: 18, height: 18, borderBottom: '1.5px solid rgba(96,165,250,0.5)', borderLeft: '1.5px solid rgba(96,165,250,0.5)' }}/>
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 18, height: 18, borderBottom: '1.5px solid rgba(96,165,250,0.5)', borderRight: '1.5px solid rgba(96,165,250,0.5)' }}/>
            {/* Status */}
            <div style={{ position: 'absolute', bottom: 14, left: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
              <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2.2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }}/>
              <span style={{ fontSize: 9, color: 'rgba(200,220,255,0.72)', letterSpacing: '0.12em', fontFamily: 'DM Mono, monospace' }}>OPEN TO WORK · PHILIPPINES</span>
            </div>
          </motion.div>
        )}

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: mobile ? 0.9 : 1.0 }}
          style={{
            fontSize: 12, color: 'rgba(148,163,184,0.46)',
            lineHeight: 1.9, maxWidth: 400,
            marginBottom: mobile ? 18 : 26,
          }}
        >
          From blueprint to byte — bridging systems architecture and modern engineering to build things that are clean, scalable, and built to last.
        </motion.p>

        {/* Skill cards 2×2 */}
        <div style={{
          display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : '1fr 1fr',
          gap: 8, maxWidth: 440,
          marginBottom: mobile ? 18 : 26,
        }}>
          {skills.map((s, i) => (
            <SkillCard key={s.label} s={s} delay={(mobile ? 1.0 : 1.1) + i * 0.07} />
          ))}
        </div>

        {/* Stats + Tech */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: mobile ? 1.3 : 1.45 }}
          style={{ display: 'flex', gap: mobile ? 20 : 28, alignItems: 'center', marginBottom: mobile ? 18 : 26, flexWrap: 'wrap' }}
        >
          {[{ t: 9, label: 'Systems Designed' }, { t: 6, label: 'Projects Shipped' }].map((s, i) => (
            <div key={s.label}>
              <div style={{
                fontFamily: "'Bebas Neue', Georgia, sans-serif",
                fontSize: mobile ? 34 : 40, color: '#e8f0ff', lineHeight: 1, letterSpacing: '0.02em',
              }}>
                <Counter target={s.t} delay={(mobile ? 1400 : 1600) + i * 120} />
                <span style={{ color: '#60a5fa', fontSize: mobile ? 26 : 32 }}>+</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(96,165,250,0.42)', letterSpacing: '0.1em', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}

          <div style={{ width: 1, height: 44, background: 'rgba(96,165,250,0.1)', alignSelf: 'center' }}/>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {techStack.map(t => (
              <span key={t} style={{
                fontSize: 9, padding: '3px 9px',
                background: 'rgba(96,165,250,0.04)',
                border: '0.5px solid rgba(96,165,250,0.13)',
                borderRadius: 4, color: 'rgba(148,163,184,0.48)',
                letterSpacing: '0.06em',
                fontFamily: 'DM Mono, monospace',
              }}>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mobile ? 1.5 : 1.65 }}
          style={{ display: 'flex', gap: 12, flexWrap: mobile ? 'wrap' : 'nowrap' }}
        >
          <button
            className="hero-btn"
            onClick={() => scrollTo('Projects')}
            style={{
              padding: mobile ? '12px 24px' : '11px 28px',
              background: 'linear-gradient(135deg, #1e40af, #2563eb)',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'DM Mono, monospace', fontSize: 11,
              color: '#fff', letterSpacing: '0.08em',
              boxShadow: '0 0 24px rgba(37,99,235,0.35), 0 4px 14px rgba(0,0,0,0.35)',
              flex: mobile ? '1' : 'unset',
            }}
          >View Work</button>
          <button
            className="hero-btn"
            onClick={() => scrollTo('Contact')}
            style={{
              padding: mobile ? '12px 24px' : '11px 28px',
              background: 'transparent',
              border: '1px solid rgba(96,165,250,0.2)', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'DM Mono, monospace', fontSize: 11,
              color: 'rgba(148,163,184,0.62)', letterSpacing: '0.08em',
              flex: mobile ? '1' : 'unset',
            }}
          >Contact</button>
        </motion.div>
      </div>
    </section>
  );
}