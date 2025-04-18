async function test() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
}
test();
console.log(3);

//  ====================

console.log("Start");
setTimeout(() => console.log("Timeout"), 0);
Promise.resolve().then(() => console.log("Promise"));
console.log("End");

//  ====================

async function run() {
  for (let i = 1; i <= 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(i);
  }
}
run();

//  ====================

const run = async () => {
  const result = await Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.reject("error"),
  ]);
  console.log(result);
};
run().catch((err) => console.log("Caught:", err));

//  ====================

function delay(msg, time) {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log(msg);
      resolve();
    }, time)
  );
}

(async () => {
  await delay("A", 100);
  await delay("B", 50);
  await delay("C", 10);
})();

//  ====================

function delay(msg, time) {
  return new Promise((resolve) =>
    setTimeout(() => {
      console.log(msg);
      resolve();
    }, time)
  );
}

(async () => {
  await delay("A", 100);
  await delay("B", 50);
  await delay("C", 10);
})();

//  ====================
console.log("A");
(async () => {
  console.log("B");
  await null;
  console.log("C");
})();
console.log("D");

// ====================

const fetchData = async () => {
  return "Data";
};

fetchData().then(console.log);
console.log("Fetching...");

//   ====================

const result = Promise.all([
  Promise.resolve("a"),
  new Promise((resolve) => setTimeout(() => resolve("b"), 100)),
  Promise.resolve("c"),
]);

result.then((res) => console.log(res));
// =====================
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
async1();
console.log("script end");

// =====================
console.log(1);

setTimeout(() => console.log(2));

Promise.resolve().then(() => console.log(3));

queueMicrotask(() => console.log(4));

console.log(5);

// =====================
const task = () =>
  new Promise((resolve) => {
    console.log("task");
    resolve("done");
  });

(async () => {
  console.log("before");
  await task().then(console.log);
  console.log("after");
})();
