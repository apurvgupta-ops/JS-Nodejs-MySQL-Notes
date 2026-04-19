function print(fn) {
  const res = fn();
  console.log(res);
}

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
// function moveZeros(arr = [0, 1, 0, 3, 12, 4, 9]) {
//   let left = 0;

//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] !== 0) {
//       [arr[left], arr[i]] = [arr[i], arr[left]];
//       left++;
//     }
//   }
//   return arr;
// }

// const res = moveZeros();
// console.log(res);

// Container water
// function containWater(arr = [1, 8, 6, 2, 5, 4, 8, 3, 7]) {
//   const n = arr.length;
//   let left = 0;
//   let maxArea = 0;
//   let right = n - 1;

//   while (left <= right) {
//     let minHeight = Math.min(arr[left], arr[right]);
//     let width = right - left;
//     let area = minHeight * width;

//     maxArea = Math.max(area, maxArea);

//     if (arr[left] < arr[right]) {
//       left++;
//     } else {
//       right--;
//     }
//   }

//   return maxArea;
// }
// const res = containWater();
// console.log(res);

// Trapping Rain Water
// function trappingWater(arr = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) {
//   const n = arr.length;
//   let left = 0;
//   let right = n - 1;
//   let leftMax = arr[left];
//   let rightMax = arr[right];
//   let totalUnit = 0;

//   while (left <= right)
//     if (leftMax < rightMax) {
//       leftMax = Math.max(leftMax, arr[left]);
//       totalUnit += leftMax - arr[left];
//       left++;
//     } else {
//       rightMax = Math.max(rightMax, arr[right]);
//       totalUnit += rightMax - arr[right];
//       right--;
//     }

//   return totalUnit;
// }

// const res = trappingWater();
// console.log(res);

// !----------------------------
// !26. Remove Duplicates from Sorted Array
// function removeDup(nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]) {
//   let left = 0;

//   for (let right = 1; right < nums.length; right++) {
//     if (nums[left] !== nums[right]) {
//       nums[++left] = nums[right];
//     }
//   }
//   const k = left + 1;

//   for (let i = k; i < nums.length; i++) {
//     nums[i] = "_";
//   }
//   console.log(nums);
//   return k;
// }

// print(removeDup);

// !27. Remove Element
// ?Approach 1
// function removeEle(nums = [3, 2, 2, 3], val = 3) {
//   let left = 0;
//   for (let right = 0; right < nums.length; right++) {
//     if (nums[right] !== val) {
//       nums[left++] = nums[right];
//     }
//   }
//   return left;
// }

// ?Approach 2 if asked how many non-val elements are there
// function removeEle(nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2) {
//   let count = 0;
//   for (let right = 0; right < nums.length; right++) {
//     if (nums[right] === val) {
//       count++;
//     }
//   }
//   return nums.length - count;
// }

// print(removeEle);

// !283. Move Zeroes
// function moveZeros(nums = [0, 1, 0, 3, 12]) {
//   let left = 0;
//   for (let right = 0; right < nums.length; right++) {
//     if (nums[right] !== 0) {
//       [nums[left], nums[right]] = [nums[right], nums[left]];
//       left++;
//     }
//   }

//   return nums;
// }
// print(moveZeros);

// !977. Squares of a Sorted Array
// function sqSortedArray(nums = [-4, -1, 0, 3, 10]) {
//   let left = 0;
//   let right = nums.length - 1;
//   let pos = nums.length - 1;
//   let res = [];

//   while (left <= right) {
//     let lsq = nums[left] ** 2;
//     let rsq = nums[right] ** 2;

//     if (lsq > rsq) {
//       res[pos--] = lsq;
//       left++;
//     } else {
//       res[pos--] = rsq;
//       right--;
//     }
//   }
//   return res;
// }

// print(sqSortedArray);
