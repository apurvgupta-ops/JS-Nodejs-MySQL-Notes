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
// var hIndex = function (citations = [3, 0, 6, 1, 5]) {
//   citations.sort((a, b) => b - a); // [6,5,3,1,0]

//   let h = 0;
//   for (let i = 0; i < citations.length; i++) {
//     if (citations[i] >= i + 1) {
//       h = i + 1;
//     } else {
//       break;
//     }
//   }

//   return h;
// };

// console.log(hIndex());

// !280. Wiggle Sort
// var wiggleSort = function (nums = [1, 5, 1, 1, 6, 4]) {
//   for (let i = 0; i < nums.length; i++) {
//     if (i % 2 === 0) {
//       if (nums[i] > nums[i + 1]) {
//         [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
//       }
//     } else {
//       if (nums[i] < nums[i + 1]) {
//         [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
//       }
//     }
//   }

//   return nums;
// };

// console.log(wiggleSort());

// !324. Wiggle Sort II
// function wiggleSortII(nums = [1, 5, 1, 1, 6, 4]) {
//   const sorted = [...nums].sort((a, b) => a - b);
//   const n = nums.length;
//   let j = Math.floor((n + 1) / 2);
//   let k = n;

//   for (let i = 0; i < n; i++) {
//     nums[i] = i % 2 === 0 ? sorted[--j] : sorted[--k];
//   }

//   return nums;
// }

// console.log(wiggleSortII());

// !1636. Sort Array by Increasing Frequency
var frequencySort = function (nums = [4, 1, 1, 2, 2, 3]) {
  let map = new Map();

  for (let i = 0; i < nums.length; i++) {
    map.set(nums[i], (map.get(nums[i]) || 0) + 1);
  }
  console.log({ map });
  //   Custom Logic
  let sortedArr = nums.sort((a, b) => {
    console.log({ a, b });
    let freqA = map.get(a);
    let freqB = map.get(b);
    console.log({ freqA, freqB });
    if (freqA !== freqB) {
      console.log({ diff: freqA - freqB });
      return freqA - freqB;
    }
    return b - a;
  });

  return sortedArr;
};

console.log(frequencySort());

// !1337. The K Weakest Rows in a Matrix
