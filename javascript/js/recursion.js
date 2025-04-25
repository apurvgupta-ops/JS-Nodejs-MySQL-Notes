// function fun(count = 0) {
//   if (count == 10) return "Done";
//   count++;
//   console.log(count);
//   return fun(count);
// }

// console.log(fun());

// ! Print Name N times
// function fun(n, name, count = 0) {
//   if (count == n) {
//     return "Done";
//   }
//   console.log({ count: count + 1, name });
//   return fun(n, name, count + 1);
// }
// console.log(fun(4, "Apurv"));

// ! Print 1 to N
// function fun(n, count = 0) {
//   if (count == n) {
//     return "Done";
//   }

//   count++;
//   console.log({ count });
//   return fun(n, count);
// }

// console.log(fun(100));

// ! Sum of first N Natural Numbers
// function fun(n, count = 0, sum = 0) {
//   if (count > n) return "Done";

//   sum += count;
//   count++;
//   console.log({ sum });
//   return fun(n, count, sum);
// }

// console.log(fun(5));

// ! Factorial of a Number
// function fun(n, count = 1, sum = 1) {
//   if (count > n) return "Done";

//   sum *= count;
//   count++;
//   console.log({ sum });
//   return fun(n, count, sum);
// }

// console.log(fun(6));

// ! Reverse a given Array
// function fun(arr, arr2 = []) {
//   if (arr.length === 0) return arr2;
//   const lastElement = arr.pop();
//   arr2.push(lastElement);
//   return fun(arr, arr2);
// }

// const res = fun([1, 2, 3, 4, 5]);
// console.log(res);

// ! Palindrome or not
function fun(n) {
  if (count > n) return;
}

console.log(fun(4554));
