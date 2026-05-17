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
// var findPeakElement = function (nums = [1, 2, 1, 3, 5, 6, 4]) {
//   let low = 0;
//   let high = nums.length - 1;

//   while (low < high) {
//     let mid = low + Math.floor((high - low) / 2);

//     if (nums[mid] < nums[mid + 1]) {
//       low = mid + 1;
//     } else {
//       high = mid;
//     }
//   }
//   return low;
// };

// console.log(findPeakElement());

// !34. Find First and Last Position of Element in Sorted Array
// var searchRange = function (nums = [5, 7, 7, 8, 8, 10], target = 8) {
//   return [searchIndex(nums, target, true), searchIndex(nums, target, false)];
// };

// const searchIndex = (nums, target, isFirst) => {
//   let low = 0;
//   let high = nums.length - 1;
//   let index = -1;

//   while (low <= high) {
//     let mid = low + Math.floor((high - low) / 2);

//     if (nums[mid] === target) {
//       index = mid;

//       if (isFirst) {
//         high = mid - 1;
//       } else {
//         low = mid + 1;
//       }
//     } else if (nums[mid] < target) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }
//   return index;
// };
// console.log(searchRange());

// !875. Koko Eating Bananas
// var minEatingSpeed = function (piles = [3, 6, 7, 11], h = 8) {
//   let minspeed = 1;
//   let maxspeed = Math.max(...piles);

//   function caneatall(mid) {
//     let totalhours = 0;

//     for (let i of piles) {
//       totalhours += Math.ceil(i / mid);
//     }
//     return totalhours <= h;
//   }

//   while (minspeed <= maxspeed) {
//     let mid = minspeed + Math.floor((maxspeed - minspeed) / 2);
//     if (caneatall(mid)) {
//       maxspeed = mid - 1;
//     } else {
//       minspeed = mid + 1;
//     }
//   }

//   return minspeed;
// };
// console.log(minEatingSpeed());

// !1011. Capacity To Ship Packages Within D Days
// var shipWithinDays = function (
//   weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//   days = 5,
// ) {
//   let mincap = Math.max(...weights);
//   let maxcap = 0;
//   for (let weight of weights) {
//     maxcap += weight;
//   }

//   function canTransfer(capacity) {
//     let totalDays = 0;
//     let sum = 0;

//     for (let weight of weights) {
//       console.log({ sum, weight, capacity });
//       if (sum + weight > capacity) {
//         totalDays++;
//         sum = 0;
//       }
//       sum += weight;
//     }
//     return totalDays;
//   }

//   while (mincap < maxcap) {
//     let mid = mincap + Math.floor((maxcap - mincap) / 2);

//     if (canTransfer(mid) < days) {
//       maxcap = mid;
//     } else {
//       mincap = mid + 1;
//     }
//   }

//   return mincap;
// };

// console.log(shipWithinDays());
