function print(fn) {
  const res = fn();
  console.log(res);
}

// Move Zeroes
// function moveZeros(arr = [0, 1, 0, 3, 12, 4, 9]) {
//   let left = 0;

//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] !== 0) {
//       [arr[left], arr[i]] = [arr[i], arr[left]];
//       left++;
//     }
//   }
//   return arr;
// }

// const res = moveZeros();
// console.log(res);

// Trapping Rain Water
// function trappingWater(arr = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) {
//   const n = arr.length;
//   let left = 0;
//   let right = n - 1;
//   let leftMax = arr[left];
//   let rightMax = arr[right];
//   let totalUnit = 0;

//   while (left <= right)
//     if (leftMax < rightMax) {
//       leftMax = Math.max(leftMax, arr[left]);
//       totalUnit += leftMax - arr[left];
//       left++;
//     } else {
//       rightMax = Math.max(rightMax, arr[right]);
//       totalUnit += rightMax - arr[right];
//       right--;
//     }

//   return totalUnit;
// }

// const res = trappingWater();
// console.log(res);

// !----------------------------
// !26. Remove Duplicates from Sorted Array
// function removeDup(nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]) {
//   let left = 0;

//   for (let right = 1; right < nums.length; right++) {
//     if (nums[left] !== nums[right]) {
//       nums[++left] = nums[right];
//     }
//   }
//   const k = left + 1;

//   for (let i = k; i < nums.length; i++) {
//     nums[i] = "_";
//   }
//   console.log(nums);
//   return k;
// }

// print(removeDup);

// !27. Remove Element
// ?Approach 1
// function removeEle(nums = [3, 2, 2, 3], val = 3) {
//   let left = 0;
//   for (let right = 0; right < nums.length; right++) {
//     if (nums[right] !== val) {
//       nums[left++] = nums[right];
//     }
//   }
//   return left;
// }

// ?Approach 2 if asked how many non-val elements are there
// function removeEle(nums = [0, 1, 2, 2, 3, 0, 4, 2], val = 2) {
//   let count = 0;
//   for (let right = 0; right < nums.length; right++) {
//     if (nums[right] === val) {
//       count++;
//     }
//   }
//   return nums.length - count;
// }

// print(removeEle);

// !283. Move Zeroes
// function moveZeros(nums = [0, 1, 0, 3, 12]) {
//   let left = 0;
//   for (let right = 0; right < nums.length; right++) {
//     if (nums[right] !== 0) {
//       [nums[left], nums[right]] = [nums[right], nums[left]];
//       left++;
//     }
//   }

//   return nums;
// }
// print(moveZeros);

// !977. Squares of a Sorted Array
// function sqSortedArray(nums = [-4, -1, 0, 3, 10]) {
//   let left = 0;
//   let right = nums.length - 1;
//   let pos = nums.length - 1;
//   let res = [];

// ? With While Loop (can do with for loop as well)
//   while (left <= right) {
//     let lsq = nums[left] ** 2;
//     let rsq = nums[right] ** 2;

//     if (lsq > rsq) {
//       res[pos--] = lsq;
//       left++;
//     } else {
//       res[pos--] = rsq;
//       right--;
//     }
//   }
//   return res;
// }
// print(sqSortedArray);

// !15. 3Sum
// function threeSum(nums = [-1, 0, 1, 2, -1, -4]) {
//   const n = nums.length;
//   nums.sort((a, b) => a - b);
//   let res = [];
//   for (let i = 0; i < n - 2; i++) {
//     // to i remove duplicate
//     if (i > 0 && nums[i] === nums[i - 1]) continue;

//     let left = i + 1;
//     let right = n - 1;
//     while (left < right) {
//       let sum = nums[i] + nums[left] + nums[right];

//       if (sum === 0) {
//         res.push([nums[i], nums[left], nums[right]]);

//         // to remove left duplicates
//         while (left < right && nums[left] === nums[left + 1]) left++;

//         // to remove right duplicates
//         while (left < right && nums[right] === nums[right - 1]) right--;

