import React, { useState, useEffect } from 'react';
import './SortingVisualizer.css';
import { mergeSort, quickSort } from '../utils/sortingAlgorithms';

function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [sortingAlgorithm, setSortingAlgorithm] = useState('mergeSort');
  const [sortBy, setSortBy] = useState('temperature');
  const [isSorting, setIsSorting] = useState(false);
  const [sortingSpeed, setSortingSpeed] = useState(50);
  const [sortingSteps, setSortingSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [performanceResults, setPerformanceResults] = useState(null);

  // Generate random data for visualization
  const generateRandomData = (size = 10) => {
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push({
        id: i + 1,
        date: `2023-01-${(i + 1).toString().padStart(2, '0')}`,
        temperature: Math.floor(Math.random() * 20) + 1,
        humidity: Math.floor(Math.random() * 40) + 40,
        rainfall: Math.floor(Math.random() * 60)
      });
    }
    setArray(newArray);
    setSortingSteps([]);
    setCurrentStep(0);
    setPerformanceResults(null);
  };

  useEffect(() => {
    generateRandomData();
  }, []);

  // Functions to trace sorting steps
  const traceMergeSort = (arr, key) => {
    const steps = [];
    
    const merge = (left, right, key) => {
      let result = [];
      let leftIndex = 0;
      let rightIndex = 0;
      
      while (leftIndex < left.length && rightIndex < right.length) {
        const leftValue = key ? left[leftIndex][key] : left[leftIndex];
        const rightValue = key ? right[rightIndex][key] : right[rightIndex];
        
        if (leftValue < rightValue) {
          result.push(left[leftIndex]);
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          rightIndex++;
        }
      }
      
      return [...result, ...left.slice(leftIndex), ...right.slice(rightIndex)];
    };
    
    const mergeSortWithSteps = (arr, key) => {
      // Base case
      if (arr.length <= 1) return arr;
      
      const mid = Math.floor(arr.length / 2);
      const left = mergeSortWithSteps(arr.slice(0, mid), key);
      const right = mergeSortWithSteps(arr.slice(mid), key);
      
      const result = merge(left, right, key);
      
      // Add this state to steps
      steps.push([...result]);
      
      return result;
    };
    
    // Start with original
    steps.push([...arr]);
    
    // Run the algorithm and collect steps
    mergeSortWithSteps([...arr], key);
    
    return steps;
  };
  
  const traceQuickSort = (arr, key) => {
    const steps = [];
    
    const quickSortWithSteps = (array, start = 0, end = array.length - 1) => {
      if (start >= end) return;
      
      let pivotIndex = partition(array, start, end);
      
      // Add this state to steps after each partition
      steps.push([...array]);
      
      quickSortWithSteps(array, start, pivotIndex - 1);
      quickSortWithSteps(array, pivotIndex + 1, end);
    };
    
    const partition = (array, start, end) => {
      // Taking the last element as pivot
      const pivotValue = key ? array[end][key] : array[end];
      let pivotIndex = start;
      
      for (let i = start; i < end; i++) {
        const currentValue = key ? array[i][key] : array[i];
        if (currentValue < pivotValue) {
          // Swap elements
          [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
          pivotIndex++;
        }
      }
      
      // Swap pivot to its final position
      [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
      
      return pivotIndex;
    };
    
    // Start with original
    steps.push([...arr]);
    
    // Create a copy of the array to work with
    const arrayCopy = [...arr];
    
    // Run the algorithm and collect steps
    quickSortWithSteps(arrayCopy, 0, arrayCopy.length - 1);
    
    return steps;
  };

  // Start sorting visualization
  const startSorting = () => {
    setIsSorting(true);
    setCurrentStep(0);
    
    // Generate steps based on selected algorithm
    let steps;
    const startTime = performance.now();
    
    if (sortingAlgorithm === 'mergeSort') {
      steps = traceMergeSort([...array], sortBy);
    } else {
      steps = traceQuickSort([...array], sortBy);
    }
    
    const endTime = performance.now();
    
    setSortingSteps(steps);
    setPerformanceResults({
      algorithm: sortingAlgorithm,
      duration: endTime - startTime,
      steps: steps.length
    });
    
    // Start visualization
    animateSorting(steps);
  };
  
  const animateSorting = (steps) => {
    let stepIndex = 0;
    
    const intervalId = setInterval(() => {
      if (stepIndex >= steps.length - 1) {
        clearInterval(intervalId);
        setIsSorting(false);
        setArray(steps[steps.length - 1]);
        setCurrentStep(steps.length - 1);
        return;
      }
      
      setArray(steps[stepIndex]);
      setCurrentStep(stepIndex);
      stepIndex++;
    }, 1000 - sortingSpeed * 10); // Adjust speed: lower value = slower
  };

  const resetSorting = () => {
    setIsSorting(false);
    generateRandomData(array.length);
  };

  const handleAlgorithmChange = (e) => {
    setSortingAlgorithm(e.target.value);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSortingSpeed(parseInt(e.target.value));
  };

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    generateRandomData(size);
  };

  const getMetricLabel = (metric) => {
    switch(metric) {
      case 'temperature': return 'Temperature (°C)';
      case 'humidity': return 'Humidity (%)';
      case 'rainfall': return 'Rainfall (mm)';
      default: return metric;
    }
  };

  return (
    <div className="sorting-visualizer">
      <h2>Sorting Algorithm Visualizer</h2>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="algorithm">Algorithm:</label>
          <select 
            id="algorithm" 
            value={sortingAlgorithm} 
            onChange={handleAlgorithmChange}
            disabled={isSorting}
          >
            <option value="mergeSort">Merge Sort</option>
            <option value="quickSort">Quick Sort</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="sortBy">Sort By:</label>
          <select 
            id="sortBy" 
            value={sortBy} 
            onChange={handleSortByChange}
            disabled={isSorting}
          >
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="rainfall">Rainfall</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="speed">Speed:</label>
          <input 
            type="range" 
            id="speed" 
            min="1" 
            max="90" 
            value={sortingSpeed} 
            onChange={handleSpeedChange}
            disabled={isSorting}
          />
        </div>
        
        <div className="control-group">
          <label htmlFor="size">Data Size:</label>
          <select 
            id="size" 
            onChange={handleSizeChange}
            disabled={isSorting}
            value={array.length}
          >
            <option value="5">5 items</option>
            <option value="10">10 items</option>
            <option value="15">15 items</option>
            <option value="20">20 items</option>
          </select>
        </div>
      </div>
      
      <div className="button-group">
        <button 
          onClick={startSorting}
          disabled={isSorting || sortingSteps.length > 0 && currentStep === sortingSteps.length - 1}
        >
          {sortingSteps.length > 0 && currentStep === sortingSteps.length - 1 ? 'Sorted' : 'Start Sorting'}
        </button>
        <button onClick={resetSorting} disabled={isSorting}>
          Reset
        </button>
      </div>
      
      {performanceResults && (
        <div className="performance-metrics">
          <h3>Algorithm Performance</h3>
          <p>Algorithm: {performanceResults.algorithm === 'mergeSort' ? 'Merge Sort' : 'Quick Sort'}</p>
          <p>Execution Time: {performanceResults.duration.toFixed(3)} ms</p>
          <p>Steps: {performanceResults.steps}</p>
          <p>Data Size: {array.length} records</p>
        </div>
      )}
      
      <div className="array-container">
        {array.map((item, index) => (
          <div 
            key={item.id} 
            className="array-bar"
            style={{
              height: `${item[sortBy] * 4}px`,
              backgroundColor: `hsl(${
                sortBy === 'temperature' ? '0, 80%, 50%' : 
                sortBy === 'humidity' ? '200, 80%, 50%' : '170, 80%, 50%'
              })`,
            }}
          >
            <div className="bar-label">{item[sortBy]}</div>
          </div>
        ))}
      </div>
      
      <div className="algorithm-info">
        <h3>{sortingAlgorithm === 'mergeSort' ? 'Merge Sort' : 'Quick Sort'} Explanation</h3>
        {sortingAlgorithm === 'mergeSort' ? (
          <div className="algorithm-description">
            <p><strong>Merge Sort</strong> is a divide-and-conquer algorithm with O(n log n) complexity. It:</p>
            <ol>
              <li>Divides the array into halves until reaching single elements</li>
              <li>Merges these small sorted arrays into larger ones</li>
              <li>Continues until the entire array is sorted</li>
            </ol>
            <p>Merge Sort is efficient for large datasets and has consistent performance across cases.</p>
          </div>
        ) : (
          <div className="algorithm-description">
            <p><strong>Quick Sort</strong> is a divide-and-conquer algorithm with average O(n log n) complexity. It:</p>
            <ol>
              <li>Selects a pivot element</li>
              <li>Partitions the array so elements less than pivot are on the left</li>
              <li>Recursively applies the same process to the sub-arrays</li>
            </ol>
            <p>Quick Sort is generally faster in practice but can degrade to O(n²) in worst cases.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SortingVisualizer;