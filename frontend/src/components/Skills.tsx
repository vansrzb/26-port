import { motion } from 'framer-motion';
import SectionWrapper, { SectionHeading, fadeUpVariants } from './SectionWrapper';
import { skills } from '../data/portfolio';

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <SectionHeading label="// 04. What I Use" title="Skills" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skills).map(([category, items], i) => (
          <motion.div
            key={category}
            variants={fadeUpVariants}
            custom={i + 1}
            className="card-glass rounded-2xl p-6 group transition-all duration-400"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-400 to-cyan-500" />
              <h3 className="font-display font-semibold text-base text-white">{category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((skill, j) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: j * 0.05 + i * 0.08 }}
                  viewport={{ once: true }}
                  className="skill-badge text-xs px-3 py-1.5 rounded-lg font-mono cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Proficiency note */}
      <motion.p
        variants={fadeUpVariants}
        className="text-center text-slate-600 text-xs font-mono mt-10"
      >
        * Constantly learning · Always building
      </motion.p>
    </SectionWrapper>
  );
}
