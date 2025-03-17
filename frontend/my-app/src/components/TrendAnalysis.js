import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function TrendAnalysis() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [timeRange, setTimeRange] = useState('month');
  const [trends, setTrends] = useState({
    min: 0,
    max: 0,
    avg: 0,
    median: 0,
    trend: 'stable'
  });

  useEffect(() => {
    // Simulating API call to backend
    const fetchData = async () => {
      try {
        // Sample data for demonstration
        const data = [
          { date: '2023-01-01', temperature: 5, humidity: 70, rainfall: 45 },
          { date: '2023-01-02', temperature: 6, humidity: 68, rainfall: 42 },
          // ... other data points
          { date: '2023-01-30', temperature: 4, humidity: 75, rainfall: 52 },
        ];
        
        setWeatherData(data);
        // Assume analyzeData is handled by your backend
        setTrends({
          min: 1,
          max: 18,
          avg: 8.5,
          median: 7.5,
          trend: 'stable'
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMetricChange = (e) => {
    const metric = e.target.value;
    setSelectedMetric(metric);
    // In a real app, you would call your backend here
    // fetchAnalysisFromBackend(weatherData, metric);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
    // In a real app, you would fetch new data based on the time range
  };

  const getMetricLabel = (metric) => {
    switch(metric) {
      case 'temperature': return 'Temperature (°C)';
      case 'humidity': return 'Humidity (%)';
      case 'rainfall': return 'Rainfall (mm)';
      default: return metric;
    }
  };

  const getMetricColor = (metric) => {
    switch(metric) {
      case 'temperature': return 'rgb(255, 99, 132)';
      case 'humidity': return 'rgb(53, 162, 235)';
      case 'rainfall': return 'rgb(75, 192, 192)';
      default: return 'rgb(153, 102, 255)';
    }
  };

  const getChartData = () => {
    const labels = weatherData.map(item => item.date);
    const data = weatherData.map(item => item[selectedMetric]);
    
    return {
      labels,
      datasets: [
        {
          label: getMetricLabel(selectedMetric),
          data,
          borderColor: getMetricColor(selectedMetric),
          backgroundColor: `${getMetricColor(selectedMetric)}33`,
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${getMetricLabel(selectedMetric)} Trends Over Time`,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: selectedMetric !== 'temperature',
        title: {
          display: true,
          text: getMetricLabel(selectedMetric)
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  // Helper function to get trend color classes
  const getTrendColorClass = (trend) => {
    switch(trend) {
      case 'rising rapidly': return 'text-red-600';
      case 'rising slowly': return 'text-orange-500';
      case 'falling rapidly': return 'text-blue-600';
      case 'falling slowly': return 'text-blue-400';
      default: return 'text-gray-600';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-600">Loading trend data...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Weather Trend Analysis</h2>
      
      <div className="flex flex-wrap justify-between mb-8 gap-4">
        <div className="flex items-center">
          <label htmlFor="metric" className="mr-2 text-gray-700 font-medium">Weather Metric:</label>
          <select 
            id="metric" 
            value={selectedMetric} 
            onChange={handleMetricChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="rainfall">Rainfall</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="timeRange" className="mr-2 text-gray-700 font-medium">Time Range:</label>
          <select 
            id="timeRange" 
            value={timeRange} 
            onChange={handleTimeRangeChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Minimum</h3>
          <p className="text-2xl font-bold text-gray-900">{trends.min.toFixed(1)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Maximum</h3>
          <p className="text-2xl font-bold text-gray-900">{trends.max.toFixed(1)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Average</h3>
          <p className="text-2xl font-bold text-gray-900">{trends.avg.toFixed(1)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Median</h3>
          <p className="text-2xl font-bold text-gray-900">{trends.median.toFixed(1)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Trend</h3>
          <p className={`text-2xl font-bold ${getTrendColorClass(trends.trend)}`}>
            {trends.trend}
          </p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <Line options={chartOptions} data={getChartData()} />
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Summary</h3>
        <p className="text-gray-700 leading-relaxed">
          The {getMetricLabel(selectedMetric).toLowerCase()} data shows a {trends.trend} trend over the selected time period.
          With values ranging from {trends.min.toFixed(1)} to {trends.max.toFixed(1)}, the average is {trends.avg.toFixed(1)}.
          {selectedMetric === 'temperature' && trends.max > 15 && (
            <span> There are several days with high temperatures that could indicate unusual weather patterns.</span>
          )}
          {selectedMetric === 'rainfall' && trends.max > 50 && (
            <span> The high rainfall measurements suggest potential flood risks in certain periods.</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default TrendAnalysis;