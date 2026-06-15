// !28. Find the first occurrence of a string.
var strStr = function (haystack = "sadbutsad", needle = "but") {
  if (needle === "") return 0;
  let n = haystack.length;
  let m = needle.length;

  for (let i = 0; i < n - m; i++) {
    let j = 0;
    while (j < m && haystack[i + j] === needle[j]) {
      j++;
    }

    if (j === m) {
      return i;
    }
  }
  return -1;
};
// ? now using KMP algorithm
// var strStrKMP = function (haystack, needle) {
//   if (needle === "") return 0;
//   let n = haystack.length;
//   let m = needle.length;

//   // Build the longest prefix suffix (LPS) array
//   const lps = new Array(m).fill(0);
//   let len = 0; // length of the previous longest prefix suffix
//   let i = 1;

//   while (i < m) {
//     if (needle[i] === needle[len]) {
//       len++;
//       lps[i] = len;
//       i++;
//     } else {
//       if (len !== 0) {
//         len = lps[len - 1];
//       } else {
//         lps[i] = 0;
//         i++;
//       }
//     }
//   }

//   // Now search using the LPS array
//   i = 0; // index for haystack
//   let j = 0; // index for needle

//   while (i < n) {
//     if (haystack[i] === needle[j]) {
//       i++;
//       j++;
//     }

//     if (j === m) {
//       return i - j; // found the needle
//     } else if (i < n && haystack[i] !== needle[j]) {
//       if (j !== 0) {
//         j = lps[j - 1];
//       } else {
//         i++;
//       }
//     }
//   }

//   return -1; // needle not found
// };
console.log(strStr());
