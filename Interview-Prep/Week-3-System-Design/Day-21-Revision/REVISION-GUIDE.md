# Day 21: Revision & Mock Interview

## 📚 Table of Contents
1. 20 Essential System Design Questions
2. Diagram Practice Tasks
3. Mock Interview Guide
4. Quick Reference Cheat Sheet

---

## 1. 20 Essential System Design Questions

### Q1: What is a Load Balancer and name different load balancing algorithms?

**Answer:**

A **load balancer** distributes incoming traffic across multiple servers to improve availability and performance.

**Algorithms:**

1. **Round Robin:** Sequential distribution
   - Use case: Servers with equal capacity
   
2. **Weighted Round Robin:** Distribution based on server capacity
   - Use case: Servers with different specs
   
3. **Least Connections:** Routes to server with fewest active connections
   - Use case: Long-lived connections (WebSocket, streaming)
   
4. **IP Hash:** Same client IP → same server
   - Use case: Session persistence
   
5. **Least Response Time:** Routes to fastest server
   - Use case: Performance-critical applications

**Layer 4 vs Layer 7:**
- **Layer 4 (Transport):** Routes based on IP/Port (faster, simpler)
- **Layer 7 (Application):** Routes based on HTTP content (URL, headers)

---

### Q2: Explain the difference between Reverse Proxy and Forward Proxy.

**Answer:**

**Forward Proxy (Client-side):**
```
Client → [Forward Proxy] → Internet → Server
```
- Hides **client** identity
- Use cases: VPN, corporate proxy, bypassing restrictions
- Example: Squid proxy

**Reverse Proxy (Server-side):**
```
Client → Internet → [Reverse Proxy] → Backend Servers
```
- Hides **server** identity
- Use cases: Load balancing, SSL termination, caching, security
- Example: Nginx, HAProxy, AWS ALB

**Key differences:**

| Aspect       | Forward Proxy | Reverse Proxy |
| ------------ | ------------- | ------------- |
| **Serves**   | Clients       | Servers       |
| **Hides**    | Client IP     | Server IP     |
| **Location** | Client-side   | Server-side   |

---

### Q3: What is CDN and how does it work?

**Answer:**

**CDN (Content Delivery Network)** caches content at edge locations near users.

**Architecture:**
```
User in USA → USA Edge Server ──┐
User in EU → EU Edge Server ────┼─→ Origin Server
User in Asia → Asia Edge Server ─┘
```

**How it works:**
1. User requests file (e.g., image.jpg)
2. DNS resolves to **nearest edge server**
3. Edge server checks cache:
   - **Hit:** Return cached content (fast!)
   - **Miss:** Fetch from origin, cache, return
4. Subsequent requests served from cache

**Benefits:**
- ✅ Reduced latency (geographic proximity)
- ✅ Reduced origin load
- ✅ High availability
- ✅ DDoS protection

**Cache headers:**
```http
Cache-Control: public, max-age=86400
CDN-Cache-Status: HIT
```

---

### Q4: What are different cache invalidation strategies?

**Answer:**

**1. Time-To-Live (TTL):**
```javascript
redis.setex('key', 3600, 'value'); // Expires in 1 hour
```
- Pros: Simple, automatic
- Cons: Stale data until expiry

**2. Cache-Aside (Lazy Loading):**
```javascript
// Read
const cached = await cache.get(key);
if (cached) return cached;

const data = await db.query(...);
await cache.set(key, data);
return data;
```
- Pros: Only caches needed data
- Cons: First request slow

**3. Write-Through:**
```javascript
// Write to cache + DB simultaneously
await cache.set(key, value);
await db.update(key, value);
```
- Pros: Cache always consistent
- Cons: Slower writes

**4. Write-Behind (Write-Back):**
```javascript
// Write to cache immediately, DB later (async)
await cache.set(key, value);
queue.push({ type: 'UPDATE_DB', key, value });
```
- Pros: Fast writes
- Cons: Data loss risk

**5. Event-Based Invalidation:**
```javascript
// Invalidate on events
events.on('user.updated', async (userId) => {
    await cache.del(`user:${userId}`);
});
```
- Pros: Always fresh
- Best for: Microservices

---

### Q5: Explain Vertical vs Horizontal Scaling.

**Answer:**

**Vertical Scaling (Scale Up):**
```
Add more resources to single server
8GB RAM → 32GB RAM
4 CPU → 16 CPU
```

