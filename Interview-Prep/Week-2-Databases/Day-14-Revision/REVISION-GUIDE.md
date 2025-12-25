# Day 14: Database Revision & Mock Interview

## 📚 20 Essential Database Interview Questions

### SQL Questions

#### Q1: Explain the difference between INNER JOIN and LEFT JOIN

**Answer:**
- **INNER JOIN**: Returns only rows with matching values in both tables
- **LEFT JOIN**: Returns all rows from left table + matching rows from right (NULL if no match)

```sql
-- INNER: 5 rows (only employees WITH departments)
SELECT e.name, d.name 
FROM employees e 
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT: 6 rows (ALL employees, NULL for no department)
SELECT e.name, d.name 
FROM employees e 
LEFT JOIN departments d ON e.dept_id = d.id;
```

---

#### Q2: What is a database index and how does it improve performance?

**Answer:**
Index is a data structure (B-Tree) that speeds up data retrieval.

**How it helps:**
- Search: O(n) → O(log n)
- Uses sorted structure for fast lookups
- Like book index - jump to page instead of reading entire book

**Trade-offs:**
- ✅ Faster reads
- ❌ Slower writes (must update index)
- ❌ More storage

---

#### Q3: Explain ACID properties

**Answer:**
- **A**tomicity: All or nothing (transaction succeeds completely or fails completely)
- **C**onsistency: Data remains valid (constraints enforced)
- **I**solation: Concurrent transactions don't interfere
- **D**urability: Committed changes permanent (survives crashes)

**Example:**
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- Both updates or neither (Atomicity)
```

---

#### Q4: What causes deadlocks and how do you prevent them?

**Answer:**
**Cause:** Circular dependency - Transaction A waits for B, B waits for A.

**Prevention:**
1. Access resources in same order
2. Keep transactions short
3. Use appropriate isolation level
4. Add indexes (reduces lock time)
5. Retry with exponential backoff

```javascript
// Consistent order prevents deadlock
const ids = [accountA, accountB].sort();
for (const id of ids) {
    await db.query('SELECT * FROM accounts WHERE id = ? FOR UPDATE', [id]);
}
```

---

#### Q5: Explain different SQL isolation levels

**Answer:**

| Level            | Dirty Read | Non-Repeatable | Phantom |
| ---------------- | ---------- | -------------- | ------- |
| READ UNCOMMITTED | ❌          | ❌              | ❌       |
| READ COMMITTED   | ✅          | ❌              | ❌       |
| REPEATABLE READ  | ✅          | ✅              | ✅*      |
| SERIALIZABLE     | ✅          | ✅              | ✅       |

*MySQL InnoDB prevents phantoms with next-key locks

**Default:** REPEATABLE READ

---

#### Q6: What is a covering index?

**Answer:**
Index that contains all columns needed by query - no table access required.

```sql
-- Query needs: name, salary
CREATE INDEX idx_dept_name_salary ON employees(dept_id, name, salary);

SELECT name, salary FROM employees WHERE dept_id = 5;
-- EXPLAIN shows: "Using index" (covering index!)
```

**Benefits:** 2-10x faster (no table I/O)

---

#### Q7: How do you optimize a slow query?

**Answer:**
1. **Run EXPLAIN** - Check type, rows, key
2. **Add indexes** - On WHERE/JOIN/ORDER BY columns
3. **Rewrite query:**
   - Avoid SELECT *
   - Filter early (WHERE before JOIN)
   - Use EXISTS instead of IN
   - Avoid functions on indexed columns
4. **Use covering index**
5. **Add LIMIT** when appropriate

---

#### Q8: Explain database normalization (1NF, 2NF, 3NF)

**Answer:**

**1NF:** Atomic values (no arrays/lists)
```sql
-- ❌ Not 1NF
CREATE TABLE users (
    id INT,
    phones VARCHAR(255)  -- "123-456, 789-012"
);

-- ✅ 1NF
CREATE TABLE phones (
    user_id INT,
    phone VARCHAR(20)
);
```

**2NF:** 1NF + No partial dependencies (all non-key fields depend on entire primary key)

**3NF:** 2NF + No transitive dependencies (non-key fields don't depend on other non-key fields)

---

### MongoDB Questions

#### Q9: When should you embed vs reference in MongoDB?

**Answer:**

**Embed when:**
- ✅ 1-to-1 or 1-to-few relationships
- ✅ Data accessed together
- ✅ Data doesn't change often
- ✅ Read performance critical

**Reference when:**
- ✅ 1-to-many with large "many"
- ✅ Data accessed independently
- ✅ Data changes frequently
- ✅ Document would exceed 16MB

```javascript
// Embed: User with address (1-to-1)
{
    _id: ObjectId("..."),
    name: "John",
    address: { street: "123 Main", city: "NYC" }
}

