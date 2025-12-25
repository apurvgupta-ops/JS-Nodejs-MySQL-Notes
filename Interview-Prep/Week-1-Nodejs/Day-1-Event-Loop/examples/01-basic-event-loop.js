// Example 1: Basic Event Loop Order
console.log('=== Example 1: Basic Event Loop Order ===\n');

console.log('1: Sync start');

setTimeout(() => {
    console.log('2: setTimeout');
}, 0);

Promise.resolve().then(() => {
    console.log('3: Promise');
});

process.nextTick(() => {
    console.log('4: nextTick');
});

setImmediate(() => {
    console.log('5: setImmediate');
});

console.log('6: Sync end');

// Expected Output:
// 1: Sync start
// 6: Sync end
// 4: nextTick
// 3: Promise
// 2: setTimeout
// 5: setImmediate
