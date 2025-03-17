import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo">
        <img src="/logo192.png" alt="ClimaSync Logo" className="logo-img" />
        <h1>ClimaSync</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/data">Weather Data</Link></li>
        <li><Link to="/trends">Trend Analysis</Link></li>
        <li><Link to="/sorting">Sorting Visualizer</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;