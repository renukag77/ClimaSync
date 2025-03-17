import React, { useState, useEffect } from 'react';
import './Dashboard.css';
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

  if (loading) return <div className="loading">Loading weather data...</div>;
  if (error) return <div className="error-message">{error}</div>;

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
    <div className="dashboard">
      <h2>Weather Data Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Average Temperature</h3>
          <p className="stat-value">
            {(weatherData.temperatures.reduce((a, b) => a + b, 0) / weatherData.temperatures.length).toFixed(1)}°C
          </p>
        </div>
        <div className="stat-card">
          <h3>Average Humidity</h3>
          <p className="stat-value">
            {(weatherData.humidity.reduce((a, b) => a + b, 0) / weatherData.humidity.length).toFixed(1)}%
          </p>
        </div>
        <div className="stat-card">
          <h3>Total Rainfall</h3>
          <p className="stat-value">
            {weatherData.rainfall.reduce((a, b) => a + b, 0)}mm
          </p>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart">
          <Line options={chartOptions} data={temperatureData} />
        </div>
        <div className="chart">
          <Line options={chartOptions} data={humidityData} />
        </div>
        <div className="chart">
          <Line options={chartOptions} data={rainfallData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;