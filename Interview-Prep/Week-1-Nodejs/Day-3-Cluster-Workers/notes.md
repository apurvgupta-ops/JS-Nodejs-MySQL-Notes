# Day 3: Cluster Module & Worker Threads

## 📚 Table of Contents
1. Single-threaded Nature of Node.js
2. Cluster Module
3. Worker Threads
4. Cluster vs Worker Threads
5. Load Balancing
6. Best Practices

---

## 1. Single-threaded Nature of Node.js

Node.js runs on a **single thread** for JavaScript execution, but uses **libuv** for async I/O operations.

**Limitations:**
- Cannot utilize multiple CPU cores by default
- CPU-intensive tasks block the event loop
- One core = underutilized on multi-core systems

**Solutions:**
- **Cluster Module**: Multiple processes
- **Worker Threads**: Multiple threads within a process

---

## 2. Cluster Module

Creates **multiple Node.js processes** (workers) that share the same server port.

### How It Works

```
┌─────────────┐
│   Master    │ ← Main process
│   Process   │
└──────┬──────┘
       │
       ├─────┬─────┬─────┬─────┐
       │     │     │     │     │
     Worker Worker Worker Worker  ← Child processes
       1     2     3     4
```

### Basic Example

```javascript
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart worker
    cluster.fork();
  });
} else {
  // Workers share TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}\n`);
  }).listen(8000);
  
  console.log(`Worker ${process.pid} started`);
}
```

### Key Features

**1. Automatic Load Balancing**
- Master distributes connections to workers
- Round-robin by default (can be configured)

**2. Process Isolation**
- Workers don't share memory
- One worker crash doesn't affect others

**3. IPC (Inter-Process Communication)**
```javascript
// Master sends message
worker.send({ msg: 'Hello worker!' });

// Worker receives message
process.on('message', (msg) => {
  console.log('Received:', msg);
});
```

---

## 3. Worker Threads

Creates **multiple threads** within the same process for CPU-intensive tasks.

### How It Works

```
┌──────────────────────────┐
│      Main Thread         │
└────────┬─────────────────┘
         │
         ├────┬────┬────┬────┐
         │    │    │    │    │
       Thread Thread Thread Thread
         1    2    3    4
         
All threads share memory (with SharedArrayBuffer)
```

### Basic Example

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Main thread
  console.log('Main thread');
  
  const worker = new Worker(__filename, {
    workerData: { num: 5 }
  });
  
  worker.on('message', (result) => {
    console.log('Result from worker:', result);
  });
  
  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });
  
  worker.on('exit', (code) => {
    console.log(`Worker stopped with code ${code}`);
  });
} else {
  // Worker thread
  const result = fibonacci(workerData.num);
  parentPort.postMessage(result);
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### Sharing Data

**1. Message Passing (Copy)**
```javascript
// Main thread
worker.postMessage({ data: 'hello' });

// Worker thread
parentPort.on('message', (msg) => {
  console.log(msg.data);
});
```

**2. SharedArrayBuffer (Shared Memory)**
```javascript
const { Worker } = require('worker_threads');

// Create shared memory
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);

const worker = new Worker(`
  const { parentPort, workerData } = require('worker_threads');
  const sharedArray = new Int32Array(workerData);
  
  // Increment shared counter
  Atomics.add(sharedArray, 0, 1);
  parentPort.postMessage('done');
`, { eval: true, workerData: sharedBuffer });

worker.on('message', () => {
  console.log('Counter:', sharedArray[0]); // 1
});
```

---

## 4. Cluster vs Worker Threads

| Feature           | Cluster Module      | Worker Threads      |
| ----------------- | ------------------- | ------------------- |
| **Creates**       | Multiple processes  | Multiple threads    |
| **Memory**        | Separate (isolated) | Shared (can share)  |
| **Communication** | IPC (slower)        | Messages (faster)   |
| **Startup**       | Slower              | Faster              |
| **Use Case**      | Scale HTTP servers  | CPU-intensive tasks |
| **Overhead**      | Higher (process)    | Lower (thread)      |
| **Isolation**     | Complete            | Limited             |
| **Shared Port**   | Yes                 | No                  |

### When to Use Each

**Use Cluster:**
- Scaling web servers
- Utilizing all CPU cores
- High availability (auto-restart)
- Need complete isolation

**Use Worker Threads:**
- CPU-intensive calculations
- Image/video processing
- Data compression
- Heavy computations in background

---

## 5. Load Balancing

### Cluster Load Balancing

**Round-robin (default on non-Windows):**
```javascript
const cluster = require('cluster');

