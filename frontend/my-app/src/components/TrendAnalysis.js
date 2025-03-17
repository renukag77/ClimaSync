import React, { useState, useEffect } from 'react';
import './TrendAnalysis.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { mergeSort } from '../utils/sortingAlgorithms';

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
          { date: '2023-01-03', temperature: 7, humidity: 65, rainfall: 38 },
          { date: '2023-01-04', temperature: 8, humidity: 62, rainfall: 35 },
          { date: '2023-01-05', temperature: 9, humidity: 60, rainfall: 32 },
          { date: '2023-01-06', temperature: 10, humidity: 58, rainfall: 30 },
          { date: '2023-01-07', temperature: 12, humidity: 55, rainfall: 25 },
          { date: '2023-01-08', temperature: 14, humidity: 52, rainfall: 20 },
          { date: '2023-01-09', temperature: 16, humidity: 50, rainfall: 15 },
          { date: '2023-01-10', temperature: 18, humidity: 48, rainfall: 10 },
          { date: '2023-01-11', temperature: 17, humidity: 49, rainfall: 12 },
          { date: '2023-01-12', temperature: 16, humidity: 51, rainfall: 15 },
          { date: '2023-01-13', temperature: 15, humidity: 53, rainfall: 18 },
          { date: '2023-01-14', temperature: 14, humidity: 55, rainfall: 22 },
          { date: '2023-01-15', temperature: 13, humidity: 57, rainfall: 25 },
          { date: '2023-01-16', temperature: 12, humidity: 59, rainfall: 28 },
          { date: '2023-01-17', temperature: 11, humidity: 61, rainfall: 32 },
          { date: '2023-01-18', temperature: 10, humidity: 63, rainfall: 35 },
          { date: '2023-01-19', temperature: 9, humidity: 65, rainfall: 38 },
          { date: '2023-01-20', temperature: 8, humidity: 67, rainfall: 42 },
          { date: '2023-01-21', temperature: 7, humidity: 69, rainfall: 45 },
          { date: '2023-01-22', temperature: 6, humidity: 71, rainfall: 48 },
          { date: '2023-01-23', temperature: 5, humidity: 73, rainfall: 50 },
          { date: '2023-01-24', temperature: 4, humidity: 75, rainfall: 52 },
          { date: '2023-01-25', temperature: 3, humidity: 77, rainfall: 55 },
          { date: '2023-01-26', temperature: 2, humidity: 79, rainfall: 58 },
          { date: '2023-01-27', temperature: 1, humidity: 81, rainfall: 60 },
          { date: '2023-01-28', temperature: 2, humidity: 80, rainfall: 58 },
          { date: '2023-01-29', temperature: 3, humidity: 78, rainfall: 55 },
          { date: '2023-01-30', temperature: 4, humidity: 75, rainfall: 52 },
        ];
        
        setWeatherData(data);
        analyzeData(data, selectedMetric);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const analyzeData = (data, metric) => {
    // Sort data by selected metric using Merge Sort
    const sortedByMetric = mergeSort([...data], metric);
    
    // Calculate statistics
    const values = data.map(item => item[metric]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calculate median (using sorted data)
    const middle = Math.floor(sortedByMetric.length / 2);
    const median = sortedByMetric.length % 2 === 0
      ? (sortedByMetric[middle - 1][metric] + sortedByMetric[middle][metric]) / 2
      : sortedByMetric[middle][metric];
    
    // Determine trend (simple linear regression)
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((sum, i) => sum + i, 0);
    const sumY = values.reduce((sum, y) => sum + y, 0);
    const sumXY = indices.reduce((sum, i) => sum + i * values[i], 0);
    const sumXX = indices.reduce((sum, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    let trendLabel = 'stable';
    if (slope > 0.5) trendLabel = 'rising rapidly';
    else if (slope > 0.1) trendLabel = 'rising slowly';
    else if (slope < -0.5) trendLabel = 'falling rapidly';
    else if (slope < -0.1) trendLabel = 'falling slowly';
    
    setTrends({
      min,
      max,
      avg,
      median,
      trend: trendLabel,
      slope
    });
  };

  const handleMetricChange = (e) => {
    const metric = e.target.value;
    setSelectedMetric(metric);
    analyzeData(weatherData, metric);
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

  if (loading) return <div className="loading">Loading trend data...</div>;

  return (
    <div className="trend-analysis">
      <h2>Weather Trend Analysis</h2>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="metric">Weather Metric:</label>
          <select id="metric" value={selectedMetric} onChange={handleMetricChange}>
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="rainfall">Rainfall</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="timeRange">Time Range:</label>
          <select id="timeRange" value={timeRange} onChange={handleTimeRangeChange}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="trend-stats">
        <div className="stat-card">
          <h3>Minimum</h3>
          <p className="stat-value">{trends.min.toFixed(1)}</p>
        </div>
        <div className="stat-card">
          <h3>Maximum</h3>
          <p className="stat-value">{trends.max.toFixed(1)}</p>
        </div>
        <div className="stat-card">
          <h3>Average</h3>
          <p className="stat-value">{trends.avg.toFixed(1)}</p>
        </div>
        <div className="stat-card">
          <h3>Median</h3>
          <p className="stat-value">{trends.median.toFixed(1)}</p>
        </div>
        <div className="stat-card trend">
          <h3>Trend</h3>
          <p className={`stat-value trend-${trends.trend.replace(/\s+/g, '-')}`}>
            {trends.trend}
          </p>
        </div>
      </div>
      
      <div className="chart-container">
        <Line options={chartOptions} data={getChartData()} />
      </div>
      
      <div className="trend-analysis-summary">
        <h3>Analysis Summary</h3>
        <p>
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