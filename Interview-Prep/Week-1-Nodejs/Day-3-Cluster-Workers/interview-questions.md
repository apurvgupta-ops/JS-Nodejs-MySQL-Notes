# Day 3: Interview Questions - Cluster & Worker Threads

## Question 1: Explain how the Cluster module works in Node.js

**Answer:**

The **Cluster module** allows Node.js to create multiple **child processes** (workers) that share the same server port, enabling utilization of multi-core systems.

**Architecture:**
```
Master Process (Parent)
    ├── Worker 1 (Child Process)
    ├── Worker 2 (Child Process)
    ├── Worker 3 (Child Process)
    └── Worker 4 (Child Process)
```

**How it works:**
1. Master process forks multiple worker processes
2. Workers share the same TCP connection/port
3. Master distributes incoming connections to workers
4. Workers handle requests independently
5. If a worker crashes, master can restart it

**Example:**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.id} died, restarting...`);
    cluster.fork();
  });
} else {
  // Workers share TCP connection
  http.createServer((req, res) => {
    res.end(`Handled by worker ${cluster.worker.id}`);
  }).listen(8000);
}
```

**Key Features:**
- **Load Balancing**: Automatic (round-robin or OS-based)
- **Process Isolation**: Workers don't share memory
- **High Availability**: Auto-restart failed workers
- **IPC**: Inter-process communication between master and workers

**Use Cases:**
- Scaling HTTP servers across multiple cores
- High availability applications
- Zero-downtime deployments (rolling restarts)

---

## Question 2: What are Worker Threads and when should you use them?

**Answer:**

**Worker Threads** allow running JavaScript in parallel on **multiple threads** within the same process.

**Key Characteristics:**
- Share memory (can use SharedArrayBuffer)
- Faster communication than processes
- Lower overhead than cluster
- Good for CPU-intensive tasks

**Example:**
```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Main thread
  const worker = new Worker(__filename, {
    workerData: { value: 10 }
  });
  
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
} else {
  // Worker thread
  const result = workerData.value * 2;
  parentPort.postMessage(result);
}
```

**When to Use:**

✅ **Use Worker Threads for:**
- CPU-intensive calculations
- Image/video processing
- Data compression/encryption
- Large data parsing
- Heavy computations

❌ **Don't Use Worker Threads for:**
- I/O operations (already async)
- Database queries
- API requests
- Simple synchronous tasks

**Performance Comparison:**
```javascript
// CPU-bound task: Calculate Fibonacci(40)

// Single thread: ~1500ms
const result = fibonacci(40);

// With Worker Threads (4 workers): ~400ms
// 4x faster on 4-core CPU!
```

---

## Question 3: What's the difference between Cluster and Worker Threads?

**Answer:**

| Aspect            | Cluster                | Worker Threads           |
| ----------------- | ---------------------- | ------------------------ |
| **Creates**       | Multiple **processes** | Multiple **threads**     |
| **Memory**        | Isolated (no sharing)  | Shared (can share)       |
| **Overhead**      | Higher                 | Lower                    |
| **Startup Time**  | Slower (~30ms)         | Faster (~1ms)            |
| **Communication** | IPC (slower)           | Message passing (faster) |
| **Port Sharing**  | Yes (same port)        | No                       |
| **Use Case**      | Scale servers          | CPU tasks                |
| **Crash Impact**  | Isolated               | Can affect process       |

**Visual Comparison:**

**Cluster:**
```
Process 1 (8000)     Process 2 (8000)     Process 3 (8000)
Memory: 50MB         Memory: 50MB         Memory: 50MB
├── Request 1        ├── Request 2        ├── Request 3
└── Request 4        └── Request 5        └── Request 6
```

**Worker Threads:**
```
Main Process (Memory: 50MB + Shared)
├── Thread 1 → Heavy Task 1
├── Thread 2 → Heavy Task 2
├── Thread 3 → Heavy Task 3
└── Thread 4 → Heavy Task 4
```

**When to Use:**

**Use Cluster when:**
- Scaling HTTP/WebSocket servers
- Need complete process isolation
- Want automatic load balancing
- Need high availability (auto-restart)

**Use Worker Threads when:**
- CPU-intensive computation
- Image/video processing
- Don't need separate processes
- Want faster startup and communication

**Can Use Both Together:**
```javascript
// Cluster for scaling + Worker Threads for CPU tasks
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const server = http.createServer((req, res) => {
    // Offload heavy work to worker thread
    const worker = new Worker('./heavy-task.js');
    worker.on('message', (result) => {
      res.end(result);
    });
  });
  server.listen(8000);
}
```

---

## Question 4: How would you implement load balancing with Worker Threads?

**Answer:**

Implement a **Worker Pool** pattern to distribute tasks across multiple worker threads.

**Worker Pool Implementation:**

