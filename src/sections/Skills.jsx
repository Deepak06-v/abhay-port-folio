/*!
  Skills Section - Phase 6
  Premium interactive tech stack section
*/

import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import skillsData from '../data/skills';
import './skills.css';

function Skills() {
  const [focusedTech, setFocusedTech] = React.useState(null);
  const [reducedMotion, setReducedMotion] = React.useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const handleTechMouseEnter = (tech) => {
    if (!reducedMotion) {
      setFocusedTech(tech);
    }
  };

  const handleTechMouseLeave = () => {
    setFocusedTech(null);
  };

  const handleTechClick = (tech) => {
    setFocusedTech(tech);
  };

  const { isVisible: headerVisible } = useScrollReveal({
    distance: '0px',
    origin: 'top',
    threshold: 0.2,
    once: true,
  });

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    const skillsHeader = document.querySelector('.skills-header');
    if (skillsHeader) {
      skillsHeader.style.animationPlayState = headerVisible ? 'running' : 'paused';
    }
  }, [headerVisible, reducedMotion]);

  return (
    <section
      id="skills"
      className="skills"
      aria-labelledby="skills-heading"
      role="region"
    >
      <div className="skills-container">
        <div className="skills-header">
          <span className="skills-label">TECH STACK</span>
          <h2 id="skills-heading" className="skills-heading">
            TOOLS I BUILD WITH
          </h2>
          <p className="skills-desc">
            Technologies and tools I use to design, develop, test, and iterate
            on modern web experiences.
          </p>
        </div>

        <div className="skills-categories">
          {Object.entries(skillsData).map(([categoryKey, category], catIndex) => (
            <div
              key={catIndex}
              className="skills-category"
              role="group"
              aria-label={category.label}
            >
              <span className="skills-category-label" onClick={() => {}}>
                {category.label}
              </span>
              <div className="skills-tech-grid">
                {category.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="skills-tech-item"
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => handleTechMouseEnter(tech)}
                    onMouseLeave={handleTechMouseLeave}
                    onFocus={() => handleTechMouseEnter(tech)}
                    onBlur={() => handleTechMouseLeave()}
                    onClick={() => handleTechClick(tech)}
                  >
                    <span className="skills-tech-name">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;