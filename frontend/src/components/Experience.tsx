import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import SectionWrapper, { SectionHeading, fadeUpVariants } from './SectionWrapper';
import { experience } from '../data/portfolio';

export default function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionHeading label="// 01. Where I've Been" title="Experience" />

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden md:block" />

        <div className="space-y-8">
          {experience.map((exp, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariants}
              custom={i + 1}
              className="relative md:pl-16"
            >
              {/* Timeline dot */}
              <div className="absolute left-[18px] top-6 timeline-dot hidden md:block" />

              <div className="card-glass rounded-2xl p-7 transition-all duration-400 group">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase size={14} className="text-blue-400" />
                      <h3 className="font-display font-bold text-xl text-white group-hover:text-blue-300 transition-colors">
                        {exp.role}
                      </h3>
                    </div>
                    <p className="font-mono text-sm text-blue-400 font-medium">{exp.company}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                      <Calendar size={11} />
                      {exp.period}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                      <MapPin size={11} />
                      {exp.location}
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-5">{exp.description}</p>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="skill-badge text-xs px-3 py-1 rounded-full font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
