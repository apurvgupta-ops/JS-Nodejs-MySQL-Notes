// Task: Multi-threaded Image Processing API

const { Worker } = require('worker_threads');
const path = require('path');
const os = require('os');

/**
 * TODO: Implement a Worker Pool for image processing
 * 
 * Requirements:
 * 1. Create a WorkerPool class that manages multiple worker threads
 * 2. Implement task distribution (load balancing)
 * 3. Handle worker failures and restart
 * 4. Process multiple images in parallel
 * 5. Return results via promises
 */

class WorkerPool {
    constructor(numWorkers, workerScript) {
        // TODO: Initialize worker pool
        // - Create worker threads
        // - Set up message handlers
        // - Track free/busy workers
    }

    async execute(taskData) {
        // TODO: Execute task on available worker
        // - Queue task if no workers available
        // - Return promise that resolves with result
    }

    close() {
        // TODO: Terminate all workers
    }
}

// Usage example (test after implementation)
async function main() {
    const pool = new WorkerPool(os.cpus().length, path.join(__dirname, 'image-worker.js'));

    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];

    try {
        const results = await Promise.all(
            images.map(img => pool.execute({ filename: img, operation: 'resize' }))
        );

        console.log('All images processed:', results);
    } finally {
        pool.close();
    }
}

// main();
