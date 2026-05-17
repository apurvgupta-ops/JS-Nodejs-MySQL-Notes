// !268. Missing Number
// var missingNumber = function (nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]) {
//   let i = 0;
//   let n = nums.length;
//   while (i < n) {
//     let correctIndex = nums[i];

//     if (nums[i] < n && nums[i] !== nums[correctIndex]) {
//       [nums[correctIndex], nums[i]] = [nums[i], nums[correctIndex]];
//     } else {
//       i++;
//     }
//   }

//   for (let i = 0; i < n; i++) {
//     if (i !== nums[i]) {
//       return i;
//     }
//   }
//   return n;
// };
// console.log(missingNumber());

// !448. Find All Numbers Disappeared in an Array
// var findDisappearedNumbers = function (nums = [4, 3, 2, 7, 8, 2, 3, 1]) {
//   let i = 1;
//   let res = [];
//   let n = nums.length;
//   while (i < n) {
//     let targetIndex = nums[i] - 1;
//     if (nums[i] !== nums[targetIndex]) {
//       [nums[i], nums[targetIndex]] = [nums[targetIndex], nums[i]];
//     } else {
//       i++;
//     }
//   }
//   for (let i = 0; i < n; i++) {
//     if (nums[i] !== i + 1) {
//       res.push(i + 1);
//     }
//   }
//   return res;
// };
// console.log(findDisappearedNumbers());

// !442. Find All Duplicates in an Array
// var findDuplicates = function (nums = [4, 3, 2, 7, 8, 2, 3, 1]) {
//   let i = 0;
//   let res = [];
//   let n = nums.length;
//   while (i < n) {
//     let targetIndex = nums[i] - 1;
//     if (nums[i] !== nums[targetIndex]) {
//       [nums[i], nums[targetIndex]] = [nums[targetIndex], nums[i]];
//     } else {
//       i++;
//     }
//   }
//   for (let i = 0; i < n; i++) {
//     if (nums[i] !== i + 1) {
//       res.push(nums[i]);
//     }
//   }
//   return res;
// };
// console.log(findDuplicates());

// !645. Set Mismatch
// var findErrorNums = function (nums = [1, 2, 2, 4]) {
//   let i = 0;
//   let res = [];
//   let n = nums.length;
//   while (i < n) {
//     let targetIndex = nums[i] - 1;
//     if (nums[i] !== nums[targetIndex]) {
//       [nums[i], nums[targetIndex]] = [nums[targetIndex], nums[i]];
//     } else {
//       i++;
//     }
//   }
//   for (let i = 0; i < n; i++) {
//     if (nums[i] !== i + 1) {
//       res.push(nums[i]);
//       res.push(i + 1);
//     }
//   }
//   return res;
// };
// console.log(findErrorNums());

// !41. First Missing Positive
var firstMissingPositive = function (nums = [7, 8, 9, 11, 12]) {
  let i = 0;
  let n = nums.length;
  while (i < n) {
    let targetIndex = nums[i] - 1;
    if (nums[i] !== nums[targetIndex]) {
      [nums[i], nums[targetIndex]] = [nums[targetIndex], nums[i]];
    } else {
      i++;
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      return i + 1;
    }
  }
  return n + 1;
};

console.log(firstMissingPositive());
