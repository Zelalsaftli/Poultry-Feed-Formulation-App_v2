import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onGoHome,
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
        setIsHelpOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleHelpNavigate = (page: Page) => {
    onNavigate(page);
    setIsHelpOpen(false);
  };

  const navLinks = [
    { page: Page.SELECTION, label: 'Ingredient Database' },
    { page: Page.ENZYME_MANAGER, label: 'Enzyme Manager' },
    { page: Page.INPUT, label: 'Feed Formulation' },
    { page: Page.ANALYSIS, label: 'Feed Analysis' },
    { page: Page.VITAMIN_PREMIX, label: 'Vitamin Premix' },
    { page: Page.MINERAL_PREMIX, label: 'Mineral Premix' },
    { page: Page.PERFORMANCE_ANALYSIS, label: 'Performance Analysis' },
  ];

  return (
    <header className="bg-white shadow-md w-full no-print">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
             <button
              onClick={onGoHome}
              className="text-gray-500 hover:text-teal-600 transition-colors"
              aria-label="Go to Home Screen"
              title="Go to Home Screen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map(link => (
                  <button
                    key={link.page}
                    onClick={() => onNavigate(link.page)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === link.page ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {link.label}
                  </button>
              ))}
              
              {/* Help Dropdown */}
              <div className="relative" ref={helpMenuRef}>
                <button
                  onClick={() => setIsHelpOpen(!isHelpOpen)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <span>Help</span>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isHelpOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); handleHelpNavigate(Page.HOW_ANALYSIS_WORKS); }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        How Analysis Works
                      </a>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); handleHelpNavigate(Page.INTERPRET_RESULTS); }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        How to Interpret Results
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </nav>
            <button
              onClick={onGoHome}
              className="hidden md:flex items-center gap-2 rounded-md bg-red-500 py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Exit to start screen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;