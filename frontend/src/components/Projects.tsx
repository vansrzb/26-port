import { motion } from 'framer-motion';
import { GitFork, Star, ExternalLink, Terminal } from 'lucide-react';
import SectionWrapper, { SectionHeading, fadeUpVariants } from './SectionWrapper';
import { projects } from '../data/portfolio';

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <SectionHeading label="// 02. What I've Built" title="Projects" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.title}
            variants={fadeUpVariants}
            custom={i + 1}
            className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 ${
              proj.featured ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
            style={{
              background: 'rgba(10,15,28,0.85)',
              border: '0.5px solid rgba(96,165,250,0.12)',
              boxShadow: '0 0 0 0 rgba(59,130,246,0)',
              transition: 'border-color 0.3s, box-shadow 0.3s',
            }}
            whileHover={{
              borderColor: 'rgba(96,165,250,0.35)',
              boxShadow: '0 0 32px -8px rgba(59,130,246,0.18)',
            }}
          >
            {/* ── Browser / terminal chrome ── */}
            <div
              style={{
                background: 'rgba(15,20,35,0.95)',
                borderBottom: '0.5px solid rgba(96,165,250,0.10)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {/* Traffic lights */}
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57','#febc2e','#28c840'].map((c) => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.8 }} />
                ))}
              </div>
              {/* URL bar */}
              <div
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(96,165,250,0.10)',
                  borderRadius: 6,
                  padding: '3px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ color: 'rgba(96,165,250,0.4)', fontSize: 9, fontFamily: "'DM Mono', monospace" }}>
                  https://
                </span>
                <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em' }}>
                  {proj.url ?? `${proj.title.toLowerCase().replace(/\s+/g, '-')}.dev`}
                </span>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {proj.github && (
                  <motion.a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'rgba(100,116,139,0.6)', display: 'flex' }}
                    whileHover={{ color: '#fff', scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <GitFork size={14} />
                  </motion.a>
                )}
                {proj.live && (
                  <motion.a
                    href={proj.live}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'rgba(100,116,139,0.6)', display: 'flex' }}
                    whileHover={{ color: '#60a5fa', scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ExternalLink size={14} />
                  </motion.a>
                )}
              </div>
            </div>

            {/* ── Preview image / placeholder ── */}
            <div
              className="relative overflow-hidden"
              style={{
                height: proj.featured ? 220 : 160,
                background: 'rgba(8,12,24,0.9)',
              }}
            >
              {proj.image ? (
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  style={{ opacity: 0.82 }}
                />
              ) : (
                /* Generative placeholder — grid + scanlines */
                <PlaceholderPreview title={proj.title} index={i} />
              )}

              {/* Scanline overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
                  mixBlendMode: 'multiply',
                }}
              />

              {/* Bottom fade into card body */}
              <div
                className="absolute bottom-0 inset-x-0 h-12 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,15,28,0.95))' }}
              />

              {proj.featured && (
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5"
                  style={{
                    background: 'rgba(251,191,36,0.12)',
                    border: '0.5px solid rgba(251,191,36,0.3)',
                    borderRadius: 6,
                    padding: '3px 9px',
                    fontSize: 10,
                    color: '#fbbf24',
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: '0.06em',
                  }}
                >
                  <Star size={10} fill="currentColor" />
                  featured
                </div>
              )}
            </div>

            {/* ── Card body ── */}
            <div className="flex flex-col flex-1 p-5">
              {/* Terminal title line */}
              <div
                className="flex items-center gap-2 mb-2"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                <Terminal size={12} style={{ color: 'rgba(96,165,250,0.5)' }} />
                <span style={{ fontSize: 10, color: 'rgba(96,165,250,0.4)', letterSpacing: '0.06em' }}>
                  ~/projects
                </span>
              </div>

              <h3
                className="font-display font-bold text-base mb-2 leading-snug transition-colors duration-300"
                style={{ color: '#e2e8f0' }}
              >
                <span className="group-hover:text-blue-300 transition-colors duration-300">
                  {proj.title}
                </span>
              </h3>

              <p
                className="text-sm leading-relaxed flex-1 mb-4"
                style={{ color: 'rgba(148,163,184,0.7)', fontSize: 12.5 }}
              >
                {proj.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 10,
                      fontFamily: "'DM Mono', monospace",
                      letterSpacing: '0.06em',
                      color: 'rgba(96,165,250,0.55)',
                      background: 'rgba(96,165,250,0.06)',
                      border: '0.5px solid rgba(96,165,250,0.14)',
                      borderRadius: 5,
                      padding: '3px 8px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Corner accent */}
            <div
              className="absolute bottom-0 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                width: 60,
                height: 60,
                background: 'radial-gradient(circle at bottom right, rgba(96,165,250,0.12), transparent 70%)',
              }}
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

/* ── Fallback preview when no image is supplied ── */
function PlaceholderPreview({ title, index }: { title: string; index: number }) {
  const hues = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
  const accent = hues[index % hues.length];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'rgba(8,12,24,0.95)' }}
    >
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`dots-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill={accent} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${index})`} />
      </svg>

      {/* Glow orb */}
      <div
        className="absolute"
        style={{
          width: 120, height: 120,
          borderRadius: '50%',
          background: accent,
          opacity: 0.06,
          filter: 'blur(40px)',
          top: '20%', left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Code-window mock lines */}
      <div
        className="relative z-10 text-left px-5"
        style={{ fontFamily: "'DM Mono', monospace", width: '100%' }}
      >
        {[
          { indent: 0, text: `const ${title.replace(/\s+/g,'_').toLowerCase()} = {`, color: accent },
          { indent: 1, text: 'status: "deployed",', color: 'rgba(148,163,184,0.45)' },
          { indent: 1, text: 'stack: [...],', color: 'rgba(148,163,184,0.35)' },
          { indent: 1, text: 'live: true,', color: 'rgba(148,163,184,0.25)' },
          { indent: 0, text: '}', color: `${accent}88` },
        ].map((line, j) => (
          <div
            key={j}
            style={{
              fontSize: 10,
              color: line.color,
              paddingLeft: line.indent * 14,
              lineHeight: 1.9,
              letterSpacing: '0.04em',
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}