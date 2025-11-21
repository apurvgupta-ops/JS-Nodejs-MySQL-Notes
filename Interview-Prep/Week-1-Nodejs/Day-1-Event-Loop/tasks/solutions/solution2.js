// Solution 2: Async Task Runner
console.log('=== Solution 2: Async Task Runner ===\n');

class TaskRunner {
    constructor() {
        this.tasks = [];
    }

    addTask(name, delay) {
        const task = {
            name,
            execute: () => new Promise((resolve) => {
                console.log(`  Starting: ${name}`);
                setTimeout(() => {
                    console.log(`  Completed: ${name}`);
                    resolve(name);
                }, delay);
            })
        };
        this.tasks.push(task);
        return this;
    }

    async runSequential() {
        console.log('Executing tasks sequentially...');
        for (const task of this.tasks) {
            await task.execute();
        }
        console.log('All sequential tasks completed!\n');
    }

    async runParallel() {
        console.log('Executing tasks in parallel...');
        const promises = this.tasks.map(task => task.execute());
        await Promise.all(promises);
        console.log('All parallel tasks completed!\n');
    }

    clear() {
        this.tasks = [];
        return this;
    }
}

// Test the implementation
async function testRunner() {
    const runner = new TaskRunner();

    // Test sequential execution
    runner.addTask('Task 1', 100)
        .addTask('Task 2', 50)
        .addTask('Task 3', 150);

    console.log('Testing Sequential Execution:');
    console.time('Sequential Time');
    await runner.runSequential();
    console.timeEnd('Sequential Time');
    // Expected: ~300ms (100 + 50 + 150)

    // Test parallel execution
    runner.clear()
        .addTask('Task A', 100)
        .addTask('Task B', 50)
        .addTask('Task C', 150);

    console.log('Testing Parallel Execution:');
    console.time('Parallel Time');
    await runner.runParallel();
    console.timeEnd('Parallel Time');
    // Expected: ~150ms (max of all delays)
}

testRunner();

// Key Learnings:
// 1. Sequential: await in loop ensures one-by-one execution
// 2. Parallel: Promise.all starts all tasks simultaneously
// 3. Parallel execution is much faster for independent tasks
// 4. Use sequential when tasks depend on each other
// 5. Use parallel when tasks are independent
