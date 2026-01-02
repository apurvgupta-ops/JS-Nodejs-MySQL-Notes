// 1️⃣ Find the Maximum and Minimum Element
// Input: [10, 25, 3, 18]
// Output: Max = 25, Min = 3


// function findMaxMin(arr) {
//     let max = -Infinity
//     let min = Infinity
//     for (let i of arr) {
//         // In built
//         // max = Math.max(max, i)
//         // min = Math.min(min, i)

//         // without
//         if (max < i) {
//             max = i
//         }

//         if (min > i) {
//             min = i
//         }
//     }
//     return { max, min }
// }

// console.log(findMaxMin([10, 25, 3, 18, 1]))


// 2️⃣ Reverse an Array (Manual Method Only)
// Input: [1, 2, 3, 4, 5]
// Output: [5, 4, 3, 2, 1]
// ✨ Two pointer technique, no reverse().

// function reverseArr(arr) {
//     let reverse = []
//     for (let i = arr.length; i > 0; i--) {
//         reverse.push(i)
//     }

//     // Inbuilt
//     // return arr.reverse()

//     return reverse;
// }

// console.log(reverseArr([1, 2, 3, 4, 5]))

// 3️⃣ Check if an Array is Sorted (Ascending)
// Input: [1, 2, 3, 4, 5]
// Output: Sorted

