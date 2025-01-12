const resolveBtn = document.querySelector(".resolveBtn");
const rejectBtn = document.querySelector(".rejectBtn");

const myPromise = new Promise((res, rej) => {
  resolveBtn.addEventListener("click", () => {
    res("Promise Resolved");
  }),
    rejectBtn.addEventListener("click", () => {
      rej("Promise Reject");
    });
});
myPromise.then((i) => console.log(i)).catch((err) => console.log(err));
//  ---
function test() {
  console.log(test.abc);
}
test();
test.abc = 500;
test.abc = 800;
test();
//  ---

console.log({} == {});
// console.log({} === {});
//  ---

let a = 10;
let b = new Number(10);
console.log(b);
console.log(a == b);
//  ---

let ba = {
  name: "APurv",
};

let ab = ba;

ab.name = "appu";
console.log(ba.name);
//  ---

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
//  ---

console.log(+true);
console.log(!"test");
//  ---

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
//  ---
