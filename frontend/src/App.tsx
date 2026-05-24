import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  // sessionStorage persists across refreshes but clears when the tab is closed.
  // First open → show loader → mark seen. Refresh → skip. New tab/close+reopen → show again.
  const [loaded, setLoaded] = useState(() => {
    const seen = sessionStorage.getItem('portfolio_loaded');
    if (seen) return true;
    sessionStorage.setItem('portfolio_loaded', '1');
    return false;
  });

  return (
    <>
      <AnimatePresence>
        {!loaded && (
          <LoadingScreen onComplete={() => setLoaded(true)} duration={2800} />
        )}
      </AnimatePresence>

      {loaded && (
        <div className="mesh-bg min-h-screen">
          <Navbar />
          <main>
            <Hero />
            <Experience />
            <Projects />
            <Education />
            <Skills />
            <Contact />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}