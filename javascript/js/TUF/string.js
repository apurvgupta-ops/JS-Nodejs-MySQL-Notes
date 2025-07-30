// ! Remove outermost Paranthesis : O(n)
// function fun(str) {
//     let result = ''
//     let open = 0;

//     for (let char of str) {
//         if (char == '(') {
//             console.log({ char, open, result })
//             if (open > 0) {
//                 result += char
//             }
//             open++;
//             // console.log({ open, result })
//         }
//         else {
//             console.log({ char, open, result })

//             open--;
//             if (open > 0) {
//                 result += char
//             }
//         }
//     }
//     return result

// }

// const str = "()(()())(())"
// console.log(fun(str))

// ! Reverse Words in a String
// Example 1:
// Input: s=”this is an amazing program”
// Output: “program amazing an is this”

// ? InBuilt method :
// const str = "this is an amazing program"
// const stsr = str.split(" ").reverse().join(" ")
// console.log({ stsr })

// ? TC : O(n)
// function fun(str) {
//     let word = "";
//     let words = []
//     for (let char of str) {
//         if (char !== " ") {
//             word += char
//         }
//         else if (word) {
//             words.push(word)
//             word = ""
//         }
//     }

//     if (word) words.push(word)

//     let result = "";
//     for (let i = words.length - 1; i >= 0; i--) {
//         result += words[i]

//         if (i > 0) result += " "
//     }
//     return result
// }

// console.log(fun(str))

// ! Largest Odd Number in a String
// Input : s = "5347"
// Output : "5347"
// Explanation : The odd numbers formed by given strings are --> 5, 3, 53, 347, 5347.
// So the largest among all the possible odd numbers for given string is 5347.
/*
The algorithm uses a greedy approach:
Start from the rightmost digit and move backwards
Check if the current digit is odd using parseInt(str[i]) % 2 === 1
When an odd digit is found, return the substring from index 0 to that position (inclusive)
If no odd digit exists, return an empty string
*/

// const str = "0214638"
// function fun(str) {
//     for (let i = str.length - 1; i >= 0; i--) {
//         if (parseInt(str[i] % 2) == 1) {
//             return str.substring(0, i + 1)
//         }
//     }

//     return ""

// }
// console.log(fun(str))

// ! Longest Common Prefix
// Input : str = ["flowers" , "flow" , "fly", "flight" ]
// Output : "fl"
// Explanation : All strings given in array contains common prefix "fl".

/*
How indexOf() Works :
The indexOf() method returns the position of the first occurrence of a specified substring within a string. It has the following behavior:
Returns the index (0-based position) if the substring is found
Returns -1 if the substring is not found
Case-sensitive - "Hello" and "hello" are treated as different strings
*/

// const str = ["flowers", "flow", "fly", "flight"]
// function fun(str) {

//     if (!str || str.length == 0) return ""

//     let prefix = str[0]
//     for (let i = 1; i < str.length; i++) {
//         while (str[i].indexOf(prefix) !== 0) {
//             prefix = prefix.slice(0, -1)
//             if (prefix == "") return
//         }
//     }

//     return prefix

// }
// console.log(fun(str))

// ! Isomorphic String
// Input : s = "egg" , t = "add"
// Output : true
// Explanation : The 'e' in string s can be replaced with 'a' of string t.
// The 'g' in string s can be replaced with 'd' of t.
// Hence all characters in s can be replaced to get t.

