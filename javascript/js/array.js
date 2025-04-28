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
