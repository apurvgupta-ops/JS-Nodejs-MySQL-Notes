# 20 Essential Node.js Interview Questions

## 1. What is Node.js and how does it work?

**Answer:** Node.js is a JavaScript runtime built on Chrome's V8 engine that allows JavaScript to run on the server-side. It uses an **event-driven, non-blocking I/O model** making it lightweight and efficient.

**Key Features:**
- Single-threaded with event loop
- Non-blocking I/O operations
- Built on V8 (compiles JS to machine code)
- Uses libuv for async operations
- Cross-platform

---

## 2. Explain the Event Loop

**Answer:** The event loop enables Node.js to perform non-blocking operations despite JavaScript being single-threaded.

**6 Phases:**
1. **Timers**: setTimeout/setInterval callbacks
2. **Pending callbacks**: I/O callbacks
3. **Idle, prepare**: Internal use
4. **Poll**: Retrieve I/O events
5. **Check**: setImmediate callbacks
6. **Close callbacks**: socket.on('close')

Between phases: Process microtasks (nextTick, Promises)

---

## 3. process.nextTick() vs setImmediate()

**Answer:**
- `process.nextTick()`: Executes **before** moving to next phase (highest priority)
- `setImmediate()`: Executes in **Check phase**

Inside I/O callbacks, setImmediate always runs first.

---

## 4. What are Streams in Node.js?

**Answer:** Collections of data that might not be available all at once. Process data in chunks.

**Types:**
1. **Readable**: Read data (fs.createReadStream)
2. **Writable**: Write data (fs.createWriteStream)
3. **Duplex**: Both (net.Socket)
4. **Transform**: Modify data (zlib.createGzip)

**Benefits:** Memory efficient, time efficient, composable

---

## 5. Explain Backpressure

**Answer:** When data is written faster than it can be consumed. Handle by:
- Check `write()` return value
- `pause()` on false
- `resume()` on 'drain' event
- Or use `pipe()`/`pipeline()` (automatic)

---

## 6. Cluster Module Purpose

**Answer:** Creates multiple processes (workers) that share the same server port, enabling:
- Multi-core utilization
- Load balancing
- High availability (auto-restart)
- Process isolation

---

## 7. Worker Threads vs Cluster

| Aspect   | Cluster       | Worker Threads |
| -------- | ------------- | -------------- |
| Creates  | Processes     | Threads        |
| Memory   | Isolated      | Shared         |
| Use Case | Scale servers | CPU tasks      |
| Overhead | Higher        | Lower          |

---

## 8. What is Middleware in Express?

**Answer:** Functions that execute during request-response cycle. Have access to `req`, `res`, and `next()`.

```javascript
app.use((req, res, next) => {
  console.log('Middleware');
  next(); // Pass to next middleware
});
```

**Types:** Application-level, Router-level, Error-handling, Built-in, Third-party

---

## 9. How to Handle Errors in Node.js?

**Answer:**

**Synchronous:**
```javascript
try {
  // code
} catch (err) {
  // handle
}
```

**Asynchronous:**
```javascript
// Promises
promise.catch(err => handleError(err));

// Async/await
try {
  await asyncFunction();
} catch (err) {
  handleError(err);
}

// Express error middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

## 10. Explain JWT Authentication

**Answer:** JSON Web Tokens provide **stateless** authentication.

**Structure:** `header.payload.signature`
- **Header**: Algorithm & type
- **Payload**: User data (claims)
- **Signature**: Verification

**Flow:**
1. User logs in
2. Server creates JWT
3. Client stores token
4. Client sends token in requests
5. Server verifies token

---

## 11. What is CORS?

**Answer:** Cross-Origin Resource Sharing allows servers to specify who can access resources.

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://example.com',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## 12. Database Connection Pooling

**Answer:** Reuses database connections instead of creating new ones.

**Benefits:**
- Improved performance
- Reduced overhead
- Limited connections
- Automatic reconnection

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'mydb',
  connectionLimit: 10
});
```

---

## 13. package-lock.json Purpose

**Answer:** Locks exact dependency versions for reproducible builds across environments. Includes sub-dependencies.

---

## 14. npm vs npx

**Answer:**
- **npm**: Package manager (install, manage dependencies)
- **npx**: Execute packages without installing globally

```bash
npm install -g create-react-app  # Install globally
npx create-react-app my-app      # Execute without install
```

---

## 15. Environment Variables

**Answer:** Configuration values stored outside code.

```javascript
// .env file
DB_HOST=localhost
DB_PORT=3306

// Access
require('dotenv').config();
console.log(process.env.DB_HOST);
```

**Benefits:** Security, flexibility, different configs per environment

---

## 16. How to Secure Node.js API?

**Answer:**

1. **Helmet**: Security headers
2. **Rate Limiting**: Prevent DDoS
3. **Input Validation**: Sanitize input
4. **JWT**: Secure auth
5. **HTTPS**: Encrypt data
6. **CORS**: Control origins
7. **Parameterized Queries**: Prevent SQL injection
8. **Update Dependencies**: Patch vulnerabilities

---

## 17. let vs const vs var

| Feature   | var      | let   | const |
| --------- | -------- | ----- | ----- |
| Scope     | Function | Block | Block |
| Hoisting  | Yes      | No    | No    |
| Reassign  | Yes      | Yes   | No    |
| Redeclare | Yes      | No    | No    |

---

## 18. Promises vs Async/Await

**Promises:**
```javascript
fetchData()
  .then(data => processData(data))
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

**Async/Await (cleaner):**
```javascript
try {
  const data = await fetchData();
  const result = await processData(data);
  console.log(result);
} catch (err) {
  console.error(err);
}
```

---

## 19. Child Processes in Node.js

**Answer:** Create child processes for CPU-intensive tasks.

**Methods:**
- `spawn()`: Stream data, long-running
- `exec()`: Buffer output, shell commands
- `execFile()`: Execute file directly
- `fork()`: Create Node.js processes

```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-la']);

ls.stdout.on('data', data => {
  console.log(`Output: ${data}`);
});
```

---

## 20. module.exports vs exports

**Answer:**

```javascript
// module.exports (replace entire export)
module.exports = {
  func1,
  func2
};

// exports (add properties)
exports.func1 = func1;
exports.func2 = func2;

// ❌ Don't do this (breaks reference)
exports = { func1, func2 };
```

`exports` is a reference to `module.exports`. Reassigning `exports` breaks the reference.

---

## Bonus Quick Answers

**21. What is npm?** Node Package Manager for installing and managing dependencies.

**22. What is Express.js?** Minimal web framework for Node.js.

**23. What is REST API?** Architectural style using HTTP methods (GET, POST, PUT, DELETE).

**24. What is MongoDB?** NoSQL document database.

**25. What is Mongoose?** ODM (Object Data Modeling) library for MongoDB.
