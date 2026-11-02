import { Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { PROFILE } from '../constants';

type SocialsProps = {
  className?: string;
};

const Socials = ({ className = '' }: SocialsProps) => {
  const { links, email } = PROFILE.meta;

  return (
    <div className={`socials ${className}`.trim()} aria-label="Social links">
      {links.github && (
        <a
          className="social-link"
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github size={17} strokeWidth={1.8} aria-hidden="true" />
        </a>
      )}
      {links.linkedin && (
        <a
          className="social-link"
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin size={17} strokeWidth={1.8} aria-hidden="true" />
        </a>
      )}
      {links.x && (
        <a
          className="social-link social-link--text"
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (formerly Twitter)"
        >
          X
        </a>
      )}
      {links.instagram && (
        <a
          className="social-link"
          href={links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <Instagram size={17} strokeWidth={1.8} aria-hidden="true" />
        </a>
      )}
      {email && (
        <a className="social-link" href={`mailto:${email}`} aria-label="Email Atul Anand">
          <Mail size={17} strokeWidth={1.8} aria-hidden="true" />
        </a>
      )}
    </div>
  );
};

export default Socials;
