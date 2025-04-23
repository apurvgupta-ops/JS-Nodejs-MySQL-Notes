// ! square
// const pat1 = (n) => {
//   let pattern = "";
//   for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
//       pattern += "* ";
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };
// console.log(pat1(5));

// ! Right Angled Triangle
// const pat2 = (n) => {
//   let pattern = "";
//   for (let i = 1; i <= n; i++) {
//     for (let j = 1; j <= n - i + 1; j++) {
//       pattern += j;
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat2(5));

// ! Triangle
const pat3 = (n) => {
  let pattern = "";
  for (let i = 1; i <= n; i++) {
    for (let s = 0; s < n - i; s++) {
      pattern += " ";
    }
    for (let j = 1; j <= n - i + 1; j++) {
      pattern += j;
    }
    for (let s = 0; s < n - i; s++) {
      pattern += " ";
    }
    pattern += "\n";
  }
  return pattern;
};

console.log(pat3(5));
