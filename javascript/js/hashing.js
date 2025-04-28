// ! Given an array of integers: [1, 2, 1, 3, 2] and we are given some queries: [1, 3, 4, 2, 10]. For each query, we need to find out how many times the number appears in the array. For example, if the query is 1 our answer would be 2, and if the query is 4 the answer will be 0.

// function fun(arr, query) {
//   const freq = {};

//   for (let num of arr) {
//     freq[num] = (freq[num] || 0) + 1;
//   }

//   //   for (let i in freq) {
//   //     console.log(i, freq[i]);
//   //   }

//   const res = [];
//   for (let i of query) {
//     res.push(freq[i] || 0);
//   }
//   return res;
// }

// const arr = [1, 2, 1, 3, 2];
// const queries = [1, 3, 4, 2, 10];
// console.log(fun(arr, queries));

// ? Using MAP

// const map = new Map();
// map.set("name", "Apurv");
// console.log(map);
// let name = map.get("name");
// console.log(name);

// function fun(arr, query) {
//   let map = new Map();

//   for (let i of arr) {
//     map.set(i, (map.get(i) || 0) + 1);
//   }

//   let res = [];
//   for (let i of query) {
//     res.push(map.get(i) || 0);
//   }

//   return res;
// }

// const arr = [1, 2, 1, 3, 2];
// const queries = [1, 3, 4, 2, 10];

// console.log(fun(arr, queries));

// ! Count frequency of each element in the array
// function fun(arr) {
//   //   const freq = {};
//   //   for (let i of arr) {
//   //     freq[i] = (freq[i] || 0) + 1;
//   //   }

//   // ? Using Map
//   const map = new Map();
//   for (let i of arr) {
//     map.set(i, (map.get(i) || 0) + 1);
//   }
//   return map;
// }

// const arr = [10, 5, 10, 15, 10, 5];
// console.log(fun(arr));

// ! Find the highest/lowest frequency element
// function fun(arr) {
//   const freq = {};
//   for (let i of arr) {
//     freq[i] = (freq[i] || 0) + 1;
//   }
//   //   const res = Object.values(freq);
//   //   console.log(res);
//   //   const max = Math.max(...res);
//   //   const min = Math.min(...res);
//   //   console.log(max, min);

//   let maxEle = null;
//   let minEle = null;
//   let maxFreq = -Infinity;
//   let minFreq = Infinity;

//   // ? Other way
//   //   for (let i in freq) {
//   //     if (freq[i] > maxFreq) {
//   //       console.log(freq[i]);
//   //       maxFreq = freq[i];
//   //       maxEle = i;
//   //     }

//   //     if (freq[i] < minFreq) {
//   //       minFreq = freq[i];
//   //       minEle = i;
//   //
//   //   }

//   // ? shorter way
//   for (let [key, value] of Object.entries(freq)) {
//     if (value > maxFreq) {
//       maxFreq = value;
//       maxEle = key;
//     }
//     if (value < minFreq) {
//       minFreq = value;
//       minEle = key;
//     }
//   }

//   return `Max freq is of ${maxEle} with freq ${maxFreq} \nMin freq is of ${minEle} with freq ${minFreq}`;
// }

// const arr = [10, 5, 10, 15, 10, 5];
// console.log(fun(arr));

// ! Find intersection of two arrays
// function fun(arr1, arr2) {
//   const map = new Map();

//   for (let i of arr1) {
//     for (let j of arr2) {
//       console.log({ i, j });
//       if (i === j) {
//         map.set(i, true);
//       }
//     }
//   }
//   return map;
// }
// const arr1 = [1, 4, 2, 5];
// const arr2 = [2, 3, 4, 5];
// console.log(fun(arr1, arr2));

// ! * Check if two strings are anagrams
/* Example:
Input: "listen", "silent"
Output: true

Explanation:
Both strings have exactly the same characters, just in different orders. */

// function fun(str1, str2) {
//   const map = new Map();

//   // Check if str1 length is not equal to str2
//   if (str1.length !== str2.length) {
//     return false;
//   }

//   for (let char of str1) {
//     map.set(char, (map.get(char) || 0) + 1);
//   }
//   for (let char of str2) {
//     if (!map.has(char) || map.get(char) === 0) {
//       return false;
//     }
//     map.set(char, map.get(char) - 1);
//   }

//   console.log(map);
//   return true;
// }
// const str1 = "listen";
// const str2 = "silent";
// console.log(fun(str1, str2));

// ! Majority Element (> n/2 times)

/* Question:
Find the element that appears more than half the size of the array.

Example:
Input: [2,2,1,1,1,2,2]
Output: 2

Explanation:
2 appears 4 times out of 7.*/

// function fun(arr) {
//   const length = arr.length;
//   const freq = {};
//   for (let i of arr) {
//     freq[i] = (freq[i] || 0) + 1;
//   }
//   const values = Object.values(freq);
//   const max = Math.max(...values);
//   console.log(max, length);
//   if (max > length / 2) {
//     return true;
//   }
//   return false;
// }
// const arr = [2, 2, 1, 1, 1, 2, 2];
// console.log(fun(arr));

// ! Longest Consecutive Sequence
/*
Question:
Find the length of the longest consecutive elements sequence.

Example:
Input: [100, 4, 200, 1, 3, 2]
Output: 4

Explanation:
Sequence [1,2,3,4] is of length 4.*/

function fun(arr) {}
const arr = [100, 4, 200, 1, 3, 2];
console.log(fun(arr));
