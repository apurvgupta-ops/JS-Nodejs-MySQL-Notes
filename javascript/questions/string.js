// 1️⃣ Reverse a String (Manual Method Only)
// Input: "javascript"
// Output: "tpircsavaj" ✨ Use a loop — no .reverse().

// const n = "javascript"
// let str = ""

// way 1
// for (let i = n.length - 1; i >= 0; i--) {
//     str += n[i]
// }

// way 2
// let reverse = ""
// for (let ch of n) {
//     str = ch + str
// }

// console.log(str)

// 2️⃣ Check if a String is a Palindrome
// Input: "racecar"
// Output: Palindrome ✨ Compare characters from both ends using two-pointer logic.

// function Palindrome(n) {
//     let left = 0
//     let right = n.length - 1

//     while (left < right) {
//         if (n[left] !== n[right]) { return false }
//         else {
//             right--;
//             left++;
//         }
//     }
//     return true
// }

// console.log(Palindrome("hell"))
// console.log(Palindrome("racecar"))

//3️⃣ Count Frequency of Each Character
// Input: "banana"
// Output: { b:1, a:3, n:2 } ✨ Teaches hash maps / JS objects + iteration.

// By using map
// function freq(str) {
//     const map = new Map()

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }

//     return map
// }

// By using object
// function freq(str) {
//     const obj = {}
//     for (let ch of str) {
//         obj[ch] = (obj[ch] || 0) + 1
//     }

//     return obj
// }
// console.log(freq("banana"))

// 4️⃣ Find the Most Frequent Character in a String
// Input: "success"
// Output: Most frequent: s (3 times) ✨ Builds on frequency map — find maximum occurrence.

// function freq(str) {
//     const map = new Map()

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }

//     let char = ""
//     let maxFreq = 0
//     for (let [key, val] of map) {

//         // without char
//         // maxFreq = Math.max(maxFreq, val)

//         // with char
//         if (maxFreq < val) {
//             maxFreq = val
//             char = key
//         }
//     }

//     return { char, maxFreq }
// }

// console.log(freq("success"))

// 5️⃣ Check if Two Strings Are Anagrams (Without Sorting)
// Input: "listen", "silent"
// Output: Anagram ✨ Use character frequency comparison — no .sort().

// function anagram(str, str1) {
//     const map = new Map()

//     if (str.length !== str1.length) return false

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }

//     for (let ch of str1) {

//         if (!map.has(ch)) {
//             return false
//         }

//         map.set(ch, (map.get(ch)) - 1)

//         if (map.get(ch) == 0) {
//             map.delete(ch)
//         }
//     }

//     if (map.size === 0) return true
//     return false
// }

// console.log(anagram("listen", "silent"))

// 6️⃣ Find the First Non-Repeating Character
// Input: "aabbcddeff"
// Output: c ✨ Requires 2-pass algorithm: first count → then find first unique.

// function firstNonRepeatingChar(str) {
//     const map = new Map()

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }

//     for (let [key, val] of map) {
//         if (val === 1) {
//             return key
//         }
//     }

//     return false
// }

// console.log(firstNonRepeatingChar("aabbcddeff"))

// 7️⃣ Remove All Duplicate Characters (Keep First Occurrence)
// Input: "programming"
// Output: "progamin" ✨ Use a visited set + build new string.

// WITH TWO LOOPS
// function keepFirstOccurrence(str) {
//     const map = new Map()

//     for (let ch of str) {
//         if (!map.has(ch)) {
//             map.set(ch, true)
//         }
//     }

//     let result = ""
//     for (let [key, val] of map) {
//         result += key
//     }

//     return result
// }

// console.log(keepFirstOccurrence("programming"))

// WITH ONE LOOPS
// function keepFirstOccurrence(str) {
//     let result = ""
//     const map = new Map()

//     for (let ch of str) {
//         if (!map.has(ch)) {
//             map.set(ch, true)
//             result += ch
//         }
//     }
//     return result
// }

// console.log(keepFirstOccurrence("programming"))

