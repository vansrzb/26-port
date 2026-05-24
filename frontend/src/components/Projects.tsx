import { motion } from 'framer-motion';
import { ExternalLink, GitFork, Star } from 'lucide-react';
import SectionWrapper, { SectionHeading, fadeUpVariants } from './SectionWrapper';
import { projects } from '../data/portfolio';

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <SectionHeading label="// 02. What I've Built" title="Projects" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.title}
            variants={fadeUpVariants}
            custom={i + 1}
            className={`card-glass rounded-2xl p-6 flex flex-col transition-all duration-400 group relative overflow-hidden ${
              proj.featured ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top left, rgba(59,130,246,0.06), transparent 60%)' }}
            />

            {proj.featured && (
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono mb-3">
                <Star size={12} fill="currentColor" />
                Featured Project
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display font-bold text-lg text-white group-hover:text-blue-300 transition-colors leading-tight">
                {proj.title}
              </h3>
              <div className="flex gap-3 ml-4 shrink-0">
                <motion.a
                  href={proj.github}
                  className="text-slate-500 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <GitFork size={16} />
                </motion.a>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{proj.description}</p>

            <div className="flex flex-wrap gap-2">
              {proj.tags.map((tag) => (
                <span key={tag} className="skill-badge text-xs px-2.5 py-1 rounded-md font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