```javascript
const { Worker } = require('worker_threads');

class WorkerPool {
  constructor(numWorkers, workerScript) {
    this.numWorkers = numWorkers;
    this.workerScript = workerScript;
    this.workers = [];
    this.freeWorkers = [];
    this.taskQueue = [];
    
    // Create worker pool
    for (let i = 0; i < numWorkers; i++) {
      this.addNewWorker();
    }
  }
  
  addNewWorker() {
    const worker = new Worker(this.workerScript);
    
    worker.on('message', (result) => {
      // Worker completed task
      worker.currentTask.resolve(result);
      
      // Process next task or mark as free
      if (this.taskQueue.length > 0) {
        const task = this.taskQueue.shift();
        this.runWorker(worker, task);
      } else {
        this.freeWorkers.push(worker);
      }
    });
    
    worker.on('error', (err) => {
      if (worker.currentTask) {
        worker.currentTask.reject(err);
      }
      // Replace failed worker
      this.workers = this.workers.filter(w => w !== worker);
      this.addNewWorker();
    });
    
    this.workers.push(worker);
    this.freeWorkers.push(worker);
  }
  
  runTask(taskData) {
    return new Promise((resolve, reject) => {
      const task = { data: taskData, resolve, reject };
      
      if (this.freeWorkers.length > 0) {
        // Worker available
        const worker = this.freeWorkers.pop();
        this.runWorker(worker, task);
      } else {
        // Queue task
        this.taskQueue.push(task);
      }
    });
  }
  
  runWorker(worker, task) {
    worker.currentTask = task;
    worker.postMessage(task.data);
  }
  
  close() {
    this.workers.forEach(worker => worker.terminate());
  }
}

// Usage
const pool = new WorkerPool(4, './worker.js');

async function processTasks() {
  const tasks = [1, 2, 3, 4, 5, 6, 7, 8];
  
  const results = await Promise.all(
    tasks.map(task => pool.runTask(task))
  );
  
  console.log('Results:', results);
  pool.close();
}
```

**Load Balancing Strategies:**

1. **Round Robin** (Default in above)
   - Distribute tasks evenly
   - Simple and fair

2. **Least Busy**
   - Track active tasks per worker
   - Assign to worker with fewest tasks

3. **Priority Queue**
   - High-priority tasks first
   - Important for varying task importance

4. **Task Stealing**
   - Workers can steal from busy workers
   - Better load distribution

---

## Question 5: How do you handle errors and crashes in clustered applications?

**Answer:**

**Error Handling Strategies:**

### 1. Worker Auto-Restart
```javascript
if (cluster.isMaster) {
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} died`);
    
    if (!worker.exitedAfterDisconnect) {
      // Unexpected crash - restart
      console.log('Restarting worker...');
      cluster.fork();
    }
  });
}
```

### 2. Graceful Shutdown
```javascript
if (cluster.isMaster) {
  process.on('SIGTERM', () => {
    Object.values(cluster.workers).forEach(worker => {
      worker.send('shutdown');
      
      // Force kill after timeout
      setTimeout(() => {
        worker.kill('SIGKILL');
      }, 10000);
    });
  });
} else {
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      server.close(() => {
        // Close DB connections, cleanup
        process.exit(0);
      });
      
      // Stop accepting new requests
      server.close();
      
      // Set timeout for existing requests
      setTimeout(() => {
        process.exit(1);
      }, 9000);
    }
  });
}
```

### 3. Health Checks
```javascript
if (cluster.isMaster) {
  const healthChecks = new Map();
  
  Object.values(cluster.workers).forEach(worker => {
    // Send ping every 30s
    setInterval(() => {
      worker.send('ping');
      
      // Expect pong within 5s
      const timeout = setTimeout(() => {
        console.log(`Worker ${worker.id} not responding`);
        worker.kill();
      }, 5000);
      
      healthChecks.set(worker.id, timeout);
    }, 30000);
  });
  
  // Handle pong
  cluster.on('message', (worker, msg) => {
    if (msg === 'pong') {
      clearTimeout(healthChecks.get(worker.id));
    }
  });
}
```

### 4. Circuit Breaker Pattern
```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }
  
  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      setTimeout(() => {
        this.state = 'HALF_OPEN';
        this.failures = 0;
      }, this.timeout);
    }
  }
}
```

### 5. Monitoring & Logging
```javascript
if (cluster.isMaster) {
  const stats = {
    requests: 0,
    errors: 0,
    workers: {}
  };
  
  cluster.on('message', (worker, msg) => {
    if (msg.type === 'stats') {
      stats.workers[worker.id] = msg.data;
      stats.requests += msg.data.requests;
      stats.errors += msg.data.errors;
    }
  });
  
  // Report stats every minute
  setInterval(() => {
    console.log('Cluster Stats:', JSON.stringify(stats, null, 2));
  }, 60000);
}
```

**Best Practices:**
1. Always restart crashed workers
2. Implement graceful shutdown
3. Use health checks for early detection
4. Log all errors with context
5. Monitor worker performance
6. Set timeouts for operations
7. Implement circuit breakers for external services
8. Use PM2 or similar for production
