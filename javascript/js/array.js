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

// ? Brute Force : O(n2)
// function fun(arr) {
//   const temp = [];
//   let count = 0;
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr.length; j++)
//       if (arr[j] === count) {
//         temp.push(arr[j]);
//       }
//     count++;
//   }
//   return temp;
// }

// ? Optimal : O(n) but space complixity is high.
// function fun(arr) {
//   const temp0 = [];
//   const temp1 = [];
//   const temp2 = [];

//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] == 0) {
//       temp0.push(arr[i]);
//     } else if (arr[i] == 1) {
//       temp1.push(arr[i]);
//     } else {
//       temp2.push(arr[i]);
//     }
//   }

//   return temp0.concat(temp1, temp2);
// }

// ? Optimal : O(n) :: Dutch National Flag algorithm - one pass
// function fun(arr) {
//   let low = 0;
//   let mid = 0;
//   let high = arr.length - 1;

//   while (mid <= high) {
//     if (arr[mid] == 0) {
//       [arr[low], arr[mid]] = [arr[mid], arr[low]];
//       low++;
//       mid++;
//     } else if (arr[mid] == 1) {
//       mid++;
//     } else {
//       [arr[mid], arr[high]] = [arr[high], arr[mid]];
//       high--;
//     }
//   }
//   return arr;
// }

// const arr = [2, 0, 2, 1, 1, 0];
// console.log(fun(arr));

// ! Find the Majority Element that occurs more than N/2 times
/*
Example 1:
Input Format: N = 3, nums[] = {3,2,3}
Result: 3
Explanation: When we just count the occurrences of each number and compare with half of the size of the array, you will get 3 for the above solution. 
*/

// function fun(arr) {
//   const n = arr.length;
//   const map = new Map();

//   for (let i = 0; i < n; i++) {
//     map.set(arr[i], (map.get(arr[i]) || 0) + 1);
//   }
//   for (let [i, v] of map) {
//     if (v >= n / 2) {
//       return { yes: i };
//     }
//   }
//   return map;
// }
// const arr = [3, 2, 3, 2, 2];
// console.log(fun(arr));

// ! * Kadane's Algorithm : Maximum Subarray Sum in an Array
/*
Example 1:
Input: arr = [-2,1,-3,4,-1,2,1,-5,4] 
Output: 6 
Explanation: [4,-1,2,1] has the largest sum = 6. 
*/

// ? Brute Force : O(n2) : This is not a Kadan's Algo
// function fun(arr) {
//   const n = arr.length;
//   let maxSum = arr[0]; // To handle Negative values also
//   let subArray = [arr[0]];

//   for (let i = 0; i < n; i++) {
//     let sum = 0;
//     let temp = [];

//     for (let j = i; j < n; j++) {
//       sum += arr[j];
//       temp.push(arr[j]);
//       if (maxSum < sum) {
//         maxSum = sum;
//         subArray = [...temp];
//       }
//     }
//   }

//   console.log(subArray, maxSum);
//   return { subArray, maxSum };
// }

// function fun(arr) {}

// const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
// console.log(fun(arr));

// ! * Stock Buy And Sell
/*
Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and 
sell on day 5 (price = 6), profit = 6-1 = 5.
*/

// ? Brute Force :  O(n)
// function fun(arr) {
//   let maxProfit = 0;
//   let buyPrice = arr[0];
//   let sellPrice = arr[0];

//   const n = arr.length;
//   for (let i = 0; i < n; i++) {
//     for (let j = i + 1; j < n; j++) {
//       if (arr[j] - arr[i] > maxProfit) {
//         maxProfit = arr[j] - arr[i];
//         buyPrice = arr[i];
//         sellPrice = arr[j];
//       }
//     }
//   }

//   console.log(`Buy at: ${buyPrice}, Sell at: ${sellPrice}`);
//   return maxProfit;
// }

// ? * Optimal : O(n)
// function fun(arr) {
//   let maxProfit = 0;
//   let buyPrice = Infinity;
//   let sellPrice = -Infinity;
//   const n = arr.length;

//   for (let i = 0; i < n; i++) {
//     if (arr[i] < buyPrice) {
//       buyPrice = arr[i];
//     } else if (arr[i] - buyPrice > maxProfit) {
//       maxProfit = arr[i] - buyPrice;
//       sellPrice = arr[i];
//     }
//   }
//   console.log(`Buy at: ${buyPrice}, Sell at: ${sellPrice}`);