//         left++;
//         right--;
//       } else if (sum > 0) right--;
//       else left++;
//     }
//   }
//   return res;
// }
// print(threeSum);

// !11. Container With Most Water
// function maxArea(height = [1, 8, 6, 2, 5, 4, 8, 3, 7]) {
//   let n = height.length;
//   let left = 0;
//   let right = n - 1;

//   let maxarea = 0;

//   while (left <= right) {
//     let minHeight = Math.min(height[left], height[right]);
//     let breadth = right - left;
//     let area = minHeight * breadth;

//     maxarea = Math.max(area, maxarea);

//     if (height[left] < height[right]) left++;
//     else right--;
//   }

//   return maxarea;
// }

// print(maxArea);

// !167. Two Sum II - Input Array Is Sorted
// function twosum(nums = [2, 7, 11, 15], target = 9) {
//   let left = 0;
//   let right = nums.length - 1;

//   while (left < right) {
//     let sum = nums[left] + nums[right];

//     if (sum === target) {
//       return [left + 1, right + 1];
//     } else if (sum > target) {
//       right--;
//     } else left++;
//   }
//   return [-1, -1];
// }
// print(twosum);

// !75. Sort Colors => DNF
// function sortColor(nums = [2, 0, 2, 1, 1, 0]) {
//   let low = 0;
//   let mid = 0;

//   let high = nums.length - 1;

//   while (mid <= high) {
//     if (nums[mid] === 1) {
//       mid++;
//     } else if (nums[mid] == 0) {
//       [nums[low], nums[mid]] = [nums[mid], nums[low]];
//       low++;
//       mid++;
//     } else {
//       [nums[high], nums[mid]] = [nums[mid], nums[high]];
//       high--;
//     }
//   }

//   return nums;
// }

// print(sortColor);

// !16. 3Sum Closest
// function Closest(nums = [-1, 2, 1, -4], target = 1) {
//   nums.sort((a, b) => a - b);
//   let closest = Infinity;
//   for (let i = 0; i < nums.length - 2; i++) {
//     let j = i + 1;
//     let k = nums.length - 1;

//     while (j < k) {
//       let sum = nums[i] + nums[j] + nums[k];

//       if (Math.abs(sum - target) < Math.abs(closest - target)) {
//         closest = sum;
//       }

//       if (sum === target) return sum;
//       else if (sum < target) j++;
//       else k--;
//     }
//   }
//   return closest;
// }
// print(Closest);

// !905. Sort Array By Parity
// function sortByParity(nums = [3, 1, 2, 4]) {
//   if (nums.length === 1) return nums;

//   let i = 0;
//   let j = nums.length - 1;
//   while (i < j) {
//     if (nums[i] % 2 !== 0) {
//       [nums[i], nums[j]] = [nums[j], nums[i]];
//       j--;
//     } else {
//       i++;
//     }
//   }
//   return nums;
// }
// print(sortByParity);

// !189. Rotate Array

// ? WAY 1
// function rotateArray(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {
//   let n = nums.length;
//   k = k % n;
//   let l = k;
//   let j = n - 1;
//   let z = n - 1;

//   // reverse all
//   for (let i = 0; i < j; i++) {
//     [nums[i], nums[j]] = [nums[j], nums[i]];
//     j--;
//   }

//   // reverse first k — fix: use r instead of mutating k
//   let r = l - 1
//   for (let i = 0; i < r; i++) {
//     [nums[i], nums[r]] = [nums[r], nums[i]];
//     r--; // r moves, k stays
//   }

//   // reverse rest — untouched, already correct
//   for (let i = l; i < z; i++) {
//     [nums[i], nums[z]] = [nums[z], nums[i]];
//     z--;
//   }

//   return nums;
// }

// ? WAY 2 (Most Optimal)
// function rotateArray(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {
//   let n = nums.length;
//   k = k % n;

//   reverse(nums, 0, n - 1);
//   reverse(nums, 0, k - 1);
//   reverse(nums, k, n - 1);

//   return nums;
// }

// function reverse(nums, left, right) {
//   while (left < right) {
//     [nums[left], nums[right]] = [nums[right], nums[left]];
//     left++;
//     right--;
//   }
// }