// USING INBUILT
// function keepFirstOccurrence(str) {
//     return [...new Set(str)].join("")
// }

// console.log(keepFirstOccurrence("programming"))

// 8️⃣ Check if a String Contains Only Alphabets (No Regex)
// Input: "HelloWorld123"
// Output: False ✨ Use ASCII ranges manually.

// function stringOnly(str) {
//     for (let ch of str) {
//         const char = ch.charCodeAt()
//         console.log(char)
//         // if (!((char >= 65 && char <= 90) || (char >= 97 && char <= 122))) {
//         //     return false
//         // }

//         if (
//             !((ch >= 'A' && ch <= 'Z') ||
//                 (ch >= 'a' && ch <= 'z'))
//         ) {
//             return false;
//         }
//     }
//     return true
// }

// console.log(stringOnly("HelloWorld"))

// 9️⃣ Reverse Only the Words in a Sentence
// Input: "I love coding"
// Output: "coding love I" ✨ Split manually or build reverser yourself.

//  TWO LOOPS
// function reverseSentence(str) {
//     let result = []
//     let str1 = ""

//     for (let ch of str) {
//         if (ch !== " ") {
//             str1 += ch
//         }
//         else {
//             result.push(str1)
//             str1 = ""
//         }
//     }

//     if (str1.length) {
//         result.push(str1)
//     }

//     let words = ""
//     for (let i = result.length - 1; i >= 0; i--) {
//         words += result[i]

//         if (i !== 0) words += " "
//     }

//     return words

// }

//  SINGLE LOOPS
// function reverseSentence(str) {
//     let result = ""
//     let str1 = ""

//     for (let ch = str.length - 1; ch >= 0; ch--) {
//         if (str[ch] !== " ") {
//             str1 = str[ch] + str1
//         }
//         else {
//             result += str1 + " "
//             str1 = ""
//         }
//     }

//     result += str1

//     return result

// }

// console.log(reverseSentence("I love coding"))

// 🔟 Reverse Only the Words in a Sentence at same place
// Input: "I love coding"
// Output: "I evol gnidoc"
// function reverseSentence(str) {
//     let result = ""
//     let str1 = ""

//     for (let ch of str) {
//         if (ch !== " ") {
//             str1 = ch + str1
//         }
//         else {
//             result += str1 + " "
//             str1 = ""
//         }
//     }

//     result += str1

//     return result

// }

// console.log(reverseSentence("I love coding"))

// 1️⃣1️⃣ Find the Longest Word in a Sentence
// Input: "coding is beautiful"
// Output: "beautiful" ✨ Manual scanning + longest tracking.

// WAY 1
// function longestWord(str) {
//     const map = new Map()
//     let str1 = ""
//     for (let ch of str) {
//         if (ch !== " ") { str1 += ch }
//         else {
//             map.set(str1, str1.length)
//             str1 = ""
//         }
//     }
//     map.set(str1, str1.length)

//     let maxLength = 0
//     let word = ""
//     for (let [key, val] of map) {
//         if (maxLength < val) {
//             maxLength = val
//             word = key
//         }
//     }
//     return { word, maxLength }
// }

// function longestWord(str) {
//     let str1 = ""
//     let maxLength = 0;
//     let word = ""
//     for (let ch of str) {
//         if (ch !== " ") { str1 += ch }
//         else {
//             if (maxLength < str1.length) {
//                 maxLength = str1.length;
//                 word = str1
//             }
//             str1 = ""
//         }
//     }

//     if (str1.length > maxLength) {
//         maxLength = str1.length;
//         word = str1;
//     }
//     return { word, maxLength }
// }

// console.log(longestWord("coding is beautiful"))

// 1️⃣2️⃣ Count the Number of Words (Manually Without split)
// Input: "  hi   there  world "
// Output: 3 words ✨ Detect transitions from space → non-space using logic.

// function noOfWords(str) {
//     let str1 = ""
//     let count = 0
//     for (let ch of str) {
//         if (ch !== " ") {
//             str1 += ch
//         }
//         else if (str1 !== "") {
//             count++
//             str1 = ""
//         }

