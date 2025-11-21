// Example 4: Multiple nextTick and Promise Queues
console.log('=== Example 4: Multiple nextTick and Promise Queues ===\n');

process.nextTick(() => {
    console.log('nextTick 1');
    process.nextTick(() => {
        console.log('nextTick inside nextTick');
    });
});

process.nextTick(() => {
    console.log('nextTick 2');
});

Promise.resolve()
    .then(() => {
        console.log('Promise 1');
        return Promise.resolve();
    })
    .then(() => {
        console.log('Promise 2');
    });

Promise.resolve().then(() => {
    console.log('Promise 3');
});

console.log('Sync end');

// Expected Output:
// Sync end
// nextTick 1
// nextTick 2
// nextTick inside nextTick (from nested nextTick)
// Promise 1
// Promise 3
// Promise 2
