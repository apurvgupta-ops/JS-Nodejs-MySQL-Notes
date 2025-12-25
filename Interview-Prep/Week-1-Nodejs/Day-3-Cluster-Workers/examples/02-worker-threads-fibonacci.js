// Example: Worker Threads for CPU-intensive tasks

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// CPU-intensive Fibonacci calculation
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

if (isMainThread) {
    // Main thread
    console.log('=== Worker Threads Example ===\n');

    const numbers = [35, 36, 37, 38];

    console.log('Calculating Fibonacci (sequential)...');
    console.time('Sequential');
    const sequentialResults = numbers.map(n => ({
        n,
        result: fibonacci(n)
    }));
    console.timeEnd('Sequential');
    console.log('Results:', sequentialResults);

    console.log('\nCalculating Fibonacci (parallel with workers)...');
    console.time('Parallel');

    const workers = numbers.map(n => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: n
            });

            worker.on('message', (result) => {
                resolve({ n, result });
            });

            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with code ${code}`));
                }
            });
        });
    });

    Promise.all(workers).then(parallelResults => {
        console.timeEnd('Parallel');
        console.log('Results:', parallelResults);

        console.log('\n✓ Parallel execution is faster for CPU-intensive tasks!');
    });

} else {
    // Worker thread
    const result = fibonacci(workerData);
    parentPort.postMessage(result);
}
