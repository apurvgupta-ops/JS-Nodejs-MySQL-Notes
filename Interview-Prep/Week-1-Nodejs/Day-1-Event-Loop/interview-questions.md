# Day 1: Interview Questions

## Question 1: Explain the Node.js Event Loop and its phases

**Answer:**

The Node.js Event Loop is a mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It continuously checks for and executes callbacks from various queues.

**The 6 Phases:**

1. **Timers Phase**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next iteration
3. **Idle, Prepare**: Used internally by Node.js
4. **Poll Phase**: Retrieves new I/O events and executes I/O callbacks
5. **Check Phase**: Executes `setImmediate()` callbacks
6. **Close Callbacks**: Executes close event callbacks (e.g., `socket.on('close')`)

**Between each phase**, the event loop processes two microtask queues:
- `process.nextTick()` queue (highest priority)
- Promise microtask queue

**Example:**
```javascript
console.log('1'); // Sync

setTimeout(() => console.log('2'), 0); // Timer phase

Promise.resolve().then(() => console.log('3')); // Microtask

process.nextTick(() => console.log('4')); // nextTick queue

console.log('5'); // Sync

// Output: 1, 5, 4, 3, 2
```

---

## Question 2: What's the difference between process.nextTick() and setImmediate()?

**Answer:**

**process.nextTick():**
- Highest priority
- Executes **before** moving to the next event loop phase
- Processes the entire nextTick queue before continuing
- Can starve the event loop if used recursively

**setImmediate():**
- Executes in the **Check Phase** of the event loop
- Designed for executing callbacks after the current Poll phase
- More predictable for I/O operations
- Won't starve the event loop

**Example:**
```javascript
// From main module - order is non-deterministic
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

// Inside I/O callback - setImmediate always first
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // Always outputs: immediate, timeout
});
```

**When to use:**
- Use `setImmediate()` for recursive operations to prevent blocking
- Use `process.nextTick()` sparingly, only when you need highest priority
- Prefer `setImmediate()` over `setTimeout(fn, 0)` in I/O callbacks

---

## Question 3: What are microtasks and macrotasks? Explain their execution order.

**Answer:**

**Microtasks** (higher priority):
- `process.nextTick()` callbacks
- Promise callbacks (`.then()`, `.catch()`, `.finally()`)
- `queueMicrotask()`

**Macrotasks** (lower priority):
- `setTimeout()`
- `setInterval()`
- `setImmediate()`
- I/O operations
- UI rendering

**Execution Order:**
1. Execute all synchronous code
2. Execute entire `process.nextTick()` queue
3. Execute entire Promise microtask queue
4. Execute one macrotask (from current event loop phase)
5. Repeat steps 2-4

**Example:**
```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => console.log('Promise inside timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => console.log('Timeout inside promise'), 0);
  })
  .then(() => console.log('Promise 2'));

process.nextTick(() => console.log('NextTick'));

console.log('End');

// Output:
// Start
// End
// NextTick
// Promise 1
// Promise 2
// Timeout 1
// Promise inside timeout
// Timeout inside promise
```

**Key Points:**
- All microtasks execute before moving to next macrotask
- This can cause event loop starvation if microtasks keep adding more microtasks
- `process.nextTick()` has highest priority among microtasks

---

## Question 4: How would you prevent blocking the event loop in Node.js?

**Answer:**

**Strategies to prevent blocking:**

**1. Use Async Operations:**
```javascript
// ❌ Bad - Blocks event loop
const data = fs.readFileSync('large-file.txt');

// ✅ Good - Non-blocking
fs.readFile('large-file.txt', (err, data) => {
  // Process data
});

// ✅ Better - With async/await
const data = await fs.promises.readFile('large-file.txt');
```

**2. Offload CPU-Intensive Tasks to Worker Threads:**
```javascript
const { Worker } = require('worker_threads');

// Heavy computation in separate thread
function performHeavyTask(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./heavy-task.js', {
      workerData: data
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}
```

