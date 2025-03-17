// Merge Sort implementation
export const mergeSort = (array, key = null) => {
    if (array.length <= 1) return array;
    
    const mid = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, mid), key);
    const right = mergeSort(array.slice(mid), key);
    
    return merge(left, right, key);
  };
  
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
  
  // Quick Sort implementation
  export const quickSort = (array, key = null) => {
    if (array.length <= 1) return array;
    
    const pivot = array[Math.floor(array.length / 2)];
    const pivotValue = key ? pivot[key] : pivot;
    
    const less = array.filter(item => (key ? item[key] : item) < pivotValue);
    const equal = array.filter(item => (key ? item[key] : item) === pivotValue);
    const greater = array.filter(item => (key ? item[key] : item) > pivotValue);
    
    return [...quickSort(less, key), ...equal, ...quickSort(greater, key)];
  };
  
  // Function to measure sorting algorithm performance
  export const measureSortingPerformance = (algorithm, data, key = null) => {
    const start = performance.now();
    const sortedData = algorithm(data, key);
    const end = performance.now();
    
    return {
      duration: end - start,
      sortedData: sortedData
    };
  };