// Max Sum Subarray of size K with 2 loops
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

// if asked with one loop
// function maxSubArrSum(arr = [1, 4, 2, 10, 23, 3, 1, 0, 20], k = 4) {
//   let n = arr.length;
//   let maxSum = 0;
//   let sum = 0;

//   for (let i = 0; i < n; i++) {
//     sum += arr[i];

//     if (i >= k) {
//       sum -= arr[i - k];
//     }

//     if (i >= k - 1) maxSum = Math.max(maxSum, sum);
//   }

//   return maxSum;
// }
// const res = maxSubArrSum();
// console.log(res);

// SubArray of the distinct element 2 loop
// function distinctSubArrSum(nums = [1, 2, 3, 3], k = 1) {
//   let maxSum = 0;
//   let sum = 0;
//   let map = new Map();

//   for (let i = 0; i < k; i++) {
//     map.set(nums[i], (map.get(nums[i]) || 0) + 1);
//     sum += nums[i];
//   }

//   if (map.size === k) {
//     maxSum = sum;
//   }
//   for (let j = k; j < nums.length; j++) {
//     map.set(nums[j], (map.get(nums[j]) || 0) + 1);
//     sum += nums[j];

//     const out = nums[j - k];
//     if (map.get(out) === 1) {
//       map.delete(out);
//     } else {
//       map.set(out, map.get(out) - 1);
//     }

//     sum -= out;

//     if (map.size === k) {
//       maxSum = Math.max(maxSum, sum);
//     }
//   }

//   return maxSum;
// }

// const res = distinctSubArrSum();
// console.log(res);

// SubArray of the distinct element one loop
// function distinctSubArrSum(nums = [1, 2, 3, 3], k = 1) {
//   let maxSum = 0;
//   let sum = 0;
//   let map = new Map();

//   for (let i = 0; i < nums.length; i++) {
//     map.set(nums[i], (map.get(nums[i]) || 0) + 1);
//     sum += nums[i];

//     if (i >= k) {
//       const out = nums[i - k];
//       if (map.get(out) === 1) map.delete(out);
//       else map.set(out, map.get(out) - 1);
//       sum -= out;
//     }

//     if (i >= k - 1 && map.size === k) {
//       maxSum = Math.max(maxSum, sum);
//     }
//   }

//   return maxSum;
// }

// const res = distinctSubArrSum();
// console.log(res);

// 485. Max Consecutive Ones
// function ones(arr = [1, 1, 0, 1, 1, 1]) {
//   let current_ones = 0;
//   let maxCount = 0;

//   for (let i = 0; i <= arr.length; i++) {
//     if (arr[i] === 1) {
//       current_ones++;
//     } else {
//       maxCount = Math.max(maxCount, current_ones);
//       current_ones = 0;
//     }
//   }

//   return maxCount;
// }

// const res = ones();
// console.log(res);

// 1004. Max Consecutive Ones III
// function maxConsecutiv(arr = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k = 2) {
//   const n = arr.length;
//   let left = 0;
//   let right = 0;
//   let maxlen = 0;
//   let zero = 0;

//   while (right < n) {
//     if (arr[right] === 0) {
//       zero++;
//     }

//     if (zero > k) {
//       if (arr[left] === 0) {
//         zero--;
//       }
//       left++;
//     }

//     if (zero <= k) {
//       len = right - left + 1;
//       maxlen = Math.max(maxlen, len);
//     }
//     right++;
//   }

//   return maxlen;
// }
// const res = maxConsecutiv();
// console.log(res);