// function sortedOrNot(arr) {
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] > arr[i + 1]) {
//             return false
//         }
//     }
//     return true
// }
// console.log(sortedOrNot([1, 2, 3, 4, 5]))

// 4️⃣ Remove All Duplicates From an Array (Use filter method)
// Input: [1, 2, 2, 3, 3, 4]
// Output: [1, 2, 3, 4]

// function removeDuplicate(arr) {

// inBuilt WAY 1
// const unique = [...new Set(arr)];
// return unique

// without WAY 2
// let unique = []
// for (let i of arr) {
//     if (!unique.includes(i)) {
//         unique.push(i)
//     }
// }
// return unique

// WAY 3
// let unique = arr.filter((item, index) => arr.indexOf(item) === index)
// return unique
// }


// console.log(removeDuplicate([1, 2, 2, 3, 3, 4]))


// 5️⃣ Merge Two Arrays Without Using concat or spread
// Input: [1, 2, 3] and [4, 5]
// Output: [1, 2, 3, 4, 5]


// function mergeArrays(arr1, arr2) {

//     // ! InBuilt
//     // let merge = [...arr1, ...arr2]
//     // return merge

//     // ! without (But in this case this is not sorted)
//     // let mergedArr = []
//     // for (let i of arr1) {
//     //     mergedArr.push(i)
//     // }
//     // for (let i of arr2) {
//     //     mergedArr.push(i)
//     // }

//     // ! without (for Sorted)
//     let mergedArr = []
//     let i = 0; let j = 0
//     while (i < arr1.length && j < arr2.length) {
//         if (arr1[i] <= arr2[j]) {
//             mergedArr.push(arr1[i])
//             i++
//         } else {
//             mergedArr.push(arr2[j])
//             j++
//         }
//     }


//     while (i < arr1.length) {
//         mergedArr.push(arr1[i])
//         i++
//     }

//     while (j < arr2.length) {
//         mergedArr.push(arr2[j])
//         j++
//     }

//     return mergedArr
// }


// console.log(mergeArrays([1, 3, 6], [4, 5]))


// 6️⃣ Find the Second Largest Element
// Input: [10, 20, 4, 45, 99]
// Output: 45

// function secondLargest(arr) {
//     let max = 0
//     let secondMax = 0;

//     for (let i of arr) {
//         if (i > max) {
//             secondMax = max;
//             max = i
//         }

//         if (i > secondMax && i !== max) {
//             secondMax = i
//         }
//     }
//     return { max, secondMax }
// }

// console.log(secondLargest([10, 20, 4, 45, 99]))


// 7️⃣ Rotate an Array to the Right by K Steps
// Input: [1, 2, 3, 4, 5], K = 2
// Output: [4, 5, 1, 2, 3]

// function rotateArray(arr, k) {
//     let n = arr.length;
//     k = k % n;

//     for (let i = 0; i < k; i++) {
//         let last = arr[n - 1]
//         for (let j = n - 1; j > 0; j--) {
//             arr[j] = arr[j - 1]
//         }
//         arr[0] = last
//     }
//     return arr
// }

// console.log(rotateArray([1, 2, 3, 4, 5, 6], 2))


// 8️⃣ Check if Two Arrays Are Equal (Same Order)
// Input: [1, 2, 3] vs [1, 2, 3]
// Output: Equal

// function sameOrNot(arr1, arr2) {
//     let n = arr1.length
//     let m = arr2.length
//     let i = 0;
//     let j = 0;

//     if (n !== m) {
//         return false
//     }

//     BY While loop
//     while (i < n && j < m) {
//         if (arr1[i] !== arr2[j]) {
//             return false
//         }
//         i++;
//         j++
//     }

//    BY for loop
//   for (let i = 0; i < arr1.length; i++) {
//     if (arr1[i] !== arr2[i]) return false;
//   }
//     return true
// }

// console.log(sameOrNot([1, 2, 3], [1, 2, 3]))

// 9️⃣ Count Even and Odd Numbers in an Array
// Input: [2, 5, 7, 8, 10]
// Output: Even = 3, Odd = 2

// function evenOddFreq(arr) {
// inbuilt
// return arr.reduce((acc, curr) => {
//     curr % 2 === 0 ? acc.even++ : acc.odd++;
//     return acc
// }, { even: 0, odd: 0 })

// without
// let obj = { even: 0, odd: 0 }
// for (let i of arr) {
//     if (i % 2 === 0) {
//         obj.even++
//     }
//     else {
//         obj.odd++
//     }
// }
// return obj
// }

// console.log(evenOddFreq([2, 5, 7, 8, 10]))


// 1️⃣0️⃣ Find All Unique Pairs Whose Sum Equals a Target
// Input: [1, 2, 3, 4, 5], target = 6
// Output: (1,5), (2,4)

// function uniquePairs(arr, target) {

// single loop(first remove the duplicate value, and then check then substract number is in the set and current number is less then the substract number , if yes then that one is the pair)

// const set = new Set(arr)
// const result = [];
// for (let num of set) {
//     const substractedValue = target - num
//     if (set.has(substractedValue) && num < substractedValue) {
//         result.push([num, substractedValue])
//     }
// }
// return result


// Two loops
// const result = [];
// for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) {
//         if (arr[i] + arr[j] == target) {
//             result.push([arr[i], arr[j]])
//         }
//     }
// }
// return result
// }

// console.log(uniquePairs([1, 2, 3, 4, 5], 6))



// 1️⃣1️⃣ Left Shift an Array by One Position
// Input: [1, 2, 3, 4]
// Output: [2, 3, 4, 1] ✨ Manual shifting, moving first element to end.

// function leftShiftByOne(arr) {
//     let n = arr.length
//     let last = arr[0]

//     for (let i = 0; i < n; i++) {
//         arr[i] = arr[i + 1]
//     }

//     arr[n - 1] = last

//     return arr
// }
// console.log(leftShiftByOne([1, 2, 3, 4]))


// 1️⃣2️⃣ Count How Many Times an Element Appears in an Array
// Input: array = [1, 4, 4, 4, 2], element = 4
// Output: 3

// function freq(arr, target) {
// with map
// const map = new Map()
// for (let i of arr) {
//     map.set(i, (map.get(i) || 0) + 1)
// }
// return map.get(target) || 0;

// without map
// let count = 0;
// for (let i of arr) {
//     if (i === target) count++
// }
// return count;
// }

// console.log(freq([1, 4, 4, 4, 2], 4))



// ! INTERMEDIATE  QUESTIONS

// ? 1️⃣3️⃣ SLIDING WINDOW APPROACH **
// We want to find the maximum of every window of size 3:
// arr = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
//  O(n)

// function maximumSum(arr, k) {
//     let windowSum = 0
//     for (let i = 0; i < k; i++) {
//         windowSum += arr[i]
//     }

//     let maxSum = windowSum

//     for (let j = k; j < arr.length; j++) {
//         windowSum = windowSum - arr[j - k] + arr[j]
//         maxSum = Math.max(maxSum, windowSum);
//     }

//     return maxSum
// }
// console.log(maximumSum([1, 3, -1, -3, 5, 3, 6, 7], 3))

// ? 1️⃣4️⃣ KADANE'S ALGORITHM
// arr = [ -2, 1, -3, 4, -1, 2, 1, -5, 4 ];
// Maximum subarray sum

// function maximumSubArraySum(arr) {
//     let maxSum = 0;
//     let currSum = 0;

//     for (let i of arr) {
//         currSum += i
//         if (currSum > maxSum) {
//             maxSum = currSum
//         }
//         if (currSum < 0) {
//             currSum = 0
//         }
//     }
//     return maxSum
// }

// console.log(maximumSubArraySum([2, 3, -7, 4, 7, -4]))

// ? 1️⃣5️⃣ PREFIX SUMS ALGORITHM
// arr = [7, 2, 5, 1, 3]
// out = [7, 9, 14, 15, 18]

// function prefixSum(arr) {
//     let preSum = new Array(arr.length);
//     preSum[0] = arr[0]

//     for (let i = 1; i < arr.length; i++) {
//         preSum[i] = preSum[i - 1] + arr[i]
//     }


//     return preSum
// }

// console.log(prefixSum([7, 2, 5, 1, 3]))


// 1️⃣6️⃣ Find Missing Number from Range 1 to N
// Input: [1, 5, 2, 4]
// Output: 3

// function missingNumber(arr) {
//     let sum = 0
//     let n = arr.length + 1

//     sum = (n * (n + 1)) / 2

//     for (let i of arr) {
//         sum -= i
//     }

//     return sum
// }

// console.log(missingNumber([1, 5, 2, 4]))

// 1️⃣7️⃣ Move All Zeroes to End (Stable, O(n))
// Input: [0, 1, 0, 3, 12]
// Output: [1, 3, 12, 0, 0]

// function moveZeroes(arr) {

// way 1 (space o(n))

// const newArr = []
// for (let i of arr) {
//     if (i !== 0) {
//         newArr.push(i)
//     }
// }
// while (newArr.length < arr.length) {
//     newArr.push(0)
// }

// return newArr

// way 2 (space o(1))

//     let pos = 0;

//     for (let i of arr) {
//         if (i !== 0) {
//             arr[pos] = i;
//             pos++;
//         }
//     }

//     while (pos < arr.length) {
//         arr[pos] = 0;
//         pos++
//     }

//     return arr
// }

// console.log(moveZeroes([0, 1, 0, 3, 12]))


// 1️⃣8️⃣  Find the First Repeating Element in an Array
// Input: [10, 5, 3, 4, 3, 5, 6]
// Output: 5

// function firstRepeating(arr) {

// way 1 o(n2)
// for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) {
//         if (arr[i] === arr[j]) return arr[i]
//     }
// }
// return false

// way 2 o(n)
//     let seen = new Set()

//     for (let i of arr) {
//         if (seen.has(i)) return i
//         seen.add(i)
//     }

//     return -1
// }


// console.log(firstRepeating([10, 5, 3, 4, 3, 5, 6]))


// 1️⃣9️⃣ Maximum Subarray Sum (Kadane’s Algorithm – O(n))
// Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
// Output: 6

// function subArraySum(arr) {
//     let maxSum = -Infinity
//     let sum = 0;
//     for (let i of arr) {
//         sum += i
//         maxSum = Math.max(maxSum, sum)
//         if (sum < 0) {
//             sum = 0
//         }
//     }

//     return maxSum
// }

// console.log(subArraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]))

// 2️⃣0️⃣ Find all subarrays of an array
// Input: [1, 2, 3]
// Output: [[1], [1,2], [1,2,3], [2], [2,3], [3]]

// function allSubarrays(arr) {
//     let result = []
//     for (let i = 0; i < arr.length; i++) {
//         for (let j = i; j < arr.length; j++) {
//             result.push(arr.slice(i, j + 1))
//         }
//     }
//     return result
// }
// console.log(allSubarrays([1, 2, 3]))

// 2️⃣1️⃣ Find all subarrays with sum = K
// Input: [1, 2, 3, 4, 5], K = 9
// Output: [[2,3,4], [4,5]]

// function subarraysWithSumK(arr, target) {
//     let result = []
//     for (let i = 0; i < arr.length; i++) {
//         let sum = 0
//         for (let j = i; j < arr.length; j++) {
//             sum += arr[j]
//             if (sum === target) {
//                 result.push(arr.slice(i, j + 1))
//             }
//         }
//     }
//     return result
// }
// console.log(subarraysWithSumK([1, 2, 3, 4, 5], 9))


// 2️⃣2️⃣ Find the Longest Subarray with Sum = K (Optimized)
// Input: [1, 2, 3, 4, 5], K = 9
// Output: [2, 3, 4]

// function LongestSubarray(arr, target) {
//     let len = 0
//     for (let i = 0; i < arr.length; i++) {
//         let sum = 0;
//         for (let j = i; j < arr.length; j++) {
//             sum += arr[j]
//             if (sum === target) {
//                 len = Math.max(len, j - i + 1)
//             }
//         }
//     }
//     return len
// }

// console.log(LongestSubarray([1, 2, 3, 4, 5], 9))

