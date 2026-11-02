import { ArrowDown } from 'lucide-react';
import { CUTOUT_IMAGE_URL, PROFILE, PROFILE_IMAGE_URL, STATS } from '../constants';

const About = () => (
  <section className="band band--yellow band--about" id="about" aria-labelledby="about-title">
    <span className="band-ghost" aria-hidden="true">
      BUILD
    </span>
    <div className="container">
      <div className="about-grid">
        <div className="about-copy" data-reveal>
          <div className="section-eyebrow mono">
            <span>01</span> About
          </div>
          <h2 className="about-title" id="about-title">
            I don&apos;t just study security.
            <br />
            <span className="scribble">I build it.</span>
          </h2>
          <p className="about-lead">{PROFILE.meta.summary}</p>

          <div className="stats" aria-label="At a glance">
            {STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label mono">{stat.label}</span>
              </div>
            ))}
          </div>

          <a className="pill pill--dark about-cta" href="#projects">
            See the work <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>

        <figure className="about-photo" data-reveal style={{ transitionDelay: '120ms' }}>
          <img
            src={CUTOUT_IMAGE_URL}
            alt={`${PROFILE.meta.name}, cybersecurity and AI engineer`}
            loading="lazy"
            width="992"
            height="671"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = PROFILE_IMAGE_URL;
            }}
          />
          <figcaption className="photo-tag mono">NFSU / Cybersecurity / &apos;28</figcaption>
        </figure>
      </div>
    </div>
  </section>
);

export default About;