//   return maxProfit;
// }
// const arr = [7, 8, 5, 3, 6, 4, 1];
// console.log(fun(arr));

// ! * Rearrange the array in alternating positive and negative items
/*
Example 1:

Input:
arr[] = {1,2,-4,-5}, N = 4
Output:
1 -4 2 -5

Explanation: 

Positive elements = 1,2
Negative elements = -4,-5
To maintain relative ordering, 1 must occur before 2, and -4 must occur before -5.
*/

// ? Brute Force : O(n + n/2)
// function fun(arr) {
//   const n = arr.length;
//   let posArr = [];
//   let negArr = [];
//   let newArr = [];

//   for (let i = 0; i < n; i++) {
//     if (arr[i] < 0) {
//       negArr.push(arr[i]);
//     } else {
//       posArr.push(arr[i]);
//     }
//   }
//   console.log({ posArr, negArr });

//   for (let i = 0; i < n / 2; i++) {
//     newArr[2 * i] = posArr[i];
//     newArr[2 * i + 1] = negArr[i];
//   }
//   return newArr;
// }

// ? Optimal : O(n)
// function fun(arr) {
//   const n = arr.length;
//   let posIdx = 0;
//   let negIdx = 1;
//   let newArr = [];
//   for (let i = 0; i < n; i++) {
//     if (arr[i] < 0) {
//       newArr[negIdx] = arr[i];
//       negIdx += 2;
//     } else {
//       newArr[posIdx] = arr[i];
//       posIdx += 2;
//     }
//   }
//   return newArr;
// }

// const arr = [1, 2, -4, -5];
// console.log(fun(arr));

// ! Leaders in an Array
/*
Input:
 arr = [10, 22, 12, 3, 0, 6]
Output:
 22 12 6
Explanation:
 6 is a leader. In addition to that, 12 is greater than all the elements in its right side (3, 0, 6), also 22 is greater than 12, 3, 0, 6.
*/

// ? Brute Force : O(n2)
// function fun(arr) {
//   const n = arr.length;
//   const newArr = [];

//   for (let i = 0; i < n; i++) {
//     let isLeader = true;
//     for (let j = i + 1; j < n; j++) {
//       if (arr[i] < arr[j]) {
//         isLeader = false;
//         break;
//       }
//     }

//     if (isLeader) {
//       newArr.push(arr[i]);
//     }
//   }
//   return newArr;
// }

// ? Optimal : O(n)
// function fun(arr) {
//   const n = arr.length;
//   let maxRight = -Infinity;
//   const newArr = [];
//   for (let i = n - 1; i >= 0; i--) {
//     if (arr[i] > maxRight) {
//       maxRight = arr[i];
//       newArr.push(arr[i]);
//     }
//   }

//   return newArr;
// }

// const arr = [10, 22, 12, 3, 0, 6];
// console.log(fun(arr));

// ! * Longest Consecutive Sequence in an Array

// ? * Optimal : O(n)
// function fun(arr) {
//   const set = new Set(arr);
//   let longest = 0;
//   for (let num of set) {
//     if (!set.has(num - 1)) {
//       let currentSum = num;
//       let currentStreak = 1;

//       while (set.has(currentSum + 1)) {
//         currentStreak += 1;
//         currentSum += 1;
//       }
//       longest = Math.max(longest, currentStreak);
//     }
//   }
//   return longest;
// }

// const arr = [100, 3, 200, 201, 202, 203, 204, 205, 0, 1, 2];
// console.log(fun(arr));

// ! * Set Matrix Zero
/*
Input: matrix=[[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
Explanation: Since matrix[2][2]=0.Therfore the 2nd column and 2nd row wil be set to 0.
*/

// ? Brute Force : O(n x m)
// function fun(matrix) {
//   const rows = matrix.length;
//   const cols = matrix[0].length;
//   console.log({ rows, cols });

//   const zeroRows = new Set();
//   const zeroCols = new Set();

//   for (let i = 0; i < rows; i++) {
//     for (let j = 0; j < cols; j++) {
//       if (matrix[i][j] == 0) {
//         zeroRows.add(i);
//         zeroCols.add(j);
//       }
//     }
//   }