// Reference: User with orders (1-to-many)
{ _id: ObjectId("user1"), name: "John" }
{ _id: ObjectId("order1"), userId: ObjectId("user1"), total: 99.99 }
```

---

#### Q10: Explain MongoDB aggregation pipeline

**Answer:**
Processes documents through multiple stages.

```javascript
db.orders.aggregate([
    { $match: { status: "completed" } },     // Filter
    { $group: {                               // Group & aggregate
        _id: "$userId",
        totalSpent: { $sum: "$total" }
    }},
    { $sort: { totalSpent: -1 } },           // Sort
    { $limit: 10 }                            // Top 10
])
```

**Common stages:** $match, $group, $project, $sort, $limit, $lookup, $unwind

---

#### Q11: How do you perform joins in MongoDB?

**Answer:**
Use `$lookup` stage.

```javascript
db.orders.aggregate([
    { $lookup: {
        from: "users",              // Collection to join
        localField: "userId",       // Field in orders
        foreignField: "_id",        // Field in users
        as: "userDetails"           // Output array
    }},
    { $unwind: "$userDetails" }     // Convert array to object
])
```

---

#### Q12: What are MongoDB schema design patterns?

**Answer:**

1. **Subset Pattern:** Store subset in parent, full data elsewhere
2. **Computed Pattern:** Pre-compute expensive calculations
3. **Bucket Pattern:** Group time-series data
4. **Extended Reference:** Embed frequently-accessed fields from referenced doc

```javascript
// Extended Reference Pattern
{
    _id: ObjectId("order1"),
    user: {  // Embed key user fields
        _id: ObjectId("user1"),
        name: "John",
        email: "john@ex.com"
    },
    items: [...]
}
// No join needed for common queries!
```

---

### Redis Questions

#### Q13: What is Redis and when would you use it?

**Answer:**
In-memory data store (key-value database).

**Use cases:**
- ✅ Caching (API responses, DB queries)
- ✅ Session storage
- ✅ Rate limiting
- ✅ Real-time analytics (leaderboards, counters)
- ✅ Pub/sub messaging
- ✅ Job queues

**Benefits:** Sub-millisecond latency, supports complex data structures

---

#### Q14: Explain Redis data structures

**Answer:**

| Structure      | Use Case               | Example                          |
| -------------- | ---------------------- | -------------------------------- |
| **String**     | Simple cache, counters | `SET user:1:name "John"`         |
| **Hash**       | Objects                | `HSET user:1 name "John" age 30` |
| **List**       | Queue, notifications   | `LPUSH queue "task1"`            |
| **Set**        | Unique items, tags     | `SADD tags:post1 "redis"`        |
| **Sorted Set** | Leaderboard, ranking   | `ZADD leaderboard 100 "player1"` |

---

#### Q15: How do you implement caching with Redis?

**Answer:**
**Cache-Aside Pattern:**

```javascript
async function getUser(id) {
    const key = `user:${id}`;
    
    // 1. Check cache
    let user = await redis.get(key);
    if (user) return JSON.parse(user);
    
    // 2. Cache miss - get from DB
    user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    
    // 3. Store in cache
    await redis.setex(key, 3600, JSON.stringify(user));
    
    return user;
}
```

**Cache invalidation:**
```javascript
async function updateUser(id, data) {
    await db.query('UPDATE users SET ? WHERE id = ?', [data, id]);
    await redis.del(`user:${id}`);  // Invalidate
}
```

---

#### Q16: Implement a rate limiter with Redis

**Answer:**
**Fixed Window:**

```javascript
async function rateLimit(userId, limit = 10, window = 60) {
    const key = `ratelimit:${userId}`;
    
    const count = await redis.incr(key);
    
    if (count === 1) {
        await redis.expire(key, window);
    }
    
    if (count > limit) {
        throw new Error('Rate limit exceeded');
    }
    
    return { allowed: true, remaining: limit - count };
}
```

---

### Performance & Optimization

#### Q17: How do you identify slow queries?

**Answer:**

**MySQL:**
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;

-- Use EXPLAIN
EXPLAIN SELECT * FROM orders WHERE status = 'pending';
```