| Pros                       | Cons                      |
| -------------------------- | ------------------------- |
| ✅ Simple (no code changes) | ❌ Hardware limits         |
| ✅ No consistency issues    | ❌ Single point of failure |
| ✅ Lower latency            | ❌ Expensive               |

**Horizontal Scaling (Scale Out):**
```
Add more servers
1 Server → 3 Servers → 10 Servers
```

| Pros                | Cons                          |
| ------------------- | ----------------------------- |
| ✅ Nearly unlimited  | ❌ Complex (load balancing)    |
| ✅ High availability | ❌ Data consistency challenges |
| ✅ Cost-effective    | ❌ Network overhead            |

**When to use:**
- **Vertical:** Initial growth, legacy apps, budget constraints
- **Horizontal:** High traffic, need high availability, cost optimization

---

### Q6: What is Database Replication? Explain Master-Slave pattern.

**Answer:**

**Replication:** Copying data from one DB to others.

**Master-Slave Replication:**
```
                Write ↓
              ┌─────────┐
              │ Master  │ (Read + Write)
              └────┬────┘
                   │ Replication
        ┌──────────┼──────────┐
        ↓          ↓          ↓
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Slave 1 │ │ Slave 2 │ │ Slave 3 │ (Read-only)
   └─────────┘ └─────────┘ └─────────┘
```

**Benefits:**
- ✅ Read scalability (add more slaves)
- ✅ High availability (failover)
- ✅ Analytics on slave (no master impact)
- ✅ Backups from slave

**Challenges:**
- ❌ **Replication lag** (slaves behind master)
- ❌ Write bottleneck (single master)
- ❌ Eventual consistency

**Handling replication lag:**
```javascript
// Read-after-write from master
await masterDb.insert(...);
const data = await masterDb.query(...); // Not slave

// Critical reads from master
await masterDb.query('SELECT * FROM users WHERE id = ?', [userId]);

// Non-critical reads from slave
await slaveDb.query('SELECT * FROM products');
```

---

### Q7: What is Sharding? Explain different sharding strategies.

**Answer:**

**Sharding:** Split data across multiple databases.

**1. Range-Based Sharding:**
```
Shard 1: user_id 1 - 1M
Shard 2: user_id 1M - 2M
Shard 3: user_id 2M - 3M
```
- Pros: Simple range queries
- Cons: Uneven distribution (hotspots)

**2. Hash-Based Sharding:**
```
shard_id = hash(user_id) % num_shards
```
```javascript
function getShardId(userId) {
    return hashFunction(userId) % 3;
}
```
- Pros: Even distribution
- Cons: Adding shards requires rehashing

**3. Geographic Sharding:**
```
Shard US: Users in USA
Shard EU: Users in Europe
Shard ASIA: Users in Asia
```
- Pros: Low latency, compliance (GDPR)
- Cons: Uneven load

**Shard key selection:**
- ✅ High cardinality
- ✅ Even distribution
- ✅ Frequently queried

**Good:** user_id, email  
**Bad:** country (low cardinality), gender (very low)

---

### Q8: Explain Consistent Hashing and why it's useful.

**Answer:**

**Problem with simple hash:**
```
hash(key) % 3 (3 servers)

Add 4th server:
hash(key) % 4  // 🚨 Most keys now map to different servers!
```

**Consistent Hashing:**

Places servers and keys on a **ring** (0-360°).

```
Ring:
Server A at 30°
Server B at 120°
Server C at 240°

Key1 → hash → 45° → Next server clockwise (B at 120°)
Key2 → hash → 200° → Next server (C at 240°)
Key3 → hash → 280° → Next server (A at 30°)
```

**Adding Server D at 60°:**
- Only keys between 30°-60° move from B to D
- Other keys unaffected! ✅

**Virtual nodes:**
```javascript
// Add multiple virtual nodes per server for better distribution
for (let i = 0; i < 150; i++) {
    const hash = hash(`${server}:${i}`);
    ring.set(hash, server);
}
```

**Use cases:**
- Distributed caching (Memcached, Redis)
- Load balancing
- CDN

---

### Q9: What is CAP Theorem? Explain with examples.

**Answer:**

**CAP Theorem:** In a distributed system, you can have only **2 out of 3**:

