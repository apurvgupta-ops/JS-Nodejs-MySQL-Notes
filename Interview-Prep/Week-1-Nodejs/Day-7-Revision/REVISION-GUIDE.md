# Day 7: Revision & Mock Interview Preparation

## 📚 Topics to Revise

### Day 1: Event Loop
- [ ] 6 phases of event loop
- [ ] Microtasks vs Macrotasks
- [ ] process.nextTick() vs setImmediate()
- [ ] Execution order
- [ ] Blocking vs non-blocking

### Day 2: Streams & Buffers
- [ ] 4 types of streams
- [ ] Backpressure handling
- [ ] pipe() vs pipeline()
- [ ] Buffer operations
- [ ] Transform streams

### Day 3: Cluster & Worker Threads
- [ ] Cluster module usage
- [ ] Worker Threads for CPU tasks
- [ ] Differences between cluster and workers
- [ ] Load balancing strategies
- [ ] Error handling in distributed systems

### Day 4: Clean Architecture
- [ ] Layered architecture (Controller → Service → Repository)
- [ ] Separation of concerns
- [ ] Dependency injection
- [ ] Folder structure best practices

### Day 5: Error Handling & Logging
- [ ] Custom error classes
- [ ] Global error handler
- [ ] Winston logger setup
- [ ] Error handling patterns
- [ ] Request logging

### Day 6: Mini Project
- [ ] Auth implementation (JWT)
- [ ] CRUD operations
- [ ] Pagination
- [ ] Input validation
- [ ] Applied clean architecture

---

## 🎯 20 Essential Node.js Questions

### 1. Explain the Event Loop
**Keywords**: libuv, phases, microtasks, non-blocking I/O

### 2. What are Streams and when to use them?
**Keywords**: memory efficiency, backpressure, types

### 3. Difference between process.nextTick() and setImmediate()
**Keywords**: microtask queue, check phase, execution order

### 4. How does the Cluster module work?
**Keywords**: master-worker, load balancing, shared port

### 5. Worker Threads vs Cluster Module
**Keywords**: threads vs processes, CPU-bound vs I/O-bound

### 6. What is middleware in Express?
**Keywords**: request-response cycle, next(), order matters

### 7. How do you handle errors in async code?
**Keywords**: try-catch, async wrapper, error middleware

### 8. Explain JWT authentication
**Keywords**: stateless, token structure, security

### 9. What is CORS and how to enable it?
**Keywords**: cross-origin, preflight, headers

### 10. Database connection pooling
**Keywords**: reuse connections, performance, configuration

### 11. What is the purpose of package-lock.json?
**Keywords**: dependency versions, reproducible builds

### 12. Explain npm vs npx
**Keywords**: package manager, execute packages

### 13. What are environment variables?
**Keywords**: .env, process.env, configuration

### 14. How to secure a Node.js API?
**Keywords**: helmet, rate limiting, input validation, JWT

### 15. What is the difference between let, const, and var?
**Keywords**: scope, hoisting, reassignment

### 16. Explain Promises and async/await
**Keywords**: asynchronous, error handling, chaining

### 17. What is callback hell and how to avoid it?
**Keywords**: nested callbacks, promises, async/await

### 18. How does Node.js handle child processes?
**Keywords**: child_process, spawn, exec, fork

### 19. What is the purpose of the Buffer class?
**Keywords**: binary data, memory, encoding

### 20. Explain module.exports vs exports
**Keywords**: CommonJS, module system, reference

---

## 🎤 Mock Interview Format

### Part 1: Concepts (20 minutes)
Answer these rapid-fire questions:
1. Event loop phases? (2 min)
2. Stream types? (2 min)
3. Cluster vs Worker Threads? (3 min)
4. Clean architecture layers? (3 min)
5. Error handling best practices? (3 min)

### Part 2: Coding (30 minutes)
Solve these problems:

**Problem 1: Event Loop Order** (10 min)
```javascript
// Predict the output
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
process.nextTick(() => console.log('4'));
console.log('5');
```

**Problem 2: Implement Custom Transform Stream** (20 min)
Create a transform stream that converts CSV to JSON.

### Part 3: System Design (10 minutes)
Design a scalable file upload service using:
- Streams for large files
- Cluster for scaling
- Proper error handling
- Clean architecture

---

## 📝 Study Tips

1. **Run all example code** - Don't just read
2. **Explain concepts out loud** - Test your understanding
3. **Draw diagrams** - Especially for event loop and architecture
4. **Practice coding problems** - Implement examples from scratch
5. **Review your mini project** - Be ready to explain decisions
6. **Time yourself** - Practice under interview conditions
7. **Focus on "why"** - Not just "how"

---

## 🔍 Common Follow-up Questions

Be prepared for deeper dives:
- "How would you debug this?"
- "What if requirements change?"
- "How does this scale?"
- "What are the trade-offs?"
- "How would you test this?"

---

## ✅ Final Checklist

- [ ] Can explain event loop with diagram
- [ ] Comfortable with all 4 stream types
- [ ] Know when to use cluster vs worker threads
- [ ] Can implement clean architecture
- [ ] Understand error handling patterns
- [ ] Completed mini project
- [ ] Practiced 20 interview questions
- [ ] Can write code without looking at notes
- [ ] Confident in system design questions
- [ ] Ready for live coding challenge

**Good luck! You've got this! 🚀**
