// Example 2: Nested Timers and Promises
console.log('=== Example 2: Nested Timers and Promises ===\n');

setTimeout(() => {
    console.log('Outer setTimeout');

    Promise.resolve().then(() => {
        console.log('Promise inside setTimeout');
    });

    process.nextTick(() => {
        console.log('nextTick inside setTimeout');
    });

    setTimeout(() => {
        console.log('Inner setTimeout');
    }, 0);
}, 0);

Promise.resolve()
    .then(() => {
        console.log('Outer Promise 1');
        return Promise.resolve();
    })
    .then(() => {
        console.log('Outer Promise 2');
    });

console.log('Synchronous code');

// Expected Output:
// Synchronous code
// Outer Promise 1
// Outer Promise 2
// Outer setTimeout
// nextTick inside setTimeout
// Promise inside setTimeout
// Inner setTimeout
