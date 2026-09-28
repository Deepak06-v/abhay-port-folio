/*!
  Process — how the work actually gets done.

  Seven stages is too many to show as seven equal cards, so the list is
  scannable by default and expands to full descriptions on demand. The
  currently open stage is also the one the progress rail tracks.
*/

import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import workflow from '../data/workflow';
import SectionHeader from '../components/SectionHeader';
import './process.css';

export default function Process() {
  const scopeRef = useReveal();
  const [openId, setOpenId] = useState(workflow[2]?.id ?? workflow[0].id);

  return (
    <section
      className="section process"
      id="process"
      ref={scopeRef}
      aria-labelledby="process-title"
    >
      <div className="container">
        <SectionHeader
          index="05"
          eyebrow="How I work"
          title="AI is a tool. The engineering decisions are mine."
          lede="This is the loop I run on every project, from the first idea to the deployed build."
          titleId="process-title"
        />

        <ol className="process__list">
          {workflow.map((stage) => {
            const isOpen = openId === stage.id;
            return (
              <li
                className={`process__item${isOpen ? ' is-open' : ''}`}
                key={stage.id}
                data-reveal="up"
              >
                <h3 className="process__heading">
                  <button
                    className="process__trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`process-panel-${stage.id}`}
                    id={`process-trigger-${stage.id}`}
                    onClick={() => setOpenId(isOpen ? null : stage.id)}
                  >
                    <span className="process__number mono">{stage.number}</span>
                    <span className="process__title">{stage.title}</span>
                    <span className="process__icon" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                </h3>

                <div
                  className="process__panel"
                  id={`process-panel-${stage.id}`}
                  role="region"
                  aria-labelledby={`process-trigger-${stage.id}`}
                  // Keep collapsed copy out of the tab order.
                  {...(isOpen ? {} : { inert: '' })}
                >
                  <p className="process__desc">{stage.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
