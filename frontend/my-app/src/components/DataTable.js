import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DataTable = () => {
  const [city, setCity] = useState("Chennai");
  const [parameter, setParameter] = useState("Temperature");
  const [algo, setAlgo] = useState("merge");
  const [order, setOrder] = useState("desc");
  const [topN, setTopN] = useState(10);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // List of all cities
  const cities = [
    "Ahmedabad",
    "Bangalore",
    "Chennai",
    "Delhi",
    "Hyderabad",
    "Jaipur",
    "Kolkata",
    "Lucknow",
    "Mumbai",
    "Pune"
  ];

  // Common weather parameters for autocomplete
  const commonParameters = [
    "Temperature",
    "Humidity",
    "Wind Speed",
    "Precipitation",
    "Air Quality",
    "Pressure"
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    const url = `http://127.0.0.1:8000/filter?city=${city}&parameter=${parameter}&algo=${algo}&top_n=${topN}&order=${order}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const tableHeaders = result.length > 0 ? Object.keys(result[0]) : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8 font-sans">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">Weather Data Explorer</h1>
        <p className="text-gray-600">Analyze and visualize weather patterns across major Indian cities</p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 md:w-1/3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Filter Options</h2>
            
            <motion.div className="space-y-5" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 appearance-none"
                  >
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parameter
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={parameter}
                    onChange={(e) => setParameter(e.target.value)}
                    list="parameters"
                    placeholder="e.g. Temperature"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <datalist id="parameters">
                    {commonParameters.map(param => (
                      <option key={param} value={param} />
                    ))}
                  </datalist>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Algorithm
                </label>
                <div className="flex gap-3">
                  <div className={`flex-1 p-3 rounded-lg cursor-pointer transition-all border ${algo === 'merge' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`} onClick={() => setAlgo('merge')}>
                    <div className="flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full border ${algo === 'merge' ? 'bg-indigo-500 border-indigo-600' : 'border-gray-400'} mr-2`}></div>
                      <span>Merge Sort</span>
                    </div>
                  </div>
                  <div className={`flex-1 p-3 rounded-lg cursor-pointer transition-all border ${algo === 'quick' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`} onClick={() => setAlgo('quick')}>
                    <div className="flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full border ${algo === 'quick' ? 'bg-indigo-500 border-indigo-600' : 'border-gray-400'} mr-2`}></div>
                      <span>Quick Sort</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <div className="flex gap-3">
                  <div className={`flex-1 p-3 rounded-lg cursor-pointer transition-all border ${order === 'desc' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`} onClick={() => setOrder('desc')}>
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                      <span>Descending</span>
                    </div>
                  </div>
                  <div className={`flex-1 p-3 rounded-lg cursor-pointer transition-all border ${order === 'asc' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'}`} onClick={() => setOrder('asc')}>
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                      </svg>
                      <span>Ascending</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Top N Rows
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={topN}
                    onChange={(e) => setTopN(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-600">1</span>
                    <span className="text-sm font-medium text-indigo-700">{topN}</span>
                    <span className="text-xs text-gray-600">50</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors duration-200 focus:ring-4 focus:ring-indigo-300 focus:outline-none`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                      <span>Get Data</span>
                    </div>
                  )}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="md:w-2/3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 shadow-sm border border-red-200"
              >
                <div className="flex">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </div>
              </motion.div>
            )}

            {result.length > 0 ? (
              <motion.div 
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">Results</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Showing top {result.length} records for {parameter} in {city}
                  </p>
                  </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        {tableHeaders.map((header) => (
                          <th
                            key={header}
                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {result.map((row, idx) => (
                        <motion.tr 
                          key={idx}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.3 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {tableHeaders.map((header) => (
                            <td
                              key={header}
                              className="py-4 px-4 text-sm text-gray-800"
                            >
                              {row[header]}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : !loading && !error ? (
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-indigo-100 p-4 rounded-full mb-5">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">No Data Yet</h3>
                <p className="text-gray-600 mb-6">Adjust your filter settings and click 'Get Data' to view results</p>
                <div className="flex flex-wrap gap-3 justify-center text-sm text-gray-500">
                  <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-200">Selected City: {city}</span>
                  <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-200">Parameter: {parameter}</span>
                  <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-200">Algorithm: {algo}</span>
                </div>
              </motion.div>
            ) : null}

            {loading && (
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-12 text-center flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="relative">
                  <div className="h-20 w-20">
                    <svg className="animate-spin h-full w-full text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mt-6 mb-2">Fetching Data</h3>
                <p className="text-gray-600">Please wait while we process your request</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Weather info summary card */}
        {result.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tableHeaders.includes(parameter) && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-600 mb-1">Maximum {parameter}</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {Math.max(...result.map(item => parseFloat(item[parameter]) || 0)).toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-green-600 mb-1">Minimum {parameter}</p>
                    <p className="text-2xl font-bold text-green-800">
                      {Math.min(...result.map(item => parseFloat(item[parameter]) || 0)).toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-sm text-purple-600 mb-1">Average {parameter}</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {(result.reduce((acc, item) => acc + (parseFloat(item[parameter]) || 0), 0) / result.length).toFixed(1)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>Weather Data Explorer &copy; {new Date().getFullYear()}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default DataTable;