1. **Consistency (C):** All nodes see same data
2. **Availability (A):** Every request gets response
3. **Partition Tolerance (P):** System works despite network failures

```
       Consistency
           /\
          /  \
         /    \
        /  CA  \
       /        \
      /____  ____\
     /  CP  \/  AP \
    /              \
Partition     Availability
Tolerance
```

**CP (Consistency + Partition Tolerance):**
- System unavailable during partition
- Examples: MongoDB, HBase, Redis
- Use case: Banking, inventory

**AP (Availability + Partition Tolerance):**
- System available but data may be stale
- Examples: Cassandra, DynamoDB, CouchDB
- Use case: Social media feeds, recommendations

**CA (Consistency + Availability):**
- Not partition-tolerant (impractical for distributed systems)
- Example: Single-node RDBMS

**Real-world scenario:**

```
Banking (CP):
Node1 and Node2 disconnect
→ System becomes unavailable (no stale balances!)

Social Media (AP):
Node1 and Node2 disconnect
→ System stays available (OK if feed slightly stale)
```

---

### Q10: What are Message Queues? Explain patterns.

**Answer:**

**Message Queue:** Enables asynchronous communication between services.

**Patterns:**

**1. Point-to-Point (Queue):**
```
Producer → [Queue] → Consumer
One message → One consumer
```
Use case: Task processing

**2. Publish-Subscribe (Topic):**
```
              ┌─ Consumer A
Producer → [Topic] ─┼─ Consumer B
              └─ Consumer C
All consumers get copy
```
Use case: Event broadcasting

**3. Work Queue:**
```
              ┌─ Worker 1
Producer → [Queue] ─┼─ Worker 2
              └─ Worker 3
Load distribution
```

**Benefits:**
- ✅ Loose coupling
- ✅ Fault tolerance
- ✅ Load leveling
- ✅ Async processing

**Example:**
```javascript
// Producer
await queue.send({ task: 'send_email', to: 'user@example.com' });

// Consumer
const job = await queue.receive();
await sendEmail(job.to);
await queue.acknowledge(job);
```

---

### Q11: Explain Kafka architecture and key concepts.

**Answer:**

**Kafka:** Distributed event streaming platform.

**Key Concepts:**

**1. Topic:** Category of messages
```
Topic: "orders"
```

**2. Partition:** Parallel processing unit
```
Topic: orders (3 partitions)
├─ Partition 0
├─ Partition 1
└─ Partition 2
```

**3. Producer:** Sends messages
```javascript
await producer.send({
    topic: 'orders',
    messages: [{ key: 'user-123', value: JSON.stringify(order) }]
});
```

**4. Consumer:** Reads messages
```javascript
await consumer.subscribe({ topic: 'orders' });
await consumer.run({
    eachMessage: async ({ message }) => {
        await processOrder(JSON.parse(message.value));
    }
});
```

**5. Consumer Group:** Load balancing
```
Topic (3 partitions)
├─ Partition 0 → Consumer A ─┐
├─ Partition 1 → Consumer B ─┼─ Consumer Group
└─ Partition 2 → Consumer C ─┘
```

**Message Ordering:**
- **Within partition:** Guaranteed order
- **Across partitions:** No guarantee

**Partition key:**
```javascript
// All orders for same user → same partition (ordered)
messages: [{ key: userId, value: orderData }]
```

---

### Q12: What is Event-Driven Architecture?

**Answer:**

**EDA:** Systems communicate through events, not direct calls.

**Traditional vs Event-Driven:**

**Traditional:**
```
Service A → Service B → Service C
(synchronous, tight coupling)
```

**Event-Driven:**
```
Service A → Event: "Order Created"
              ↓
         [Event Bus]
         ↓    ↓    ↓
      Svc B  Svc C  Svc D
    (async, loose coupling)
```

**Event Types:**

**1. Event Notification:**
```javascript
events.publish('order.created', { orderId: '123' });

events.on('order.created', async (event) => {
    await sendEmail(event.orderId);
});
```

**2. Event-Carried State Transfer:**
```javascript
// Event contains all data (no query needed)
events.publish('order.created', {
    orderId: '123',
    items: [...],
    total: 99.99
});
```