**3. Break Long-Running Operations:**
```javascript
// ❌ Bad - Processes all at once
function processLargeArray(array) {
  array.forEach(item => heavyOperation(item));
}

// ✅ Good - Batch processing with setImmediate
async function processInBatches(array, batchSize = 100) {
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    batch.forEach(item => heavyOperation(item));
    
    // Allow event loop to process other events
    await new Promise(resolve => setImmediate(resolve));
  }
}
```

**4. Use Streams for Large Data:**
```javascript
// Instead of loading entire file
const readable = fs.createReadStream('large-file.txt');
readable.on('data', (chunk) => {
  // Process chunk
});
```

**5. Monitor Event Loop Lag:**
```javascript
const start = process.hrtime.bigint();

setInterval(() => {
  const elapsed = process.hrtime.bigint() - start;
  if (elapsed > 100_000_000n) { // 100ms
    console.warn('Event loop lag detected!');
  }
}, 1000);
```

---

## Question 5: Explain the difference between sync and async operations with a real-world scenario.

**Answer:**

**Synchronous (Blocking):**
- Executes line by line
- Each operation waits for previous to complete
- Blocks the event loop
- Simple but poor performance for I/O

**Asynchronous (Non-blocking):**
- Operations don't wait for each other
- Uses callbacks, promises, or async/await
- Event loop continues processing
- Better performance for I/O operations

**Real-World Scenario: Restaurant Order System**

**Synchronous Approach (❌ Bad for servers):**
```javascript
// Like a restaurant where chef makes one order completely before starting next

function processOrderSync(orderId) {
  console.log(`Taking order ${orderId}`);
  
  // Blocks while cooking (3 seconds)
  const start = Date.now();
  while (Date.now() - start < 3000) {}
  console.log(`Order ${orderId} ready!`);
  
  return `Order ${orderId} completed`;
}

// Process 3 orders
console.time('Sync orders');
processOrderSync(1);
processOrderSync(2);
processOrderSync(3);
console.timeEnd('Sync orders');
// Takes ~9 seconds (3 + 3 + 3)
// Server can't handle any other requests during this time!
```

**Asynchronous Approach (✅ Good for servers):**
```javascript
// Like a restaurant where chef starts all orders and serves as they're ready

function processOrderAsync(orderId) {
  return new Promise((resolve) => {
    console.log(`Taking order ${orderId}`);
    
    // Non-blocking cooking time
    setTimeout(() => {
      console.log(`Order ${orderId} ready!`);
      resolve(`Order ${orderId} completed`);
    }, 3000);
  });
}

// Process 3 orders in parallel
console.time('Async orders');
Promise.all([
  processOrderAsync(1),
  processOrderAsync(2),
  processOrderAsync(3)
]).then(() => {
  console.timeEnd('Async orders');
});
// Takes ~3 seconds (all parallel)
// Server can handle other requests simultaneously!
```

**When to Use Each:**

| Use Case                  | Synchronous | Asynchronous     |
| ------------------------- | ----------- | ---------------- |
| App initialization        | ✅           | ❌                |
| Reading config at startup | ✅           | ❌                |
| API requests              | ❌           | ✅                |
| Database queries          | ❌           | ✅                |
| File operations           | ❌           | ✅                |
| CPU-intensive tasks       | ❌           | ✅ (with Workers) |

**Key Takeaway:**
- Sync: Use only at startup or in scripts
- Async: Use for all I/O operations in production servers
- The event loop must stay responsive to handle concurrent requests

---

## Bonus Tips for Interviews

1. **Always explain with diagrams**: Draw the event loop phases
2. **Use concrete examples**: Don't just define, demonstrate with code
3. **Mention trade-offs**: Every solution has pros and cons
4. **Show awareness of performance**: Discuss blocking vs non-blocking
5. **Reference real-world use cases**: Connect to actual applications

**Common Follow-up Questions:**
- How do you debug event loop issues?
- What tools do you use to monitor event loop performance?
- How does libuv work under the hood?
- Explain the difference between Node.js and browser event loops
- How would you optimize a slow API endpoint?
