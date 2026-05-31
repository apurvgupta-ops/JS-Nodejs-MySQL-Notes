// !912. Sort an Array =< we can also do this with heap sort, quick sort, counting sort, radix sort, bucket sort, etc. but merge sort is the most efficient and stable sorting algorithm with O(n log n) time complexity and O(n) space complexity.
// class MergeSorter {
//   /**
//    * Public method to execute Merge Sort on an array.
//    * @param {number[]} arr
//    * @returns {number[]} New or sorted array references.
//    */
//   static sort(arr) {
//     if (!arr || arr.length <= 1) return arr;
//     this._mergeSort(arr, 0, arr.length - 1);
//     return arr;
//   }

//   static _mergeSort(arr, left, right) {
//     if (left >= right) return;

//     // Prevents floating point issues and structural integer bounds overflow
//     const mid = left + Math.floor((right - left) / 2);

//     this._mergeSort(arr, left, mid);
//     this._mergeSort(arr, mid + 1, right);
//     this._merge(arr, left, mid, right);
//   }

//   static _merge(arr, left, mid, right) {
//     const temp = new Array(right - left + 1);
//     let i = left;
//     let j = mid + 1;
//     let k = 0;

//     // Inward weaving comparison traversal
//     while (i <= mid && j <= right) {
//       if (arr[i] <= arr[j]) {
//         temp[k++] = arr[i++];
//       } else {
//         temp[k++] = arr[j++];
//       }
//     }

//     // Exhaust remaining elements from left partition
//     while (i <= mid) {
//       temp[k++] = arr[i++];
//     }

//     // Exhaust remaining elements from right partition
//     while (j <= right) {
//       temp[k++] = arr[j++];
//     }

//     // Write the temporary buffer block configurations back to original storage
//     for (let m = 0; m < temp.length; m++) {
//       arr[left + m] = temp[m];
//     }
//   }
// }

// // Example usage:
// const arr = [38, 27, 43, 3, 9, 82, 10];
// console.log(MergeSorter.sort(arr)); // Output: [3, 9, 10, 27, 38, 43, 82]

// !1365. How Many Numbers Are Smaller Than the Current Number
// var smallerNumbersThanCurrent = function (nums = [7]) {
//   const sortedArr = [...nums].sort((a, b) => a - b);

//   let map = new Map();

//   for (let i = 0; i < nums.length; i++) {
//     if (!map.has(sortedArr[i])) {
//       map.set(sortedArr[i], i);
//     }
//   }

//   return nums.map((num) => map.get(num));

//   // without map => this also create the loops to worst case would be O(n^2)
//   // return nums.map(num => sorted.indexOf(num));
// };

// console.log(smallerNumbersThanCurrent());

// !179. Largest Number => With inbuit funciton
// var largestNumber = function (nums = [3, 30, 34, 5, 9]) {
//   const strNums = nums.map(String);
//   strNums.sort((a, b) => (b + a).localeCompare(a + b));

//   if (strNums[0] === "0") {
//     return "0";
//   }

//   return strNums.join("");
// };

// console.log(largestNumber());

// !179. Largest Number => Without inbuit funciton
// !274. H-Index
