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

// ! Remove Duplicates in-place from Sorted Array
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

// ? Rotation by K
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

// ! Union of Two Sorted Arrays
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

//  ! Find the missing number in an array

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
