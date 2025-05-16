/*
Binary Search is a searching algorithm used to find the position of a target value in a sorted array by repeatedly dividing the search interval in half.

=> Key Characteristics:
Requires the array to be sorted

Has a time complexity of O(log n)

Works by comparing the middle element with the target:

If equal → target found

If target < mid → search left half

If target > mid → search right half 
*/

// ! Binary Search to find X in sorted array
// ? O(log n)
// Approach 1 : Iterative
// function fun(arr, k) {
//   const n = arr.length;
//   let low = 0;
//   let high = n - 1;

//   while (low <= high) {
//     let mid = Math.floor((low + high) / 2);

//     if (arr[mid] === k) return `true, ${arr[mid]}`;
//     else if (arr[mid] < k) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }
//   return -1;
// }

// Apporach 2 : Recursive Approach

// function fun(arr, k, low = 0, high = arr.length - 1) {
//   if (low > high) return `false, not found`;
//   let mid = Math.floor((low + high) / 2);
//   if (arr[mid] === k) return `true, ${arr[mid]}`;
//   else if (arr[mid] < k) {
//     return fun(arr, k, mid + 1, high);
//   } else {
//     return fun(arr, k, low, mid - 1);
//   }
// }

// const arr = [1, 2, 3, 4, 5, 6];
// const k = 5;
// console.log(fun(arr, k));

// ! Implement Lower/Upper Bound
/*
Input Format: N = 5, arr[] = {3,5,8,15,19}, x = 9
Result: 3
Explanation: Index 3 is the smallest index such that arr[3] >= x.
*/
// ! Lower Bound
// ? Brute Force : O(n)
// function fun(arr, k) {
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] > k) {
//       return `Index ${i} is the smallest index such that ${arr[i]} >= ${x}.`;
//     }
//   }
//   return false;
// }

// ? Optimal : O(logn)
// function fun(arr, x) {
// let low = 0;
// let high = arr.length - 1;
// let ans = arr.length;

// while (low <= high) {
//   let mid = Math.floor((low + high) / 2);

//   if (arr[mid] >= x) {
//     ans = mid;
//     high = mid - 1;
//   } else {
//     low = mid + 1;
//   }
// }
// return ans === arr.length
//   ? "No lower bound found"
//   : `Index ${ans} is the lower bound, value = ${arr[ans]}`;
// }

// ! Upper Bound
// ? Optimal : O(logn)
// function fun(arr, x) {
//   let low = 0;
//   let high = arr.length - 1;
//   let ans = arr.length;

//   while (low <= high) {
//     let mid = Math.floor((low + high) / 2);

//     if (arr[mid] > x) {
//       ans = mid;
//       high = mid - 1;
//     } else {
//       low = mid + 1;
//     }
//   }

//   return ans === arr.length
//     ? "No upper bound found"
//     : `Index ${ans} is the upper bound, value = ${arr[ans]}`;
// }

// const arr = [3, 5, 8, 9, 15, 19];
// const x = 9;
// console.log(fun(arr, x));

// ! Search Insert Position
/*
Input Format: arr[] = {1,2,4,7}, x = 6
Result: 3
Explanation: 6 is not present in the array. So, if we will insert 6 in the 3rd index(0-based indexing), the array will still be sorted. {1,2,4,6,7}.
*/
