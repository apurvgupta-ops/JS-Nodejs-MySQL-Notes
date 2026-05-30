// !53. Maximum Subarray
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

// !121. Best Time to Buy and Sell Stock
// var maxProfit = function (prices = [7, 1, 5, 3, 6, 4]) {
//   let minprice = Infinity;
//   let maxprofit = 0;
//   for (let i = 0; i < prices.length; i++) {
//     minprice = Math.min(minprice, prices[i]);
//     maxprofit = Math.max(maxprofit, prices[i] - minprice);
//   }
//   return maxprofit;
// };
// console.log(maxProfit());

// !152. Maximum Product Subarray
// explnation : we have to keep track of both the maximum and minimum product at each step because a negative number can turn a minimum product into a maximum product and vice versa. When we encounter a negative number, we swap the current maximum and minimum products before updating them with the current number. This way, we ensure that we are always considering the potential for both positive and negative products to contribute to the overall maximum product.
// var maxProduct = function (nums = [2, 3, -2, 4]) {
//   let res = nums[0];
//   let currmax = nums[0];
//   let currmin = nums[0];

//   for (let i = 1; i < nums.length; i++) {
//     if (nums[i] < 0) {
//       [currmax, currmin] = [currmin, currmax];
//     }
//     currmax = Math.max(nums[i], currmax * nums[i]);
//     currmin = Math.min(nums[i], currmin * nums[i]);
//     res = Math.max(res, currmax);
//   }
//   return res;
// };
// console.log(maxProduct());

// !918. Maximum Sum Circular Subarray
// var maxSubarraySumCircular = function (nums = [1, -2, 3, -2]) {
//   let total = 0;
//   let maxSum = -Infinity;
//   let minSum = Infinity;
//   let currMax = 0;
//   let currMin = 0;

//   for (let num of nums) {
//     total += num;
//     currMax = Math.max(currMax + num, num);
//     maxSum = Math.max(maxSum, currMax);
//     currMin = Math.min(currMin + num, num);
//     minSum = Math.min(minSum, currMin);
//   }

//   return maxSum > 0 ? Math.max(maxSum, total - minSum) : maxSum;
// };
// console.log(maxSubarraySumCircular());

// !1749. Maximum Absolute Sum of Any Subarray
// var maxAbsoluteSum = function (nums = [2, -5, 1, -4, 3, -2]) {
//   let res = Math.abs(nums[0]);
//   let currmax = nums[0];
//   let currmin = nums[0];

//   for (let i = 1; i < nums.length; i++) {
//     currmax = Math.max(nums[i], currmax + nums[i]);
//     currmin = Math.min(nums[i], currmin + nums[i]);
//     res = Math.max(res, Math.abs(currmax), Math.abs(currmin));
//   }
//   return res;
// };

// console.log(maxAbsoluteSum());
