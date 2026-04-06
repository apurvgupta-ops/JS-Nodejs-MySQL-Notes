// Max Sum Subarray of size K
// function maxSubArrSum(arr = [1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4) {
//   let n = arr.length;
//   let maxSum = 0;
//   let sum = 0;
//   for (let i = 0; i < k; i++) {
//     sum += arr[i];
//   }

//   maxSum = sum;

//   for (let j = k; j < n; j++) {
//     sum += arr[j] - arr[j - k];
//     maxSum = Math.max(maxSum, sum);
//   }
//   return maxSum;
// }

// const res = maxSubArrSum();
// console.log(res);
