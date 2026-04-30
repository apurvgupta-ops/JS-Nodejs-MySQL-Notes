function print(fn) {
  const res = fn();
  console.log(res);
}

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

// !----------------------------
// !643. Maximum Average Subarray I
// ?(With 2 loops)
// var findMaxAverage = function (nums = [1, 12, -5, -6, 50, 3], k = 4) {
//   let maxAvg = 0;
//   let sum = 0;
//   for (let right = 0; right < k; right++) {
//     sum += nums[right];
//   }
//   maxAvg = sum / k;
//   for (let i = k; i < nums.length; i++) {
//     sum += nums[i] - nums[i - k];
//     maxAvg = Math.max(maxAvg, sum / k);
//   }
//   return maxAvg;
// };

// ?(With 1 loops)
// var findMaxAverage = function (nums = [-1], k = 1) {
//   let maxAvg = -Infinity;
//   let sum = 0;
//   for (let right = 0; right < nums.length; right++) {
//     sum += nums[right];
//     if (right >= k) {
//       sum -= nums[right - k];
//     }
//     if (right >= k - 1) maxAvg = Math.max(maxAvg, sum / k);
//   }
//   return maxAvg;
// };
// print(findMaxAverage);

// !1480. Running Sum of 1d Array
// var runningSum = function (nums = [1, 2, 3, 4]) {
//   let sum = 0;
//   //   const res = [];
//   for (let i = 0; i < nums.length; i++) {
//     sum += nums[i];
//     // res.push(sum);
//     nums[i] = sum;
//   }
//   return nums;
// };
// print(runningSum);

// !1343. Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold
// var numOfSubarrays = function (
//   arr = [2, 2, 2, 2, 5, 5, 5, 8],
//   k = 3,
//   threshold = 4,
// ) {
//   let avg = -Infinity;
//   let sum = 0;
//   let count = 0;
//   for (let i = 0; i < arr.length; i++) {
//     sum += arr[i];

//     avg = sum / k;
//     console.log({ avg, sum });

//     if (i >= k) {
//       sum -= arr[i - k];
//     }

//     if (i >= k - 1) {
//       avg = sum / k;
//       if (avg >= threshold) {
//         count++;
//       }
//     }
//   }
//   return count;
// };

// print(numOfSubarrays);

// !438. Find All Anagrams in a String
// var findAnagrams = function (s = "cbaebabacd", p = "abc") {
//   let res = [];
//   let pmap = new Map();
//   let wmap = new Map();
//   let k = p.length;

//   for (let ch of p) {
//     pmap.set(ch, (pmap.get(ch) || 0) + 1);
//   }

//   for (let i = 0; i < s.length; i++) {
//     wmap.set(s[i], (wmap.get(s[i]) || 0) + 1);

//     if (i >= k) {
//       let out = s[i - k];
//       if (wmap.get(out) === 1) wmap.delete(out);
//       else {
//         wmap.set(out, wmap.get(out) - 1);
//       }
//     }

//     if (i >= k - 1 && isSameMap(pmap, wmap)) {
//       res.push(i - k + 1);
//     }
//   }
//   return res;
// };
// function isSameMap(map1, map2) {
//   if (map1.size !== map2.size) return false;
//   for (let [key, val] of map1) {
//     if (map2.get(key) !== val) return false;
//   }
//   return true;
// }

// print(findAnagrams);

// !567. Permutation in String
// var checkInclusion = function (s2 = "eidbaooo", s1 = "ab") {
//   let pmap = new Map();
//   let wmap = new Map();
//   let k = s1.length;

//   for (let ch of s1) {
//     pmap.set(ch, (pmap.get(ch) || 0) + 1);
//   }

//   for (let i = 0; i < s2.length; i++) {
//     wmap.set(s2[i], (wmap.get(s2[i]) || 0) + 1);

//     if (i >= k) {
//       let out = s2[i - k];
//       if (wmap.get(out) === 1) wmap.delete(out);
//       else {
//         wmap.set(out, wmap.get(out) - 1);
//       }
//     }

//     if (i >= k - 1 && isSameMap(pmap, wmap)) {
//       return true;
//     }
//   }
//   return false;
// };
// function isSameMap(map1, map2) {
//   if (map1.size !== map2.size) return false;
//   for (let [key, val] of map1) {
//     if (map2.get(key) !== val) return false;
//   }
//   return true;
// }

// print(checkInclusion);

// !239. Sliding Window Maximum
// var maxSlidingWindow = function (nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3) {
//   const deque = [];
//   const res = [];

//   for (let i = 0; i < nums.length; i++) {
//     if (deque.length > 0 && deque[0] <= i - k) {
//       deque.shift();
//     }

//     while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
//       deque.pop();
//     }

//     deque.push(i);

//     if (i >= k - 1) {
//       res.push(nums[deque[0]]);
//     }
//   }
//   return res;
// };

// print(maxSlidingWindow);

// !1052. Grumpy Bookstore Owner
// var maxSatisfied = function (
//   customers = [1, 0, 1, 2, 1, 1, 7, 5],
//   grumpy = [0, 1, 0, 1, 0, 1, 0, 1],
//   minutes = 3,
// ) {
//   let zerosum = 0;
//   let maxWindowSum = 0;
//   let currwindowsum = 0;

//   for (let i = 0; i < customers.length; i++) {
//     if (grumpy[i] === 0) zerosum += customers[i];

//     if (grumpy[i] === 1) currwindowsum += customers[i];

//     if (i >= minutes) {
//       if (grumpy[i - minutes] === 1) {
//         currwindowsum -= customers[i - minutes];
//       }
//     }

//     maxWindowSum = Math.max(maxWindowSum, currwindowsum);
//   }

//   return zerosum + maxWindowSum;
// };

// console.log(maxSatisfied());
