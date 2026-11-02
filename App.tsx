import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SkillsExperience from './components/SkillsExperience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Tools from './components/Tools';
import Contact from './components/Contact';
import CursorEffect from './components/CursorEffect';
import { PROFILE } from './constants';
import { ArrowUp } from 'lucide-react';

const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const syncedAt = new Date(PROFILE.generatedAt);
  const syncedLabel = Number.isNaN(syncedAt.getTime())
    ? ''
    : syncedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative">
      <CursorEffect />
      <Navbar />
      
      <main>
        <Hero />
        <SkillsExperience />
        <Projects />
        <Certifications />
        <Tools />
        <Contact />
      </main>

      <footer className="bg-gray-50 py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>&copy; {new Date().getFullYear()} {PROFILE.meta.name}. All rights reserved.</p>
        {syncedLabel && (
          <p className="mt-2 text-xs text-gray-400">
            Content auto-synced from resume · {syncedLabel}
          </p>
        )}
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-primary text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all hover:-translate-y-1 z-40 animate-fadeIn"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default App;