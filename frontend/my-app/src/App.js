import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import TrendAnalysis from './components/TrendAnalysis';
import SortingVisualizer from './components/SortingVisualizer';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data" element={<DataTable />} />
            <Route path="/trends" element={<TrendAnalysis />} />
            <Route path="/sorting" element={<SortingVisualizer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;