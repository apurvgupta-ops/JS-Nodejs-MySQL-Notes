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

function uniquePairs(arr, target) {

}

console.log(uniquePairs([1, 2, 3, 4, 5], 6))