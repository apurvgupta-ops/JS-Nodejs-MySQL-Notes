function print(fn) {
  const res = fn();
  console.log(res);
}

// !3. Longest Substring No Repeat
// !1004. Max Consecutive Ones III
// !209. Min Size Subarray Sum
// !904. Fruit Into Baskets
// function maxFruitLen(fruits = [1, 2, 1], k = 2) {
//   let maxlen = 0;
//   let left = 0;
//   let map = new Map();

//   for (let right = 0; right < fruits.length; right++) {
//     map.set(fruits[right], (map.get(fruits[right]) || 0) + 1);

//     while (map.size > 2) {
//       map.set(fruits[left], map.get(fruits[left]) - 1);
//       if (map.get(fruits[left]) === 0) {
//         map.delete(fruits[left]);
//       }
//       left++;
//     }
//     let len = right - left + 1;
//     maxlen = Math.max(maxlen, len);
//   }

//   return maxlen;
// }
// const res = maxFruitLen();
// console.log(res);

// !424. Longest Repeating Char Replace
var characterReplacement = function (s = "AABABBA", k = 1) {
  let map = new Map();
  let maxFreq = 0;
  let left = 0;
  let maxlen = 0;

  for (let right = 0; right < s.length; right++) {
    let char = s[right];

    map.set(char, (map.get(char) || 0) + 1);
    maxFreq = Math.max(maxFreq, map.get(char));

    // let len = right - left + 1; we can't use this, becuase in while loop left get incremented, and len is outside the while loop so it check only for once(left pointer), and creates infinity loop
    while (right - left + 1 - maxFreq > k) {
      map.set(s[left], map.get(s[left]) - 1);
      left++;
    }

    maxlen = Math.max(maxlen, right - left + 1);
  }

  return maxlen;
};

console.log(characterReplacement());
