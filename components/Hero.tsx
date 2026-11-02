import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { EDUCATION, PROFILE, RESUME_URL } from '../constants';
import Socials from './Socials';

const Hero = () => {
  const { meta } = PROFILE;
  const primarySchool = EDUCATION[0]?.institution?.split(',')[0] ?? 'Open to opportunities';
  const gpa = EDUCATION[0]?.score ?? '';

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-inner">
        <div className="hero-topline">
          <span className="mono">Portfolio / 2026</span>
          <span className="mono hero-location">Dharwad, India · 15.46°N, 75.01°E</span>
        </div>

        <div className="hero-head">
          <p className="hero-hi">Hey, I&apos;m</p>
          <h1 className="hero-name" id="hero-title">
            {meta.name}
          </h1>
          <p className="hero-role">
            And I secure <span className="scribble">systems</span>
            <span className="hero-shield" aria-hidden="true">
              🛡️
            </span>
          </p>

          <svg
            className="hero-star"
            viewBox="0 0 100 100"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M50 0 58 38 88 12 70 44 100 50 70 56 88 88 58 62 50 100 42 62 12 88 30 56 0 50 30 44 12 12 42 38Z" />
            <circle cx="50" cy="50" r="7" />
          </svg>
        </div>

        <div className="hero-bottom">
          <p className="hero-summary">{meta.summary}</p>

          <div className="hero-actions">
            <a
              className="pill pill--dark"
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View resume <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a className="pill pill--outline" href="#contact">
              Let&apos;s talk <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="hero-facts">
            <div className="hero-fact">
              <span className="mono">Degree</span>
              <strong>{meta.headline}</strong>
            </div>
            <div className="hero-fact">
              <span className="mono">Institute</span>
              <strong>{primarySchool}</strong>
            </div>
            {gpa && (
              <div className="hero-fact">
                <span className="mono">GPA</span>
                <strong>{gpa}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="hero-edge">
          <a className="hero-scroll mono" href="#about">
            Scroll to explore <ArrowDown size={14} aria-hidden="true" />
          </a>
          <Socials className="hero-socials" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
