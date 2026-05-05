// 560. Subarray Sum Equals K
// function subarraySum(nums = [1, 2, 3], k = 3) {
//   let count = 0;
//   let prefixSum = 0;
//   let map = new Map([[0, 1]]);

//   for (const i of nums) {
//     prefixSum += i;

//     if (map.has(prefixSum - k)) {
//       count += map.get(prefixSum - k);
//     }
//     map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
//   }
//   return count;
// }

// const res = subarraySum();
// console.log(res);

// 724. Find Pivot Index
// function pivotIndex(nums = [1, 7, 3, 6, 5, 6]) {
//   let leftsum = 0;
//   let totalsum = 0;
//   let rightsum = 0;

//   for (let i = 0; i < nums.length; i++) {
//     totalsum += nums[i];
//   }

//   for (let i = 0; i < nums.length; i++) {
//     rightsum = totalsum - leftsum - nums[i];

//     if (leftsum === rightsum) {
//       return i;
//     }
//     leftsum += nums[i];
//   }
//   return -1;
// }

// const res = pivotIndex();
// console.log(res);

// 238. Product of Array Except Self
// function productExceptself(nums = [1, 2, 3, 4]) {
//   let res = [];
//   res[0] = 1;

//   for (let i = 1; i < nums.length; i++) {
//     res[i] = res[i - 1] * nums[i - 1];
//   }

//   let rightProduct = 1;

//   for (let j = res.length - 1; j >= 0; j--) {
//     res[j] *= rightProduct;
//     rightProduct *= nums[j];
//   }
//   return res;
// }
// const res = productExceptself();
// console.log(res);

// !----------------------------
// !303. Range Sum Query
// /**
//  * @param {number[]} nums
//  */
// var NumArray = function(nums) {
//     const n = nums.length;
//     // 1. Create a prefixSum array with "padding" (size n + 1) [cite: 80, 109]
//     // prefixSum[i] will store the sum of elements from index 0 up to i-1
//     this.prefixSum = new Array(n + 1).fill(0); [cite: 81]

//     // 2. Build the sums: prefixSum[i+1] = prefixSum[i] + current element [cite: 83, 99]
//     for (let i = 0; i < n; i++) {
//         this.prefixSum[i + 1] = this.prefixSum[i] + nums[i]; [cite: 83, 99]
//     }
// };

// /** * @param {number} left
//  * @param {number} right
//  * @return {number}
//  */
// NumArray.prototype.sumRange = function(left, right) {
//     // 3. Use the "Magic Formula" to get the range sum in O(1) [cite: 85, 110]
//     // Sum(left, right) = (Total sum up to right) - (Sum before left)
//     return this.prefixSum[right + 1] - this.prefixSum[left]; [cite: 85, 101]
// };

// !724. Find Pivot Index
// var pivotIndex = function (nums = [1, 7, 3, 6, 5, 6]) {
//   let leftsum = 0;
//   let rightsum = 0;
//   let totalsum = 0;

//   for (let i = 0; i < nums.length; i++) {
//     totalsum += nums[i];
//   }

//   for (let i = 0; i < nums.length; i++) {
//     rightsum = totalsum - leftsum - nums[i];

//     if (rightsum == leftsum) {
//       return i;
//     }

//     leftsum += nums[i];
//   }

//   return -1;
// };
// console.log(pivotIndex());

// !1422. Max Score After Splitting
// var maxScore = function (s = "011101") {
//   const n = s.length;
//   let totalOnesCount = 0;
//   let onesInLeft = 0;
//   let zerosInLeft = 0;
//   let maxScore = 0;

//   for (let i = 0; i < n; i++) {
//     if (s[i] === "1") totalOnesCount++;
//   }

//   for (let i = 0; i < n - 1; i++) {
//     if (s[i] === "1") {
//       onesInLeft++;
//     } else {
//       zerosInLeft++;
//     }
//     let score = zerosInLeft + (totalOnesCount - onesInLeft);
//     maxScore = Math.max(maxScore, score);
//   }

//   return maxScore;
// };
// console.log(maxScore());
// !560. Subarray Sum Equals K

// !525. Contiguous Array
var findMaxLength = function (nums = [0, 1, 1, 1, 1, 1, 0, 0, 0]) {
  let map = new Map();
  map.set(0, -1);
  let maxlen = 0;
  let prefixSum = 0;

  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i] === 1 ? 1 : -1;

    if (map.has(prefixSum)) {
      let prevIndex = map.get(prefixSum);
      maxlen = Math.max(maxlen, i - prevIndex);
    } else {
      map.set(prefixSum, i);
    }
  }
  return maxlen;
};

console.log(findMaxLength());
// !974. Subarray Sums Divisible K
// !523. Continuous Subarray Sum
