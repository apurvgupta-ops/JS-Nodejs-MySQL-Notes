// ! square
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
//       pattern += "* ";
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };
// console.log(pat(5));

// ! Right Angled Triangle
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 1; i <= n; i++) {
//     for (let j = 1; j <= n - i + 1; j++) {
//       pattern += j;
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! Triangle
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i <= n; i++) {
//     for (let s = 0; s <= n - i; s++) {
//       pattern += " ";
//     }
//     for (let j = 1; j <= 2 * i + 1; j++) {
//       pattern += "*";
//     }
//     for (let s = 0; s <= n - i; s++) {
//       pattern += " ";
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! Reverse Triangle
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i <= n; i++) {
//     for (let s = 0; s <= i; s++) {
//       pattern += " ";
//     }
//     for (let j = 1; j <= 2 * n - (2 * i - 1); j++) {
//       pattern += "*";
//     }
//     for (let s = 0; s <= i; s++) {
//       pattern += " ";
//     }
//     pattern += "\n";
//   }

//   return pattern;
// };

// console.log(pat(5));

// ! Diamond
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i <= n; i++) {
//     for (let s = 0; s <= n - i; s++) {
//       pattern += " ";
//     }
//     for (let j = 1; j <= 2 * i + 1; j++) {
//       pattern += "*";
//     }
//     for (let s = 0; s <= n - i; s++) {
//       pattern += " ";
//     }
//     pattern += "\n";
//   }
//   for (let i = 0; i <= n; i++) {
//     for (let s = 0; s <= i; s++) {
//       pattern += " ";
//     }
//     for (let j = 1; j <= 2 * n - (2 * i - 1); j++) {
//       pattern += "*";
//     }
//     for (let s = 0; s <= i; s++) {
//       pattern += " ";
//     }
//     pattern += "\n";
//   }

//   return pattern;
// };

// console.log(pat(5));

// ! half Diamond
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i <= n; i++) {
//     for (let j = 0; j < i; j++) {
//       pattern += "* ";
//     }
//     pattern += "\n";
//   }
//   for (let i = 0; i <= n; i++) {
//     for (let j = 0; j < n - i; j++) {
//       pattern += "* ";
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! O 1 triangle
// const pat = (n) => {
//   let pattern = "";
//   let count = 0;
//   for (let i = 0; i < n; i++) {
//     for (let j = 0; j < i; j++) {
//       if (count === 0) {
//         pattern += 1;
//         count++;
//       } else {
//         pattern += 0;
//         count--;
//       }
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! Right angled Numbertriangle adjcent
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 1; i <= n; i++) {
//     for (let j = 1; j <= i; j++) {
//       pattern += j;
//     }
//     for (let s = 0; s < 2 * (n - i); s++) {
//       pattern += " ";
//     }
//     for (let j = i; j >= 1; j--) {
//       pattern += j;
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! Increase Number Right Angled Triangle
// const pat = (n) => {
//   let pattern = "";
//   let count = 1;
//   for (let i = 1; i <= n; i++) {
//     for (let j = 0; j < i; j++) {
//       pattern += count++;
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! Alphabet right triangle
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i <= n; i++) {
//     for (let j = 0; j <= i; j++) {
//       pattern += String.fromCharCode(65 + i);
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! Alphabet triangle with alternate ABC
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i <= n; i++) {
//     for (let s = 0; s < n - i; s++) {
//       pattern += "*";
//     }
//     for (let j = 0; j < i; j++) {
//       pattern += String.fromCharCode(65 + j);
//     }

//     for (let j = i - 2; j >= 0; j--) {
//       pattern += String.fromCharCode(65 + j);
//     }

//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(4));

// ! Reverse Alphabet triangle
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 1; i <= n; i++) {
//     let startChar = 65 + n - i - 1;
//     for (let j = 1; j <= i; j++) {
//       pattern += String.fromCharCode(startChar + j);
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(4));

// ! Diamond Inside Square
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 1; i <= n; i++) {
//     for (let j = 0; j <= n - i; j++) {
//       pattern += "*";
//     }
//     for (let s = 0; s < i; s++) {
//       pattern += " ";
//     }
//     for (let s = 0; s < i; s++) {
//       pattern += " ";
//     }
//     for (let j = 0; j <= n - i; j++) {
//       pattern += "*";
//     }

//     pattern += "\n";
//   }

//   for (let i = 1; i <= n; i++) {
//     for (let j = 0; j < i; j++) {
//       pattern += "*";
//     }
//     for (let s = 0; s <= n - i; s++) {
//       pattern += " ";
//     }

//     for (let s = 0; s <= n - i; s++) {
//       pattern += " ";
//     }
//     for (let j = 0; j < i; j++) {
//       pattern += "*";
//     }

//     pattern += "\n";
//   }

//   return pattern;
// };
// console.log(pat(5));

// ! Butterfly

// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i <= n; i++) {
//     for (let j = 0; j < i; j++) {
//       pattern += "*";
//     }

//     for (let s = 0; s < n - i; s++) {
//       pattern += " ";
//     }

//     for (let s = 0; s < n - i; s++) {
//       pattern += " ";
//     }

//     for (let j = 0; j < i; j++) {
//       pattern += "*";
//     }

//     pattern += "\n";
//   }

//   for (let i = 0; i <= n; i++) {
//     for (let j = 0; j < n - i; j++) {
//       pattern += "*";
//     }

//     for (let s = 0; s < i; s++) {
//       pattern += " ";
//     }

//     for (let s = 0; s < i; s++) {
//       pattern += " ";
//     }

//     for (let j = 0; j < n - i; j++) {
//       pattern += "*";
//     }

//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! Hollow square
// const pat = (n) => {
//   let pattern = "";
//   for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
//       if (j == 0 || i == 0 || i == n - 1 || j == n - 1) {
//         pattern += "*";
//       } else {
//         pattern += " ";
//       }
//     }
//     pattern += "\n";
//   }
//   return pattern;
// };

// console.log(pat(5));

// ! Important
const pat = (n) => {
  let pattern = "";
  const size = 2 * n - 1;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const top = i;
      const left = j;
      const right = size - 1 - j;
      const bottom = size - 1 - i;

      const layer = Math.min(top, left, right, bottom);
      pattern += n - layer;
    }
    pattern += "\n";
  }

  return pattern;
};

console.log(pat(3));
