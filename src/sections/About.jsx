/*!
  About — identity, stated plainly.

  Distinct composition: an oversized statement leads the section, then the
  prose sits beside a bordered fact table. The factual details are presented
  as a spec block so they read as data rather than as biography filler.
*/

import { useReveal } from '../hooks/useReveal';
import SectionHeader from '../components/SectionHeader';
import './about.css';

const FACTS = [
  { key: 'Based in', value: 'Bengaluru, India' },
  { key: 'Studying', value: 'BCA — 3rd year' },
  { key: 'Focus', value: 'Full-stack web development' },
  { key: 'Stack', value: 'MERN' },
];

export default function About() {
  const scopeRef = useReveal();

  return (
    <section className="section about" id="about" ref={scopeRef} aria-labelledby="about-title">
      <div className="container">
        <SectionHeader
          index="01"
          eyebrow="About"
          title="A developer who treats AI like a tool, not a crutch"
          titleId="about-title"
        />

        <div className="about__grid">
          <div className="about__intro">
            <p className="about__lead" data-reveal="up">
              I&rsquo;m a BCA 3rd-year student in Bengaluru who builds real web products
              rather than isolated demos. Most of what I ship runs across the full MERN
              stack.
            </p>
            <p className="prose" data-reveal="up">
              I use AI to move faster on the parts that are not the interesting part —
              scaffolding, boilerplate, and looking things up. I still read the code, I
              still own the architecture, and I still need to understand why it works
              before it goes anywhere near a user.
            </p>
            <p className="prose" data-reveal="up">
              Right now I am in my third year, applying what I learn to projects like
              DEER and working through ideas like Fixmate, and open to where this leads.
            </p>
          </div>

          <div className="about__facts" data-reveal="up">
            <div className="about__facts-head">
              <span className="mono">Details</span>
              <span className="mono">Ref</span>
            </div>
            <dl className="about__facts-list">
              {FACTS.map((fact, i) => (
                <div className="about__fact" key={fact.key}>
                  <dt className="about__fact-key mono">{fact.key}</dt>
                  <dd className="about__fact-value">{fact.value}</dd>
                  <span className="about__fact-ref mono" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
              <div className="about__fact">
                <dt className="about__fact-key mono">Status</dt>
                <dd className="about__fact-value">
                  <span className="pill">
                    <span className="pill__dot" aria-hidden="true" />
                    Open to opportunities
                  </span>
                </dd>
                <span className="about__fact-ref mono" aria-hidden="true">
                  05
                </span>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