if (cluster.isMaster) {
  // Default is round-robin
  cluster.schedulingPolicy = cluster.SCHED_RR;
  
  for (let i = 0; i < 4; i++) {
    cluster.fork();
  }
}
```

**Operating System (Windows default):**
```javascript
cluster.schedulingPolicy = cluster.SCHED_NONE;
```

### Custom Load Balancing with Worker Threads

```javascript
class WorkerPool {
  constructor(numWorkers, workerScript) {
    this.workers = [];
    this.freeWorkers = [];
    this.taskQueue = [];
    
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerScript);
      this.workers.push(worker);
      this.freeWorkers.push(worker);
      
      worker.on('message', (result) => {
        this.onWorkerMessage(worker, result);
      });
    }
  }
  
  runTask(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };
      
      if (this.freeWorkers.length > 0) {
        const worker = this.freeWorkers.pop();
        this.executeTask(worker, task);
      } else {
        this.taskQueue.push(task);
      }
    });
  }
  
  executeTask(worker, task) {
    worker.currentTask = task;
    worker.postMessage(task.data);
  }
  
  onWorkerMessage(worker, result) {
    const task = worker.currentTask;
    task.resolve(result);
    
    if (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift();
      this.executeTask(worker, nextTask);
    } else {
      this.freeWorkers.push(worker);
    }
  }
  
  close() {
    this.workers.forEach(worker => worker.terminate());
  }
}
```

---

## 6. Best Practices

### 1. CPU-Bound vs I/O-Bound

```javascript
// ❌ Don't use workers for I/O
new Worker('database-query.js'); // Wrong!

// ✅ Use workers for CPU tasks
new Worker('image-processing.js'); // Correct!
```

### 2. Cluster with Graceful Shutdown

```javascript
if (cluster.isMaster) {
  const workers = [];
  
  for (let i = 0; i < numCPUs; i++) {
    workers.push(cluster.fork());
  }
  
  process.on('SIGTERM', () => {
    workers.forEach(worker => {
      worker.send('shutdown');
      worker.disconnect();
      
      setTimeout(() => {
        worker.kill();
      }, 10000); // Force kill after 10s
    });
  });
} else {
  const server = http.createServer(handler);
  
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      server.close(() => {
        process.exit(0);
      });
    }
  });
}
```

### 3. Worker Pool Pattern

```javascript
// Create once, reuse many times
const pool = new WorkerPool(4, './worker.js');

// Use for multiple tasks
const results = await Promise.all([
  pool.runTask({ data: 1 }),
  pool.runTask({ data: 2 }),
  pool.runTask({ data: 3 })
]);
```

### 4. Error Handling

```javascript
const worker = new Worker('./worker.js');

worker.on('error', (err) => {
  console.error('Worker error:', err);
  // Handle error, maybe restart worker
});

worker.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Worker stopped with code ${code}`);
    // Restart if needed
  }
});
```

### 5. Monitor Performance

```javascript
const cluster = require('cluster');

if (cluster.isMaster) {
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.id} is online`);
  });
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} died (${signal || code})`);
    if (!worker.exitedAfterDisconnect) {
      // Unexpected exit, restart
      cluster.fork();
    }
  });
}
```

---

## Quick Reference

### Cluster Module
```javascript
const cluster = require('cluster');

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.send('message');
  }
} else {
  // Worker process
  process.on('message', (msg) => {
    // Handle message
  });
}
```

### Worker Threads
```javascript
const { Worker } = require('worker_threads');

// Create worker
const worker = new Worker('./worker.js', {
  workerData: { data: 'value' }
});

// Listen for messages
worker.on('message', (result) => {
  console.log(result);
});

// In worker.js
const { parentPort, workerData } = require('worker_threads');
parentPort.postMessage('result');
```

---

## 📝 Key Takeaways

1. **Cluster** = Multiple processes, **Worker Threads** = Multiple threads
2. Use **Cluster** for scaling servers, **Workers** for CPU tasks
3. Cluster provides process isolation and auto-restart
4. Worker Threads are faster and share memory
5. Implement worker pools for reusability
6. Always handle errors and implement graceful shutdown
7. Monitor worker health and restart if needed
