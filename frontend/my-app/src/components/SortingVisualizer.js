import React, { useState, useEffect } from 'react';

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Sorting Algorithm Visualizer</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1">Algorithm:</label>
          <select 
            value={sortingAlgorithm} 
            onChange={handleAlgorithmChange}
            disabled={isSorting}
            className="w-full p-2 border rounded"
          >
            <option value="mergeSort">Merge Sort</option>
            <option value="quickSort">Quick Sort</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Sort By:</label>
          <select 
            value={sortBy} 
            onChange={handleSortByChange}
            disabled={isSorting}
            className="w-full p-2 border rounded"
          >
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="rainfall">Rainfall</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Speed:</label>
          <input 
            type="range" 
            min="1" 
            max="90" 
            value={sortingSpeed} 
            onChange={handleSpeedChange}
            disabled={isSorting}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block mb-1">Data Size:</label>
          <select 
            onChange={handleSizeChange}
            disabled={isSorting}
            value={array.length}
            className="w-full p-2 border rounded"
          >
            <option value="5">5 items</option>
            <option value="10">10 items</option>
            <option value="15">15 items</option>
            <option value="20">20 items</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={startSorting}
          disabled={isSorting || (sortingSteps.length > 0 && currentStep === sortingSteps.length - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {sortingSteps.length > 0 && currentStep === sortingSteps.length - 1 ? 'Sorted' : 'Start Sorting'}
        </button>
        <button 
          onClick={resetSorting} 
          disabled={isSorting}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
        >
          Reset
        </button>
      </div>
      
      {performanceResults && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Algorithm Performance</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Algorithm: {performanceResults.algorithm === 'mergeSort' ? 'Merge Sort' : 'Quick Sort'}</div>
            <div>Execution Time: {performanceResults.duration.toFixed(3)} ms</div>
            <div>Steps: {performanceResults.steps}</div>
            <div>Data Size: {array.length} records</div>
          </div>
        </div>
      )}
      
      <div className="h-64 flex items-end justify-center bg-gray-50 border p-4 mb-6">
        {array.map((item) => {
          let barColor;
          switch(sortBy) {
            case 'temperature': barColor = 'bg-red-500'; break;
            case 'humidity': barColor = 'bg-blue-500'; break;
            case 'rainfall': barColor = 'bg-green-500'; break;
            default: barColor = 'bg-purple-500';
          }
          
          return (
            <div 
              key={item.id} 
              className="mx-1 flex flex-col items-center"
            >
              <div className="text-xs mb-1">{item[sortBy]}</div>
              <div 
                className={`w-8 ${barColor}`}
                style={{height: `${item[sortBy] * 3}px`}}
              ></div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-gray-50 p-4 border rounded">
        <h3 className="font-bold mb-2">
          {sortingAlgorithm === 'mergeSort' ? 'Merge Sort' : 'Quick Sort'} Explanation
        </h3>
        {sortingAlgorithm === 'mergeSort' ? (
          <div>
            <p className="mb-2"><strong>Merge Sort</strong> is a divide-and-conquer algorithm with O(n log n) complexity.</p>
            <ol className="list-decimal ml-5 mb-2">
              <li>Divides the array into halves until reaching single elements</li>
              <li>Merges these small sorted arrays into larger ones</li>
              <li>Continues until the entire array is sorted</li>
            </ol>
            <p>Merge Sort is efficient for large datasets and has consistent performance across cases.</p>
          </div>
        ) : (
          <div>
            <p className="mb-2"><strong>Quick Sort</strong> is a divide-and-conquer algorithm with average O(n log n) complexity.</p>
            <ol className="list-decimal ml-5 mb-2">
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