//   for (let i = 0; i < rows; i++) {
//     for (let j = 0; j < cols; j++) {
//       if (zeroRows.has(i) || zeroCols.has(j)) {
//         matrix[i][j] = 0;
//       }
//     }
//   }

//   console.table(matrix);
//   return matrix;
// }

// const matrix = [
//   [1, 1, 0, 2],
//   [1, 0, 1, 3],
//   [1, 1, 0, 4],
// ];
// console.log(fun(matrix));

// ! * Rotate Image by 90 degree
/*
Input: [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
Explanation: Rotate the matrix simply by 90 degree clockwise and return the matrix.
*/

// ? Brute Force : O(n2) : Row to Column
// function fun(matrix) {
//   const n = matrix.length;
//   console.log({ n });

//   const result = Array.from({ length: n }, () => Array(n).fill(0));
//   console.table(result);

//   for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
//       result[j][n - 1 - i] = matrix[i][j];
//     }
//   }

//   return result;
// }

// ? Column to Row
// function fun(matrix) {
//   const n = matrix.length;
//   let result = [];
//   for (let i = 0; i < n; i++) {
//     let newRow = [];

//     for (let j = n - 1; j >= 0; j--) {
//       newRow.push(matrix[j][i]);
//       console.log({ newRow });
//     }

//     result.push(newRow);
//   }

//   return result;
// }

// const matrix = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
// ];

// console.table(fun(matrix));

// ! * Spiral Traversal of Matrix
/*
Input: Matrix[][] = { { 1, 2, 3, 4 },
		      { 5, 6, 7, 8 },
		      { 9, 10, 11, 12 },
	              { 13, 14, 15, 16 } }

Outhput: 1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10.
Explanation: The output of matrix in spiral form.
*/

/*
Approach :
In each outer loop traversal print the elements of a square in a clockwise manner.

Print the top row, i.e. Print the elements of the top row from column index left to right and increase the count of the top so that it will move to the next row.

Print the right column, i.e. Print the rightmost column from row index top to bottom and decrease the count of right.

Print the bottom row, i.e. if top <= bottom, then print the elements of a bottom row from column right to left and decrease the count of bottom.

Print the left column, i.e. if left <= right, then print the elements of the left column from the bottom row to the top row and increase the count of left.

Run a loop until all the squares of loops are printed.

Note: As we can see in the code snippet below, two edge conditions are being added in the last two ‘for’ loops: when we are moving from right to left and from bottom to top. 

These conditions are added to check if the matrix is a single column or a single row. So, whenever the elements in a single row are traversed they cannot be traversed again backward so the condition is checked in the right-to-left loop. When a single column is present, the condition is checked in the bottom-to-top loop as elements from bottom to top cannot be traversed again

*/

// ? * O(n x m)
// function fun(mat) {
//   // Define ans array to store the result.
//   let ans = [];

//   // Determine the number of rows and columns
//   let n = mat.length; // no. of rows
//   let m = mat[0].length; // no. of columns

//   // Initialize the pointers reqd for traversal.
//   let top = 0,
//     left = 0,
//     bottom = n - 1,
//     right = m - 1;

//   // Loop until all elements are not traversed.
//   while (top <= bottom && left <= right) {
//     // For moving left to right
//     for (let i = left; i <= right; i++) ans.push(mat[top][i]);

//     top++;

//     // For moving top to bottom.
//     for (let i = top; i <= bottom; i++) ans.push(mat[i][right]);

//     right--;

//     // For moving right to left.
//     if (top <= bottom) {
//       for (let i = right; i >= left; i--) ans.push(mat[bottom][i]);

//       bottom--;
//     }

//     // For moving bottom to top.
//     if (left <= right) {
//       for (let i = bottom; i >= top; i--) ans.push(mat[i][left]);

//       left++;
//     }
//   }
//   return ans;
// }

// const matrix = [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 10, 11, 12],
//   [13, 14, 15, 16],
// ];

// console.log(fun(matrix));

// ! Count Subarray sum Equals K
/*
Input Format: N = 4, array[] = {3, 1, 2, 4}, k = 6
Result: 2
Explanation: The subarrays that sum up to 6 are [3, 1, 2] and [2, 4].
*/

