# Day 1: Node.js Event Loop - Deep Dive

## 📚 Table of Contents
1. Event Loop Overview
2. Event Loop Phases
3. Microtasks vs Macrotasks
4. Sync vs Async
5. Common Pitfalls
6. Best Practices

---

## 1. Event Loop Overview

The **Event Loop** is the mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It offloads operations to the system kernel whenever possible.

### Key Concepts:
- **Single-threaded**: JavaScript runs on a single thread
- **Non-blocking I/O**: Operations don't wait for completion
- **Event-driven**: Callbacks are executed when events occur

### How It Works:
```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

---

## 2. Event Loop Phases

### Phase 1: **Timers**
Executes callbacks scheduled by `setTimeout()` and `setInterval()`.

**Important**: The timer specifies the minimum threshold after which the callback may be executed, not the exact time.

### Phase 2: **Pending Callbacks**
Executes I/O callbacks deferred to the next loop iteration (e.g., TCP errors).

### Phase 3: **Idle, Prepare**
Used internally by Node.js.

### Phase 4: **Poll**
The most important phase:
- Retrieves new I/O events
- Executes I/O-related callbacks (almost all except close callbacks, timers, and setImmediate)
- Node will block here when appropriate

**Poll Phase Behavior:**
1. If the poll queue is not empty: Execute callbacks synchronously until queue is empty or system limit is reached
2. If the poll queue is empty:
   - If `setImmediate()` has been scheduled: End poll phase and move to check phase
   - If no `setImmediate()`: Wait for callbacks to be added, then execute them immediately

### Phase 5: **Check**
Executes `setImmediate()` callbacks.

### Phase 6: **Close Callbacks**
Executes close event callbacks (e.g., `socket.on('close', ...)`).

---

## 3. Microtasks vs Macrotasks

### Microtasks (Process.nextTick & Promises)
- **Higher Priority**: Execute before moving to the next phase
- **Process.nextTick**: Highest priority, executes before promises
- **Promise callbacks**: Execute after process.nextTick but before next phase

**Microtask Queue Order:**
1. `process.nextTick()` queue
2. Promise microtask queue

### Macrotasks
Correspond to event loop phases:
- `setTimeout`
- `setInterval`
- `setImmediate`
- I/O operations

### Execution Order:
```
process.nextTick() > Promises > setTimeout > setImmediate > I/O
```

### Example:
```javascript
console.log('1: Start');

setTimeout(() => console.log('2: setTimeout'), 0);

Promise.resolve().then(() => console.log('3: Promise'));

process.nextTick(() => console.log('4: nextTick'));

setImmediate(() => console.log('5: setImmediate'));

console.log('6: End');

// Output:
// 1: Start
// 6: End
// 4: nextTick
// 3: Promise
// 2: setTimeout
// 5: setImmediate
```

---

## 4. Sync vs Async

### Synchronous Code
- Blocks the event loop
- Executes line by line
- Simple but can cause performance issues

```javascript
// ❌ BAD: Blocks event loop
const fs = require('fs');
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);
// Everything waits until file is read
```

### Asynchronous Code
- Non-blocking
- Uses callbacks, promises, or async/await
- Better performance for I/O operations

```javascript
// ✅ GOOD: Non-blocking
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
console.log('This runs immediately');
```

### When to Use Each:

**Use Synchronous:**
- Initialization code (app startup)
- Configuration loading at startup
- Simple scripts

**Use Asynchronous:**
- I/O operations (file, network, database)
- API requests
- Long-running operations
- Production servers

---

## 5. Common Pitfalls

### 1. **process.nextTick() Recursion**
```javascript
// ❌ Starves the event loop
function recurse() {
  process.nextTick(recurse);
}
recurse(); // Will never reach other phases
```

### 2. **Mixing setTimeout and setImmediate**
Order is non-deterministic when called from main module:
```javascript
// Order is unpredictable
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

// Inside I/O cycle, setImmediate always executes first
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // Always: immediate → timeout
});
```

### 3. **Blocking the Event Loop**
```javascript
// ❌ Blocks for 5 seconds
const start = Date.now();
while (Date.now() - start < 5000) {}
// Server can't handle any requests during this time
```

---

## 6. Best Practices

### 1. **Use Async/Await for Cleaner Code**
```javascript
// Instead of callbacks
async function readFiles() {
  try {
    const data1 = await fs.promises.readFile('file1.txt', 'utf8');
    const data2 = await fs.promises.readFile('file2.txt', 'utf8');
    return { data1, data2 };
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 2. **Prefer setImmediate over setTimeout(fn, 0)**
```javascript
// ✅ More predictable inside I/O callbacks
setImmediate(() => {
  // Executes in check phase
});
```

### 3. **Be Careful with process.nextTick()**
```javascript
// ✅ Good: One-time defer
process.nextTick(() => {
  console.log('Deferred to next tick');
});

// ❌ Bad: Recursive nextTick
function bad() {
  process.nextTick(bad); // Starves event loop
}
```

### 4. **Use Worker Threads for CPU-Intensive Tasks**
```javascript
const { Worker } = require('worker_threads');

// Offload heavy computation
const worker = new Worker('./heavy-task.js');
worker.on('message', (result) => {
  console.log('Result:', result);
});
```

### 5. **Monitor Event Loop Lag**
```javascript
const start = process.hrtime.bigint();
setInterval(() => {
  const delta = process.hrtime.bigint() - start;
  if (delta > 100_000_000n) { // 100ms
    console.warn('Event loop lag detected:', delta);
  }
}, 1000);
```

---

## 7. Quick Reference

### Execution Priority (Highest to Lowest)
1. Synchronous code
2. `process.nextTick()`
3. Promise microtasks
4. `setTimeout()` / `setInterval()`
5. `setImmediate()`
6. I/O callbacks
7. Close callbacks

### Phase Transitions
```
Main Script → nextTick → Promises → Timer Phase → 
nextTick → Promises → Pending Callbacks → 
nextTick → Promises → Poll Phase → 
nextTick → Promises → Check Phase → 
nextTick → Promises → Close Callbacks → 
Back to Timers...
```

---

## 📝 Key Takeaways

1. Event loop has 6 phases, each with a specific purpose
2. Microtasks (nextTick, Promises) execute between phases
3. `process.nextTick()` has highest priority
4. Use async for I/O, sync only for initialization
5. Never block the event loop with heavy computation
6. `setImmediate` > `setTimeout` inside I/O callbacks
7. Understand execution order for debugging and optimization

---

## 🔗 Further Reading
- [Official Node.js Event Loop Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [libuv Design Overview](http://docs.libuv.org/en/v1.x/design.html)
