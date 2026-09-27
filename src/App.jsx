import './index.css';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import AIWorkflow from './sections/AIWorkflow';
import Journey from './sections/Journey';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import { useLenis, useLenisScrollTrigger, useReducedMotionLenis } from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import PageLoader from './components/PageLoader';

function App() {
  // Initialize Lenis once
  useLenis();
  // Synchronize Lenis with ScrollTrigger
  useLenisScrollTrigger();
  // Handle reduced motion for Lenis
  useReducedMotionLenis();

  return (
    <>
      <PageLoader duration={1000}>
        <>
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <AIWorkflow />
          <Journey />
          <Contact />
          <Footer />
        </>
      </PageLoader>
      <CustomCursor />
    </>
  );
}

export default App;