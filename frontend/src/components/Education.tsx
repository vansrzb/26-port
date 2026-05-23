import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import SectionWrapper, { SectionHeading, fadeUpVariants } from './SectionWrapper';
import { education } from '../data/portfolio';

export default function Education() {
  return (
    <SectionWrapper id="education">
      <SectionHeading label="// 03. Where I Learned" title="Education" />

      <div className="space-y-6">
        {education.map((edu, i) => (
          <motion.div
            key={i}
            variants={fadeUpVariants}
            custom={i + 1}
            className="card-glass rounded-2xl p-8 group transition-all duration-400"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Icon */}
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <GraduationCap size={24} className="text-blue-400" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-blue-300 transition-colors">
                      {edu.degree}
                    </h3>
                    <p className="font-mono text-sm text-blue-400 mt-1">{edu.school}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full w-fit">
                    {edu.period}
                  </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-5">{edu.description}</p>

                {/* Achievements */}
                <div className="flex flex-wrap gap-3">
                  {edu.achievements.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                      <Award size={11} />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