//     }
//     if (str1 !== "") {
//         count++
//     }

//     return count
// }

// console.log(noOfWords("  hi hi   there  world "))

// 1️⃣3️⃣ Find All Substrings of a String (No Built-ins)
// Input: "abc"
// Output: a, ab, abc, b, bc, c ✨ Nested loops + substring construction.

// function substrings(str) {
//     const res = []
//     for (let i = 0; i < str.length; i++) {
//         let str1 = ""
//         for (let j = i; j < str.length; j++) {
//             str1 += str[j]
//             // res.push(str.substring(i, j)); // with inbuilt
//             res.push(str1)
//         }
//     }
//     return res
// }

// console.log(substrings("abc"))

// 1️⃣4️⃣ Compress a String (Basic Run-Length Encoding)
// Input: "aaabbccccd"
// Output: "a3b2c4d1" ✨ Count consecutive characters and build encoded output.

// TWO LOOPS
// function stringCompression(str) {
//     const map = new Map()

//     for (let ch of str) {
//         map.set(ch, (map.get(ch) || 0) + 1)
//     }
//     let result = ""

//     for (let [key, val] of map) {
//         result += `${key}${val}`
//     }

//     return result
// }

// SINGLE LOOPS
// function stringCompression(str) {
//     let res = ""
//     let count = 1
//     for (let ch = 0; ch < str.length; ch++) {
//         if (str[ch] === str[ch + 1]) {
//             count++
//         }
//         else {
//             res += str[ch] + count;
//             count = 1
//         }
//     }

//     return res
// }

// console.log(stringCompression("aaabbccccd"))

// ! ------------------INTREMEDIATE QUESTIONS---------------------

// 1️⃣ Find if One String Is a Substring of Another (Manual Method)
// Input: Main string: "hellothere" Target string: "there"
// Output: true ✨ Manual parsing only; check character by character without using includes, or indexOf.

// With BuiltIn
// const n = "hellothere"
// const bool = n.includes("thereasd");
// console.log(bool)

// ? SLIDING WINDOW APPROACH
// function isSubstring(str, target) {
//     const strlen = str.length
//     const targetlen = target.length

//     for (let ch = 0; ch < strlen; ch++) {
//         let isMatch = ""

//         for (let i = ch; i < targetlen + ch; i++) {
//             isMatch += str[i]
//         }
//         if (isMatch == target) {
//             return true
//         }
//     }
//     return false

// }

// console.log(isSubstring("hellothereasd", "there"))

// 2️⃣ Manual Substring Search (Without Using indexOf)
// Input: text = "hello world", pattern = "wor"
// Output: Found at index 6 ✨ Classic naive pattern matching algorithm (two nested loops).

// function subStrSearch(str, target) {

//     const strlen = str.length;
//     const targetlen = target.length;

//     for (let i = 0; i < strlen; i++) {
//         let isMatch = ""

//         for (let j = i; j < targetlen + i; j++) {
//             isMatch += str[j]
//         }

//         if (isMatch == target) {
//             return i
//         }
//     }
//     return -1
// }

// console.log(subStrSearch("hello world", "wor"))

// 3️⃣ Check if One String is Rotation of Another
// Input: "abcde", "cdeab"
// Output: Rotation ✨ Use the trick: second string must be inside (s1 + s1).

// Inbuilt
// console.log(("abcde" + "abcde").includes("cdeab"))

// Without inbuilt
// function isRotation(str, target) {
//     const newStr = str + str
//     const newStrLen = newStr.length
//     const targetLen = target.length

//     for (let i = 0; i < newStrLen; i++) {
//         let isMatch = ""

//         for (let j = i; j < targetLen + i; j++) {
//             isMatch += newStr[j]
//         }
//         if (isMatch == target) {
//             return true
//         }
//     }

//     return false
// }

// console.log(isRotation('abcde', 'cdeab'))

// 4️⃣ Count Frequency of Each Word in a Sentence
// Input: "i love coding and i love javascript"
// Output: { i:2, love:2, coding:1, and:1, javascript:1 } ✨ Word parsing + map building.

