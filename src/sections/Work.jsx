/*!
  Work — the proof section.

  The projects data has no screenshots (image: null), so instead of broken
  image boxes the covers are typographic compositions. The featured project
  gets a full-bleed asymmetric layout; secondary work sits in a smaller row.
*/

import { useCallback, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useMagnetic } from '../hooks/useMagnetic';
import Modal from '../components/Modal';
import projects from '../data/projects';
import SectionHeader from '../components/SectionHeader';
import './work.css';

const pad = (n) => String(n + 1).padStart(2, '0');

export default function Work() {
  const scopeRef = useReveal();
  const [openId, setOpenId] = useState(null);

  const magneticRef = useMagnetic();

  const active = projects.find((p) => p.id === openId) ?? null;
  const openProject = useCallback((id) => setOpenId(id), []);
  const closeProject = useCallback(() => setOpenId(null), []);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section className="section work" id="work" ref={scopeRef} aria-labelledby="work-title">
      <div className="container">
        <SectionHeader
          index="02"
          eyebrow="Selected work"
          title="Things I have designed and shipped"
          lede="Each project below is something I owned end to end — interface, API, and data."
          titleId="work-title"
        />

        {featured.map((project) => (
          <ProjectFeature
            key={project.id}
            project={project}
            index={projects.indexOf(project)}
            onOpen={openProject}
            magneticRef={magneticRef}
          />
        ))}

        {rest.length > 0 && (
          <ul className="work__rest" role="list">
            {rest.map((project) => (
              <li key={project.id} data-reveal="up">
                <article className="work__mini">
                  <span className="work__mini-cover" data-variant={project.id % 2}>
                    <span className="work__mini-index mono">{pad(projects.indexOf(project))}</span>
                    <span className="work__mini-wordmark">{project.title}</span>
                  </span>
                  <div className="work__mini-body">
                    <h3 className="work__mini-title">{project.title}</h3>
                    <p className="work__mini-type mono">{project.type}</p>
                    <p className="work__mini-desc">{project.description}</p>
                    <button
                      className="link-arrow"
                      type="button"
                      onClick={() => openProject(project.id)}
                    >
                      Read the brief
                      <Arrow />
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={Boolean(active)}
        onClose={closeProject}
        labelledBy="work-dialog-title"
      >
        {active && (
          <div className="work__dialog">
            <p className="eyebrow mono">
              {active.status} · {pad(projects.indexOf(active))}
            </p>
            <h3 className="work__dialog-title" id="work-dialog-title">
              {active.title}
            </h3>
            <p className="work__dialog-type mono">{active.type}</p>
            <p className="work__dialog-desc">{active.description}</p>

            {active.technologies.length > 0 && (
              <>
                <h4 className="work__dialog-sub mono">Built with</h4>
                <ul className="tag-list" role="list">
                  {active.technologies.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="work__dialog-actions">
              {active.githubUrl && (
                <a
                  className="btn btn--primary"
                  href={active.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  View source
                  <svg
                    className="btn__arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 9.5L9.5 4.5M5.5 4.5h4v4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
              {!active.githubUrl && (
                <p className="work__dialog-note">
                  This one is a concept, so there is no public repository to link.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

/* --- Featured project ---------------------------------------------- */

function ProjectFeature({ project, index, onOpen, magneticRef }) {
  return (
    <article className="work__feature" data-reveal="clip">
      <div className="work__feature-grid">
        <div className="work__feature-cover" data-variant={project.id % 2} aria-hidden="true">
          <span className="work__feature-index mono">{pad(index)}</span>
          <span className="work__feature-wordmark">{project.title}</span>
          <span className="work__feature-glyph" data-variant={project.id % 2} />
        </div>

        <div className="work__feature-body">
          <p className="eyebrow mono">
            {project.status}
            <span className="work__feature-dot" aria-hidden="true" />
            Featured
          </p>
          <h3 className="work__feature-title">{project.title}</h3>
          <p className="work__feature-type mono">{project.type}</p>
          <p className="work__feature-desc">{project.description}</p>

          <ul className="tag-list" role="list">
            {project.technologies.slice(0, 6).map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
            {project.technologies.length > 6 && (
              <li className="tag tag--more mono">+{project.technologies.length - 6}</li>
            )}
          </ul>

          <button
            className="link-arrow"
            type="button"
            onClick={() => onOpen(project.id)}
            ref={magneticRef}
          >
            Read the brief
            <Arrow />
          </button>
        </div>
      </div>
    </article>
  );
}

function Arrow() {
  return (
    <svg
      className="link-arrow__icon"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
