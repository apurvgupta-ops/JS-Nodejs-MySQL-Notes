// ! Integer Count
// function fun(n) {
//   let count = 0;
//   while (n > 0) {
//     count++;
//     n = Math.floor(n / 10);
//   }
//   return count;
// }

// console.log(fun(12345));

// ! Reverse Number
// function fun(n) {
//   let reverseNumber = 0;
//   while (n > 0) {
//     let lastDigit = n % 10;
//     reverseNumber = reverseNumber * 10 + lastDigit;
//     n = Math.floor(n / 10);
//     console.log({ n });
//   }
//   return reverseNumber;
// }

// console.log(fun(12345));

// ! Check Palindrone
// function fun(n) {
//   let reverseNumber = 0;
//   let realNumber = n;
//   while (n > 0) {
//     let lastDigit = n % 10;
//     reverseNumber = reverseNumber * 10 + lastDigit;
//     n = Math.floor(n / 10);
//   }
//   console.log({ reverseNumber });
//   if (reverseNumber == realNumber) {
//     return "This Number is Palindrone";
//   } else {
//     return "This is not a palindrone";
//   }
// }

// console.log(fun(4554));

// ! GCD
// function fun(n, m) {
//   let largest = 0;
//   for (let i = 0; i < Math.min(n, m); i++) {
//     if (n % i == 0 && m % i == 0) {
//       largest = i;
//     }
//   }
//   return largest;
// }

// console.log(fun(10, 14));

// ! Armstrong Number
// function fun(n) {
//   let armstrong = 0;
//   while (n > 0) {
//     let lastDigit = n % 10;
//     armstrong += Math.pow(lastDigit, 3);
//     n = Math.floor(n / 10);
//   }
//   return armstrong;
// }

// console.log(fun(153));

// ! Print All Divisor
// function fun(n) {
//   let divisor = [];
//   for (let i = 0; i <= n; i++) {
//     if (n % i == 0) {
//       divisor.push(i);
//     }
//   }
//   return divisor;
// }

// console.log(fun(36));

// ! prime or not
function fun(n) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    if (n % i == 0) {
      arr.push(i);
    }
  }
  if (arr.length > 2) {
    return "This is not a prime number";
  } else {
    return `This is prime number`;
  }
}
console.log(fun(18));
