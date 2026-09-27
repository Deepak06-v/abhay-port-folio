/*!
  Projects Section - Phase 7
  Premium Selected Work showcase
*/

import React, { useState, useEffect } from 'react';
import projectsData from '../data/projects';
import './projects.css';

function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setReducedMotion(e.matches);
    setReducedMotion(mq.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const hasMedia = (project) => {
    return !!(project.liveUrl || project.githubUrl);
  };

  // Determine image source for each project
  const getProjectImageSrc = (project) => {
    if (project.image) {
      return '/projects/' + project.image;
    }
    return null;
  };

  function handleModalClose() {
    setActiveProject(null);
  }

  return (
    <section
      id="work"
      className="projects"
      aria-labelledby="projects-heading"
      role="region"
    >
      <div className="projects-container">
        <div className="projects-header">
          <span className="projects-label">SELECTED WORK</span>
          <h2 id="projects-heading" className="projects-heading">
            THINGS I'VE BUILT
          </h2>
          <p className="projects-desc">
            A selection of projects where I combine development, design, and
            AI-assisted workflows.
          </p>
        </div>

        <div className="projects-grid">
          {projectsData.map((project) => {
            const imgSrc = getProjectImageSrc(project);
            return (
              <div
                key={project.id}
                className="project-card"
                role="button"
                tabIndex={0}
                onClick={() => setActiveProject(project)}
              >
                <div
                  className="project-visual"
                  onClick={() => setActiveProject(project)}
                  style={{
                    backgroundImage: imgSrc
                      ? `url(${imgSrc})`
                      : 'var(--bg-secondary)'
                  }}
                >
                  { !imgSrc && (
                    <div className="project-placeholder">
                      <span className="placeholder-text">{project.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Projects;