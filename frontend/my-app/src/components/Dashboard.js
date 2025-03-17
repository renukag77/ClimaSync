import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating API call to backend
    const fetchData = async () => {
      try {
        // In a real app, this would be fetched from your backend
        const response = await fetch('/api/weather-data');
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
        
        // Use sample data for demonstration
        const sampleData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          temperatures: [7, 9, 12, 15, 18, 21, 24],
          humidity: [68, 65, 60, 55, 58, 52, 50],
          rainfall: [42, 38, 32, 25, 20, 15, 10]
        };
        setWeatherData(sampleData);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen text-lg font-medium text-gray-600">Loading weather data...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-lg font-medium text-red-600">{error}</div>;

  const temperatureData = {
    labels: weatherData.labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData.temperatures,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const humidityData = {
    labels: weatherData.labels,
    datasets: [
      {
        label: 'Humidity (%)',
        data: weatherData.humidity,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const rainfallData = {
    labels: weatherData.labels,
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: weatherData.rainfall,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weather Trends',
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Weather Data Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Average Temperature</h3>
          <p className="text-3xl font-bold text-pink-500">
            {(weatherData.temperatures.reduce((a, b) => a + b, 0) / weatherData.temperatures.length).toFixed(1)}°C
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Average Humidity</h3>
          <p className="text-3xl font-bold text-blue-500">
            {(weatherData.humidity.reduce((a, b) => a + b, 0) / weatherData.humidity.length).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <h3 className="text-lg font-medium text-gray-600 mb-2">Total Rainfall</h3>
          <p className="text-3xl font-bold text-teal-500">
            {weatherData.rainfall.reduce((a, b) => a + b, 0)}mm
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 overflow-hidden">
          <Line options={chartOptions} data={temperatureData} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 overflow-hidden">
          <Line options={chartOptions} data={humidityData} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 overflow-hidden">
          <Line options={chartOptions} data={rainfallData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;