**3. Event Sourcing:**
```javascript
// Store all state changes as events
const events = [
    { type: 'OrderCreated', orderId: '123' },
    { type: 'PaymentReceived', orderId: '123', amount: 99.99 },
    { type: 'OrderShipped', orderId: '123' }
];

// Rebuild state by replaying events
function getOrderState(orderId) {
    return events.filter(e => e.orderId === orderId)
        .reduce((state, event) => applyEvent(state, event), {});
}
```

**Benefits:**
- ✅ Loose coupling
- ✅ Scalability
- ✅ Flexibility (add consumers easily)

---

### Q13: How would you design a URL Shortener?

**Answer:**

**Requirements:**
- Shorten long URLs
- Redirect to original URL
- Handle billions of URLs
- Low latency (< 100ms)

**Short code generation:**

**Option 1: Base62 encoding**
```javascript
const BASE62 = '0-9a-zA-Z';

function encodeBase62(id) {
    let result = '';
    while (id > 0) {
        result = BASE62[id % 62] + result;
        id = Math.floor(id / 62);
    }
    return result;
}

// Auto-increment ID → Base62
encodeBase62(12345); // "3D7"
```

**Capacity:** 62^7 = 3.5 trillion URLs

**Database schema:**
```sql
CREATE TABLE urls (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP,
    clicks BIGINT DEFAULT 0,
    
    INDEX idx_short_code (short_code)
);
```

**API:**
```javascript
// Shorten
POST /api/shorten
{ "longUrl": "https://example.com/..." }
→ { "shortUrl": "https://short.url/abc123" }

// Redirect
GET /abc123
→ 302 Redirect to long URL
```

**Architecture:**
```
Client → Load Balancer → App Servers
                          ↓
                       [Redis Cache]
                          ↓
                      [MySQL DB]
```

**Caching:**
```javascript
// Check cache first
const longUrl = await redis.get(`url:${shortCode}`);
if (longUrl) return redirect(longUrl);

// Cache miss - query DB
const url = await db.query('SELECT long_url FROM urls WHERE short_code = ?', [shortCode]);
await redis.setex(`url:${shortCode}`, 3600, url.long_url);
```

**Scaling:**
- Read replicas (read-heavy workload)
- Sharding (billions of URLs)
- CDN (static assets)

---

### Q14: Design a Real-Time Messaging System (WhatsApp).

**Answer:**

**Requirements:**
- Send/receive messages in real-time
- One-to-one and group chat
- Delivery and read receipts
- Offline support

**Architecture:**
```
Client → [WebSocket Server] → [Kafka] → [Cassandra]
                ↓
            [Redis] (online status)
```

**WebSocket for real-time:**
```javascript
ws.on('message', async (data) => {
    const { to, content } = JSON.parse(data);
    
    // Save to DB
    await cassandra.execute('INSERT INTO messages ...');
    
    // Deliver if recipient online
    if (connections.has(to)) {
        connections.get(to).send({ from: senderId, content });
    } else {
        // Send push notification
        await sendPushNotification(to, content);
    }
});
```

**Database (Cassandra):**
```sql
CREATE TABLE messages (
    chat_id UUID,
    message_id TIMEUUID,
    sender_id UUID,
    content TEXT,
    created_at TIMESTAMP,
    status TEXT, -- sent, delivered, read
    PRIMARY KEY (chat_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
```

**Online status (Redis):**
```javascript
// User connects
await redis.sadd('online_users', userId);

// User disconnects
await redis.srem('online_users', userId);
await redis.set(`user:${userId}:last_seen`, Date.now());
```

**Receipts:**
```javascript
// Delivery receipt
ws.send({ type: 'message_delivered', messageId });

// Read receipt
ws.send({ type: 'message_read', messageId });
```

**Scalability:**
- Multiple WebSocket servers
- Kafka for async processing
- Cassandra for message storage (time-series)

---

### Q15: Design a File Upload System for large files.

**Answer:**

**Requirements:**
- Upload large files (up to 10GB)
- Resumable uploads
- Progress tracking

**Chunked Upload:**

**1. Initiate:**
```
POST /api/upload/initiate
{ "fileName": "video.mp4", "fileSize": 104857600 }

Response:
{ "uploadId": "uuid", "chunkSize": 5242880, "totalChunks": 20 }
```

**2. Upload chunks:**
```
PUT /api/upload/{uploadId}/chunk/{chunkNumber}
[Binary data]
```

**3. Complete:**
```
POST /api/upload/{uploadId}/complete
{ "chunks": [1, 2, ..., 20] }
```

