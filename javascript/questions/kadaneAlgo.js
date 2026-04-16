// 53. Maximum Subarray
// function maxSubArray(nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) {
//   let sum = 0;
//   let maxSum = -Infinity;

//   for (let i of nums) {
//     sum += i;
//     maxSum = Math.max(sum, maxSum);

//     if (sum < 0) {
//       sum = 0;
//     }
//   }
//   return maxSum;
// }

// const res = maxSubArray();
// console.log(res);
