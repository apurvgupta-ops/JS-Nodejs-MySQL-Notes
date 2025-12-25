// Task 2: Build a Simple Async Task Runner
// Create a function that runs tasks with proper async handling

console.log('=== Task 2: Async Task Runner ===\n');

// TODO: Implement the TaskRunner class

class TaskRunner {
    constructor() {
        this.tasks = [];
    }

    // Add a task to the queue
    addTask(name, delay) {
        // TODO: Implement this
        // Should return a promise that resolves after 'delay' ms
    }

    // Run all tasks sequentially
    async runSequential() {
        // TODO: Implement sequential execution
        // Each task should wait for the previous one to complete
    }

    // Run all tasks in parallel
    async runParallel() {
        // TODO: Implement parallel execution
        // All tasks should start at the same time
    }
}

// Test your implementation
async function testRunner() {
    const runner = new TaskRunner();

    runner.addTask('Task 1', 100);
    runner.addTask('Task 2', 50);
    runner.addTask('Task 3', 150);

    console.log('Running tasks sequentially...');
    console.time('Sequential');
    await runner.runSequential();
    console.timeEnd('Sequential');

    console.log('\nRunning tasks in parallel...');
    console.time('Parallel');
    await runner.runParallel();
    console.timeEnd('Parallel');
}

// testRunner();

// Expected behavior:
// Sequential should take ~300ms (sum of all delays)
// Parallel should take ~150ms (max delay)