// ? WAY 3 sc O(n)
// function rotateArray(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {
//   const n = nums.length;
//   k = k % n;
//   const result = [];
//   for (let i = n - k; i < n; i++) result.push(nums[i]); // last k elements first
//   for (let i = 0; i < n - k; i++) result.push(nums[i]); // then rest
//   for (let i = 0; i < n; i++) nums[i] = result[i]; // copy back
//   return nums;
// }

// ? Brute Force : tc O(n2)
// function rotateArray(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {
//   let n = nums.length;
//   for (let i = 0; i < k; i++) {
//     let lastEle = nums[n - 1];

//     for (let j = n - 1; j >= 0; j--) {
//       nums[j] = nums[j - 1];
//     }
//     nums[0] = lastEle;
//   }

//   return nums;
// }

// print(rotateArray);

// ?STRING

// !125. Valid Palindrome
// var isPalindrome = function (s = "A man, a plan, a canal: Panama") {
//   s = s.toLowerCase().replace(/[^a-z0-9]/g, ""); // remove non-alphanumeric
//   let left = 0;
//   let right = s.length - 1;

//   while (left < right) {
//     if (s[left] !== s[right]) return false;
//     left++;
//     right--;
//   }
//   return true;
// };
// console.log(isPalindrome());

// !344. Reverse String
// var reverseString = function (s = ["h", "e", "l", "l", "o"]) {

// ?with Inbuilt
//  s.reverse();

// ?Without
// let reversed = [];
// for (let i = s.length - 1; i >= 0; i--) {
//   reversed.push(s[i]);
// }
// return reversed;

// ?Do not return anything, modify s in-place instead.
// let left = 0;
// let right = s.length - 1;
// while (left < right) {
//   [s[left], s[right]] = [s[right], s[left]];
//   left++;
//   right--;
// }
// console.log(s);

// ?my way
// let i = 0;
// while (i < Math.floor(s.length / 2)) {
//   let left = i;
//   let right = s.length - 1 - i;
//   [s[left], s[right]] = [s[right], s[left]];
//   i++;
// }
// console.log(s);
// };

// console.log(reverseString());

// !345. Reverse Vowels of a String
// var reverseVowels = function (s = "IceCreAm") {
//   let arr = s.split("");
// ? So we can do this with set as well, but includes is O(n) for array and O(1) for set, so better to use set
// let vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);
//   let vowels = ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"];
//   let left = 0;
//   let right = s.length - 1;

//   while (left < right) {

// ? so instead of includes we can use vowels.has(arr[left]) if we use set, which is O(1) instead of O(n) for array includes
//     while (left < right && !vowels.includes(arr[left])) {
//       left++;
//     }

//     while (left < right && !vowels.includes(arr[right])) {
//       right--;
//     }

//     if (left < right) {
//       [arr[left], arr[right]] = [arr[right], arr[left]];
//       left++;
//       right--;
//     }
//   }

//   return arr.join("");
// };
// console.log(reverseVowels());

// !392. Is Subsequence
// var isSubsequence = function (s = "abc", t = "ahbgdc") {
//   let left = 0;
//   let right = 0;
//   while (left < s.length && right < t.length) {
//     if (s[left] === t[right]) {
//       left++;
//     }
//     right++;
//   }
//   return left === s.length;
// };
// console.log(isSubsequence());

// !680. Valid Palindrome II
// var validPalindrome = function (s = "abcca") {
//   let left = 0;
//   let right = s.length - 1;

//   while (left < right) {
//     if (s[left] !== s[right]) {
//       return isPalidrone(s, left + 1, right) || isPalidrone(s, left, right - 1);
//     }
//     left++;
//     right--;
//   }

//   return true;
// };

// function isPalidrone(s, left, right) {
//   while (left < right) {
//     if (s[left] !== s[right]) {
//       return false;
//     }
//     left++;
//     right--;
//   }
//   return true;
// }
// console.log(validPalindrome());

