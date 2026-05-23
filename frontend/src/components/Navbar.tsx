import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Menu, X } from 'lucide-react';
import { navLinks } from '../data/portfolio';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (section: string) => {
    const el = document.getElementById(section.toLowerCase());
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActive(section);
      setMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-glass shadow-lg shadow-blue-900/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT — Logo + Nickname */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.02 }}
        >
          {/* Logo mark */}
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
              <rect width="36" height="36" rx="8" fill="url(#grad)" />
              <text x="18" y="25" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Syne, sans-serif">V</text>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 rounded-lg animate-pulse-glow opacity-50" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            vans<span className="text-blue-400">rzb</span>
          </span>
        </motion.div>

        {/* CENTER — Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.button
              key={link}
              onClick={() => scrollTo(link)}
              className={`relative px-4 py-2 text-sm font-mono font-medium tracking-wide rounded-lg transition-all duration-300 ${
                active === link
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {active === link && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg bg-blue-500/10 border border-blue-500/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 font-mono text-xs">
                <span className="text-cyan-500 mr-1">./</span>{link}
              </span>
            </motion.button>
          ))}
        </div>

        {/* RIGHT — CTA */}
        <div className="hidden md:flex items-center gap-3">
          <motion.a
            href="mailto:vansrzb@email.com"
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Mail size={14} />
            <span className="font-mono text-xs">Email Me</span>
          </motion.a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden nav-glass border-t border-blue-900/20"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="text-left py-2 px-3 text-sm font-mono text-slate-300 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all"
                >
                  <span className="text-cyan-500">./</span>{link}
                </button>
              ))}
              <a
                href="mailto:vansrzb@email.com"
                className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mt-2 w-fit"
              >
                <Mail size={14} />
                <span>Email Me</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
