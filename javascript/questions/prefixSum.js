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
