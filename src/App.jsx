/*!
  App — composition and the scroll-spy that drives the navbar.

  Section order is the reading order the page is built around: identity ->
  proof -> background -> inventory -> method -> contact. This order also
  matches SECTION_IDS in Navbar.jsx, which the scroll-spy relies on.
*/

import Navbar, { NAV_SECTION_IDS } from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import Footer from './components/Footer';

import Hero from './sections/Hero';
import About from './sections/About';
import Work from './sections/Work';
import Journey from './sections/Journey';
import Skills from './sections/Skills';
import Process from './sections/Process';
import Contact from './sections/Contact';

import { useScrollSpy } from './hooks/useScrollSpy';

function App() {
  // Stable module-level list, so the observer is not rebuilt every render.
  const activeId = useScrollSpy(NAV_SECTION_IDS);

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <Navbar activeId={activeId} />

        <main id="main">
          <Hero />
          <About />
          <Work />
          <Journey />
          <Skills />
          <Process />
          <Contact />
        </main>

        <Footer />
      </SmoothScroll>
    </>
  );
}

export default App;
