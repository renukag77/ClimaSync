import React, { useState, useEffect } from 'react';

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
        setSortedData(data); // Assuming you'll sort this with your backend logic
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    setSortBy(key);
    // Call your backend sorting function here
    // sortData(weatherData, key, algorithm);
  };

  const handleAlgorithmChange = (e) => {
    const selectedAlgorithm = e.target.value;
    setAlgorithm(selectedAlgorithm);
    // Call your backend sorting function here
    // sortData(weatherData, sortBy, selectedAlgorithm);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvData = event.target.result;
          // Call your CSV parsing function here
          // const parsedData = parseCSV(csvData);
          // setWeatherData(parsedData);
          // sortData(parsedData, sortBy, algorithm);
        } catch (error) {
          console.error('Error parsing CSV:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-40 text-gray-600">Loading weather data...</div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 my-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Weather Data Analysis</h2>
      
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="algorithm" className="block text-sm font-medium text-gray-700 mb-1">Sorting Algorithm:</label>
          <select 
            id="algorithm" 
            value={algorithm} 
            onChange={handleAlgorithmChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mergeSort">Merge Sort</option>
            <option value="quickSort">Quick Sort</option>
          </select>
        </div>
        
        <div className="w-full md:w-1/2">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload Weather Data CSV:</label>
          <input 
            type="file" 
            id="file-upload" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {performance && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Sorting Performance</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded shadow">
              <p className="text-xs text-gray-500">Algorithm</p>
              <p className="font-medium">{performance.algorithm === 'mergeSort' ? 'Merge Sort' : 'Quick Sort'}</p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-xs text-gray-500">Execution Time</p>
              <p className="font-medium">{performance.duration?.toFixed(3)} ms</p>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <p className="text-xs text-gray-500">Data Size</p>
              <p className="font-medium">{performance.dataSize} records</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
              <th 
                onClick={() => handleSort('date')} 
                className={`px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 ${sortBy === 'date' ? 'bg-gray-200' : ''}`}
              >
                Date {sortBy === 'date' && '↓'}
              </th>
              <th 
                onClick={() => handleSort('temperature')} 
                className={`px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 ${sortBy === 'temperature' ? 'bg-gray-200' : ''}`}
              >
                Temperature (°C) {sortBy === 'temperature' && '↓'}
              </th>
              <th 
                onClick={() => handleSort('humidity')} 
                className={`px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 ${sortBy === 'humidity' ? 'bg-gray-200' : ''}`}
              >
                Humidity (%) {sortBy === 'humidity' && '↓'}
              </th>
              <th 
                onClick={() => handleSort('rainfall')} 
                className={`px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 ${sortBy === 'rainfall' ? 'bg-gray-200' : ''}`}
              >
                Rainfall (mm) {sortBy === 'rainfall' && '↓'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{row.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
                <td className={`px-4 py-3 text-sm ${
                  row.temperature > 15 ? 'text-red-600 font-medium' : 
                  row.temperature < 7 ? 'text-blue-600 font-medium' : 'text-gray-900'
                }`}>
                  {row.temperature}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  row.humidity > 65 ? 'text-indigo-600 font-medium' : 'text-gray-900'
                }`}>
                  {row.humidity}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  row.rainfall > 40 ? 'text-purple-600 font-medium' : 
                  row.rainfall < 20 ? 'text-green-600 font-medium' : 'text-gray-900'
                }`}>
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