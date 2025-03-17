import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';

const SortingVisualizer = () => {
  const [city, setCity] = useState("Chennai");
  const [parameter, setParameter] = useState("Temperature");
  const [algo, setAlgo] = useState("merge");
  const [order, setOrder] = useState("desc");
  const [topN, setTopN] = useState(10);
  const [originalData, setOriginalData] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [magnificationFactor, setMagnificationFactor] = useState(15);
  const [colorScheme, setColorScheme] = useState("gradient");

  const handleSubmit = async () => {
    const url = `http://127.0.0.1:8000/filter?city=${city}&parameter=${parameter}&algo=${algo}&top_n=${topN}&order=${order}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const values = data.map((item) => parseFloat(item[parameter]));
      setOriginalData(values);
      setSteps([]);
      setCurrentStep(0);
      setIsRunning(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Something went wrong. Check console.");
    }
  };

  const startSorting = () => {
    if (originalData.length === 0) return;
    
    setIsRunning(true);
    if (algo === "merge") {
      visualizeMergeSort([...originalData]);
    } else if (algo === "quick") {
      visualizeQuickSort([...originalData]);
    }
  };

  const resetVisualization = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const visualizeMergeSort = (arr) => {
    const newSteps = [];
    newSteps.push([...arr]); // Initial state
    
    const mergeSort = (array, left, right) => {
      if (left >= right) return;
      const mid = Math.floor((left + right) / 2);
      mergeSort(array, left, mid);
      mergeSort(array, mid + 1, right);
      merge(array, left, mid, right);
    };

    const merge = (array, left, mid, right) => {
      let temp = [];
      let i = left;
      let j = mid + 1;

      while (i <= mid && j <= right) {
        if (array[i] < array[j]) {
          temp.push(array[i++]);
        } else {
          temp.push(array[j++]);
        }
      }

      while (i <= mid) temp.push(array[i++]);
      while (j <= right) temp.push(array[j++]);

      for (let k = left; k <= right; k++) {
        array[k] = temp[k - left];
      }

      // Push step
      newSteps.push([...array]);
    };

    const copy = [...arr];
    mergeSort(copy, 0, copy.length - 1);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const visualizeQuickSort = (arr) => {
    const newSteps = [];
    newSteps.push([...arr]); // Initial state
    
    const quickSort = (array, left, right) => {
      if (left >= right) return;
      
      const pivotIndex = partition(array, left, right);
      quickSort(array, left, pivotIndex - 1);
      quickSort(array, pivotIndex + 1, right);
    };

    const partition = (array, left, right) => {
      const pivot = array[right];
      let i = left - 1;
      
      for (let j = left; j < right; j++) {
        if (array[j] <= pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      
      [array[i + 1], array[right]] = [array[right], array[i + 1]];
      newSteps.push([...array]);
      
      return i + 1;
    };

    const copy = [...arr];
    quickSort(copy, 0, copy.length - 1);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  // Handle animation
  useEffect(() => {
    let intervalId;
    
    if (isRunning && steps.length > 0) {
      intervalId = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(intervalId);
            setIsRunning(false);
            return prev;
          }
          return prev + 1;
        });
      }, animationSpeed);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [steps, isRunning, animationSpeed]);

  // Function to get visualization stats for the current step
  const getVisualizationStats = () => {
    if (steps.length === 0 || currentStep >= steps.length) {
      return { min: 0, max: 100, baseHeight: 0 };
    }
    
    const values = steps[currentStep];
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Calculate a base height (minimum height all bars will have)
    const baseHeight = min * 0.8; // 80% of the minimum value
    
    return { min, max, baseHeight };
  };

  const { min, max, baseHeight } = getVisualizationStats();

  // Color schemes for bars
  const colorSchemes = {
    gradient: (index, value, min, max) => {
      // Calculate relative position (0-1) of value between min and max
      const ratio = (value - min) / (max - min);
      const hue = 240 - ratio * 240; // Blue (240) to Red (0)
      return `hsl(${hue}, 80%, 60%)`;
    },
    rainbow: (index, value, min, max) => {
      // Create rainbow pattern based on index
      const hue = (index * 30) % 360;
      return `hsl(${hue}, 80%, 60%)`;
    },
    categorical: (index, value, min, max) => {
      // Use distinct categorical colors
      const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33F5", 
        "#33FFF5", "#F5FF33", "#FF5733", "#C733FF",
        "#33C7FF", "#FFC733", "#33FF8D", "#FF338D"
      ];
      return colors[index % colors.length];
    }
  };

  // Patterns for bars
  const patterns = [
    { pattern: "solid" },
    { pattern: "striped" },
    { pattern: "dotted" },
    { pattern: "dashed" },
    { pattern: "gradient" }
  ];

  // Create a unique style for each bar
  const getBarStyle = (index, value) => {
    const baseColor = colorSchemes[colorScheme](index, value, min, max);
    const patternType = patterns[index % patterns.length].pattern;
    
    let background = baseColor;
    const lighterColor = `hsl(${parseInt(baseColor.replace('hsl(', '').split(',')[0])}, 80%, 75%)`;
    
    if (patternType === "striped") {
      background = `repeating-linear-gradient(45deg, ${baseColor}, ${baseColor} 8px, ${lighterColor} 8px, ${lighterColor} 16px)`;
    } else if (patternType === "dotted") {
      background = `radial-gradient(circle, ${lighterColor} 2px, ${baseColor} 2px)`;
      background += ` 0 0/8px 8px`;
    } else if (patternType === "dashed") {
      background = `repeating-linear-gradient(90deg, ${baseColor}, ${baseColor} 12px, ${lighterColor} 12px, ${lighterColor} 18px)`;
    } else if (patternType === "gradient") {
      background = `linear-gradient(to top, ${baseColor}, ${lighterColor})`;
    }
    
    return {
      background,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "4px 4px 0 0"
    };
  };

  return (
    <div className="p-6 font-sans bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Sorting Algorithm Visualizer</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-2 font-medium">Algorithm:</p>
          <select 
            value={algo} 
            onChange={(e) => setAlgo(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-2 font-medium">Sort By:</p>
          <select 
            value={parameter} 
            onChange={(e) => setParameter(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Temperature">Temperature</option>
            <option value="Humidity">Humidity</option>
            <option value="Pressure">Pressure</option>
          </select>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-2 font-medium">Color Scheme:</p>
          <select 
            value={colorScheme} 
            onChange={(e) => setColorScheme(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="gradient">Temperature Gradient</option>
            <option value="rainbow">Rainbow</option>
            <option value="categorical">Categorical</option>
          </select>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-2 font-medium">Speed: <span className="text-gray-500 text-sm">{Math.round(100 / (animationSpeed / 1000))}x</span></p>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={2100 - animationSpeed}
            onChange={(e) => setAnimationSpeed(2100 - parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-2 font-medium">Data Size:</p>
          <select 
            value={topN} 
            onChange={(e) => setTopN(parseInt(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5 items</option>
            <option value="10">10 items</option>
            <option value="15">15 items</option>
            <option value="20">20 items</option>
          </select>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="mb-2 font-medium">Magnification: <span className="text-gray-500 text-sm">{magnificationFactor}x</span></p>
          <input
            type="range"
            min="1"
            max="30"
            value={magnificationFactor}
            onChange={(e) => setMagnificationFactor(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button 
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all"
        >
          Fetch Data
        </button>
        
        <button 
          onClick={startSorting}
          disabled={isRunning || originalData.length === 0}
          className={`px-6 py-3 text-white rounded-lg shadow-md transition-all ${
            isRunning || originalData.length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Start Sorting
        </button>
        
        <button 
          onClick={resetVisualization}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-md transition-all"
        >
          Reset
        </button>
      </div>
      
      <div className="border rounded-xl p-6 mb-6 bg-white shadow-lg h-96">
        {steps.length > 0 && (
          <div className="flex items-end justify-center gap-3 h-full">
            {steps[currentStep].map((val, i) => {
              // Exaggerate differences by magnifying only the part above baseHeight
              const baseHeightPercent = 15; // Fixed base height percentage
              const differenceHeight = magnificationFactor * (val - min);
              const totalHeight = baseHeightPercent + differenceHeight;
              
              // Cap at 95% to leave room for the label
              const cappedHeight = Math.min(totalHeight, 95);
              
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-xs mb-1 font-bold">{val.toFixed(2)}</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${cappedHeight}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: "40px",
                      position: "relative",
                      border: "1px solid rgba(0,0,0,0.2)",
                      ...getBarStyle(i, val)
                    }}
                    className="flex items-end justify-center"
                  >
                    {/* Highlight current position */}
                    <div className="absolute top-0 w-full h-1 bg-black"></div>
                    
                    {/* Base height indicator */}
                    {baseHeightPercent > 0 && (
                      <div 
                        className="absolute w-full h-px bg-gray-400"
                        style={{ bottom: `${baseHeightPercent}%` }}
                        ></div>
                      )}
                    </motion.div>
                    <div className="text-xs mt-1">{i + 1}</div>
                  </div>
                );
              })}
            </div>
          )}
          {steps.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No data to visualize. Please fetch data first.</p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Progress:</p>
            <p className="text-sm text-gray-600">
              Step {currentStep} of {steps.length - 1}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ 
                width: steps.length > 1 
                  ? `${(currentStep / (steps.length - 1)) * 100}%` 
                  : '0%' 
              }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-blue-800">Algorithm Information</h3>
          <div className="prose max-w-none">
            {algo === "merge" && (
              <>
                <h4>Merge Sort</h4>
                <p>Time Complexity: O(n log n)</p>
                <p>Space Complexity: O(n)</p>
                <p>
                  Merge sort is a divide-and-conquer algorithm that divides the input array into two halves, 
                  recursively sorts them, and then merges the sorted halves.
                </p>
              </>
            )}
            {algo === "quick" && (
              <>
                <h4>Quick Sort</h4>
                <p>Time Complexity: O(n log n) average case, O(n²) worst case</p>
                <p>Space Complexity: O(log n)</p>
                <p>
                  Quick sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element and 
                  partitioning the array around the pivot so that elements smaller than the pivot are on the 
                  left and elements greater are on the right.
                </p>
              </>
            )}
          </div>
        </div>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Sorting Algorithm Visualizer © {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  };
  
  export default SortingVisualizer;
                      