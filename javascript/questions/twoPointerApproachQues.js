function print(fn) {
  const res = fn();
  console.log(res);
}

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

// ? With While Loop (can do with for loop as well)
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

// !15. 3Sum
// function threeSum(nums = [-1, 0, 1, 2, -1, -4]) {
//   const n = nums.length;
//   nums.sort((a, b) => a - b);
//   let res = [];
//   for (let i = 0; i < n - 2; i++) {
//     // to i remove duplicate
//     if (i > 0 && nums[i] === nums[i - 1]) continue;

//     let left = i + 1;
//     let right = n - 1;
//     while (left < right) {
//       let sum = nums[i] + nums[left] + nums[right];

//       if (sum === 0) {
//         res.push([nums[i], nums[left], nums[right]]);

//         // to remove left duplicates
//         while (left < right && nums[left] === nums[left + 1]) left++;

//         // to remove right duplicates
//         while (left < right && nums[right] === nums[right - 1]) right--;

//         left++;
//         right--;
//       } else if (sum > 0) right--;
//       else left++;
//     }
//   }
//   return res;
// }
// print(threeSum);

// !11. Container With Most Water
// function maxArea(height = [1, 8, 6, 2, 5, 4, 8, 3, 7]) {
//   let n = height.length;
//   let left = 0;
//   let right = n - 1;

//   let maxarea = 0;

//   while (left <= right) {
//     let minHeight = Math.min(height[left], height[right]);
//     let breadth = right - left;
//     let area = minHeight * breadth;

//     maxarea = Math.max(area, maxarea);

//     if (height[left] < height[right]) left++;
//     else right--;
//   }

//   return maxarea;
// }

// print(maxArea);

// !167. Two Sum II - Input Array Is Sorted
// function twosum(nums = [2, 7, 11, 15], target = 9) {
//   let left = 0;
//   let right = nums.length - 1;

//   while (left < right) {
//     let sum = nums[left] + nums[right];

//     if (sum === target) {
//       return [left + 1, right + 1];
//     } else if (sum > target) {
//       right--;
//     } else left++;
//   }
//   return [-1, -1];
// }
// print(twosum);

// !75. Sort Colors => DNF
// function sortColor(nums = [2, 0, 2, 1, 1, 0]) {
//   let low = 0;
//   let mid = 0;

//   let high = nums.length - 1;

//   while (mid <= high) {
//     if (nums[mid] === 1) {
//       mid++;
//     } else if (nums[mid] == 0) {
//       [nums[low], nums[mid]] = [nums[mid], nums[low]];
//       low++;
//       mid++;
//     } else {
//       [nums[high], nums[mid]] = [nums[mid], nums[high]];
//       high--;
//     }
//   }

//   return nums;
// }

// print(sortColor);

// !16. 3Sum Closest
// function Closest(nums = [-1, 2, 1, -4], target = 1) {
//   nums.sort((a, b) => a - b);
//   let closest = Infinity;
//   for (let i = 0; i < nums.length - 2; i++) {
//     let j = i + 1;
//     let k = nums.length - 1;

//     while (j < k) {
//       let sum = nums[i] + nums[j] + nums[k];

//       if (Math.abs(sum - target) < Math.abs(closest - target)) {
//         closest = sum;
//       }

//       if (sum === target) return sum;
//       else if (sum < target) j++;
//       else k--;
//     }
//   }
//   return closest;
// }
// print(Closest);

// !905. Sort Array By Parity
// function sortByParity(nums = [3, 1, 2, 4]) {
//   if (nums.length === 1) return nums;

//   let i = 0;
//   let j = nums.length - 1;
//   while (i < j) {
//     if (nums[i] % 2 !== 0) {
//       [nums[i], nums[j]] = [nums[j], nums[i]];
//       j--;
//     } else {
//       i++;
//     }
//   }
//   return nums;
// }
// print(sortByParity);

// !189. Rotate Array

// ? WAY 1
// function rotateArray(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {
//   let n = nums.length;
//   k = k % n;
//   let l = k;
//   let j = n - 1;
//   let z = n - 1;

//   // reverse all
//   for (let i = 0; i < j; i++) {
//     [nums[i], nums[j]] = [nums[j], nums[i]];
//     j--;
//   }

//   // reverse first k — fix: use r instead of mutating k
//   let r = l - 1
//   for (let i = 0; i < r; i++) {
//     [nums[i], nums[r]] = [nums[r], nums[i]];
//     r--; // r moves, k stays
//   }

//   // reverse rest — untouched, already correct
//   for (let i = l; i < z; i++) {
//     [nums[i], nums[z]] = [nums[z], nums[i]];
//     z--;
//   }

//   return nums;
// }

// ? WAY 2 (Most Optimal)
// function rotateArray(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {
//   let n = nums.length;
//   k = k % n;

//   reverse(nums, 0, n - 1);
//   reverse(nums, 0, k - 1);
//   reverse(nums, k, n - 1);

//   return nums;
// }

// function reverse(nums, left, right) {
//   while (left < right) {
//     [nums[left], nums[right]] = [nums[right], nums[left]];
//     left++;
//     right--;
//   }
// }

// ? WAY 3 sc O(n)
// function rotateArray(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {
//   const n = nums.length;
//   k = k % n;
//   const result = [];
//   for (let i = n - k; i < n; i++) result.push(nums[i]); // last k elements first
//   for (let i = 0; i < n - k; i++) result.push(nums[i]); // then rest
//   for (let i = 0; i < n; i++) nums[i] = result[i]; // copy back
//   return nums;
// }

// ? Brute Force : tc O(n2)
// function rotateArray(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {
//   let n = nums.length;
//   for (let i = 0; i < k; i++) {
//     let lastEle = nums[n - 1];

//     for (let j = n - 1; j >= 0; j--) {
//       nums[j] = nums[j - 1];
//     }
//     nums[0] = lastEle;
//   }

//   return nums;
// }

// print(rotateArray);