// ? Brute Force :  O(n2)
// function fun(arr, k) {
//   const n = arr.length;
//   let res = [];
//   let count = 0;
//   for (let i = 0; i < n; i++) {
//     let sum = 0;
//     let temp = [];
//     for (let j = i; j < n; j++) {
//       sum += arr[j];
//       temp.push(arr[j]);
//       if (sum == k) {
//         res = [[...temp], ...res];
//         count++;
//       }
//     }
//   }
//   return { res, count };
// }

// ? Optimal : O(n)
// function fun(arr, k) {
//   let n = arr.length;
//   let count = 0;
//   let map = new Map();
//   map.set(0, 1);
//   let sum = 0;
//   for (let i = 0; i < n; i++) {
//     sum += arr[i];

//     if (map.has(sum - k)) {
//       count += map.get(sum - k);
//     }

//     map.set(sum, (map.get(sum) || 0) + 1);
//   }

//   return count;
// }

// const arr = [3, 1, 2, 4];
// const k = 6;
// console.log(fun(arr, k));

// ! Pascal's Triangle

// ? Brute Force : O(n2)
// function generateCenteredPascalsTriangle(n) {
//   const triangle = [];

//   for (let i = 0; i < n; i++) {
//     const row = [1];

//     for (let j = 1; j < i; j++) {
//       row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
//     }
//     if (i > 0) row.push(1);
//     triangle.push(row);
//   }

//   // Calculate max width for spacing
//   const maxWidth = triangle[n - 1].join(" ").length;

//   // Print centered rows
//   triangle.forEach((row) => {
//     const line = row.join(" ");
//     const padding = " ".repeat(Math.floor((maxWidth - line.length) / 2));
//     console.log(padding + line);
//   });
// }

// generateCenteredPascalsTriangle(10);

// ! Generate Pascal of Nth Row

// ? Optimal : O(N)
// function generatePascalNthRow(n) {
//   let row = [];
//   let value = 1;

//   for (let k = 0; k <= n; k++) {
//     row.push(value);
//     value = (value * (n - k)) / (k + 1);
//   }

//   return row.join(" ");
// }

// console.log(generatePascalNthRow(9));

// ! Merge Overlapping Sub-intervals
/*
Input: intervals=[[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] are overlapping we can merge them to form [1,6]
 intervals.
*/
// ? Brute Force : O(nlogn + n2)
// function fun(arr) {
//   const n = arr.length;
//   let res = [];
//   arr.sort((a, b) => a[0] - b[0]);
//   for (let i = 0; i < n; i++) {
//     let start = arr[i][0];
//     let end = arr[i][1];

//     if (res.length && arr[i][0] <= res[res.length - 1][1]) {
//       continue;
//     }
//     for (let j = i + 1; j < n; j++) {
//       if (end >= arr[j][0]) {
//         end = Math.max(end, arr[j][1]);
//       } else {
//         break;
//       }
//     }
//     res.push([start, end]);
//   }
//   return res;
// }

// ? Optimal : O(nlogn + n)
// function fun(arr) {
//   const n = arr.length;
//   arr.sort((a, b) => a[0] - b[0]);

//   const ans = [arr[0]];
//   console.log({ ans });

//   for (let i = 1; i < n; i++) {
//     const last = ans[ans.length - 1];
//     const curr = arr[i];
//     console.log({ curr, last });
//     if (curr[0] <= last[1]) {
//       last[1] = Math.max(last[1], curr[1]);
//     } else {
//       ans.push(curr);
//     }
//   }

//   return ans;
// }

// const arr = [
//   [1, 3],
//   [2, 6],
//   [5, 10],
//   [15, 18],
// ];
// console.log(fun(arr));

// ! Majority Elements(&gt;N/3 times) | Find the elements that appears more than N/3 times in the array
// ? Optimal : O(n)
// function fun(arr) {
//   const n = arr.length;
//   const map = new Map();
//   let res = [];

//   for (let num of arr) {
//     map.set(num, (map.get(num) || 0) + 1);
//   }
//   for (let [i, v] of map) {
//     if (v > Math.floor(n / 3)) {
//       res.push(i);
//     }
//   }

//   return res.length
//     ? `The count of ${res} is greater than N/3 times. Hence, ${res} is the answer.`
//     : false;
// }

// const arr = [1, 2, 2, 3, 2, 3, 3, 3, 3, 2];
// console.log(fun(arr));

// ! 3 Sum : Find triplets that add up to a zero

