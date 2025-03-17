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
  const [magnificationFactor, setMagnificationFactor] = useState(30); // Increased default value
  const [colorScheme, setColorScheme] = useState("gradient");
  const [scaleFactor, setScaleFactor] = useState(0.005); // Decreased default for better scaling
  const [barWidth, setBarWidth] = useState(60); // New state for bar width

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

  // Enhanced color schemes for bars
  const colorSchemes = {
    gradient: (index, value, min, max) => {
      // Calculate relative position (0-1) of value between min and max
      const ratio = (value - min) / (max - min);
      const hue = 240 - ratio * 240; // Blue (240) to Red (0)
      return `hsl(${hue}, 100%, 50%)`; // Increased saturation and lightness
    },
    rainbow: (index, value, min, max) => {
      // Create rainbow pattern based on index
      const hue = (index * 30) % 360;
      return `hsl(${hue}, 100%, 50%)`; // Increased saturation
    },
    categorical: (index, value, min, max) => {
      // Use distinct bright categorical colors
      const colors = [
        "#FF3333", "#33FF33", "#3333FF", "#FF33FF", 
        "#33FFFF", "#FFFF33", "#FF8833", "#8833FF",
        "#33FF88", "#FF3388", "#88FF33", "#3388FF"
      ];
      return colors[index % colors.length];
    }
  };

  // Patterns for bars with more pronounced differences
  const patterns = [
    { pattern: "solid" },
    { pattern: "striped" },
    { pattern: "dotted" },
    { pattern: "dashed" },
    { pattern: "gradient" }
  ];

  // Create a unique style for each bar with more pronounced differences
  const getBarStyle = (index, value) => {
    const baseColor = colorSchemes[colorScheme](index, value, min, max);
    const patternType = patterns[index % patterns.length].pattern;
    
    let background = baseColor;
    const lighterColor = `hsl(${parseInt(baseColor.replace('hsl(', '').split(',')[0])}, 100%, 75%)`;
    
    if (patternType === "striped") {
      background = `repeating-linear-gradient(45deg, ${baseColor}, ${baseColor} 10px, ${lighterColor} 10px, ${lighterColor} 20px)`;
    } else if (patternType === "dotted") {
      background = `radial-gradient(circle, ${lighterColor} 3px, ${baseColor} 3px)`;
      background += ` 0 0/10px 10px`;
    } else if (patternType === "dashed") {
      background = `repeating-linear-gradient(90deg, ${baseColor}, ${baseColor} 15px, ${lighterColor} 15px, ${lighterColor} 25px)`;
    } else if (patternType === "gradient") {
      background = `linear-gradient(to top, ${baseColor}, ${lighterColor})`;
    }
    
    return {
      background,
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)", // Enhanced shadow
      borderRadius: "6px 6px 0 0", // Rounded top corners
      border: "2px solid rgba(0,0,0,0.2)" // Added border
    };
  };

  return (
    <div className="p-6 font-sans bg-gray-100">
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-800">Sorting Algorithm Visualizer</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-lg">
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
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
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
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
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
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
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
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
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
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="mb-2 font-medium">Magnification: <span className="text-gray-500 text-sm">{magnificationFactor}x</span></p>
          <input
            type="range"
            min="10"
            max="100"
            value={magnificationFactor}
            onChange={(e) => setMagnificationFactor(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Scale factor with adjusted range */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="mb-2 font-medium">Scale Factor: <span className="text-gray-500 text-sm">{scaleFactor}</span></p>
          <input
            type="range"
            min="0.001"
            max="0.01"
            step="0.0001"
            value={scaleFactor}
            onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* New control for bar width */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="mb-2 font-medium">Bar Width: <span className="text-gray-500 text-sm">{barWidth}px</span></p>
          <input
            type="range"
            min="30"
            max="100"
            step="5"
            value={barWidth}
            onChange={(e) => setBarWidth(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button 
          onClick={handleSubmit}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg transition-all text-lg font-bold"
        >
          Fetch Data
        </button>
        
        <button 
          onClick={startSorting}
          disabled={isRunning || originalData.length === 0}
          className={`px-8 py-4 text-white rounded-lg shadow-lg transition-all text-lg font-bold ${
            isRunning || originalData.length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Start Sorting
        </button>
        
        <button 
          onClick={resetVisualization}
          className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-lg transition-all text-lg font-bold"
        >
          Reset
        </button>
      </div>
      
      {/* Increased height for the visualization area */}
      <div className="border rounded-xl p-6 mb-6 bg-white shadow-lg h-128">
        {steps.length > 0 && (
          <div className="flex items-end justify-center gap-3 h-full">
            {steps[currentStep].map((val, i) => {
              // Modified height calculation with increased base height and magnification
              const baseHeightPercent = 20; // Increased base height percentage
              
              // Scale differences using the customizable scale factor
              const normalizedValue = (val - min) / scaleFactor;
              const differenceHeight = magnificationFactor * normalizedValue;
              const totalHeight = baseHeightPercent + differenceHeight;
              
              // Cap at 98% to leave room for the label but make it taller
              const cappedHeight = Math.min(totalHeight, 98);
              
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-lg mb-2 font-bold">{val.toFixed(2)}</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${cappedHeight}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: `${barWidth}px`, // Using the customizable bar width
                      position: "relative",
                      border: "2px solid rgba(0,0,0,0.2)",
                      ...getBarStyle(i, val)
                    }}
                    className="flex items-end justify-center relative"
                  >
                    {/* Value indicator inside the bar at the top */}
                    <div className="absolute top-2 w-full text-center">
                      <span className="bg-white bg-opacity-70 px-2 py-1 rounded-full text-xs font-bold">
                        {val.toFixed(1)}
                      </span>
                    </div>
                    
                    {/* Highlight current position */}
                    <div className="absolute top-0 w-full h-2 bg-black"></div>
                    
                    {/* Base height indicator with label */}
                    {baseHeightPercent > 0 && (
                      <div className="absolute w-full">
                        <div className="h-px bg-gray-600 w-full"
                          style={{ bottom: `${baseHeightPercent}%` }}></div>
                        <div className="absolute -left-8 text-xs"
                          style={{ bottom: `${baseHeightPercent}%` }}>Base</div>
                      </div>
                    )}
                    
                    {/* 3D effect with gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white from-5% via-transparent via-40% to-black to-90% opacity-20"></div>
                  </motion.div>
                  <div className="text-base mt-2 font-medium">{i + 1}</div>
                </div>
              );
            })}
          </div>
        )}
        {steps.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-xl">
            <p>No data to visualize. Please fetch data first.</p>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-lg">Progress:</p>
          <p className="text-base text-gray-600">
            Step {currentStep} of {steps.length - 1}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ 
              width: steps.length > 1 
                ? `${(currentStep / (steps.length - 1)) * 100}%` 
                : '0%' 
            }}
          ></div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">Algorithm Information</h3>
        <div className="prose max-w-none">
          {algo === "merge" && (
            <>
              <h4 className="text-xl font-semibold text-blue-700">Merge Sort</h4>
              <p className="text-lg"><strong>Time Complexity:</strong> O(n log n)</p>
              <p className="text-lg"><strong>Space Complexity:</strong> O(n)</p>
              <p className="text-lg">
                Merge sort is a divide-and-conquer algorithm that divides the input array into two halves, 
                recursively sorts them, and then merges the sorted halves. It is a stable, comparison-based 
                sorting algorithm that consistently performs at O(n log n) regardless of the input distribution.
              </p>
            </>
          )}
          {algo === "quick" && (
            <>
              <h4 className="text-xl font-semibold text-blue-700">Quick Sort</h4>
              <p className="text-lg"><strong>Time Complexity:</strong> O(n log n) average case, O(n²) worst case</p>
              <p className="text-lg"><strong>Space Complexity:</strong> O(log n)</p>
              <p className="text-lg">
                Quick sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element and 
                partitioning the array around the pivot so that elements smaller than the pivot are on the 
                left and elements greater are on the right. Quick sort typically outperforms merge sort in practice 
                due to better locality of reference and lower constant factors in its time complexity.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Enhanced scale information section */}
      <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
        <h3 className="text-2xl font-bold mb-4 text-blue-800">Scale Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-semibold text-blue-700">Current Settings</h4>
            <ul className="list-disc pl-5 space-y-2 mt-3 text-lg">
              <li><strong>Scale Factor:</strong> {scaleFactor}</li>
              <li><strong>Magnification Factor:</strong> {magnificationFactor}x</li>
              <li><strong>Bar Width:</strong> {barWidth}px</li>
              <li><strong>Base Height:</strong> {20}% of total height</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-blue-700">Visualization Enhancement</h4>
            <p className="mt-3 text-lg">
              This visualization uses multiple factors to enhance the visibility of small differences:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3 text-lg">
              <li>A smaller scale factor makes subtle differences between values more visible</li>
              <li>Higher magnification amplifies the differences between values</li>
              <li>Wider bars improve visibility of color patterns and differences</li>
              <li>Base height ensures that even the smallest values are visible</li>
            </ul>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-600 text-base">
        <p>Sorting Algorithm Visualizer © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default SortingVisualizer;