**Implementation (S3 multipart):**
```javascript
// Initiate
const multipart = await s3.createMultipartUpload({
    Bucket: 'my-bucket',
    Key: uploadId
}).promise();

// Upload chunk
const part = await s3.uploadPart({
    Bucket: 'my-bucket',
    Key: uploadId,
    PartNumber: chunkNumber,
    UploadId: multipart.UploadId,
    Body: chunkData
}).promise();

// Store ETag in Redis
await redis.hset(`upload:${uploadId}:parts`, chunkNumber, part.ETag);

// Complete
await s3.completeMultipartUpload({
    Bucket: 'my-bucket',
    Key: uploadId,
    UploadId: multipart.UploadId,
    MultipartUpload: { Parts: [...] }
}).promise();
```

**Resume upload:**
```javascript
GET /api/upload/{uploadId}/progress

Response:
{ "uploadedChunks": [1, 2, 3], "totalChunks": 20, "percentage": 15 }
```

**Deduplication:**
```javascript
// Client sends file hash
const hash = await sha256(file);

// Check if file exists
const existing = await db.query('SELECT id FROM files WHERE hash = ?', [hash]);
if (existing) {
    return { fileId: existing.id, deduplicated: true };
}
```

**Architecture:**
```
Client → Upload API → [Redis] (metadata)
                   → [S3] (storage)
                   → [CDN] (delivery)
```

---

### Q16: What is Rate Limiting and how to implement it?

**Answer:**

**Rate Limiting:** Restrict number of requests per time window.

**Algorithms:**

**1. Fixed Window:**
```javascript
// Redis
const key = `rate:${userId}:${currentMinute}`;
const count = await redis.incr(key);
await redis.expire(key, 60);

if (count > 100) {
    return '429 Too Many Requests';
}
```
- Simple but has "boundary issue"

**2. Sliding Window:**
```javascript
// Redis Sorted Set
const now = Date.now();
const windowStart = now - 60000;

// Remove old entries
await redis.zremrangebyscore(`rate:${userId}`, 0, windowStart);

// Count requests in window
const count = await redis.zcard(`rate:${userId}`);

if (count >= 100) {
    return '429 Too Many Requests';
}

// Add current request
await redis.zadd(`rate:${userId}`, now, `${now}-${uuid()}`);
```
- More accurate

**3. Token Bucket:**
```javascript
const maxTokens = 100;
const refillRate = 10; // tokens per second

let tokens = await redis.get(`tokens:${userId}`) || maxTokens;
let lastRefill = await redis.get(`lastRefill:${userId}`) || Date.now();

// Refill tokens
const elapsed = (Date.now() - lastRefill) / 1000;
tokens = Math.min(maxTokens, tokens + elapsed * refillRate);

if (tokens < 1) {
    return '429 Too Many Requests';
}

tokens -= 1;
await redis.set(`tokens:${userId}`, tokens);
await redis.set(`lastRefill:${userId}`, Date.now());
```
- Handles bursts

**Express middleware:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});

app.use('/api/', limiter);
```

---

### Q17: Explain Database Indexing and when to use it.

**Answer:**

**Index:** Data structure to speed up queries.

**B-Tree Index (most common):**
```
Root Node
├─ Internal Nodes
└─ Leaf Nodes (actual data pointers)
```

**Without index:**
```sql
SELECT * FROM users WHERE email = 'john@example.com';
-- Full table scan: O(n)
```

**With index:**
```sql
CREATE INDEX idx_email ON users(email);

SELECT * FROM users WHERE email = 'john@example.com';
-- Index lookup: O(log n)
```

**Index types:**

**1. Single-column:**
```sql
CREATE INDEX idx_email ON users(email);
```

**2. Composite (multi-column):**
```sql
CREATE INDEX idx_country_city ON users(country, city);

-- Uses index
SELECT * FROM users WHERE country = 'US' AND city = 'NY';

-- Doesn't use index (missing first column)
SELECT * FROM users WHERE city = 'NY';
```

**3. Covering index:**
```sql
CREATE INDEX idx_covering ON users(email, name);

