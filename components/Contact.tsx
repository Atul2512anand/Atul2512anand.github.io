import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { PROFILE, RESUME_URL } from '../constants';
import Socials from './Socials';

const Contact = () => {
  const { meta } = PROFILE;
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(meta.email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${meta.email}`;
    }
  };

  return (
    <section className="band band--pink band--contact" id="contact" aria-labelledby="contact-title">
      <span className="band-ghost" aria-hidden="true">
        HELLO
      </span>
      <div className="container">
        <div className="contact-grid">
          <div className="contact-copy" data-reveal>
            <div className="section-eyebrow mono">
              <span>07</span> Contact
            </div>
            <h2 className="contact-title" id="contact-title">
              Let&apos;s build something that <span className="scribble">holds up.</span>
            </h2>
            <p className="contact-note">
              No contact form. Just my real inbox. Recruiting, collaborating, or arguing about
              OT security — all welcome.
            </p>

            <div className="contact-actions">
              <a className="pill pill--dark" href={`mailto:${meta.email}`}>
                Email me <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <button className="pill pill--outline" type="button" onClick={copyEmail}>
                {copied ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <Copy size={16} aria-hidden="true" />
                )}
                {copied ? 'Copied' : 'Copy email'}
              </button>
            </div>
            <span className="sr-only" role="status">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
          </div>

          <aside className="contact-card" data-reveal style={{ transitionDelay: '120ms' }}>
            <div className="contact-card-top">
              <span className="mono">Contact card / 2026</span>
              <span className="card-star" aria-hidden="true">
                ✦
              </span>
            </div>

            <dl className="contact-list">
              <div className="contact-row">
                <dt className="mono">Email</dt>
                <dd>
                  <a href={`mailto:${meta.email}`}>{meta.email}</a>
                </dd>
              </div>
              {meta.phone && (
                <div className="contact-row">
                  <dt className="mono">Phone</dt>
                  <dd>
                    <a href={`tel:${meta.phone.replace(/\s+/g, '')}`}>{meta.phone}</a>
                  </dd>
                </div>
              )}
              <div className="contact-row">
                <dt className="mono">Based</dt>
                <dd>{meta.location}</dd>
              </div>
              <div className="contact-row">
                <dt className="mono">Resume</dt>
                <dd>
                  <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
                    Download PDF <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </dd>
              </div>
            </dl>

            <div className="contact-card-foot">
              <span className="mono">Elsewhere</span>
              <Socials />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Contact;
