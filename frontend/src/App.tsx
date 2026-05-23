import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Education from './components/Education';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
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
  );
}
