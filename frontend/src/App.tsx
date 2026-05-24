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
import PortfolioChatbot from './components/PortfolioChatbot';

export default function App() {
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

          {/* AI Chatbot — always visible when portfolio is loaded */}
          <PortfolioChatbot />
        </div>
      )}
    </>
  );
}