import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, PROFILE, RESUME_URL } from '../constants';
import Socials from './Socials';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="#top" aria-label="Atul Anand — back to top">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span className="brand-name">{PROFILE.meta.name}</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <a key={link.href} className="nav-link" href={link.href}>
              {link.name}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a
            className="nav-cta"
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume <span aria-hidden="true">↗</span>
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu" id="mobile-navigation">
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.href}
                className="mobile-link"
                href={link.href}
                onClick={() => setOpen(false)}
              >
                <span className="mono">0{index + 1}</span>
                {link.name}
                <span aria-hidden="true">↘</span>
              </a>
            ))}
          </nav>
          <div className="mobile-menu-foot">
            <a
              className="pill pill--dark"
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View resume <span aria-hidden="true">↗</span>
            </a>
            <Socials />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
