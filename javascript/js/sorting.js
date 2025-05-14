// ! Bubble Sort
/*
Bubble Sort is a simple sorting algorithm that repeatedly compares adjacent elements and swaps them if they are in the wrong order.
In each pass through the array, the largest element "bubbles up" to its correct position at the end.
*/
// function fun(arr) {
//   let n = arr.length;
//   for (let i = 0; i < n - 1; i++) {
//     for (let j = 0; j < n - i - 1; j++) {
//       if (arr[j] > arr[j + 1]) {
//         [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//       }
//     }
//   }
//   return arr;
// }

// const arr = [3, 5, 7, 2, 1, 4];
// console.log(fun(arr));

// ! Selection Sort
/*
Definition:
Selection Sort is a simple, comparison-based sorting algorithm that divides the array into two parts:
Sorted part (built from left to right)
Unsorted part (remaining elements)
In every step:
Find the minimum element from the unsorted part.
Swap it with the first unsorted element.
Repeat until the whole array is sorted.
*/

// function fun(arr) {
//   n = arr.length;

//   for (let i = 0; i < n - 1; i++) {
//     let smallestIndex = i;

//     for (let j = i + 1; j < n; j++) {
//       if (arr[j] < arr[smallestIndex]) {
//         smallestIndex = j;
//       }
//     }

//     if (smallestIndex !== i) {
//       [arr[i], arr[smallestIndex]] = [arr[smallestIndex], arr[i]];
//     }
//   }
//   return arr;
// }

// const arr = [3, 5, 7, 2, 1, 4];
// console.log(fun(arr));

// ! Merge Sort
function merge(arr, start, mid, end) {
  const temp = [];
  let left = start;
  let newMid = mid + 1;
  while (left <= mid && newMid <= end) {
    // check between 2 half array's
    if (arr[left] < arr[newMid]) {
      temp.push(arr[left]);
      left++;
    } else {
      temp.push(arr[newMid]);
      newMid++;
    }
  }

  // push left out element from left side array
  while (left <= mid) {
    temp.push(arr[left]);
    left++;
  }

  // push left out element from right side array
  while (newMid <= end) {
    temp.push(arr[newMid]);
    newMid++;
  }

  for (let i = 0; i < temp.length; i++) {
    arr[start + i] = temp[i];
  }
}

function mergeSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;
  let mid = Math.floor((start + end) / 2);
  mergeSort(arr, start, mid);
  mergeSort(arr, mid + 1, end);
  merge(arr, start, mid, end);
}

const arr = [4, 2, 1, 6, 7];
mergeSort(arr);
console.log(arr);
