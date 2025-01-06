// Given an integer array arr and a mapping function fn, return a new array with a transformation applied to each element.

// The returned array should be created such that returnedArray[i] = fn(arr[i], i).

// Please solve it without the built-in Array.map method.

// Example 1:

// Input: arr = [1,2,3], fn = function plusone(n) { return n + 1; }
// Output: [2,3,4]
// Explanation:
// const newArray = map(arr, plusone); // [2,3,4]
// The function increases each value in the array by one.
// Example 2:

// Input: arr = [1,2,3], fn = function plusI(n, i) { return n + i; }
// Output: [1,3,5]
// Explanation: The function increases each value by the index it resides in.
// Example 3:

// Input: arr = [10,20,30], fn = function constant() { return 42; }
// Output: [42,42,42]
// Explanation: The function always returns 42.

/**
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */
var map = function (arr, fn) {
  const newArray = [];
  for (let i = 0; i < arr.length; i++) {
    newArray.push(fn(arr[i], i));
  }
  return newArray;
};

// Example 1:
const arr1 = [1, 2, 3];
const plusOne = function(n) { return n + 1; };
console.log(map(arr1, plusOne)); // Output: [2, 3, 4]

// Example 2:
const arr2 = [1, 2, 3];
const plusI = function(n, i) { return n + i; };
console.log(map(arr2, plusI)); // Output: [1, 3, 5]

// Example 3:
const arr3 = [10, 20, 30];
const constant = function() { return 42; };
console.log(map(arr3, constant)); // Output: [42, 42, 42]
