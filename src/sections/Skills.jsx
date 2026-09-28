/*!
  Skills — a bordered spec sheet.

  Distinct from every other section on purpose: no prose, no cards. Each
  capability group is a full-width row separated by 2px rules, with the
  technologies laid out as a square inventory. It reads as a parts table,
  which is what a stack actually is.
*/

import { useReveal } from '../hooks/useReveal';
import skills from '../data/skills';
import './skills.css';

export default function Skills() {
  const scopeRef = useReveal();
  const groups = Object.entries(skills);

  return (
    <section
      className="section skills"
      id="skills"
      ref={scopeRef}
      aria-labelledby="skills-title"
    >
      <div className="container">
        <header className="skills__header">
          <span className="tech-label" data-reveal="up">
            <span className="tech-label__index">04</span>
            Stack
          </span>
          <h2 className="skills__title" id="skills-title" data-reveal="up">
            The tools, <span className="skills__title-accent">plainly listed</span>
          </h2>
        </header>

        <div className="skills__sheet" data-reveal="up">
          {groups.map(([key, group], i) => (
            <div className="skills__row" key={key}>
              <div className="skills__row-key">
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="skills__row-label mono">{group.label}</h3>
              </div>

              <ul className="skills__items" role="list">
                {group.technologies.map((tech) => (
                  <li className="tag tag--block" key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
