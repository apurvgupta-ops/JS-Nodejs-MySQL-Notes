// ! Largest Element in an Array
// ?Brute Force O(n2)
// function fun(arr) {
//   let largest = 0;
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr.length; j++) {
//       if (arr[i] < arr[j]) {
//         largest = arr[j];
//       }
//     }
//   }
//   return largest;
// }

// ?Brute Force O(nlogn)
// function fun(arr) {
//   return arr.sort((a, b) => a - b)[arr.length - 1];
// }

// ?Optimize Approach O(n)
// function fun(arr) {
//   let max = arr[0];
//   for (let i of arr) {
//     if (max < i) {
//       max = i;
//     }
//   }

//   return max;
// }
// const arr = [1, 20, 4, 6, 30, 8, 2, 9, 50];
// console.log(fun(arr));

// ! Second Largest Element in an Array without sorting
// ?Brute Force O(n)
// function fun(arr) {
//   if (arr.length < 2) {
//     return;
//   }

//   let max = 0;
//   let SecondLargest = 0;
//   for (let i of arr) {
//     if (max < i) {
//       SecondLargest = max;
//       max = i;
//     }

//     if (i > SecondLargest && i != max) {
//       SecondLargest = i;
//     }
//   }
//   return { max, SecondLargest };
// }
// const arr = [1, 2, 4, 7, 0, 5];

// console.log(fun(arr));

// ! Check if the array is sorted
// ? Optimal Force O(n)
// function fun(arr) {
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] > arr[i + 1]) {
//       return false;
//     }
//   }
//   return true;
// }

// const arr = [1, 2, 4, 3, 0, 5];

// console.log(fun(arr));

// ! * Remove Duplicates in-place from Sorted Array
// ? Brute Force O(n)
// function fun(arr) {
//   const newArray = [...new Set(arr)];

//   while (newArray.length < arr.length) {
//     newArray.push("_");
//   }
//   return newArray;
// }

// ? WithOut inbuild function :
// function fun(arr) {
//   let i = 0;
//   for (let j = 1; j < arr.length; j++) {
//     if (arr[i] !== arr[j]) {
//       i++;
//       arr[i] = arr[j];
//     }
//   }

//   // for dash _
//   for (let d = i + 1; d < arr.length; d++) {
//     arr[d] = "_";
//   }
//   return arr;
// }

// const arr = [1, 1, 2, 2, 2, 3, 3];
// console.log(fun(arr));

// ! Left Rotate the Array by One
/*
Example 1:
Input: N = 5, array[] = {1,2,3,4,5}
Output: 2,3,4,5,1
Explanation: 
Since all the elements in array will be shifted 
toward left by one so ‘2’ will now become the 
first index and and ‘1’ which was present at 
first index will be shifted at last.
*/

// function fun(arr) {
//   const n = arr.length;
//   let firstElement = arr[0];
//   for (let i = 1; i < n; i++) {
//     arr[i - 1] = arr[i];
//   }
//   arr[n - 1] = firstElement;

//   return arr;
// }

// ? * Rotation by K
// function fun(arr) {
//   for (let i = 0; i < k; i++) {
//     const firstElement = arr[0];
//     for (let j = 1; j < arr.length; j++) {
//       arr[j - 1] = arr[j];
//     }
//     arr[arr.length - 1] = firstElement;
//   }
//   return arr;
// }
// const arr = [1, 2, 3, 4, 5];
// const k = 3;
// console.log(fun(arr, k));

// ! Move all Zeros to the end of the array

// ? Brute Force : O(n)
// function fun(arr) {
//   const n = arr.length;
//   for (let i = 0; i < n - 1; i++) {
//     for (let j = 1; j < n - 1; j++) {
//       if (arr[j] == 0) {
//         const ele = arr[j];
//         arr[j] = arr[j + 1];
//         arr[j + 1] = ele;
//       }
//     }
//   }
//   return arr;
// }

// ? Optimal : O(n)
// function fun(arr) {
//   const n = arr.length;
//   let count = 0;
//   for (let i = 0; i < n; i++) {
//     if (arr[i] !== 0) {
//       arr[count] = arr[i];
//       count++;
//     }
//   }

//   while (count < n) {
//     arr[count] = 0;
//     count++;
//   }

//   return arr;
// }
// const arr = [1, 0, 2, 3, 0, 4, 0, 1];
// console.log(fun(arr));

// ! Linear Search
// function fun(arr, num) {
//   for (let [i, v] of Object.entries(arr)) {
//     if (num == v) {
//       return `${v} is present in the ${i}th index`;
//     }
//   }
//   return false;
// }
// const arr = [1, 2, 3, 4, 5];
// const num = 6;
// console.log(fun(arr, num));

// ! * Union of Two Sorted Arrays
/* 
Example 1:
Input:
n = 5,m = 5.
arr1[] = {1,2,3,4,5}  
arr2[] = {2,3,4,4,5}
Output:
 {1,2,3,4,5}

Explanation: 
Common Elements in arr1 and arr2  are:  2,3,4,5
Distnict Elements in arr1 arFind the missing number in an arraye : 1
Distnict Elemennts in arr2 are : No distinct elements.
Union of arr1 and arr2 is {1,2,3,4,5} 
*/

// ? Brute Force Approach
// function fun(arr1, arr2) {
//   const arr3 = arr1.concat(arr2);
//   const set = [...new Set(arr3)];
//   set.sort((a, b) => a - b);
//   return set;
// }

// ? Optimal Approach
// function fun(arr1, arr2) {
//   const n = arr1.length - 1;
//   const m = arr2.length - 1;
//   let res = [];
//   let i = 0;
//   let j = 0;
//   while (i < n && j < m) {
//     if (arr1[i] === arr2[j]) {
//       if (res[res.length - 1] !== arr1[i]) {
//         res.push(arr1[i]);
//       }
//       i++;
//       j++;
//     } else if (arr1[i] < arr2[j]) {
//       if (res[res.length - 1] !== arr1[i]) {
//         res.push(arr1[i]);
//       }
//       i++;
//     } else {
//       if (res[res.length - 1] !== arr1[j]) {
//         res.push(arr1[j]);
//       }
//     }
//     j++;
//   }

//   // Add remaining elements
//   while (i < arr1.length) {
//     if (res[res.length - 1] !== arr1[i]) {
//       res.push(arr1[i]);
//     }
//     i++;
//   }

//   while (j < arr2.length) {
//     if (res[res.length - 1] !== arr2[j]) {
//       res.push(arr2[j]);
//     }
//     j++;
//   }

//   return res;
// }

// const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const arr2 = [2, 3, 4, 4, 5, 11, 12];

// console.log(fun(arr1, arr2));

// ! Find the missing number in an array

// ? Brute Force : O(n)
// function fun(arr) {
//   const map = new Map();
//   for (let i = 0; i < arr.length; i++) {
//     map.set(arr[i], true);
//   }

//   for (let i = 1; i < arr.length+1; i++) {
//     if (!map.has(i)) {
//       return i;
//     }
//   }
//   return map;
// }

// ? Optimal : O(n)
// function fun(arr) {
//   const n = arr.length + 1;
//   const total = (n * (n + 1)) / 2;
//   const sum = arr.reduce((acc, num) => acc + num, 0);
//   return total - sum;
// }

// const arr = [1, 2, 4, 5];
// console.log(fun(arr));

// ! Count Maximum Consecutive One's in the array
// function fun(arr) {
//   let count = 0;
//   let maxCount = 0;

//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] === 1) {
//       count++;
//       maxCount = Math.max(maxCount, count);
//     } else {
//       count = 0;
//     }
//   }
//   return maxCount;
// }

// const arr = [1, 1, 1, 1, 0, 1, 1, 1];
// console.log(fun(arr));

// ! Find the number that appears once, and the other numbers twice

// function fun(arr) {
//   const map = new Map();

//   for (let i = 0; i < arr.length; i++) {
//     map.set(arr[i], (map.get(arr[i]) || 0) + 1);
//   }
//   for (let [i, v] of map) {
//     if (v == 1) {
//       return `In this array, only element ${i} appear once and the other elements appear twice. So, is ${i} the answer.`;
//     }
//   }

//   return false;
// }
// const arr = [4, 4, 1, 1, 2];
// console.log(fun(arr));

// ! * Longest Subarray with given Sum K(Positives)
/*
Example 1:
Input Format: N = 3, k = 5, array[] = {2,3,5}
Result: 2
Explanation: The longest subarray with sum 5 is {2, 3}. And its length is 2.
*/
// ? Brute Force : O(n2)
// function fun(arr, k) {
//   const n = arr.length;
//   let bestSub = [];
//   let maxLength = 0;
//   for (let i = 0; i < n; i++) {
//     let sum = 0;
//     let temp = [];
//     for (let j = i; j < n; j++) {
//       sum += arr[j];
//       temp.push(arr[j]);
//       if (sum == k) {
//         if (maxLength < temp.length) {
//           maxLength = temp.length;
//           bestSub = [...temp];
//         }
//       }
//     }
//   }

//   if (bestSub.length > 0) {
//     return `The longest subarray with sum ${k} is [${bestSub}] with length ${bestSub.length}.`;
//   }
//   return false;
// }

// ? Optimal  : O(n) **
// function fun(arr, k) {
//   const map = new Map();
//   let currentSum = 0;
//   let maxLength = 0;

//   for (let i = 0; i < arr.length; i++) {
//     currentSum += arr[i];

//     // Case 1: If currentSum itself is k
//     if (currentSum === k) {
//       maxLength = i + 1;
//     }

//     // Case 2: If (currentSum - k) was seen before
//     if (map.has(currentSum - k)) {
//       const prevIndex = map.get(currentSum - k);
//       maxLength = Math.max(maxLength, i - prevIndex);
//     }

//     // Store currentSum if not already stored (first occurrence only)
//     if (!map.has(currentSum)) {
//       map.set(currentSum, i);
//     }
//   }

//   return maxLength;
// }

// const arr = [2, 3, 2, 5, 1, 1, 1, 3, 4];
// const k = 10;
// console.log(fun(arr, k));

// ! * Longest Subarray with sum K | [Postives and Negatives]
// function fun(arr, k) {
//   const n = arr.length;
//   let bestSubArray = [];
//   let maxLength = 0;

//   for (let i = 0; i < n; i++) {
//     let sum = 0;
//     let temp = [];

//     for (let j = i; j < n; j++) {
//       sum += arr[j];
//       temp.push(arr[j]);
//       if (sum === k) {
//         if (maxLength < temp.length) {
//           maxLength = temp.length;
//           bestSubArray = [...temp];
//         }
//       }
//     }
//   }

//   if (bestSubArray.length > 0) {
//     return `The longest subarray with sum ${k} is [${bestSubArray}] with length ${bestSubArray.length}.`;
//   }
//   return false;
// }
// const arr = [2, 2, 5, 1, -1, 3, 4];
// const k = 10;

// console.log(fun(arr, k));

// ! * Two Sum : Check if a pair with given sum exists in Array

// ? Brute Force : O(n2)
// function fun(arr, k) {
//   const n = arr.length;
//   for (let i = 0; i < n; i++) {
//     for (let j = i; j < n; j++) {
//       if (arr[i] + arr[j] === k) {
//         return `So, the answer is “YES” for the first variant and [${i}, ${j}] for 2nd variant.`;
//       }
//     }
//   }
//   return false;
// }

// ? * Optimal : O(n)
// function fun(arr, k) {
//   const set = new Set();
//   for (let i = 0; i < arr.length; i++) {
//     const comp = k - arr[i];
//     console.log(comp);
//     console.log("Before", set);
//     if (set.has(comp)) {
//       return "yes";
//     }
//     set.add(arr[i]);
//     console.log("After", set);
//   }
//   return false;
// }

// const arr = [2, 6, 5, 8, 11];
// const k = 14;
// console.log(fun(arr, k));

// ! Sort an array of 0s, 1s and 2s