// function eachWordCount(str) {
//     let word = ""
//     const map = new Map()
//     for (let ch of str) {
//         if (ch !== " ") {
//             word += ch
//         }
//         else {
//             map.set(word, (map.get(word) || 0) + 1)
//             word = ""
//         }
//     }

//     map.set(word, (map.get(word) || 0) + 1)
//     return map
// }

// console.log(eachWordCount("i love coding and i love javascript"))

// 5️⃣ Check If a String Is a Pangram
// Input: "The quick brown fox jumps over the lazy dog"
// Output: Pangram ✨ Check if all 26 letters exist.

// function pangram(str) {
//     const letters = "abcdefghijklmnopqrstuvwxyz";
//     for (let i of letters) {
//         if (!str.includes(i)) return false;
//     }
//     return true;
// }

// function pangram(str) {
//     const set = new Set()
//     for (let i of str) {
//         if (i >= "a" && i <= "z") {
//             set.add(i)
//         };
//     }
//     return set.size === 26 ? true : false;
// }
// console.log(pangram("The quick brown fox jumps over the lazy dog"));

// 6️⃣ Remove All Duplicate Words From a Sentence
// Input: "this is is a test test string"
// Output: "this is a test string" ✨ Track seen words, build cleaned sentence.

// function existOrNot(str) {
//     const seen = new Map()
//     let word = ''
//     for (let ch of str) {
//         if (ch !== " ") {
//             word += ch
//         } else {
//             if (!seen.has(word)) {
//                 seen.set(word, true)
//             }
//             word = ""
//         }
//     }

//     seen.set(word, true)

//     return [...seen.keys()].join(" ")
// }

// console.log(existOrNot("this is is a test test string"))

// 7️⃣ Find the Longest Palindromic Substring (Brute Force Allowed)
// Input: "babad"
// Output: "bab" or "aba" ✨ Check all substrings; teaches brute-force reasoning.

// function isPalindromic(str) {
//     let res = []
//     let longest = ''
//     for (let ch = 0; ch < str.length; ch++) {
//         let str1 = ""

//         for (let i = ch; i < str.length; i++) {
//             str1 += str[i]

//             let left = 0;
//             let right = str1.length - 1
//             let isPalindrome = true;

//             while (left < right) {
//                 if (str1[left] !== str1[right]) {
//                     isPalindrome = false;
//                     break;
//                 }
//                 left++;
//                 right--;
//             }

//             // if (isPalindrome && str1.length > longest.length) {
//             //     longest = str1
//             // }
//             if (isPalindrome && str1.length > 2) {
//                 res.push(str1)
//             }
//         }
//     }
//     // return longest
//     return res
// }

// console.log(isPalindromic("babad"))

// 8️⃣ Find All Anagram Pairs in an Array of Strings
// Input: ["cat", "tac", "act", "dog"]
// Output: ["cat","tac","act"]

// function allAnagramPairs(arr) {
//     const map = new Map()
//     for (let str of arr) {
//         let key = str.split("").sort().join("")

//         if (!map.has(key)) {
//             map.set(key, [])
//         }

//         map.get(key).push(str)
//     }

//     let result = []
//     for (let res of map.values()) {
//         if (res.length > 1) {
//             result.push(...res)
//         }
//     }
//     return result
// }

// console.log(allAnagramPairs(["cat", "tac", "act", "dog"]))

// 9️⃣ Find the Longest Substring Without Repeating Characters (Sliding Window)
// Input: "abcabcbb"
// Output: "abc" ✨ Introduction to sliding windows, hash maps, and window shrinking logic.

function longestSubstring(str) {
  let longest = "";
  for (let i = 0; i < str.length; i++) {
    const seen = new Set();
    let current = "";
    for (let j = i; j < str.length; j++) {
      if (seen.has(str[j])) break;
      seen.add(str[j]);
      current += str[j];
    }

    if (current.length > longest.length) {
      longest = current;
    }
  }

  return longest;
}

console.log(longestSubstring("abcabcbb"));
