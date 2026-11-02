import { ArrowUp } from 'lucide-react';
import { PROFILE } from '../constants';
import Socials from './Socials';

const Footer = () => {
  const syncedAt = new Date(PROFILE.generatedAt);
  const syncedLabel = Number.isNaN(syncedAt.getTime())
    ? ''
    : syncedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a className="footer-brand" href="#top">
              {PROFILE.meta.name}
              <span aria-hidden="true">.</span>
            </a>
            <p className="footer-tag">Cybersecurity &amp; AI engineer.</p>
          </div>

          <Socials />

          <a className="footer-toplink mono" href="#top">
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {PROFILE.meta.name}</span>
          {syncedLabel && <span>Resume-synced · {syncedLabel}</span>}
          <span>Dharwad, India</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
