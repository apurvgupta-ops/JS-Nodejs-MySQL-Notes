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

// !739. Daily Temperatures
var dailyTemperatures = function (temperatures) {
  let stack = [];
  let res = new Array(temperatures.length).fill(0);

  for (let i = 0; i < temperatures.length; i++) {
    while (
      stack.length > 0 &&
      temperatures[stack[stack.length - 1]] < temperatures[i]
    ) {
      let prevIndex = stack.pop();
      res[prevIndex] = i - prevIndex;
    }
    stack.push(i);

    console.log({ stack, res });
  }

  return res;
};

console.log(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]));