// ? Brute Force : O(n3)
// function fun(arr) {
//   const n = arr.length;
//   const set = new Set();
//   for (let i = 0; i < n; i++) {
//     let sum = 0;
//     let temp = [];
//     for (let j = i + 1; j < n; j++) {
//       for (let k = j + 1; k < n; k++) {
//         sum = arr[i] + arr[j] + arr[k];
//         temp.push(arr[i], arr[j], arr[k]);
//         if (sum == 0) {
//           temp.sort((a, b) => a - b);
//           set.add(temp);
//         }
//         temp = [];
//       }
//     }
//     console.log(set);
//     return;
//   }

//   console.log(res);
//   return res;
// }

// ? Optimal : O(NlogN)+O(N2)
// function fun(arr) {
//   const n = arr.length;
//   const result = [];
//   arr.sort((a, b) => a - b);

//   for (let i = 0; i < n - 2; i++) {
//     // Skip duplicate values for i
//     if (i > 0 && arr[i] === arr[i - 1]) continue;

//     let j = i + 1;
//     let k = n - 1;

//     while (j < k) {
//       let sum = arr[i] + arr[j] + arr[k];

//       if (sum === 0) {
//         result.push([arr[i], arr[j], arr[k]]);

//         // Skip duplicates for j and k
//         while (j < k && arr[j] === arr[j + 1]) j++;
//         while (j < k && arr[k] === arr[k - 1]) k--;

//         j++;
//         k--;
//       } else if (sum < 0) {
//         j++;
//       } else {
//         k--;
//       }
//     }
//   }

//   return result;
// }

// const arr = [-1, 0, 1, 2, -1, -4];
// console.log(fun(arr));

// ! Length of the longest subarray with zero Sum

// ? Brute Force :  O()
// function fun(arr, k) {
//   const n = arr.length;
//   let maxLength = 0;
//   let bestSub = [];
//   for (let i = 0; i < n; i++) {
//     let sum = 0;
//     let temp = [];

//     for (let j = i; j < n; j++) {
//       sum += arr[j];
//       temp.push(arr[j]);
//       if (sum == k) {
//         if (maxLength < temp.length) {
//           maxLength = temp.length;
//           //   bestSub = [...temp];
//         }
//       }
//     }
//   }

//   //   console.log(bestSub);
//   return maxLength;
// }

// ? Optimal : O(n)
// function fun(arr, k) {
//   const map = new Map();
//   let sum = 0;
//   let maxLen = 0;

//   for (let i = 0; i < arr.length; i++) {
//     sum += arr[i];
//     console.log({ sum });
//     if (sum === k) {
//       maxLen = i + 1;
//     }
//     console.log({ maxLen, i });
//     if (map.has(sum - k)) {
//       maxLen = Math.max(maxLen, i - map.get(sum - k));
//     }
//     console.log({ maxLen });
//     if (!map.has(sum)) {
//       map.set(sum, i);
//     }
//   }

//   console.log({ map });
//   return maxLen;
// }

// const arr = [9, -3, 3, -1, 6, -5];
// const k = 0;
// console.log(fun(arr, k));

// ! Merge two Sorted Arrays
/*
Input: 
n = 4, arr1[] = [1 4 8 10] 
m = 5, arr2[] = [2 3 9]

Output: 
arr1[] = [1 2 3 4]
arr2[] = [8 9 10]

Explanation:
After merging the two non-decreasing arrays, we get, 1,2,3,4,8,9,10.
*/

// ! With Extra Space
// ? Brute Force : TC : O(n+m) + O(n+m), SC : O(n+m)
// function fun(a1, a2) {
//   const n = a1.length;
//   const m = a2.length;
//   const a3 = [];
//   let left = 0;
//   let right = 0;
//   while (left < n && right < m) {
//     if (a1[left] < a2[right]) {
//       a3.push(a1[left]);
//       left++;
//     } else {
//       a3.push(a2[right]);
//       right++;
//     }
//   }
//   while (left < n) {
//     a3.push(a1[left++]);
//   }
//   while (right < m) {
//     a3.push(a2[right++]);
//   }

//   for (let i = 0; i < a3.length; i++) {
//     if (i < n) {
//       a1[i] = a3[i];
//     } else {
//       console.log({ i, m });
//       a2[i - n] = a3[i];
//     }
//   }

//   return { a1, a2 };
// }

