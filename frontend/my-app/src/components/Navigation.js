import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg py-4 px-4 md:px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <img src="/logo192.png" alt="ClimaSync Logo" className="w-10 h-10 mr-3 transition-transform duration-300 hover:scale-110" />
          <h1 className="text-white text-xl font-bold tracking-tight">
            <span className="text-blue-200">Clima</span>Sync
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex space-x-1">
            {[
              { name: 'Dashboard', path: '/' },
              { name: 'Weather Data', path: '/data' },
              { name: 'Trend Analysis', path: '/trends' },
              { name: 'Sorting Visualizer', path: '/sorting' }
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out flex items-center ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-600/30 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-blue-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-2 animate-fadeIn">
          <ul className="flex flex-col space-y-2">
            {[
              { name: 'Dashboard', path: '/' },
              { name: 'Weather Data', path: '/data' },
              { name: 'Trend Analysis', path: '/trends' },
              { name: 'Sorting Visualizer', path: '/sorting' }
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition duration-200 ease-in-out ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-100 hover:bg-blue-600/30 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navigation;