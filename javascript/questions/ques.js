// 2 sum problem
// function twosum(arr, target) {
//   let n = arr.length;
//   let left = 0;
//   let right = n - 1;

//   while (left < right) {
//     let sum = arr[left] + arr[right];
//     if (sum === target) {
//       return [left, right];
//     } else if (sum > target) {
//       right--;
//     } else {
//       left++;
//     }
//   }

//   return [-1, -1];
// }

// const target = 9;
// const res = twosum([2, 7, 11, 15], target);
// console.log(res);

// 3sum problem :  in question it says remove duplicates
// function threesum(nums) {
//   const n = nums.length;

//   nums.sort((a, b) => a - b);

//   let res = [];
//   for (let i = 0; i < n - 2; i++) {
//     // Skip duplicate 'i'
//     if (i > 0 && nums[i] === nums[i - 1]) continue;

//     left = i + 1;
//     right = n - 1;

//     while (left < right) {
//       let sum = nums[i] + nums[left] + nums[right];

//       if (sum === 0) {
//         res.push([nums[i], nums[left], nums[right]]);

//         // Skip duplicates for left
//         while (left < right && nums[left] === nums[left + 1]) left++;

//         // Skip duplicates for right
//         while (left < right && nums[right] === nums[right - 1]) right--;

//         left++;
//         right--;
//       } else if (sum > 0) {
//         right--;
//       } else {
//         left++;
//       }
//     }
//   }

//   return res;
// }

// const target = 0;
// const res = threesum([-1, 0, 1, 2, -1, -4], target);
// console.log(res);

// Sort colors => with DNF

// function sortColor(arr = [2, 0, 1, 2, 1, 0]) {
//   let low = 0;
//   let mid = 0;
//   let high = arr.length - 1;

//   while (mid <= high) {
//     if (arr[mid] === 0) {
//       [mid[low], arr[mid]] = [arr[mid], arr[low]];
//       low++;
//       mid++;
//     } else if (arr[mid] === 1) {
//       mid++;
//     } else {
//       [arr[mid], arr[high]] = [arr[high], arr[mid]];
//       high--;
//     }
//   }

//   return arr;
// }
// const res = sortColor();
// console.log(res);

// Move Zeroes