-- All columns in index (no table lookup!)
SELECT name FROM users WHERE email = 'john@example.com';
```

**When NOT to index:**
- Small tables
- Frequently updated columns
- Low cardinality (e.g., gender with 2 values)

**Trade-offs:**
- ✅ Faster reads
- ❌ Slower writes (index maintenance)
- ❌ Storage overhead

---

### Q18: What is Database Connection Pooling?

**Answer:**

**Connection Pool:** Reuse database connections instead of creating new ones.

**Without pooling:**
```javascript
// Every request creates new connection
const conn = await mysql.createConnection({ ... });
await conn.query('SELECT ...');
await conn.end(); // Close

// Expensive! (TCP handshake, authentication, etc.)
```

**With pooling:**
```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'mydb',
    connectionLimit: 10 // Max 10 connections
});

// Reuse connection from pool
const conn = await pool.getConnection();
await conn.query('SELECT ...');
conn.release(); // Return to pool (not close!)
```

**Benefits:**
- ✅ Faster (no connection overhead)
- ✅ Resource control (limit max connections)
- ✅ Better performance

**Configuration:**

```javascript
const pool = mysql.createPool({
    connectionLimit: 10,    // Max connections
    queueLimit: 0,          // Unlimited queue
    acquireTimeout: 10000,  // Wait 10s for connection
    waitForConnections: true
});
```

**Best practices:**
- Always release connections
- Handle errors
- Monitor pool usage

```javascript
// Check pool stats
console.log(pool.pool._freeConnections.length); // Available
console.log(pool.pool._allConnections.length);  // Total
```

---

### Q19: Explain the Saga Pattern for distributed transactions.

**Answer:**

**Saga:** Manage distributed transactions using sequence of local transactions.

**Problem:**
```
Order Service → Inventory Service → Payment Service
All must succeed or all rollback
```

**Solution: Saga (choreography):**

```javascript
// Order Service
async function createOrder(orderData) {
    // 1. Create order
    await db.insert('orders', orderData);
    
    // 2. Publish event
    await events.publish('order.created', { orderId, items });
}

// Inventory Service
events.on('order.created', async (event) => {
    try {
        await reserveInventory(event.items);
        await events.publish('inventory.reserved', { orderId: event.orderId });
    } catch (error) {
        await events.publish('inventory.failed', { orderId: event.orderId });
    }
});

// Payment Service
events.on('inventory.reserved', async (event) => {
    try {
        await processPayment(event.orderId);
        await events.publish('payment.completed', { orderId: event.orderId });
    } catch (error) {
        // Compensate - release inventory
        await events.publish('payment.failed', { orderId: event.orderId });
    }
});

// Order Service (compensate)
events.on('payment.failed', async (event) => {
    await db.update('orders', { id: event.orderId, status: 'cancelled' });
    await events.publish('order.cancelled', { orderId: event.orderId });
});

// Inventory Service (compensate)
events.on('order.cancelled', async (event) => {
    await releaseInventory(event.orderId);
});
```

**Orchestrator-based:**
```javascript
class OrderSaga {
    async execute(orderData) {
        const steps = [
            { service: 'inventory', action: 'reserve', compensate: 'release' },
            { service: 'payment', action: 'charge', compensate: 'refund' },
            { service: 'shipping', action: 'create', compensate: 'cancel' }
        ];
        
        const completed = [];
        
        try {
            for (const step of steps) {
                await this.executeStep(step);
                completed.push(step);
            }
        } catch (error) {
            // Rollback in reverse order
            for (const step of completed.reverse()) {
                await this.compensate(step);
            }
        }
    }
}
```

---

### Q20: What metrics would you monitor in a production system?

**Answer:**

**1. Application Metrics:**

**Response time:**
```javascript
const start = Date.now();
await handleRequest(req);
const duration = Date.now() - start;

metrics.histogram('api.response_time', duration);
```

**Throughput:**
```javascript
metrics.increment('api.requests_total');
```

**Error rate:**
```javascript
try {
    await handleRequest(req);
} catch (error) {
    metrics.increment('api.errors_total');
}
```

**2. Infrastructure Metrics:**

**CPU usage:**
```bash
top
htop
```

**Memory usage:**
```javascript
const used = process.memoryUsage();
console.log(`Heap: ${used.heapUsed / 1024 / 1024} MB`);
```

**Disk I/O:**
```bash
iostat
```

**3. Database Metrics:**

**Query time:**
```javascript
const start = Date.now();
await db.query('SELECT ...');
const duration = Date.now() - start;

