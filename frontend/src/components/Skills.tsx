import { motion } from 'framer-motion';
import { useRef } from 'react';
import SectionWrapper, { SectionHeading, fadeUpVariants } from './SectionWrapper';
import { skills } from '../data/portfolio';

const CATEGORY_META: Record<string, { icon: string; color: string; dim: string }> = {
  'Frontend':        { icon: '⬡', color: '#60a5fa', dim: 'rgba(96,165,250,0.08)'  },
  'Backend':         { icon: '⬡', color: '#34d399', dim: 'rgba(52,211,153,0.08)'  },
  'Database':        { icon: '⬡', color: '#a78bfa', dim: 'rgba(167,139,250,0.08)' },
  'DevOps & Tools':  { icon: '⬡', color: '#fb923c', dim: 'rgba(251,146,60,0.08)'  },
  'Languages':       { icon: '⬡', color: '#f472b6', dim: 'rgba(244,114,182,0.08)' },
  'Testing':         { icon: '⬡', color: '#facc15', dim: 'rgba(250,204,21,0.08)'  },
};

const FALLBACK = { icon: '⬡', color: '#60a5fa', dim: 'rgba(96,165,250,0.08)' };

function SkillMarquee({
  items,
  color,
  reverse = false,
  speed = 28,
}: {
  items: string[];
  color: string;
  reverse?: boolean;
  speed?: number;
}) {
  const doubled = [...items, ...items, ...items];

  return (
    <div
      style={{
        overflow: 'hidden',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)',
        maskImage:
          'linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)',
        paddingBlock: 3,
      }}
    >
      <style>{`
        @keyframes marquee-fwd { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        @keyframes marquee-rev { from { transform: translateX(-33.333%) } to { transform: translateX(0) } }
        .mq-track-fwd { animation: marquee-fwd ${speed}s linear infinite; }
        .mq-track-rev { animation: marquee-rev ${speed}s linear infinite; }
        .mq-track-fwd:hover, .mq-track-rev:hover { animation-play-state: paused; }
      `}</style>
      <div
        className={reverse ? 'mq-track-rev' : 'mq-track-fwd'}
        style={{ display: 'flex', width: 'max-content', gap: 8 }}
      >
        {doubled.map((skill, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 13px',
              background: 'rgba(255,255,255,0.025)',
              border: `0.5px solid ${color}22`,
              borderRadius: 7,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.05em',
              color: 'rgba(148,163,184,0.6)',
              whiteSpace: 'nowrap',
              cursor: 'default',
              transition: 'color 0.2s, border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.color = color;
              el.style.borderColor = `${color}55`;
              el.style.background = `${color}10`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.color = 'rgba(148,163,184,0.6)';
              el.style.borderColor = `${color}22`;
              el.style.background = 'rgba(255,255,255,0.025)';
            }}
          >
            <span style={{ color: `${color}66`, fontSize: 8 }}>◆</span>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const entries = Object.entries(skills);

  return (
    <SectionWrapper id="skills">
      <SectionHeading label="// 04. What I Use" title="Skills" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([category, items], i) => {
          const meta = CATEGORY_META[category] ?? FALLBACK;
          const skillList = items as string[];

          return (
            <motion.div
              key={category}
              variants={fadeUpVariants}
              custom={i + 1}
              style={{
                background: 'rgba(10,15,28,0.82)',
                border: '0.5px solid rgba(96,165,250,0.10)',
                borderRadius: 18,
                overflow: 'hidden',
                position: 'relative',
                transition: 'border-color 0.3s',
              }}
              whileHover={{ borderColor: `${meta.color}44` }}
            >
              {/* Dot-grid background */}
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18, pointerEvents: 'none' }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id={`dot-${i}`} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                    <circle cx="1.5" cy="1.5" r="0.9" fill={meta.color} />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#dot-${i})`} />
              </svg>

              {/* Glow corner */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 90, height: 90,
                background: `radial-gradient(circle at top right, ${meta.color}18, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              {/* Header */}
              <div style={{
                position: 'relative',
                padding: '14px 16px 12px',
                borderBottom: `0.5px solid ${meta.color}18`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                {/* Accent bar */}
                <div style={{
                  width: 3, height: 18, borderRadius: 2,
                  background: `linear-gradient(to bottom, ${meta.color}, ${meta.color}44)`,
                  flexShrink: 0,
                }} />

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    color: `${meta.color}88`,
                    marginBottom: 1,
                  }}>
                    {String(i + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
                  </div>
                  <div style={{
                    fontFamily: "'Bebas Neue', Georgia, sans-serif",
                    fontSize: 15,
                    letterSpacing: '0.08em',
                    color: '#e2e8f0',
                  }}>
                    {category}
                  </div>
                </div>

                {/* Count badge */}
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  color: meta.color,
                  background: `${meta.color}12`,
                  border: `0.5px solid ${meta.color}30`,
                  borderRadius: 6,
                  padding: '3px 8px',
                  letterSpacing: '0.04em',
                }}>
                  {skillList.length}
                </div>
              </div>

              {/* Marquee rows */}
              <div style={{ position: 'relative', padding: '12px 0 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                <SkillMarquee items={skillList} color={meta.color} speed={22 + i * 3} />
                {skillList.length > 4 && (
                  <SkillMarquee items={skillList} color={meta.color} reverse speed={26 + i * 2} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom status line */}
      <motion.p
        variants={fadeUpVariants}
        className="text-center text-slate-600 text-xs font-mono mt-10"
      >
        * Constantly learning · Always building
      </motion.p>
    </SectionWrapper>
  );
}