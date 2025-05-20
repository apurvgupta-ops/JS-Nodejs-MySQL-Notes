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

// ? Optimal : O(logn)
// function fun(arr, k) {
//   const n = arr.length;
//   let low = 0;
//   let high = n - 1;

//   while (low <= high) {
//     let mid = Math.floor((low + high) / 2);
//     if (arr[mid] === k) {
//       return mid;
//     } else if (arr[mid] < k) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }

//   return low;
// }

// const arr = [1, 2, 4, 7];
// let k = 3;
// console.log(fun(arr, k));

// ! Floor and Ceil in Sorted Array
/*
Input Format: n = 6, arr[] ={3, 4, 4, 7, 8, 10}, x= 5
Result: 4 7
Explanation: The floor of 5 in the array is 4, and the ceiling of 5 in the array is 7.
*/
// ? Optimal : O(logn)
// function fun(arr, k) {
//   const n = arr.length;
//   let low = 0;
//   let high = n - 1;
//   while (low <= high) {
//     let mid = Math.floor((low + high) / 2);
//     if (arr[mid] === k) {
//       return { floor: arr[mid], ceil: arr[mid] };
//     } else if (arr[mid] < k) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }
//   console.log(low);
//   return { floor: arr[low - 1], ceil: arr[low] };
// }
// const arr = [3, 4, 4, 7, 8, 10];
// const x = 8;

// console.log(fun(arr, x));

// ! Last occurrence in a sorted array
/*
Input: N = 7, target=13, array[] = {3,4,13,13,13,20,40}
Output: 4
Explanation: As the target value is 13 , it appears for the first time at index number 2.
*/

// function fun(arr, k) {
//   const n = arr.length;
//   let low = 0;
//   let high = n - 1;
//   let idx = 0;

//   while (low <= high) {
//     let mid = Math.floor((low + high) / 2);

//     if (arr[mid] === k) {
//       idx = mid;
//       low = mid + 1;
//     } else if (arr[mid] < k) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }

//   return idx;
// }
// const arr = [3, 4, 13, 13, 13, 20, 40];
// const k = 13;
// console.log(fun(arr, k));

// ! Count Occurrences in Sorted Array

// function firstOccurrence(arr, k) {
//   const n = arr.length;
//   let low = 0,
//     high = n - 1;
//   let first = -1;

//   while (low <= high) {
//     let mid = Math.floor((low + high) / 2);
//     if (arr[mid] === k) {
//       first = mid;
//       high = mid - 1;
//     } else if (arr[mid] < k) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }
//   return first;
// }

// function lastOccurrence(arr, k) {
//   const n = arr.length;
//   let low = 0,
//     high = n - 1;
//   let last = -1;

//   while (low <= high) {
//     let mid = Math.floor((low + high) / 2);
//     if (arr[mid] === k) {
//       last = mid;
//       low = mid + 1;
//     } else if (arr[mid] < k) {
//       low = mid + 1;
//     } else {
//       high = mid - 1;
//     }
//   }
//   return last;
// }

// function firstAndLastPosition(arr, k) {
//   let first = firstOccurrence(arr, k);
//   if (first === -1) return [-1, -1];
//   let last = lastOccurrence(arr, k);
//   return [first, last];
// }

// function count(arr, x) {
//   let [first, last] = firstAndLastPosition(arr, x);
//   if (first === -1) return 0;
//   return last - first + 1;
// }
// const arr = [3, 13, 4, 13, 13, 13, 20, 40, 13];
// const k = 13;
// console.log(count(arr, k));

// ! Search Element in a Rotated Sorted Array
/*
Input Format: arr = [4,5,6,7,0,1,2,3], k = 0
Result: 4
Explanation: Here, the target is 0. We can see that 0 is present in the given rotated sorted array, nums. Thus, we get output as 4, which is the index at which 0 is present in the array.
*/
