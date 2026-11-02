import { EXPERIENCES } from '../constants';

const Experience = () => (
  <section
    className="band band--salmon band--experience"
    id="experience"
    aria-labelledby="experience-title"
  >
    <span className="band-ghost" aria-hidden="true">
      RISK
    </span>
    <div className="container">
      <div className="section-head" data-reveal>
        <div>
          <div className="section-eyebrow mono">
            <span>02</span> Experience
          </div>
          <h2 className="section-title" id="experience-title">
            Four teams. One question:{' '}
            <span className="scribble">what could go wrong?</span>
          </h2>
        </div>
        <p className="section-note">
          Health-tech OSINT in the UAE, ML research at IIT (BHU), retail analytics at Vodafone,
          and OT/SCADA labs at NFSU. Different domains, same instinct: find the weak point before
          someone else does.
        </p>
      </div>

      <div className="exp-list">
        {EXPERIENCES.map((exp, index) => (
          <article
            className="exp-row"
            key={exp.id}
            data-reveal
            style={{ transitionDelay: `${Math.min(index * 60, 240)}ms` }}
          >
            <span className="exp-index mono">{String(index + 1).padStart(2, '0')}</span>

            <div className="exp-main">
              <div className="exp-heading">
                <h3 className="exp-role">{exp.role}</h3>
                {exp.source === 'linkedin' && <span className="source-badge mono">LinkedIn</span>}
              </div>
              <p className="exp-company">{exp.company}</p>

              {exp.description.length > 0 && (
                <ul className="exp-points">
                  {exp.description.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>

            <span className="exp-period mono">{exp.period}</span>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
