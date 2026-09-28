/*!
  Journey — the background that explains the work.

  A vertical spine on small screens, a two-column layout on wide ones. Every
  entry is always expanded: this is context, not an interaction.
*/

import { useReveal } from '../hooks/useReveal';
import journey from '../data/journey';
import SectionHeader from '../components/SectionHeader';
import './journey.css';

export default function Journey() {
  const scopeRef = useReveal();

  return (
    <section
      className="section journey"
      id="journey"
      ref={scopeRef}
      aria-labelledby="journey-title"
    >
      <div className="container">
        <SectionHeader
          index="03"
          eyebrow="Background"
          title="Still early, learning in public"
          lede="Where the foundation came from, and where it is heading."
          titleId="journey-title"
        />

        <ol className="journey__list">
          {journey.map((entry) => (
            <li className="journey__item" key={entry.id} data-reveal="up">
              <div className="journey__marker" aria-hidden="true">
                <span className="journey__dot" />
              </div>

              <div className="journey__body">
                <p className="journey__number mono">{entry.number}</p>
                <h3 className="journey__title">{entry.title}</h3>
                <p className="journey__desc">{entry.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
