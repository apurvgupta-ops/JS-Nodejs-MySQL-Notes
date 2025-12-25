// Example 5: Real-world Async Patterns

console.log('=== Example 5: Real-world Async Patterns ===\n');

// Pattern 1: Callback Hell (Anti-pattern)
function callbackHell() {
    console.log('\n1. Callback Hell (Anti-pattern):');

    setTimeout(() => {
        console.log('  Step 1 complete');
        setTimeout(() => {
            console.log('  Step 2 complete');
            setTimeout(() => {
                console.log('  Step 3 complete');
            }, 100);
        }, 100);
    }, 100);
}

// Pattern 2: Promise Chain
function promiseChain() {
    console.log('\n2. Promise Chain:');

    return new Promise((resolve) => {
        setTimeout(() => resolve('  Step 1 complete'), 100);
    })
        .then((msg) => {
            console.log(msg);
            return new Promise((resolve) => {
                setTimeout(() => resolve('  Step 2 complete'), 100);
            });
        })
        .then((msg) => {
            console.log(msg);
            return new Promise((resolve) => {
                setTimeout(() => resolve('  Step 3 complete'), 100);
            });
        })
        .then((msg) => {
            console.log(msg);
        });
}

// Pattern 3: Async/Await (Best Practice)
async function asyncAwait() {
    console.log('\n3. Async/Await (Best Practice):');

    const step1 = () => new Promise((resolve) => {
        setTimeout(() => resolve('  Step 1 complete'), 100);
    });

    const step2 = () => new Promise((resolve) => {
        setTimeout(() => resolve('  Step 2 complete'), 100);
    });

    const step3 = () => new Promise((resolve) => {
        setTimeout(() => resolve('  Step 3 complete'), 100);
    });

    console.log(await step1());
    console.log(await step2());
    console.log(await step3());
}

// Pattern 4: Parallel Execution
async function parallelExecution() {
    console.log('\n4. Parallel Execution:');

    const task1 = new Promise((resolve) => {
        setTimeout(() => resolve('  Task 1 complete'), 100);
    });

    const task2 = new Promise((resolve) => {
        setTimeout(() => resolve('  Task 2 complete'), 150);
    });

    const task3 = new Promise((resolve) => {
        setTimeout(() => resolve('  Task 3 complete'), 50);
    });

    // All tasks run in parallel
    const results = await Promise.all([task1, task2, task3]);
    results.forEach(result => console.log(result));
}

// Execute all patterns
(async () => {
    callbackHell();

    setTimeout(async () => {
        await promiseChain();
        await asyncAwait();
        await parallelExecution();
    }, 500);
})();
