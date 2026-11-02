import React, { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import {
  ACHIEVEMENTS,
  COURSES,
  EDUCATION,
  EXPERIENCES,
  FOCUS_AREAS,
  SKILL_GROUPS,
} from '../constants';

const SkillsExperience: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  return (
    <section id="skills" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Skills & Experience</h2>
          <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
            A snapshot of my technical toolkit and the roles behind it, generated directly from my
            resume so it stays current.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Side: Skills */}
          <div className="w-full lg:w-5/12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="w-8 h-1 bg-primary mr-3"></span>
              My Skills
            </h3>
            
            <div className="space-y-6">
              {SKILL_GROUPS.map((group) => (
                <div key={group.category}>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    {group.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-3">Focus Areas</h4>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-3">Relevant Coursework</h4>
              <div className="flex flex-wrap gap-2">
                {COURSES.map((course) => {
                  const ongoing = course.endsWith('*');
                  const label = course.replace(/\*$/, '');
                  return (
                    <span key={course} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {label}
                      {ongoing && <span className="ml-1 text-secondary" title="Ongoing">•</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Tabs for Exp/Edu */}
          <div className="w-full lg:w-7/12">
            <div className="flex mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('experience')}
                className={`pb-4 pr-8 text-xl font-bold transition-all relative ${
                  activeTab === 'experience' 
                    ? 'text-primary' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Experience
                {activeTab === 'experience' && <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></span>}
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`pb-4 px-8 text-xl font-bold transition-all relative ${
                  activeTab === 'education' 
                    ? 'text-secondary' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Education
                {activeTab === 'education' && <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary rounded-t-full"></span>}
              </button>
            </div>

            <div className="space-y-8">
              {activeTab === 'experience' ? (
                <div className="space-y-12 animate-fadeIn">
                  {EXPERIENCES.map((exp) => (
                    <div key={exp.id} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 shrink-0 rounded-full bg-indigo-50 text-primary flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors border-2 border-indigo-100">
                            {exp.id}
                         </div>
                         <div className="w-0.5 h-full bg-gray-200 my-2 group-last:hidden"></div>
                      </div>
                      <div className="pb-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xl font-bold text-gray-900">{exp.role}</h4>
                          {exp.source === 'linkedin' && (
                            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
                              LinkedIn
                            </span>
                          )}
                        </div>
                        <div className="text-primary font-medium mb-2">
                          {exp.company} <span className="text-gray-400 mx-2">|</span>{' '}
                          <span className="text-gray-500 text-sm">{exp.period}</span>
                        </div>
                        {exp.description.length > 0 && (
                          <ul className="list-disc list-outside ml-4 text-gray-600 space-y-2 text-sm leading-relaxed marker:text-secondary">
                            {exp.description.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-12 animate-fadeIn">
                  {EDUCATION.map((edu, index) => (
                    <div key={edu.id} className="flex gap-6 group">
                       <div className="flex flex-col items-center">
                         <div className="w-12 h-12 shrink-0 rounded-full bg-amber-50 text-secondary flex items-center justify-center font-bold text-xl group-hover:bg-secondary group-hover:text-white transition-colors border-2 border-amber-100">
                            {index + 1}
                         </div>
                         <div className="w-0.5 h-full bg-gray-200 my-2 group-last:hidden"></div>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{edu.degree}</h4>
                        <div className="text-secondary font-medium mb-2">{edu.institution}</div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">{edu.period}</span>
                          {edu.score && (
                            <span className="font-bold text-gray-700">
                              {edu.score.includes('/') ? `GPA: ${edu.score}` : edu.score}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {ACHIEVEMENTS.length > 0 && (
              <div className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-900">
                  <Sparkles size={16} className="text-secondary" />
                  Selected Achievements
                </h4>
                <ul className="space-y-3">
                  {ACHIEVEMENTS.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-indigo-950/80">
                      <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SkillsExperience;
