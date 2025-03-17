// components/Dashboard.js
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [weatherStats, setWeatherStats] = useState({
    avgTemperature: 0,
    avgHumidity: 0,
    avgPressure: 0,
    cities: [],
    lastUpdated: null,
    loading: true
  });
  
  const [selectedCity, setSelectedCity] = useState('All');

  // Simulated data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, replace this with your actual API call
        // const response = await fetch('http://127.0.0.1:8000/weather/stats');
        // const data = await response.json();
        
        // Simulated data
        setTimeout(() => {
          setWeatherStats({
            avgTemperature: 28.3,
            avgHumidity: 74.2,
            avgPressure: 1012.5,
            cities: ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata'],
            lastUpdated: new Date().toLocaleString(),
            loading: false
          });
        }, 800);
      } catch (error) {
        console.error("Error fetching weather stats:", error);
        setWeatherStats(prev => ({...prev, loading: false}));
      }
    };
    
    fetchData();
  }, []);

  // Calculate weather status based on temperature
  const getWeatherStatus = (temp) => {
    if (temp > 30) return { status: "Hot", color: "text-red-500" };
    if (temp > 25) return { status: "Warm", color: "text-orange-400" };
    if (temp > 20) return { status: "Pleasant", color: "text-green-500" };
    if (temp > 15) return { status: "Cool", color: "text-blue-400" };
    return { status: "Cold", color: "text-blue-600" };
  };

  const { status, color } = getWeatherStatus(weatherStats.avgTemperature);

  // Weather Cards Data
  const cards = [
    {
      title: "Temperature",
      value: `${weatherStats.avgTemperature}°C`,
      icon: "☀️",
      bgColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
      details: `Status: ${status}`
    },
    {
      title: "Humidity",
      value: `${weatherStats.avgHumidity}%`,
      icon: "💧",
      bgColor: "bg-gradient-to-r from-blue-400 to-blue-600",
      details: weatherStats.avgHumidity > 70 ? "High Humidity" : "Normal Humidity"
    },
    {
      title: "Pressure",
      value: `${weatherStats.avgPressure} hPa`,
      icon: "🌡️",
      bgColor: "bg-gradient-to-r from-purple-400 to-purple-600",
      details: "Atmospheric Pressure"
    }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Weather Forecast Dashboard</h1>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="mr-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Cities</option>
              {weatherStats.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Refresh Data
            </button>
          </div>
        </div>
        
        {weatherStats.loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {cards.map((card, index) => (
                <div key={index} className={`${card.bgColor} rounded-lg shadow-lg p-6 text-white`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    <span className="text-3xl">{card.icon}</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">{card.value}</div>
                  <p className="text-white text-opacity-90">{card.details}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Last updated: {weatherStats.lastUpdated}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">Current weather:</span>
                  <span className={`font-medium ${color}`}>{status}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Quick Navigation</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Data Table', 'Sorting Visualizer', 'Trend Analysis', 'Forecast'].map((item, index) => (
              <button 
                key={index}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Weather Alerts</h2>
          <div className="space-y-3">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
              <div className="flex items-center">
                <div className="text-yellow-500 mr-2 text-xl">⚠️</div>
                <div>
                  <p className="font-medium">Heavy Rain Warning</p>
                  <p className="text-sm text-gray-600">Expected in Mumbai region tomorrow</p>
                </div>
              </div>
            </div>
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <div className="text-red-500 mr-2 text-xl">🌡️</div>
                <div>
                  <p className="font-medium">Heat Wave Alert</p>
                  <p className="text-sm text-gray-600">Chennai area for the next 3 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;