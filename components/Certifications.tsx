import { ArrowUpRight } from 'lucide-react';
import { ACHIEVEMENTS, CERTIFICATIONS, PROFILE, SCHOLASTIC } from '../constants';

const Certifications = () => {
  const linkedinUrl = PROFILE.meta.links.linkedin;
  const honor = SCHOLASTIC.find((item) => /top performer|award/i.test(item));

  return (
    <section
      className="band band--black band--certs"
      id="certifications"
      aria-labelledby="certifications-title"
    >
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <div className="section-eyebrow mono">
              <span>06</span> Receipts
            </div>
            <h2 className="section-title" id="certifications-title">
              Certified. <span className="accent-yellow">Battle-tested.</span>
            </h2>
          </div>
          <p className="section-note">
            Formal training and hands-on labs — OT/SCADA, SOC workflows, incident response and
            the unglamorous compliance work that keeps systems alive.
          </p>
        </div>

        <div className="cert-list">
          {CERTIFICATIONS.map((cert, index) => (
            <article
              className="cert-row"
              key={cert.id}
              data-reveal
              style={{ transitionDelay: `${Math.min(index * 60, 180)}ms` }}
            >
              <span className="cert-index mono">{String(index + 1).padStart(2, '0')}</span>
              <div className="cert-main">
                <div className="cert-title-row">
                  <h3 className="cert-title">
                    {cert.link ? (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer">
                        {cert.title} <ArrowUpRight size={15} aria-hidden="true" />
                      </a>
                    ) : (
                      cert.title
                    )}
                  </h3>
                  {cert.source === 'linkedin' && (
                    <span className="source-badge mono">LinkedIn</span>
                  )}
                </div>
                {cert.description && <p className="cert-desc">{cert.description}</p>}
              </div>
              <span className="cert-issuer">{cert.issuer || 'Professional development'}</span>
              <span className="cert-date mono">{cert.date}</span>
            </article>
          ))}
        </div>

        {honor && (
          <div className="honor" data-reveal>
            <span className="honor-star" aria-hidden="true">
              ✦
            </span>
            <div>
              <span className="mono honor-label">Academic highlight</span>
              <p>{honor}</p>
            </div>
          </div>
        )}

        <div className="record" data-reveal>
          <div className="record-head">
            <span className="mono">Also on the record</span>
            {linkedinUrl && (
              <a
                className="text-link"
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                More on LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
          <ul className="record-list">
            {ACHIEVEMENTS.map((item, index) => (
              <li key={item}>
                <span className="mono record-index">{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
