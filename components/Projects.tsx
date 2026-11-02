import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { PROFILE, PROJECTS } from '../constants';

const Projects: React.FC = () => {
  const githubUrl = PROFILE.meta.links.github;

  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Projects</h2>
            <div className="w-16 h-1 bg-primary"></div>
            <p className="mt-4 max-w-xl text-gray-600">
              A few things I have built end-to-end. Descriptions and technologies are generated from my
              resume.
            </p>
          </div>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              <Github size={16} />
              All Projects
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${
                index === PROJECTS.length - 1 && PROJECTS.length % 2 === 1 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex p-6 md:p-8 gap-6">
                  {/* Icon Container */}
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl font-bold">{project.title.charAt(0)}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      {project.year && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                          {project.year}
                        </span>
                      )}
                      {project.source === 'linkedin' && (
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-700">
                          LinkedIn
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    
                    {project.tools.length > 0 && (
                      <div className="mb-4">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block mb-2">Tools Used</span>
                        <div className="flex flex-wrap gap-2">
                          {project.tools.map((tool) => (
                            <span key={tool} className="text-xs font-medium text-primary bg-indigo-50 px-2 py-1 rounded">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          View Project <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-gray-400">Ask me about this project</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
