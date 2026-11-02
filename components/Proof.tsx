import { ArrowUpRight } from 'lucide-react';
import { PROOF_LOGOS, RESUME_URL } from '../constants';

const Proof = () => (
  <section className="proof" aria-labelledby="proof-label">
    <div className="container proof-inner">
      <h2 className="mono proof-label" id="proof-label">
        Worked &amp; trained with
      </h2>
      <div className="proof-logos">
        {PROOF_LOGOS.map((logo, index) => (
          <span className={`proof-logo proof-logo--${index % 3}`} key={logo}>
            {logo}
          </span>
        ))}
      </div>
      <a
        className="proof-resume"
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        My resume <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </div>
  </section>
);

export default Proof;