**MongoDB:**
```javascript
// Enable profiler
db.setProfilingLevel(1, { slowms: 100 });

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10);

// Explain query
db.orders.find({ status: "pending" }).explain("executionStats");
```

---

#### Q18: What is database sharding?

**Answer:**
**Sharding:** Horizontal partitioning - split data across multiple servers.

**Example:**
```
Shard 1: users with id 1-1000000
Shard 2: users with id 1000001-2000000
Shard 3: users with id 2000001-3000000
```

**Sharding strategies:**
1. **Range-based:** user_id ranges
2. **Hash-based:** hash(user_id) % num_shards
3. **Geographic:** by country/region

**Benefits:** Scale beyond single server
**Drawbacks:** Complex queries, no joins across shards

---

#### Q19: Explain database replication

**Answer:**
**Replication:** Copy data to multiple servers.

**Master-Slave:**
```
Master (writes) → Slave 1 (reads)
                → Slave 2 (reads)
                → Slave 3 (reads)
```

**Benefits:**
- ✅ Load balancing (distribute reads)
- ✅ High availability (failover to slave)
- ✅ Disaster recovery (backup)

**MySQL:**
```sql
-- On master
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- On slave
CHANGE MASTER TO MASTER_HOST='master_ip', ...;
START SLAVE;
```

---

#### Q20: What are database connection pools?

**Answer:**
**Connection Pool:** Reusable database connections.

**Without pool:**
```javascript
// ❌ Bad: Create new connection each request
const conn = await mysql.createConnection({...});
await conn.query('SELECT ...');
await conn.end();  // Close (expensive!)
```

**With pool:**
```javascript
// ✅ Good: Reuse connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    connectionLimit: 10  // Max 10 concurrent
});

const conn = await pool.getConnection();
await conn.query('SELECT ...');
conn.release();  // Return to pool (not closed!)
```

**Benefits:**
- ✅ Faster (no connection overhead)
- ✅ Resource efficient
- ✅ Prevents connection exhaustion

**Config:**
- connectionLimit: Max connections (10-20 for small apps)
- queueLimit: Max queued requests

---

## 🎨 Database Diagram Tasks

### Task 1: Social Media Platform

Design database schema for:
- Users (profile, authentication)
- Posts (text, images, video)
- Comments (nested)
- Likes
- Followers/Following
- Notifications

**Requirements:**
- Support 1M+ users
- Real-time feeds
- Efficient follower queries

---

### Task 2: E-commerce Marketplace

Design database schema for:
- Users (buyers, sellers)
- Products (categories, inventory)
- Orders (checkout, payment)
- Reviews & Ratings
- Shopping Cart
- Order History

**Requirements:**
- Track inventory
- Handle concurrent orders
- Product recommendations

---

### Task 3: Banking System

Design database schema for:
- Accounts (checking, savings)
- Transactions (transfer, deposit, withdrawal)
- Users (authentication, KYC)
- Transaction History
- Account Balance (real-time)

**Requirements:**
- ACID transactions
- Audit trail
- Fraud detection

---

## 🎤 Mock Interview Format

### Part 1: Concepts (30 minutes)

Interviewer asks 5-10 questions from the 20 above.

**Practice:**
1. Explain clearly and concisely
2. Give examples
3. Discuss trade-offs
4. Ask clarifying questions

---

### Part 2: Query Writing (45 minutes)

**SQL Task:**
Given tables, write queries for:
1. Multi-table join
2. Aggregation (GROUP BY)
3. Subquery
4. Complex filtering
5. Optimization (add indexes)

**MongoDB Task:**
Write aggregation pipeline for analytics.

---

### Part 3: Schema Design (45 minutes)

Design database schema for given system.

**Deliverables:**
1. ER diagram or MongoDB collections
2. Explain relationships
3. Justify embed vs reference decisions
4. Identify indexes needed
5. Discuss scaling strategy

---

## ✅ Final Checklist

- [ ] Answered all 20 questions confidently
- [ ] Completed 3 database diagrams
- [ ] Can write complex SQL queries
- [ ] Can write MongoDB aggregations
- [ ] Understand caching strategies
- [ ] Know when to use each database type
- [ ] Can optimize slow queries
- [ ] Understand transactions & ACID
- [ ] Can design scalable schemas

**You're ready for database interviews!** 🚀