// !151. Reverse Words in a String
// var reverseWords = function (s = "  hello world  ") {
// ? Inbuilt
//  const stsr = str.split(" ").reverse().join(" ")
// ? Without Inbuilt => with extra space
// let word = "";
// let words = [];
// for (let char of s) {
//   if (char !== " ") {
//     word += char;
//   } else if (word) {
//     words.push(word);
//     word = "";
//   }
// }
// if (word) words.push(word);
// // Reverse the array
// let result = "";
// for (let i = words.length - 1; i >= 0; i--) {
//   result += words[i];
//   if (i > 0) result += " ";
// }
// return result;
// ? Without Inbuilt => Without extra space
// let word = "";
// let result = "";
// for (let i = s.length - 1; i >= 0; i--) {
//   if (s[i] !== " ") {
//     word = s[i] + word;
//   } else if (word) {
//     result += word + " ";
//     word = "";
//   }
// }
// console.log({ word });
// if (word) result += word;
// return result;

// ?Without Inbuit => Without extra space => with two pointers
// s = "  hello world  "
// let left = s.length - 1;
// let right = s.length - 1;
// let result = "";

// while (left >= 0) {
//   if (s[left] === " ") {
//     right = left - 1;
//   } else if (left === 0 || s[left - 1] === " ") {
//     result += s.substring(left, right + 1) + " ";
//   }
//   left--;
// }
// return result.trim();

// ?Without Inbuit => Without extra space => with two pointers
// Step 1: Trim and normalize spaces
// const cleaned = s.trim().replace(/\s+/g, " ");
// // Step 2: Convert to array and reverse
// const words = cleaned.split(" ");
// let left = 0,
//   right = words.length - 1;

// while (left < right) {
//   [words[left], words[right]] = [words[right], words[left]];
//   left++;
//   right--;
// }

// return words.join(" ");
// };

// console.log(reverseWords());

// !242. Valid Anagram
// var isAnagram = function (s = "rat", t = "cat") {
// ? Inbuilt Way
// if (s.length !== t.length) return false;
// const sortedS = s.split("").sort().join("");
// const sortedT = t.split("").sort().join("");
// return sortedS === sortedT;
// ?Without Inbuilt
// if (s.length !== t.length) return false;
// let map = new Map();
// for (let char of s) {
//   map.set(char, (map.get(char) || 0) + 1);
// }
// for (let char of t) {
// ?Optimization: If char doesn't exist in map, t has an extra unique character
// if (!map.has(char)) return false;
//   map.set(char, map.get(char) - 1);
//   if (map.get(char) == 0) {
//     map.delete(char);
//   }
// }
// return map.size === 0 ? true : false;
// };

// console.log(isAnagram());

// !383. Ransom Note
// var canConstruct = function (ransomNote = "aaa", magazine = "aab") {
//   if (ransomNote.length > magazine.length) return false;

//   let map = new Map();
//   for (let char of magazine) {
//     map.set(char, (map.get(char) || 0) + 1);
//   }

//   for (let char of ransomNote) {
//     if (!map.has(char) || map.get(char) == 0) {
//       return false;
//     }
//     map.set(char, map.get(char) - 1);
//   }

//   return true;
// };

// console.log(canConstruct());

// !387. First Unique Character in a String
// var firstUniqChar = function (s = "loveleetcode") {
//   if (s.length <= 1) return 0;

//   let map = new Map();
//   for (let char of s) {
//     map.set(char, (map.get(char) || 0) + 1);
//   }

//   for (let i = 0; i < s.length; i++) {
//     if (map.get(s[i]) === 1) {
//       return i;
//     }
//   }
//   return -1;
// };

// console.log(firstUniqChar());

// !49. Group Anagrams
// var groupAnagrams = function (
//   strs = ["eat", "tea", "tan", "ate", "nat", "bat"],
// ) {
//   let map = new Map();

//   for (let char of strs) {
//     let sortedChar = char.split("").sort().join("");
//     if (!map.has(sortedChar)) {
//       map.set(sortedChar, []);
//     }
//     map.get(sortedChar).push(char);
//   }
//   let res = [];
//   for (let [key, value] of map) {
//     res.push(value);
//   }
//   return res;
// };

// console.log(groupAnagrams());
