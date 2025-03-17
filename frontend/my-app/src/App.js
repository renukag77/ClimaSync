import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import DataTable from "./components/DataTable";
import Visualizer from "./components/SortingVisualizer";
import TrendAnalysis from "./components/TrendAnalysis";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={
              <div>
                <Dashboard />
              </div>
            } />
            <Route path="/data" element={<DataTable />} />
            <Route path="/trends" element={<TrendAnalysis />} />
            <Route path="/sorting" element={<Visualizer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;