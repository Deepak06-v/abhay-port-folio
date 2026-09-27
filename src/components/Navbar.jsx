/*!
  Navbar Component - Phase 3
  Premium desktop + mobile navigation
*/

import { useState, useEffect } from 'react';
import './navbar.css';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <nav class="navbar" aria-label="Main navigation" role="navigation">
      <div class="navbar-container">
        <a href="#home" class="brand" aria-label="Abhay Kumar">
          <span class="brand-span">ABHAY</span>
          <span class="brand-span">KUMAR</span>
        </a>

        <ul class="nav-links" aria-label="Navigation links">
          <li>
            <a href="#home" class="nav-link active" aria-current="page">HOME</a>
          </li>
          <li>
            <a href="#about" class="nav-link">ABOUT</a>
          </li>
          <li>
            <a href="#skills" class="nav-link">SKILLS</a>
          </li>
          <li>
            <a href="#work" class="nav-link">WORK</a>
          </li>
          <li>
            <a href="#journey" class="nav-link">JOURNEY</a>
          </li>
          <li>
            <a href="#contact" class="nav-link">CONTACT</a>
          </li>
        </ul>

        <div class="nav-cta">
          <a href="#contact" class="nav-cta-link">LET'S CONNECT</a>
        </div>

        <button class="menu-button" aria-label="Menu" onClick={toggleMobileMenu}>
          Menu
        </button>
      </div>

      {/* Mobile Menu */}
      <aside
        class="mobile-menu"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        role="menu"
      >
        <button
          class="mobile-close-button"
          aria-label="Close menu"
          onClick={closeMobileMenu}
        >
          Close
        </button>

        <nav>
          <ul role="menu">
            <li>
              <a
                href="#home"
                class="mobile-menu-link"
                aria-current="page"
                onClick={handleLinkClick}
              >HOME</a>
            </li>
            <li>
              <a
                href="#about"
                class="mobile-menu-link"
                onClick={handleLinkClick}
              >ABOUT</a>
            </li>
            <li>
              <a
                href="#skills"
                class="mobile-menu-link"
                onClick={handleLinkClick}
              >SKILLS</a>
            </li>
            <li>
              <a
                href="#work"
                class="mobile-menu-link"
                onClick={handleLinkClick}
              >WORK</a>
            </li>
            <li>
              <a
                href="#journey"
                class="mobile-menu-link"
                onClick={handleLinkClick}
              >JOURNEY</a>
            </li>
            <li>
              <a
                href="#contact"
                class="mobile-menu-link"
                onClick={handleLinkClick}
              >CONTACT</a>
            </li>
          </ul>
        </nav>
      </aside>
    </nav>
  );
}

export default Navbar;