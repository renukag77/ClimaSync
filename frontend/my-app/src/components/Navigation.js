import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md py-3 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <img src="./ClimaSync2.png" alt="ClimaSync Logo" className="w-10 h-10 mr-3" />
          <h1 className="text-white text-xl font-bold">ClimaSync</h1>
        </div>
        <ul className="flex flex-wrap justify-center space-x-1 md:space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/data" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Weather Data
            </Link>
          </li>
          <li>
            <Link to="/trends" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Trend Analysis
            </Link>
          </li>
          <li>
            <Link to="/sorting" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Sorting Visualizer
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;