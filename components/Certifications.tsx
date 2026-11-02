import React from 'react';
import { Award, ExternalLink, Linkedin } from 'lucide-react';
import { CERTIFICATIONS, PROFILE } from '../constants';

const Certifications: React.FC = () => {
  const linkedinUrl = PROFILE.meta.links.linkedin;

  return (
    <section id="certifications" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Certifications & Training</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Continuous learning is key. Here are some of the programs and hands-on trainings I have completed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl border border-gray-200 p-2 hover:border-secondary/50 transition-colors duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4 bg-gray-100">
                {/* Simulated certificate visual */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-indigo-50 via-white to-amber-50 transition-transform duration-500 group-hover:scale-105">
                    <Award className="w-12 h-12 text-indigo-300 group-hover:text-secondary transition-colors" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-gray-400">Verified training</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
              </div>
              <div className="px-2 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cert.title}</h3>
                  {cert.source === 'linkedin' && (
                    <span className="mt-1 rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-700">
                      LinkedIn
                    </span>
                  )}
                </div>
                {cert.description && (
                  <p className="mb-2 text-xs leading-relaxed text-gray-500">{cert.description}</p>
                )}
                <div className="flex justify-between items-center gap-3 text-sm">
                  <span className="text-gray-600 font-medium">{cert.issuer || 'Professional development'}</span>
                  <span className="shrink-0 text-gray-400">{cert.date}</span>
                </div>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Verify credential <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {linkedinUrl && (
          <div className="mt-12 text-center">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-50 text-primary font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Linkedin size={16} />
              More on LinkedIn
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;
