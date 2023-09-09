
// Function to calculate the mean
function calculateMean(data: number[]): number {
  const sum = data.reduce((acc, value) => acc + value, 0);
  return sum / data.length;
}

// Function to calculate the median
function calculateMedian(data: number[]): number {
  const sortedData = [...data].sort((a, b) => a - b);
  const middle = Math.floor(sortedData.length / 2);

  if (sortedData.length % 2 === 0) {
    return (sortedData[middle - 1] + sortedData[middle]) / 2;
  } else {
    return sortedData[middle];
  }
}

// Function to calculate the mode
function calculateMode(data: number[]): number {
  const counts: Record<number, number> = {};
  let mode = data[0];
  let maxCount = 0;

  for (const value of data) {
    counts[value] = (counts[value] || 0) + 1;
    if (counts[value] > maxCount) {
      mode = value;
      maxCount = counts[value];
    }
  }

  return mode;
}

export { calculateMean, calculateMedian, calculateMode };
