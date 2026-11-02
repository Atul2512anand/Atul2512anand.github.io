import { Activity, ArrowUpRight, Blocks, Github, ScanFace, type LucideIcon } from 'lucide-react';
import { PROFILE, PROJECTS } from '../constants';

type ArtSpec = {
  icon: LucideIcon;
  tone: 'yellow' | 'salmon' | 'blue';
  label: string;
};

const ART: ArtSpec[] = [
  { icon: Blocks, tone: 'yellow', label: 'Chain / traceability' },
  { icon: Activity, tone: 'salmon', label: 'Predict / maintain' },
  { icon: ScanFace, tone: 'blue', label: 'Detect / log' },
];

const Projects = () => {
  const githubUrl = PROFILE.meta.links.github;

  return (
    <section className="band band--paper band--projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <div className="section-eyebrow mono">
              <span>03</span> Selected work
            </div>
            <h2 className="section-title" id="projects-title">
              Shipped, not just <span className="scribble">specced.</span>
            </h2>
          </div>
          <div className="section-head-side">
            <p className="section-note">
              Three end-to-end builds: a blockchain supply chain, an agentic maintenance system,
              and a face-recognition attendance pipeline.
            </p>
            {githubUrl && (
              <a
                className="text-link"
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} aria-hidden="true" /> All repos
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div className="project-list">
          {PROJECTS.map((project, index) => {
            const art = ART[index % ART.length];
            const Icon = art.icon;
            const number = String(index + 1).padStart(2, '0');
            const sentences = project.description.split(/(?<=[.!?])\s+/);
            const lead = sentences[0];
            const rest = sentences.slice(1).join(' ');

            return (
              <article
                className="project"
                key={project.id}
                data-reveal
                style={{ transitionDelay: `${Math.min(index * 80, 240)}ms` }}
              >
                <div className={`project-art project-art--${art.tone}`} aria-hidden="true">
                  <span className="art-grid" />
                  <span className="art-index">{number}</span>
                  <Icon className="art-icon" size={190} strokeWidth={0.9} />
                  <span className="art-label mono">{art.label}</span>
                </div>

                <div className="project-body">
                  <div className="project-meta">
                    <span className="mono">
                      {project.year ?? 'Build'} / {number}
                    </span>
                    {project.source === 'linkedin' && (
                      <span className="source-badge mono">LinkedIn</span>
                    )}
                  </div>

                  <h3 className="project-title">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        {project.title}
                        <ArrowUpRight size={22} aria-hidden="true" />
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>

                  <p className="project-desc">
                    <span className="project-lead">{lead}</span>
                    {rest && <span> {rest}</span>}
                  </p>

                  {project.tools.length > 0 && (
                    <div className="tags" aria-label="Tools used">
                      {project.tools.map((tool) => (
                        <span className="tag mono" key={tool}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="project-foot">
                    {project.link ? (
                      <a
                        className="pill pill--outline project-link"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on GitHub <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="mono">Ask me about this build</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