if (duration > 1000) {
    console.warn('Slow query:', duration);
}
```

**Connection pool:**
```javascript
const poolStats = {
    active: pool._allConnections.length - pool._freeConnections.length,
    idle: pool._freeConnections.length,
    total: pool._allConnections.length
};
```

**Deadlocks:**
```sql
SHOW ENGINE INNODB STATUS;
```

**4. Business Metrics:**

**Conversion rate:**
```javascript
const signups = await db.count('users', { date: today });
const purchases = await db.count('orders', { date: today });
const conversionRate = (purchases / signups) * 100;
```

**5. Alerting:**

```javascript
if (errorRate > 5%) {
    alert('High error rate!');
}

if (responseTime > 1000) {
    alert('Slow responses!');
}

if (cpuUsage > 80%) {
    alert('High CPU usage!');
}
```

**Tools:**
- **Application:** Prometheus, Grafana, DataDog
- **Logs:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing:** Jaeger, Zipkin
- **APM:** New Relic, AppDynamics

---

## 2. Diagram Practice Tasks

### Task 1: E-commerce System

Draw architecture for:
- Product catalog
- Shopping cart
- Order processing
- Payment
- Inventory management

**Include:**
- Load balancer
- App servers
- Databases (SQL, Redis)
- Message queue
- CDN

### Task 2: Social Media Feed

Draw architecture for:
- User posts
- Follow/followers
- Timeline generation
- Notifications
- Media uploads

**Include:**
- WebSocket servers
- Cassandra (posts)
- Redis (cache)
- S3 (media)
- CDN

### Task 3: Video Streaming Platform

Draw architecture for:
- Video upload
- Transcoding
- Streaming
- Recommendations
- Analytics

**Include:**
- Chunked upload
- S3
- Lambda (transcoding)
- CloudFront CDN
- Database

---

## 3. Mock Interview Guide

### Interview Structure (2 hours)

**1. Requirements Gathering (15 min)**
- Ask clarifying questions
- Define functional requirements
- Define non-functional requirements
- Estimate scale

**2. High-Level Design (30 min)**
- Draw system architecture
- Identify major components
- Explain data flow
- Discuss trade-offs

**3. Detailed Design (45 min)**
- API design
- Database schema
- Deep dive into 2-3 components
- Scaling strategy

**4. Discussion (30 min)**
- Bottlenecks
- Failure scenarios
- Monitoring & alerting
- Security

### Sample Questions to Ask

**For any system:**
- "How many users?"
- "Read/write ratio?"
- "Latency requirements?"
- "Consistency or availability?"
- "Data retention?"

### Evaluation Criteria

- ✅ Requirements clarification
- ✅ High-level thinking
- ✅ Trade-offs discussion
- ✅ Scalability considerations
- ✅ Communication

---

## 4. Quick Reference Cheat Sheet

### Load Balancing
- **Algorithms:** Round Robin, Least Connections, IP Hash
- **Types:** Layer 4 (TCP/UDP), Layer 7 (HTTP)

### Caching
- **Strategies:** Cache-Aside, Write-Through, Write-Behind
- **Invalidation:** TTL, Event-based

### Scaling
- **Vertical:** Add resources (RAM, CPU)
- **Horizontal:** Add servers

### Databases
- **Replication:** Master-Slave (read scaling)
- **Sharding:** Range, Hash, Geographic
- **Indexing:** B-Tree, Composite, Covering

### Message Queues
- **Patterns:** Point-to-point, Pub-sub, Work queue
- **Kafka:** Topics, Partitions, Consumer groups

### System Design
- **URL Shortener:** Base62, Caching
- **WhatsApp:** WebSocket, Cassandra
- **File Upload:** Chunking, S3 multipart

### CAP Theorem
- **CP:** MongoDB, HBase (consistency)
- **AP:** Cassandra, DynamoDB (availability)

---

## 📝 Final Checklist

Week 3 Mastery:
- [ ] Understand all load balancing algorithms
- [ ] Explain cache invalidation strategies
- [ ] Design scalable systems (vertical/horizontal)
- [ ] Implement database replication and sharding
- [ ] Use message queues (Kafka)
- [ ] Design URL shortener
- [ ] Design real-time messaging system
- [ ] Design file upload system
- [ ] Draw 3+ system architecture diagrams
- [ ] Complete mock interview

**You're ready for system design interviews! 🚀**

