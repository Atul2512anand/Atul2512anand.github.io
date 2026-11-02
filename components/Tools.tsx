import React from 'react';
import { TOOL_ICONS } from '../constants';

const Tools: React.FC = () => {
  // Duplicate the array to ensure seamless infinite scroll
  const infiniteTools = [...TOOL_ICONS, ...TOOL_ICONS];

  return (
    <section id="tools" className="py-20 bg-white overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900">Tools & Technologies</h2>
        <div className="w-16 h-1 bg-secondary mx-auto mt-4"></div>
        <p className="mt-4 text-sm text-gray-500">Pulled from my resume and project stacks.</p>
      </div>

      <div className="relative w-full">
        {/* Gradient masks for edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

        <div className="flex overflow-hidden">
          <div className="flex animate-scroll gap-12 py-8 whitespace-nowrap">
            {infiniteTools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                    <div 
                        key={`${tool.name}-${idx}`}
                        className="flex flex-col items-center gap-3 group min-w-[100px] mx-4"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                            <Icon className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                        </div>
                        <span className="font-semibold text-gray-600 group-hover:text-primary">{tool.name}</span>
                    </div>
                )
            })}
          </div>
        </div>
      </div>

      <div className="text-center mt-12 flex justify-center gap-2">
          {[1,2,3].map(d => <div key={d} className={`w-2 h-2 rounded-full ${d===2 ? 'bg-primary' : 'bg-gray-300'}`}></div>)}
      </div>
    </section>
  );
};

export default Tools;