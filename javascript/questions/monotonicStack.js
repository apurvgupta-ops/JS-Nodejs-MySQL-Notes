// !CC. Next Greater Element
// var nextGreaterElement = function (
//   arr = [4, 12, 5, 3, 1, 2, 5, 3, 1, 2, 4, 6],
// ) {
//   let stack = [];
//   let res = new Array(arr.length).fill(-1);

//   for (let i = arr.length - 1; i >= 0; i--) {
//     while (stack.length > 0 && stack[stack.length - 1] <= arr[i]) {
//       stack.pop();
//     }

//     if (stack.length > 0) {
//       console.log({ res, stack });
//       res[i] = stack[stack.length - 1];
//     }
//     stack.push(arr[i]);
//   }

//   return res;
// };
// console.log(nextGreaterElement());

// !496. Next Greater Element I
// var nextGreaterElement = function (nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]) {
//   let stack = [];
//   let map = new Map();

//   for (let i = nums2.length - 1; i >= 0; i--) {
//     while (stack.length > 0 && stack[stack.length - 1] <= nums2[i]) {
//       stack.pop();
//     }
//     if (stack.length > 0) {
//       map.set(nums2[i], stack[stack.length - 1]);
//     } else {
//       map.set(nums2[i], -1);
//     }
//     stack.push(nums2[i]);
//   }

//   let res = [];
//   for (let num of nums1) {
//     res.push(map.get(num));
//   }

//   return res;
// };
// console.log(nextGreaterElement());

// !1047. Remove All Adjacent Duplicates In String
// var removeDuplicates = function (s = "abbaca") {
//   let stack = [];

//   for (let i = 0; i < s.length; i++) {
//     console.log(s[i], stack[stack.length - 1]);
//     if (stack.length > 0 && stack[stack.length - 1] == s[i]) {
//       stack.pop();
//     } else {
//       stack.push(s[i]);
//     }
//   }

//   return stack.join("");
// };

// console.log(removeDuplicates());

// !739. Daily Temperatures : saving index
// var dailyTemperatures = function (temperatures) {
//   let stack = [];
//   let res = new Array(temperatures.length).fill(0);

//   for (let i = 0; i < temperatures.length; i++) {
//     while (
//       stack.length > 0 &&
//       temperatures[stack[stack.length - 1]] < temperatures[i]
//     ) {
//       let prevIndex = stack.pop();
//       res[prevIndex] = i - prevIndex;
//     }
//     stack.push(i);

//     console.log({ stack, res });
//   }

//   return res;
// };

// console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));

// !503. Next Greater Element II :  saving index
// var nextGreaterElements = function (nums = [1, 2, 1]) {
//   let stack = [];
//   const n = nums.length;
//   let res = new Array(n).fill(-1);

//   for (let i = 2 * n - 1; i >= 0; i--) {
//     let realIdx = i % n;

//     while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[realIdx]) {
//       stack.pop();
//     }

//     if (i < n) {
//       if (stack.length > 0) {
//         res[realIdx] = nums[stack[stack.length - 1]];
//       }
//     }
//     stack.push(realIdx);
//   }
//   return res;
// };
// console.log(nextGreaterElements());

// !456. 132 Pattern
// var find132pattern = function (nums = [3, 1, 4, 2]) {
//   let numk = -Infinity;
//   let stack = [];

//   for (let i = nums.length - 1; i >= 0; i--) {
//     if (numk > nums[i]) return true;

//     while (stack.length > 0 && stack[stack.length - 1] < nums[i]) {
//       numk = stack.pop();
//     }

//     stack.push(nums[i]);
//   }

//   return false;
// };
// console.log(find132pattern());

// !20. Valid Parentheses
// var isValid = function (s = "([)]") {
//   let stack = [];
//   let map = new Map([
//     ["(", ")"],
//     ["[", "]"],
//     ["{", "}"],
//   ]);

//   for (let char of s) {
//     if (map.has(char)) {
//       stack.push(char);
//     } else {
//       let last = stack.pop();
//       if (map.get(last) !== char) {
//         return false;
//       }
//     }
//   }

//   return stack.length === 0;
// };
// console.log(isValid());

// !394. Decode String
// var decodeString = function (s = "2[a3[c2[x]]y]") {
//   let stack = [];
//   let numStack = [];
//   let currentNum = 0;
//   let currentStr = "";

//   for (let char of s) {
//     if (!isNaN(char)) {
//       currentNum = currentNum * 10 + parseInt(char);
//     } else if (char === "[") {
//       numStack.push(currentNum);
//       stack.push(currentStr);
//       currentNum = 0;
//       currentStr = "";
//     } else if (char === "]") {
//       let repeatTimes = numStack.pop();
//       let prevStr = stack.pop();
//       currentStr = prevStr + currentStr.repeat(repeatTimes);
//     } else {
//       currentStr += char;
//     }
//   }

//   return currentStr;
// };

// console.log(decodeString());
// !1081. Smallest Subsequence of Distinct Characters
var smallestSubsequence = function (s = "bcabc") {};

// !316. Remove Duplicate Letters
var removeDuplicateLetters = function (s = "bcabc") {};

// !1249. Minimum Remove to Make Valid Parentheses
var minRemoveToMakeValid = function (s = "lee(t(c)o)de)") {};

// !856. Score of Parentheses
// var scoreOfParentheses = function (s = "(()(()))") {
//   let stack = [0];

//   for (let char of s) {
//     if (char === "(") {
//       stack.push(0);
//     } else {
//       let topEle = stack.pop();
//       stack[stack.length - 1] += topEle === 0 ? 1 : 2 * topEle;
//     }
//   }

//   return stack[0];
// };

// console.log(scoreOfParentheses());