// ! WithOut Extra Space
// ? TC: O(min(n,m)) + O(nlogn)+ O(mlogm)
// function fun(a1, a2) {
//   const n = a1.length;
//   const m = a2.length;
//   let leftEnd = n - 1;
//   let rightStart = 0;

//   while (leftEnd >= 0 && rightStart < m) {
//     if (a1[leftEnd] > a2[rightStart]) {
//       [a1[leftEnd], a2[rightStart]] = [a2[rightStart], a1[leftEnd]];
//       leftEnd--;
//       rightStart++;
//     } else {
//       break;
//     }
//   }

//   a1.sort((a, b) => a - b);
//   a2.sort((a, b) => a - b);

//   return { a1, a2 };
// }

// ? Gap Method : Shell Sort
// function fun(a1, a2) {
//   const n = a1.length;
//   const m = a2.length;
//   let gap = Math.ceil(n + m) / 2;
//   while (gap > 0) {
//     let left = 0;
//     let right = gap;

//     while (right < n + m) {
//       const a = left < n ? arr1[left] : arr2[left - n];
//       const b = right < n ? arr1[right] : arr2[right - n];

//       if (a > b) {
//         if (left < n && right < n) {
//           // Swap within arr1
//           [arr1[left], arr1[right]] = [arr1[right], arr1[left]];
//         } else if (left < n && right >= n) {
//           // Swap between arr1 and arr2
//           [arr1[left], arr2[right - n]] = [arr2[right - n], arr1[left]];
//         } else {
//           // Swap within arr2
//           [arr2[left - n], arr2[right - n]] = [arr2[right - n], arr2[left - n]];
//         }
//       }

//       left++;
//       right++;
//     }

//     gap = gap <= 1 ? 0 : Math.ceil(gap / 2);
//   }

//   return { a1, a2 };
// }

// const arr1 = [1, 4, 5, 8, 10];
// const arr2 = [2, 3, 9, 11];
// console.log(fun(arr1, arr2));

// ! Find the repeating and missing numbers
/*
Input Format: array[] = {3,1,2,5,4,6,7,5}
Result: {5,8)
Explanation: A = 5 , B = 8 
Since 5 is appearing twice and 8 is missing
*/
// ? TC: O(n), SC : O(n)(map)

// function fun(arr) {
//   const n = arr.length;
//   const map = new Map();
//   let repeating = null;
//   let missing = null;

//   // Count frequency of each number
//   for (let num of arr) {
//     map.set(num, (map.get(num) || 0) + 1);
//   }

//   // Find repeating and missing
//   for (let i = 1; i <= n; i++) {
//     const freq = map.get(i) || 0;
//     if (freq === 0) {
//       missing = i;
//     } else if (freq === 2) {
//       repeating = i;
//     }
//   }

//   return { repeating, missing };
// }

// ? TC: O(n) , SC :O(1) : Chat gpt
// function findRepeatingAndMissing(arr) {
// 	const n = arr.length;

// 	let sum = 0;
// 	let sumSq = 0;

// 	for (let num of arr) {
// 	  sum += num;
// 	  sumSq += num * num;
// 	}

// 	const actualSum = (n * (n + 1)) / 2;
// 	const actualSumSq = (n * (n + 1) * (2 * n + 1)) / 6;

// 	const diff = sum - actualSum;           // x - y
// 	const squareDiff = sumSq - actualSumSq; // x² - y²

// 	const sumXY = squareDiff / diff;        // x + y

// 	const x = (diff + sumXY) / 2;           // x (repeating)
// 	const y = sumXY - x;                    // y (missing)

// 	return {
// 	  repeating: x,
// 	  missing: y
// 	};
//   }

// const arr = [3, 1, 2, 5, 4, 6, 7, 5];
// console.log(fun(arr));

// ! Count inversions in an array
/*
Input Format: N = 5, array[] = {5,4,3,2,1}
Result: 10
Explanation: we have a reverse sorted array and we will get the maximum inversions as for i < j we will always find a pair such that A[j] < A[i]. Example: 5 has index 0 and 3 has index 2 now (5,3) pair is inversion as 0 < 2 and 5 > 3 which will satisfy out conditions and for reverse sorted array we will get maximum inversions and that is (n)*(n-1) / 2.For above given array there is 4 + 3 + 2 + 1 = 10 inversions.
*/
