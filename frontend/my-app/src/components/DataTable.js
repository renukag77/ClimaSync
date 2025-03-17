import React, { useState, useEffect } from 'react';
import './DataTable.css';
import { mergeSort, quickSort, measureSortingPerformance } from '../utils/sortingAlgorithms';

function DataTable() {
  const [weatherData, setWeatherData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [algorithm, setAlgorithm] = useState('mergeSort');
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    // Simulating API call to backend
    const fetchData = async () => {
      try {
        // In a real app, this would be fetched from your backend
        // const response = await fetch('/api/weather-data');
        // const data = await response.json();
        
        // Using sample data for now
        const data = [
          { id: 1, date: '2023-01-01', temperature: 5, humidity: 70, rainfall: 45 },
          { id: 2, date: '2023-01-02', temperature: 6, humidity: 68, rainfall: 42 },
          { id: 3, date: '2023-01-03', temperature: 7, humidity: 65, rainfall: 38 },
          { id: 4, date: '2023-01-04', temperature: 8, humidity: 62, rainfall: 35 },
          { id: 5, date: '2023-01-05', temperature: 9, humidity: 60, rainfall: 32 },
          { id: 6, date: '2023-01-06', temperature: 10, humidity: 58, rainfall: 30 },
          { id: 7, date: '2023-01-07', temperature: 12, humidity: 55, rainfall: 25 },
          { id: 8, date: '2023-01-08', temperature: 14, humidity: 52, rainfall: 20 },
          { id: 9, date: '2023-01-09', temperature: 16, humidity: 50, rainfall: 15 },
          { id: 10, date: '2023-01-10', temperature: 18, humidity: 48, rainfall: 10 },
        ];
        
        setWeatherData(data);
        sortData(data, sortBy, algorithm);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortData = (data, key, sortAlgorithm) => {
    const sortFunc = sortAlgorithm === 'mergeSort' ? mergeSort : quickSort;
    const result = measureSortingPerformance(sortFunc, [...data], key);
    
    setSortedData(result.sortedData);
    setPerformance({
      algorithm: sortAlgorithm,
      duration: result.duration,
      dataSize: data.length
    });
  };

  const handleSort = (key) => {
    setSortBy(key);
    sortData(weatherData, key, algorithm);
  };

  const handleAlgorithmChange = (e) => {
    const selectedAlgorithm = e.target.value;
    setAlgorithm(selectedAlgorithm);
    sortData(weatherData, sortBy, selectedAlgorithm);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvData = event.target.result;
          const parsedData = parseCSV(csvData);
          setWeatherData(parsedData);
          sortData(parsedData, sortBy, algorithm);
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim() !== '').map((line, index) => {
      const values = line.split(',');
      const entry = { id: index + 1 };
      
      headers.forEach((header, i) => {
        const value = values[i]?.trim();
        if (header === 'date') {
          entry[header] = value;
        } else {
          entry[header] = parseFloat(value);
        }
      });
      
      return entry;
    });
  };

  if (loading) return <div className="loading">Loading weather data...</div>;

  return (
    <div className="data-table-container">
      <h2>Weather Data Analysis</h2>
      
      <div className="controls">
        <div className="algorithm-selector">
          <label htmlFor="algorithm">Sorting Algorithm:</label>
          <select id="algorithm" value={algorithm} onChange={handleAlgorithmChange}>
            <option value="mergeSort">Merge Sort</option>
            <option value="quickSort">Quick Sort</option>
          </select>
        </div>
        
        <div className="data-upload">
          <label htmlFor="file-upload">Upload Weather Data CSV:</label>
          <input type="file" id="file-upload" accept=".csv" onChange={handleFileUpload} />
        </div>
      </div>
      
      {performance && (
        <div className="performance-metrics">
          <h3>Sorting Performance</h3>
          <p>Algorithm: {performance.algorithm === 'mergeSort' ? 'Merge Sort' : 'Quick Sort'}</p>
          <p>Execution Time: {performance.duration.toFixed(3)} ms</p>
          <p>Data Size: {performance.dataSize} records</p>
        </div>
      )}
      
      <div className="table-container">
        <table className="weather-table">
          <thead>
            <tr>
              <th>ID</th>
              <th onClick={() => handleSort('date')} className={sortBy === 'date' ? 'active-sort' : ''}>
                Date {sortBy === 'date' && '↓'}
              </th>
              <th onClick={() => handleSort('temperature')} className={sortBy === 'temperature' ? 'active-sort' : ''}>
                Temperature (°C) {sortBy === 'temperature' && '↓'}
              </th>
              <th onClick={() => handleSort('humidity')} className={sortBy === 'humidity' ? 'active-sort' : ''}>
                Humidity (%) {sortBy === 'humidity' && '↓'}
              </th>
              <th onClick={() => handleSort('rainfall')} className={sortBy === 'rainfall' ? 'active-sort' : ''}>
                Rainfall (mm) {sortBy === 'rainfall' && '↓'}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.date}</td>
                <td className={row.temperature > 15 ? 'high-temp' : row.temperature < 7 ? 'low-temp' : ''}>
                  {row.temperature}
                </td>
                <td className={row.humidity > 65 ? 'high-humidity' : ''}>{row.humidity}</td>
                <td className={row.rainfall > 40 ? 'heavy-rain' : row.rainfall < 20 ? 'light-rain' : ''}>
                  {row.rainfall}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;