// !704. Binary Search
// var search = function (nums = [-1, 0, 3, 5, 9, 12], target = 9) {
//   let low = 0;
//   let high = nums.length - 1;

//   while (low <= high) {
//     let mid = low + Math.floor((high - low) / 2);

//     if (nums[mid] === target) {
//       return mid;
//     } else if (nums[mid] < target) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }

//   return -1;
// };

// console.log(search());

// !374. Guess Number Higher or Lower
// var guessNumber = function (n = 2, pick = 6) {
//   let low = 1;
//   let high = n;

//   while (low <= high) {
//     let mid = low + Math.floor((high - low) / 2);
//     // let res = guess(mid);
//     if (res === 0) {
//       return mid;
//     } else if (res === 1) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }

//   return -1;
// };
// console.log(guessNumber());

// !278. First Bad Version
// isBadVersion = function (version) {
//   if (version == 1) {
//     return true;
//   } else {
//     return false;
//   }
// };
// var badVersion = function (n = 3) {
//   let low = 1;
//   let high = n;

//   while (low < high) {
//     let mid = low + Math.floor((high - low) / 2);
//     let res = isBadVersion(mid);
//     if (res) {
//       high = mid;
//     } else {
//       low = mid + 1;
//     }
//   }
//   return low;
// };

// console.log(badVersion());

// !35. Search Insert Position
// var searchInsert = function (nums = [1, 3, 5, 6], target = 7) {
//   let low = 0;
//   let high = nums.length;

//   while (low < high) {
//     let mid = low + Math.floor((high - low) / 2);
//     if (nums[mid] === target) {
//       return mid;
//     } else if (nums[mid] < target) {
//       low = mid + 1;
//     } else {
//       high = mid;
//     }
//   }
//   return low;
// };

// console.log(searchInsert());

// !33. Search in Rotated Sorted Array
// var search = function (nums = [4, 5, 6, 7, 0, 1, 2], target = 0) {
//   let low = 0;
//   let high = nums.length - 1;

//   while (low <= high) {
//     let mid = low + Math.floor((high - low) / 2);
//     if (nums[mid] === target) {
//       return mid;
//     }

//     // Check if the left half is sorted
//     if (nums[low] <= nums[mid]) {
//       // If target is in the left half
//       if (nums[low] <= target && target < nums[mid]) {
//         high = mid - 1;
//       } else {
//         low = mid + 1;
//       }
//     } else {
//       // Right half is sorted
//       // If target is in the right half
//       if (nums[mid] < target && target <= nums[high]) {
//         low = mid + 1;
//       } else {
//         high = mid - 1;
//       }
//     }
//   }

//   return -1;
// };

// console.log(search());

// !153. Find Minimum in Rotated Sorted Array
// var findMin = function (nums = [11, 13, 15, 17]) {
//   let low = 0;
//   let high = nums.length - 1;

//   while (low < high) {
//     let mid = low + Math.floor((high - low) / 2);
//     if (nums[mid] > nums[high]) {
//       low = mid + 1;
//     } else {
//       high = mid;
//     }
//   }

//   return nums[low];
// };
// console.log(findMin());

// !162. Find Peak Element
