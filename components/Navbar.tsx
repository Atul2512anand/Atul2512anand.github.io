import React, { useState, useEffect } from 'react';
import { NAV_LINKS, PROFILE } from '../constants';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Use scrollIntoView with options, supported by scroll-padding-top in CSS
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      
      // Update URL hash without jumping
      window.history.pushState(null, '', href);
    }
  };

  const leftLinks = NAV_LINKS.slice(0, 3);
  const rightLinks = NAV_LINKS.slice(3);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center md:justify-center relative h-20">
          
          {/* Mobile Menu Button */}
          <div className="md:hidden absolute left-0">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation" className="text-gray-800 focus:outline-none p-2 bg-white/50 rounded-md">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation - Left */}
          <div className="hidden md:flex space-x-8 items-center">
            {leftLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-700 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Center Name Block - Yellow Box */}
          <div className="hidden md:flex mx-10 h-full items-center">
             <div className="bg-secondary h-24 px-8 flex items-center justify-center shadow-md transform translate-y-2 transition-transform hover:translate-y-3">
                <a 
                  href="#about" 
                  onClick={(e) => handleNavClick(e, '#about')}
                  className="text-2xl font-bold text-indigo-900 tracking-tight whitespace-nowrap cursor-pointer"
                >
                  {PROFILE.meta.name}
                </a>
             </div>
          </div>

          {/* Desktop Navigation - Right */}
          <div className="hidden md:flex space-x-8 items-center">
            {rightLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-700 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Name */}
          <div className="md:hidden ml-auto">
             <a 
               href="#about"
               onClick={(e) => handleNavClick(e, '#about')}
               className="font-bold text-xl text-indigo-900 bg-secondary px-4 py-2 rounded-sm shadow-sm cursor-pointer"
             >
              {PROFILE.meta.name}
             </a>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col py-4 px-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-gray-600 hover:text-primary font-medium text-lg border-b border-gray-50 pb-2"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;