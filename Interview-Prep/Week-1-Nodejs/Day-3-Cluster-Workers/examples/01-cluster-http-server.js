// Example: Cluster-based HTTP Server

const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...\n`);

    const workers = [];

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        workers.push(worker);

        worker.on('message', (msg) => {
            console.log(`Master received from worker ${worker.id}:`, msg);
        });
    }

    // Track worker status
    cluster.on('online', (worker) => {
        console.log(`✓ Worker ${worker.id} (PID: ${worker.process.pid}) is online`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`✗ Worker ${worker.id} died (${signal || code})`);

        // Restart worker automatically
        if (!worker.exitedAfterDisconnect) {
            console.log('Starting a new worker...');
            const newWorker = cluster.fork();
            workers.push(newWorker);
        }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('\nSIGTERM received, shutting down gracefully...');
        workers.forEach(worker => {
            worker.send('shutdown');
            worker.disconnect();
        });
    });

} else {
    // Worker process
    let requestCount = 0;

    const server = http.createServer((req, res) => {
        requestCount++;

        // Simulate work
        const duration = Math.random() * 1000;

        setTimeout(() => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                worker: cluster.worker.id,
                pid: process.pid,
                requestCount,
                message: `Handled by worker ${cluster.worker.id}`
            }));

            // Send stats to master
            process.send({
                workerId: cluster.worker.id,
                requestCount
            });
        }, duration);
    });

    server.listen(8000, () => {
        console.log(`Worker ${cluster.worker.id} started`);
    });

    // Handle shutdown message
    process.on('message', (msg) => {
        if (msg === 'shutdown') {
            server.close(() => {
                console.log(`Worker ${cluster.worker.id} shutting down...`);
                process.exit(0);
            });
        }
    });
}

// Test:
// Start server: node cluster-example.js
// In another terminal: ab -n 1000 -c 10 http://localhost:8000/
