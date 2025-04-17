// const resolveBtn = document.querySelector(".resolveBtn");
// const rejectBtn = document.querySelector(".rejectBtn");

// const myPromise = new Promise((res, rej) => {
//   resolveBtn.addEventListener("click", () => {
//     res("Promise Resolved");
//   }),
//     rejectBtn.addEventListener("click", () => {
//       rej("Promise Reject");
//     });
// });
// myPromise.then((i) => console.log(i)).catch((err) => console.log(err));
//  ===================================

let a = 10;
let b = new Number(10);
console.log(b);
console.log(a == b);

//  ===================================

let ba = {
  name: "APurv",
};

let ab = ba;

ab.name = "appu";
console.log(ba.name);

//  ===================================

// function test1(record) {
//   console.log({ ...record });
//   if ({ ...record } == { age: 28 }) {
//     console.log("hhhhh");
//   } else if (record === { age: 28 }) {
//     console.log("2888 else if");
//   } else {
//     console.log("no records");
//   }
// }

// test1({ age: 28 });

//  ===================================

var aa = {};
var bb = { key: "bb" };
var cc = { key: "cc" };
console.log(aa[bb]); //u
console.log(aa[cc]); //
console.log(bb[bb]); //
console.log(bb[cc]);

aa[bb] = 500;
bb[cc] = 600;
bb[bb] = 400;
console.log(aa[cc]);
console.log(aa[bb]);
console.log(bb[bb]);
console.log(bb[cc]);

//  ===================================

console.log([] + [] == "")
console.log(1 < 2 < 3)
console.log(1 > 2 > 3)
console.log(NaN == NaN)
console.log(+true);
console.log(!"test");

// ===========

console.log("Start");

const promise = new Promise((resolve, reject) => {
  console.log("Inside Promise");
  resolve("Resolved!");
});

promise.then((res) => console.log(res));

console.log("End");

// ===============

const obj = {
  name: "John",
  greet: function () {
    console.log(this.name);
  },
};

setTimeout(obj.greet, 1000);

// ==================
function outer() {
  let count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}

const counter = outer();
counter();
counter();

// ==================
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}

// ===================
const promise1 = Promise.resolve("A");
const promise2 = new Promise((res) => setTimeout(() => res("B"), 100));
const promise3 = Promise.resolve("C");

Promise.all([promise1, promise2, promise3]).then(console.log);

// ===================
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
}).then(() => {
  console.log("Promise 2");
});

console.log("End");


// ===================
function test() {
  console.log(test.abc);
}
test();
test.abc = 500;
test.abc = 800;
test();


