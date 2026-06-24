// !28. Find the first occurrence of a string.
// var strStr = function (haystack = "sadbutsad", needle = "but") {
//   if (needle === "") return 0;
//   let n = haystack.length;
//   let m = needle.length;

//   for (let i = 0; i < n - m; i++) {
//     let j = 0;
//     while (j < m && haystack[i + j] === needle[j]) {
//       j++;
//     }

//     if (j === m) {
//       return i;
//     }
//   }
//   return -1;
// };
// ? now using KMP algorithm

function computeLPSArray(pattern = "leetcodeetcode") {
  let m = pattern.length;
  let lps = new Array(m).fill(0);
  let prefix = 0; // length of the previous longest prefix suffix
  let suffix = 1;

  while (suffix < m) {
    if (pattern[suffix] === pattern[prefix]) {
      prefix++;
      lps[suffix] = prefix;
      suffix++;
    } else {
      if (prefix !== 0) {
        prefix = lps[prefix - 1];
      } else {
        lps[suffix] = 0;
        suffix++;
      }
    }
  }
  console.log({ lps });
  return lps;
}

console.log(computeLPSArray());

// var strStrKMP = function (haystack, needle) {
//   if (needle === "") return 0;
//   let n = haystack.length;
//   let m = needle.length;
//   let lps = computeLPSArray(needle);
//   let indexOfHaystack = 0; // index for haystack
//   let indexOfNeedle = 0; // index for needle

//   while (indexOfHaystack < n) {
//     if (haystack[indexOfHaystack] === needle[indexOfNeedle]) {
//       indexOfHaystack++;
//       indexOfNeedle++;
//     }

//     if (indexOfNeedle === m) {
//       return indexOfHaystack - indexOfNeedle; // found the pattern, return starting index
//     } else if (
//       indexOfHaystack < n &&
//       haystack[indexOfHaystack] !== needle[indexOfNeedle]
//     ) {
//       if (indexOfNeedle !== 0) {
//         indexOfNeedle = lps[indexOfNeedle - 1]; // use the LPS array to skip comparisons
//       } else {
//         indexOfHaystack++; // move to the next character in haystack
//       }
//     }
//   }
//   return -1; // pattern not found
// };
// console.log(strStrKMP("sadbutsad", "but"));

// !459. Repeated Substring Pattern
// var repeatedSubstringPattern = function (s = "abaababaab") {
//   let prefix = 0;
//   let suffix = 1;

//   let lps = new Array(s.length).fill(0);
//   let n = s.length;
//   while (suffix < n) {
//     if (s[prefix] === s[suffix]) {
//       prefix++;
//       lps[suffix] = prefix;
//       suffix++;
//     } else {
//       if (prefix != 0) {
//         prefix = lps[prefix - 1];
//       } else {
//         lps[suffix] = 0;
//         suffix++;
//       }
//     }
//   }
//   let lastlpsValue = lps[n - 1];
//   console.log({ lastlpsValue, lps });
//   return lastlpsValue > 0 && n % (n - lastlpsValue) === 0;
// };

// console.log(repeatedSubstringPattern());

// !796. Rotate String
// var rotateString = function (s = "abcde", goal = "cdeab") {
//   // if (s.length !== goal.length) return false;
//   // let concatenated = s + s; // Concatenate the string with itself
//   // return concatenated.includes(goal); // Check if goal is a substring of the concatenated string

//   // ? using KMP algorithm
//   if (s.length !== goal.length) return false;
//   let concatenated = s + s; // Concatenate the string with itself
//   let lps = computeLPSArray(goal);
//   console.log(lps);
//   let indexOfConcatenated = 0; // index for concatenated string
//   let indexOfGoal = 0; // index for goal

//   while (indexOfConcatenated < concatenated.length) {
//     if (concatenated[indexOfConcatenated] === goal[indexOfGoal]) {
//       indexOfConcatenated++;
//       indexOfGoal++;
//     }

//     if (indexOfGoal === goal.length) {
//       return true; // found the pattern, return true
//     } else if (
//       indexOfConcatenated < concatenated.length &&
//       concatenated[indexOfConcatenated] !== goal[indexOfGoal]
//     ) {
//       if (indexOfGoal !== 0) {
//         indexOfGoal = lps[indexOfGoal - 1]; // use the LPS array to skip comparisons
//       } else {
//         indexOfConcatenated++; // move to the next character in concatenated string
//       }
//     }
//   }
//   return false; // pattern not found
// };

// console.log(rotateString());

// !1408. String Matching in an Array
var stringMatching = function (words) {
  let result = [];
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (i !== j && words[i].includes(words[j])) {
        result.push(words[j]);
      }
    }
  }
  // return [...new Set(result)]; // Remove duplicates
  return result;
};

console.log(stringMatching(["mass", "as", "hero", "superhero"]));
