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

// 209. Minimum Size Subarray Sum
// function minimunSize(target = 7, nums = [2, 3, 1, 2, 4, 3]) {
//   let minlen = Infinity;
//   let left = 0;
//   let sum = 0;
//   for (let i = 0; i < nums.length; i++) {
//     sum += nums[i];

//     while (sum >= target) {
//       let len = i - left + 1;
//       minlen = Math.min(minlen, len);
//       sum -= nums[left];
//       left++;
//     }
//   }

//   return minlen === Infinity ? 0 : minlen;
// }
// const res = minimunSize();
// console.log(res);

// 713. Subarray Product Less Than K
// function numSubarrayProductLessThanK(nums = [10, 5, 2, 6], k = 100) {
//   if (k <= 1) return 0;
//   let left = 0;
//   let product = 1;
//   let count = 0;
//   for (let i = 0; i < nums.length; i++) {
//     product *= nums[i];

//     while (product >= k) {
//       product /= nums[left];
//       left++;
//     }

//     let len = i - left + 1;
//     count += len;
//   }

//   return count;
// }
// const res = numSubarrayProductLessThanK();
// console.log(res);

// 904. Fruit Into Baskets
// function maxFruitLen(fruits = [1, 2, 1], k = 2) {
//   let maxlen = 0;
//   let left = 0;
//   let map = new Map();

//   for (let right = 0; right < fruits.length; right++) {
//     map.set(fruits[right], (map.get(fruits[right]) || 0) + 1);

//     while (map.size > 2) {
//       map.set(fruits[left], map.get(fruits[left]) - 1);
//       if (map.get(fruits[left]) === 0) {
//         map.delete(fruits[left]);
//       }
//       left++;
//     }
//     let len = right - left + 1;
//     maxlen = Math.max(maxlen, len);
//   }

//   return maxlen;
// }
// const res = maxFruitLen();
// console.log(res);

// 992. Subarrays with K Different Integers
// function subarraysWithKDistinct(nums = [1, 2, 1, 2, 3], k = 2) {
//   return atMost(nums, k) - atMost(nums, k - 1);
// }

// function atMost(nums = [1, 2, 1, 2, 3], k = 2) {
//   let count = 0;
//   let map = new Map();
//   let left = 0;

//   for (let right = 0; right < nums.length; right++) {
//     map.set(nums[right], (map.get(nums[right]) || 0) + 1);

//     while (map.size > k) {
//       map.set(nums[left], map.get(nums[left]) - 1);
//       if (map.get(nums[left]) === 0) {
//         map.delete(nums[left]);
//       }
//       left++;
//     }
//     count += right - left + 1;
//   }
//   return count;
// }
// const res = subarraysWithKDistinct();
// console.log(res);

// 239. Sliding Window Maximum
