function print(fn) {
  const res = fn();
  console.log(res);
}

// !Find the Largest element in an array
// function Largest(nums = [2, 5, 1, 3, 0]) {
//   let max = 0;
//   for (let i of nums) {
//     max = Math.max(max, i);
//   }
//   return max;
// }

// print(Largest);

// !Find Second Smallest and Second Largest Element in an array
// function secondMaxMin(nums = [7, 7, 5]) {
//   if (nums.length < 2) return { secondMax: null, secondMin: null };

//   let max = -Infinity;
//   let secondMax = -Infinity;
//   let min = Infinity;
//   let secondMin = Infinity;

//   for (let i of nums) {
//     if (max < i) {
//       secondMax = max;
//       max = i;
//     } else if (i < max && i > secondMax) {
//       secondMax = i;
//     }

//     if (min > i) {
//       secondMin = min;
//       min = i;
//     } else if (i > min && i < secondMin) {
//       secondMin = i;
//     }
//   }
//   return {
//     secondMax: secondMax === -Infinity ? null : secondMax,
//     secondMin: secondMin === Infinity ? null : secondMin,
//   };
// }

// print(secondMaxMin);

// !Check if an Array is Sorted
// function isArraySorted(nums = [1, 2, 3, 4, 5]) {
//   if (nums.length <= 1) return true;

//   for (let i = 1; i < nums.length; i++) {
//     if (nums[i] < nums[i - 1]) {
//       return false;
//     }
//   }
//   return true;
// }

// print(isArraySorted);

// !Remove Duplicates in-place from Sorted Array
function removeDuplicates(nums = [1, 1, 2, 2, 2, 3, 3]) {}
print(removeDuplicates);
