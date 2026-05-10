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
