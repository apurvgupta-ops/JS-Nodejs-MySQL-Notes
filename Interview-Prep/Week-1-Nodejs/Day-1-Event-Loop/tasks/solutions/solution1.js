// Solution 1: Event Loop Visualization
console.log('=== Solution 1: Event Loop Visualization ===\n');

console.log('A'); // 1st - Synchronous

setTimeout(() => console.log('B'), 0); // 5th - Timer phase (0ms)
setTimeout(() => console.log('C'), 100); // Last - Timer phase (100ms)

Promise.resolve()
    .then(() => console.log('D')) // 3rd - Promise microtask
    .then(() => console.log('E')); // 4th - Chained promise

process.nextTick(() => console.log('F')); // 2nd - nextTick queue (highest priority)

setImmediate(() => console.log('G')); // 6th - Check phase

Promise.resolve().then(() => {
    console.log('H'); // 3rd batch - Promise microtask
    process.nextTick(() => console.log('I')); // After H, before next phase
});

console.log('J'); // 1st - Synchronous

// Correct order: A J F D H I E B G C
// 
// Explanation:
// 1. A, J - Synchronous code executes first
// 2. F - process.nextTick has highest priority
// 3. D, H - Promise microtasks (first level)
// 4. I - nextTick inside promise executes before continuing
// 5. E - Chained promise
// 6. B - setTimeout(0) in timer phase
// 7. G - setImmediate in check phase
// 8. C - setTimeout(100) executes last

console.log('\n✅ Run this file to verify the order!');
