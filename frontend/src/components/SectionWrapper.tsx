import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.1,
      ease: 'easeOut' as const,
    },
  }),
};

export default function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
      }}
      className={`relative py-24 px-6 max-w-6xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <motion.div variants={fadeUpVariants} className="mb-14">
      <p className="font-mono text-xs text-blue-400 tracking-widest uppercase mb-3">{label}</p>
      <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">{title}</h2>
      <div className="section-line" />
    </motion.div>
  );
}
