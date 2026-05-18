# 🏗️ Practical HLD — High Level Design
### The "WHY, WHEN, PROS/CONS" Guide — Not Just Buzzwords

---

## The Big Question: What Even Is HLD?

LLD = How do you write the code inside one service?
HLD = How do you connect MANY services so the whole system works at scale?

> HLD answers: "What happens when your app goes from 100 users to 100 million?"

The honest truth is — most concepts in HLD exist because of ONE root problem:

**A single server can only handle so much. Everything in HLD is about what you do when one server isn't enough.**

---

## PART 1 — The Building Blocks

---

### 1. Vertical vs Horizontal Scaling

**The First Question Everyone Faces:**
```
Your app is getting slow. Server is struggling. What do you do?
```

---

#### Vertical Scaling (Scale Up)

**What:** Make your one server bigger. More CPU, more RAM, faster disk.

**Real Example:**
```
Your Node.js API runs on a t2.micro (1 CPU, 1GB RAM).
Traffic grows → CPU hits 90%.
You upgrade to t2.xlarge (4 CPU, 16GB RAM).
Problem solved... for now.
```

**Pros:**
- Zero code changes — just click "upgrade" in AWS
- No distributed system complexity
- Works immediately
- Good for databases (easier to keep data on one machine)

**Cons:**
- There's a physical limit — you can't add infinite CPUs to one machine
- Extremely expensive at the top end (a 128-core server costs 10x more than 128 single-core servers)
- Single point of failure — one machine goes down, everything goes down
- Downtime needed to upgrade hardware

**When to Use:**
- Early stage (< 10k users) — vertical is almost always the right call
- Databases — vertical is simpler than sharding
- When horizontal complexity isn't worth it yet

---

#### Horizontal Scaling (Scale Out)

**What:** Add more servers of the same size, distribute traffic between them.

**Real Example:**
```
Instead of one big server:
  [Load Balancer]
       ↓
  [Server 1] [Server 2] [Server 3]

Traffic triples? Add Server 4, 5, 6.
```

**Pros:**
- No theoretical limit — keep adding servers
- High availability — one server dies, others keep serving
- Much cheaper at scale (commodity hardware vs supercomputers)
- Can scale specific components independently (more API servers, same DB)

**Cons:**
- Servers can't share memory — sessions, state must move to external store (Redis)
- You now have a distributed system — network failures, consistency issues
- More infrastructure to manage
- Code must be stateless (same request can go to any server)

**The Key Requirement for Horizontal Scaling:**
```
❌ Stateful server — DON'T do this:
  User logs in → Server 1 stores session in memory
  Next request → Load balancer sends to Server 2
  Server 2: "Who are you? No session found" → User logged out

✅ Stateless server — DO this:
  User logs in → Session stored in Redis
  Next request → Any server fetches session from Redis
  Works on any server → Scale freely
```

**When to Use:**
- When you've maxed out vertical scaling
- When you need high availability (can't afford downtime)
- Web/API servers are almost always horizontally scaled
- Read replicas for databases

---

### 2. Load Balancer

**What:** Sits in front of your servers and distributes incoming requests so no single server gets overwhelmed.

**The Pain Without It:**
```
10 servers running. All traffic hits Server 1.
Server 1 is dying. Servers 2-10 sit idle.
You bought 10x the hardware — using 1/10 of it.
```

**How it Works:**
```
Internet
   ↓
[Load Balancer] ← Single entry point
   ↓      ↓      ↓
[S1]   [S2]   [S3]   ← Distributes traffic
```

---

#### Load Balancing Algorithms — Which One and Why?

**Round Robin:**
```
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1 (cycle repeats)
```
- ✅ Simple, even distribution
- ❌ Doesn't account for server load (S1 might be handling a heavy DB query while S2 is idle)
- Use when: All servers are identical and requests are similar in weight

**Least Connections:**
```
S1: 100 active connections
S2: 5 active connections   ← next request goes here
S3: 50 active connections
```
- ✅ Smarter — sends to least busy server
- ❌ Slightly more complex
- Use when: Requests have varying processing times (some fast, some slow)

**IP Hash (Sticky Sessions):**
```
User IP: 192.168.1.1 → always goes to Server 2
User IP: 10.0.0.5   → always goes to Server 1
```
- ✅ Same user always hits same server (useful if you MUST have local state)
- ❌ Uneven distribution if some IPs are busier
- Use when: You have legacy stateful code you can't refactor immediately

**Weighted Round Robin:**
```
Server 1 (8 CPU): weight 4 → gets 4x more traffic
Server 2 (2 CPU): weight 1 → gets 1x traffic
```
- ✅ Accounts for different server capacities
- Use when: Servers have different hardware specs

---

#### Layer 4 vs Layer 7 Load Balancing

**Layer 4 (Transport Layer):**
- Routes based on IP address and TCP port
- Doesn't look at the content of the request
- Very fast — no content inspection overhead
- Example: AWS Network Load Balancer

**Layer 7 (Application Layer):**
- Routes based on HTTP headers, URL path, cookies, content
- Can do smart routing:
  ```
  /api/images/* → Image Servers
  /api/videos/* → Video Servers
  /api/users/*  → User Servers
  ```
- Can do A/B testing, canary deployments
- Slightly slower (reads request content)
- Example: AWS Application Load Balancer, Nginx

**Pros of Load Balancer:**
- Distribute load across servers
- Health checks — automatically removes dead servers
- SSL termination — decrypt HTTPS once at LB, pass plain HTTP to servers
- Single entry point for firewall rules

**Cons:**
- LB itself can become a bottleneck (use multiple LBs with DNS round robin)
- Single point of failure if not set up in HA mode
- Adds latency (small, but real)

**When to Use:** Any time you have more than 1 server. Always.

---

### 3. Caching

**The Pain Without It:**
```
User loads their profile page.
Your server queries the DB: "SELECT * FROM users WHERE id=123"
The DB finds the row — takes 50ms.

1000 users load their profile every second.
That's 1000 DB queries/second — same data, fetched again and again.
Your DB gets hammered. Latency spikes. Users complain.
```

**The Idea:** Store the result of an expensive operation so next time you just look it up instead of recomputing.

```
Without cache:  Request → App → DB (50ms) → Response
With cache:     Request → App → Cache hit! (0.1ms) → Response
                                ↓ (only on miss)
                               DB (50ms)
```

---

#### Where to Cache — Cache Layers

```
L1: Browser cache          → User's browser stores assets/API responses
L2: CDN cache              → Cloudflare/Fastly caches at the network edge
L3: Reverse proxy cache    → Nginx/Varnish caches at your server entrance
L4: Application cache      → In-process memory (fastest but limited size)
L5: Distributed cache      → Redis/Memcached (shared across all app servers)
L6: Database query cache   → DB caches frequent query results internally
```

---

#### Caching Strategies — The Real Trade-offs

**Cache-Aside (Lazy Loading):**
```
Read:
  1. Check Redis → Cache hit? Return it. Done.
  2. Cache miss → Query DB
  3. Store result in Redis
  4. Return result

Write:
  1. Write to DB
  2. Delete (invalidate) cache key
  3. Next read will repopulate from DB
```

```js
// Real code
async function getUser(userId) {
  const cacheKey = `user:${userId}`;

  // Step 1: Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached); // cache hit

  // Step 2: Cache miss — go to DB
  const user = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  if (!user) return null;

  // Step 3: Store in cache with TTL
  await redis.setex(cacheKey, 300, JSON.stringify(user)); // expires in 5 minutes

  return user;
}

async function updateUser(userId, data) {
  await db.query("UPDATE users SET ? WHERE id = ?", [data, userId]);
  await redis.del(`user:${userId}`); // invalidate cache
}
```

- ✅ Only caches what's actually requested (no wasted memory)
- ✅ Cache failure doesn't break the app (falls back to DB)
- ❌ First request always slow (cache cold start)
- ❌ Brief inconsistency window between DB write and cache invalidation
- **Use when:** Read-heavy data, acceptable to serve slightly stale data

---

**Write-Through:**
```
Write:
  1. Write to DB
  2. Write to cache (same transaction)

Read:
  1. Always check cache first (cache should always be warm)
```
- ✅ Cache always has fresh data
- ✅ No cache miss on reads (after first write)
- ❌ Every write is slower (two writes: DB + cache)
- ❌ Cache fills with data that may never be read (write-heavy apps waste memory)
- **Use when:** Read-heavy AND you need fresh data, payment info, inventory counts

---

**Write-Behind (Write-Back):**
```
Write:
  1. Write to cache immediately (fast!)
  2. Async worker writes to DB later (in batches)

Read:
  1. Always from cache
```
- ✅ Fastest write performance — user gets response immediately
- ✅ Reduces DB write load dramatically (batch writes)
- ❌ Data loss risk — if cache crashes before async write, data is gone
- ❌ Complex — need reliable async workers
- **Use when:** High-frequency writes where some data loss is acceptable (view counts, analytics, likes count)

---

**Read-Through:**
```
Read:
  Cache miss → Cache itself fetches from DB and populates itself
  (App doesn't manage cache directly)
```
- ✅ App code is simpler — just talk to cache
- ❌ First request is still slow
- ❌ Less control over caching logic
- **Use when:** You want to simplify app code, frameworks like Spring Cache

---

#### Cache Eviction Policies

**LRU (Least Recently Used):**
- When cache is full, evict the item that was accessed longest ago
- Assumption: if you haven't used it recently, you won't need it soon
- Most commonly used — good general purpose

**LFU (Least Frequently Used):**
- Evict the item accessed least number of times
- Better for content where popular things stay popular (viral videos, trending posts)
- More complex to implement

**TTL (Time To Live):**
- Each item expires after a set time regardless of access
- Good for time-sensitive data (stock prices, weather)
- Simple and predictable

---

#### Cache Problems You MUST Know

**Cache Stampede (Thundering Herd):**
```
Problem:
  Cache entry for "top posts" expires at 12:00:00
  1000 users all request "top posts" at 12:00:01
  All 1000 miss the cache → all 1000 hit the DB simultaneously
  DB gets 1000 queries at once → crashes

Solutions:
  1. Mutex/lock: First request acquires lock, fetches from DB, 
     populates cache. Others wait.
  2. Probabilistic early expiry: Before TTL expires, randomly
     refresh (don't wait for full expiry)
  3. Background refresh: Async job refreshes before TTL expires
```

**Cache Penetration:**
```
Problem:
  Attacker sends requests for user_id=99999999 (doesn't exist)
  Cache miss every time → hits DB every time
  DB gets hammered with queries for non-existent data

Solutions:
  1. Cache null values: If DB returns nothing, cache "null" for 60s
  2. Bloom filter: Probabilistic set — "does this key POSSIBLY exist?"
     If Bloom says NO → return 404 immediately without hitting DB
```

**Cache Hotspot:**
```
Problem:
  Celebrity posts something → millions of requests for same cache key
  One Redis node getting 100k req/sec for one key

Solutions:
  1. Local in-memory cache on each app server (L1 cache)
  2. Add jitter to expiry times so not all copies expire simultaneously
  3. Replicate hot keys across multiple Redis nodes
```

**Pros of Caching:**
- Dramatic performance improvement (50ms → 0.1ms)
- Reduces DB load by 90%+
- Handles traffic spikes (cache absorbs load)

**Cons:**
- Cache invalidation is hard (Phil Karlton: "There are only two hard things in CS")
- Stale data risk — cache might serve outdated info
- Memory costs money
- Adds operational complexity

**When to Cache:**
- Data that's read much more than it's written
- Expensive computations (reports, aggregations)
- External API responses (rate limited APIs)
- Session data
- **Don't cache:** Highly dynamic data, financial transactions, anything needing strong consistency

---

### 4. Database Design at Scale

---

#### SQL vs NoSQL — The Real Decision

**This is not a "SQL is old, NoSQL is modern" thing.**
Each solves different problems.

**Use SQL (PostgreSQL, MySQL) when:**
```
✅ Your data has clear relationships (users → orders → items)
✅ You need ACID transactions (money transfer: debit + credit must both succeed)
✅ You need complex queries (JOINs, aggregations, GROUP BY)
✅ Schema is known and stable
✅ Data integrity matters more than raw speed

Real examples:
  - User accounts and authentication
  - Financial transactions, billing
  - Order management
  - Inventory with strict counts
```

**Use NoSQL when:**
```
✅ Massive scale (billions of records)
✅ Schema changes frequently (product catalog with different attributes per category)
✅ Simple access patterns (get by ID, get by user)
✅ Write-heavy workloads
✅ Horizontal scaling is priority

Real examples:
  - Social media posts (Cassandra at Instagram)
  - Product catalog (MongoDB)
  - Session storage (Redis)
  - Event logs, clickstream (Cassandra, Kafka)
  - Search (Elasticsearch)
```

**The Honest Truth:**
Most apps start with SQL and that's fine. Only switch to NoSQL when you have a specific reason (scale, schema flexibility, access patterns). Don't use MongoDB just because it's "modern."

---

#### Indexing — Why Queries Are Slow and How to Fix Them

**The Problem Without Indexes:**
```sql
SELECT * FROM orders WHERE user_id = 123;
-- Without index: scans ALL 50 million rows one by one
-- With index: jumps directly to user 123's rows

50 million rows × 100 bytes = 5GB of data to scan
vs
Index lookup: ~3ms
```

**Types of Indexes:**

**B-Tree Index (most common):**
```sql
CREATE INDEX idx_user_id ON orders(user_id);
-- Good for: equality (=), range (<, >, BETWEEN), ORDER BY, LIKE 'abc%'
-- Bad for: LIKE '%abc' (can't use index for leading wildcards)
```

**Composite Index:**
```sql
CREATE INDEX idx_user_status ON orders(user_id, status);
-- Can answer: WHERE user_id = 123
-- Can answer: WHERE user_id = 123 AND status = 'pending'
-- CANNOT efficiently answer: WHERE status = 'pending' (alone)
-- RULE: Leftmost prefix rule — index works from left to right
```

**Covering Index:**
```sql
CREATE INDEX idx_covering ON orders(user_id, status, total, created_at);
-- Query: SELECT status, total FROM orders WHERE user_id = 123
-- Index contains ALL needed columns → never touches the actual table row
-- Fastest possible query — "index-only scan"
```

**The Index Trade-off:**
```
More indexes:
  ✅ Reads are faster
  ❌ Writes are slower (every INSERT/UPDATE must update all indexes)
  ❌ More disk space
  ❌ More memory for index pages

Rule: Add indexes for read-heavy data. Be careful on write-heavy tables.
```

**Signs You Need an Index:**
- Query takes > 100ms
- `EXPLAIN ANALYZE` shows "Seq Scan" on a large table
- Same column appears in WHERE/JOIN/ORDER BY repeatedly

**Signs You Have Too Many Indexes:**
- INSERT/UPDATE is slow
- You have indexes that haven't been used in months

---

#### Database Replication — Why and How

**The Problem:**
```
Single database server:
  - All reads AND writes go to one machine
  - That machine goes down → everything down
  - Read traffic grows → DB becomes bottleneck
```

**Single-Leader Replication (Master-Replica):**
```
           Writes
Client ──────────→ [Leader/Primary DB]
                          │
                   Replication (async)
                   ↙        ↘
            [Replica 1]  [Replica 2]
                 ↑            ↑
              Reads         Reads
```

- All writes go to Leader
- Reads can go to Replicas (reduces Leader load)
- If Leader dies → promote a Replica to Leader
- ✅ Simple to understand, widely supported
- ❌ Async replication means Replicas might be slightly behind (replication lag)
- ❌ If you read from Replica right after writing to Leader, you might get stale data

**Read Your Own Writes Problem:**
```
User posts a comment → write to Leader
User immediately views their profile → reads from Replica
Replica hasn't caught up yet → user doesn't see their own comment!

Solution: After a write, route that user's reads to Leader for 1 minute
```

**When to Add Replicas:**
- Read:Write ratio > 5:1 (typical for social media, content sites)
- DB CPU > 60% from reads
- Need high availability (failover)

---

#### Database Sharding — When One DB Isn't Enough

**The Problem:**
```
Replicas help with READ scale.
But what about WRITE scale?
All writes still go to ONE leader. 
Leader has 1 disk, 1 CPU. Hard limit.

Twitter: 500M tweets/day = 6000 writes/second
No single MySQL instance handles that.
```

**What is Sharding:**
Split data across multiple databases. Each shard holds a subset.

```
Without sharding:        With sharding (by user_id):
[One DB: all 100M users]  [Shard 1: users 1-33M]
                          [Shard 2: users 33M-66M]
                          [Shard 3: users 66M-100M]

Writes for user 5M → Shard 1 only
Writes for user 50M → Shard 2 only
Each shard gets 1/3 of the write load
```

**Sharding Strategies:**

**Range-Based Sharding:**
```
Shard 1: user_id 1 to 1,000,000
Shard 2: user_id 1,000,001 to 2,000,000
Shard 3: user_id 2,000,001 to 3,000,000
```
- ✅ Simple, range queries stay on one shard
- ❌ Hotspots — new users always on last shard (newest shard gets all writes)
- ❌ Uneven data if early users are more active

**Hash-Based Sharding:**
```
shard = hash(user_id) % number_of_shards
user_id=123: hash(123) % 3 = Shard 1
user_id=456: hash(456) % 3 = Shard 0
```
- ✅ Even distribution, no hotspots
- ❌ Range queries hit ALL shards (expensive)
- ❌ Adding a new shard requires rehashing everything (mitigated by consistent hashing)

**Consistent Hashing:**
```
Imagine a ring (0 to 360 degrees).
Servers placed at points on the ring.
Keys hashed → find next server clockwise.

Add a server: Only keys between new server and previous server move.
Remove server: Only that server's keys move to next server.
vs regular hashing: Adding 1 server remaps 90%+ of all keys!
```
- ✅ Minimal data movement when adding/removing shards
- ✅ Used by: Cassandra, DynamoDB, Redis Cluster, CDNs
- ❌ More complex to implement

**Sharding Problems:**
```
Cross-shard queries:
  "Find all orders over $100 in the last week"
  Must query ALL shards and merge results — expensive

Cross-shard transactions:
  User on Shard 1 sends money to user on Shard 2
  Can't use a simple DB transaction — two different databases!
  Need distributed transactions (very complex) or redesign

Rebalancing:
  Shard 1 is getting too much traffic
  Moving data to a new shard while serving traffic is tricky

Rule: Shard only when you absolutely need to.
Pick shard key so most queries touch only one shard.
```

**Pros of Sharding:**
- Unlimited write scale (add more shards)
- Each shard is smaller — queries faster
- Fault isolation (one shard down ≠ all data down)

**Cons:**
- Complex application logic (which shard to query?)
- Cross-shard operations are hard
- Operational complexity (managing N databases)
- Joins across shards are painful

**When to Shard:**
- When single-leader replication isn't enough for writes
- Usually after 500GB-1TB of data or 10k+ writes/second
- Almost always the last resort — try other options first

---

### 5. CAP Theorem — The Fundamental Trade-off

**What It Says:**
A distributed system can guarantee at most 2 of these 3 properties:

```
C — Consistency:    Every read gets the most recent write
A — Availability:   Every request gets a response (not an error)
P — Partition Tolerance: System works even when network splits into isolated groups
```

**The Key Insight:**
Network partitions WILL happen in any real distributed system (cables get cut, servers lose connectivity). So P is not optional — you must tolerate partitions. That means your real choice is:

**CP (Consistency + Partition Tolerance):**
```
Network partition happens →
System REFUSES to serve requests rather than serve stale data

Example: Bank transfers
  If two DB nodes can't talk to each other:
  Better to return "Service unavailable" than let both sides
  deduct from the same account (resulting in double spend)

Real systems: HBase, Zookeeper, etcd
Use when: Financial data, inventory counts, anything where wrong data = disaster
```

**AP (Availability + Partition Tolerance):**
```
Network partition happens →
System CONTINUES serving requests, possibly returning stale data

Example: Social media feed
  If two DB nodes can't talk to each other:
  Better to show a slightly old feed than show an error page
  User gets a response, even if their feed is 5 seconds behind

Real systems: Cassandra, CouchDB, DynamoDB (default)
Use when: Social feeds, product catalogs, user preferences
```

**Real-World Application:**
```
Shopping cart: AP — better to show a slightly stale cart than error
Payment processing: CP — better to fail than double-charge
DNS: AP — better to return cached (possibly stale) IP than time out
User profile: AP — showing yesterday's bio is fine
Bank balance: CP — must be accurate
Likes count: AP — showing 10,231 vs actual 10,234 is fine
```

---

### 6. Message Queues — The Backbone of Async Systems

**The Pain Without Message Queues:**
```
User places order.
OrderService must:
  1. Charge payment (500ms)
  2. Send email (300ms)
  3. Update inventory (200ms)
  4. Notify warehouse (400ms)
  5. Update analytics (100ms)
  Total: 1500ms for user to see "Order placed!"

Also: If email service is down → order fails entirely
Also: Black Friday spike → 100x traffic → everything overwhelmed at once
```

**With Message Queue:**
```
User places order.
OrderService:
  1. Save order to DB (50ms)
  2. Drop message on queue (5ms)
  3. Return "Order placed!" to user (55ms total)

Queue delivers message to:
  Email Service    → handles when ready
  Inventory Service → handles when ready
  Warehouse System → handles when ready
  Analytics        → handles when ready

Result: User gets response in 55ms instead of 1500ms.
Email service down? Message stays in queue, delivered when service recovers.
Traffic spike? Queue absorbs it — services process at their own pace.
```

---

#### When to Use Each Queue

**Kafka:**
```
What it's built for:
  High-throughput event streaming. Think of it as a persistent log.
  Producers write events, consumers read them in order.
  Events stay in Kafka for days/weeks — consumers can replay.

Real use cases:
  - Activity tracking (every click, page view, event)
  - Audit logs (who changed what, when)
  - Stream processing (real-time analytics)
  - Event sourcing (reconstruct state from event history)
  - Feeding multiple systems from one data stream

Throughput: Millions of messages/second

Pros:
  ✅ Extremely high throughput
  ✅ Messages persisted — consumers can replay from any point
  ✅ Multiple consumers can read same messages independently
  ✅ Ordered within a partition

Cons:
  ❌ Complex to operate
  ❌ Not great for low-latency task queues
  ❌ Overkill for simple "send email" scenarios
```

**RabbitMQ:**
```
What it's built for:
  Traditional message broker. Producer sends, consumer processes, message deleted.
  Rich routing: send different messages to different queues based on rules.

Real use cases:
  - Task queues (process this job exactly once)
  - Email/SMS sending
  - Order processing
  - RPC (request/response over queue)

Throughput: Tens of thousands/second

Pros:
  ✅ Flexible routing (fanout, topic, direct)
  ✅ Message acknowledgment — not deleted until processed
  ✅ Good for task queues with retry logic
  ✅ Lower latency than Kafka

Cons:
  ❌ Messages deleted after consumption (can't replay)
  ❌ Lower throughput than Kafka
  ❌ Harder to scale horizontally
```

**SQS (AWS):**
```
What it's built for:
  Managed queue service. No ops overhead.
  Standard queue or FIFO queue.

Pros:
  ✅ Zero management (AWS runs it)
  ✅ Scales automatically
  ✅ Cheap

Cons:
  ❌ At-least-once delivery (might get same message twice)
  ❌ No message ordering in standard queue
  ❌ AWS vendor lock-in
```

---

#### Delivery Guarantees — Critical to Understand

**At-Most-Once:**
```
Fire and forget. Send message, don't check if received.
Message might be lost.
Use when: Metrics, logs — losing a few is acceptable
```

**At-Least-Once (most common):**
```
Retry until consumer acknowledges.
Message might be delivered more than once.
CRITICAL: Your consumer must be IDEMPOTENT.

Idempotent = processing the same message twice has same effect as once

Non-idempotent (wrong):
  On "ORDER_PLACED" → charge payment
  If message delivered twice → charged twice!

Idempotent (right):
  On "ORDER_PLACED" → check if order_id already processed
  If yes → skip (already done)
  If no → charge payment, mark order_id as processed
```

**Exactly-Once (hardest):**
```
Message delivered and processed exactly once. No duplicates. No loss.
Very expensive to guarantee. Kafka supports it with transactions.
Use only when absolutely necessary (financial systems).
```

**Pros of Message Queues:**
- Decoupling — services don't know about each other
- Buffer traffic spikes — queue absorbs load, consumers process steadily
- Reliability — service can be down, messages wait
- Retry logic — failed processing retried automatically

**Cons:**
- Eventual consistency — things happen asynchronously
- Debugging is harder — trace a request across multiple services
- Duplicate message handling adds complexity
- Another system to operate and monitor

**When to Use:**
- Any operation that doesn't need to happen synchronously
- When you want to decouple services
- For anything that might fail and need retry
- **Don't use when:** You need the result immediately, simple direct calls are clearer

---

### 7. Consistent Hashing — Why It Matters

**The Problem With Regular Hashing:**
```
You have 3 cache servers.
shard = hash(key) % 3

Everything works. Now add a 4th server:
shard = hash(key) % 4

Almost ALL keys map to different servers now!
You just invalidated 75% of your cache in one go.
Every miss → DB hit → DB overwhelmed.
This is called a "cache avalanche" and it can take down production.
```

**How Consistent Hashing Fixes It:**
```
Imagine a ring numbered 0 to 360.
Hash your servers to positions on the ring:
  Server A → position 50
  Server B → position 150
  Server C → position 250

Hash your key → find position on ring → go clockwise to next server.
  key "user:123" → position 80 → Server B (next clockwise from 80)
  key "post:456" → position 200 → Server C
  key "feed:789" → position 310 → Server A (wraps around)

Add Server D at position 100:
  Only keys between 50 (Server A) and 100 (Server D) move to D.
  That's ~14% of keys, not 75%!

Remove Server B at position 150:
  Only keys between 50 and 150 move to Server C.
  Again, ~28% — not everything.
```

**Virtual Nodes:**
```
Problem: 3 servers might land unevenly on the ring by chance.
Solution: Each server gets 150 virtual positions on the ring.
  Server A → positions 12, 47, 83, 119, 156, 198, ... (150 positions)
  Server B → positions 5, 38, 71, 103, 141, 187, ... (150 positions)
Result: Even distribution regardless of how many servers you have.
```

**Used By:** Cassandra, DynamoDB, Redis Cluster, CDN routing, Memcached clients

**Pros:**
- Adding/removing nodes affects minimal keys
- No cache avalanche
- Scales smoothly

**Cons:**
- More complex than simple modulo
- Need client-side implementation or a proxy

---

### 8. API Design — Building Interfaces That Don't Break

---

#### REST — The Standard Everyone Knows

**What:** Representational State Transfer. HTTP-based. Resources (nouns) + verbs (HTTP methods).

```
GET    /users/123          → Get user 123
POST   /users              → Create new user
PUT    /users/123          → Replace user 123 (full update)
PATCH  /users/123          → Update part of user 123
DELETE /users/123          → Delete user 123
GET    /users/123/orders   → Get orders for user 123
POST   /orders/456/cancel  → Cancel order 456 (action as sub-resource)
```

**Good REST Design:**
```
✅ Nouns in URLs, not verbs:
   /users (good)     /getUser (bad)
   /orders (good)    /createOrder (bad)

✅ Proper status codes:
   200 OK           → Success with body
   201 Created      → New resource created
   204 No Content   → Success, no body (DELETE)
   400 Bad Request  → Client sent invalid data
   401 Unauthorized → Not logged in
   403 Forbidden    → Logged in but not allowed
   404 Not Found    → Resource doesn't exist
   409 Conflict     → e.g., email already taken
   429 Too Many Requests → Rate limited
   500 Server Error → Our bug

✅ Consistent error format:
   { "error": "VALIDATION_FAILED",
     "message": "Email is required",
     "details": [{"field": "email", "issue": "required"}] }

✅ Pagination:
   GET /posts?page=2&limit=20        → offset pagination
   GET /posts?after=eyJpZCI6MTJ9     → cursor pagination (better)
```

**Pagination Trade-offs:**
```
Offset pagination (page=2&limit=20):
  ✅ Simple, user can jump to any page
  ❌ If new posts added while paginating, you see duplicates or miss items
  ❌ Slow for deep pages (OFFSET 1000000 scans 1M rows)

Cursor pagination (after=<cursor>):
  ✅ Consistent — no duplicate/missed items during real-time updates
  ✅ Efficient — index lookup on cursor value
  ❌ Can't jump to arbitrary page
  ❌ Client must store cursor
  Use for: Social feeds, infinite scroll
```

**Versioning — How to Change API Without Breaking Clients:**
```
URL versioning (most common):
  /api/v1/users
  /api/v2/users     ← Breaking change? New version.
  ✅ Explicit, easy to route
  ❌ URL pollution

Header versioning:
  Accept: application/vnd.myapi.v2+json
  ✅ Clean URLs
  ❌ Less visible, harder to test in browser

Rule: Make v1 and v2 run simultaneously during migration period.
Never break existing clients without a deprecation window.
```

---

#### GraphQL — When REST's Fixed Responses Aren't Enough

**The Problem REST Has:**
```
Mobile app needs: user name + avatar only (small screen)
Desktop app needs: user name + avatar + bio + follower count + recent posts

REST: Both get the same /users/123 response with EVERYTHING
  Mobile gets 10KB when it needed 500 bytes (over-fetching)

Or worse:
  Mobile needs name (from /users/123) + recent post (from /posts?user=123)
  Two round trips! (under-fetching)
```

**GraphQL Solution:**
```graphql
# Mobile asks for exactly what it needs
query {
  user(id: "123") {
    name
    avatar
  }
}

# Desktop asks for more
query {
  user(id: "123") {
    name
    avatar
    bio
    followerCount
    recentPosts(limit: 5) {
      title
      createdAt
    }
  }
}
```

**Pros of GraphQL:**
- Client controls exactly what data it gets — no over/under-fetching
- Single endpoint, multiple queries in one request
- Self-documenting schema
- Great for complex, interconnected data

**Cons of GraphQL:**
- Complex queries can be slow if not careful (N+1 query problem)
- Caching is harder (every query is different)
- More complex server implementation
- Overkill for simple CRUD APIs

**When to Use:**
- Multiple client types (mobile, web, desktop) with different data needs
- Complex graph-like data (social networks)
- Rapid product iteration where data requirements change
- **Don't use when:** Simple CRUD, public APIs for third parties, when caching is critical

---

#### Rate Limiting — Protecting Your API

**Why:**
```
Without rate limiting:
  One bad client sends 100,000 req/second
  Your servers are overwhelmed
  Real users can't use your service
  Your DB gets destroyed
  Attacker can also scrape all your data
```

**Rate Limiting Headers (standard practice):**
```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100        ← max requests per window
X-RateLimit-Remaining: 45     ← requests left this window
X-RateLimit-Reset: 1700000000 ← when window resets (Unix timestamp)

HTTP/1.1 429 Too Many Requests
Retry-After: 30               ← try again after 30 seconds
```

**Algorithms (briefly):**
```
Fixed Window: 100 req per minute. Simple but edge case: 200 req possible
              at the minute boundary (last 50 + first 50 of next window)

Sliding Window: Rolling 60-second window. Accurate. Slightly more memory.

Token Bucket: Bucket of tokens. Each req takes 1 token. 
              Tokens refill at steady rate. Allows bursts up to bucket size.
              Good for APIs that want to allow occasional bursts.

Leaky Bucket: Requests "leak" out at steady rate regardless of input.
              Smooths out traffic spikes. Good for downstream protection.
```

---

### 9. CDN — Content Delivery Network

**The Problem:**
```
Your servers are in Mumbai.
User is in New York.
Network latency: ~200ms just for the data to travel.
User wants to load your 5MB homepage assets.
That's painfully slow.
```

**What CDN Does:**
```
CDN has servers (edge nodes) all over the world.
  - 50 cities, 6 continents

When user in New York requests your logo:
  1. Request goes to nearest CDN edge (New York)
  2. CDN has it cached → serves immediately (< 5ms latency)
  3. No trip to your Mumbai server needed

If CDN doesn't have it (cache miss):
  CDN fetches from your origin server once, caches it.
  Every subsequent request served from CDN.
```

**What to Put on CDN:**
```
✅ Great for CDN:
  Static assets: images, CSS, JavaScript, fonts
  Video streaming: CDN serves video segments
  File downloads: PDFs, software
  Static HTML pages

❌ Not for CDN:
  Dynamic content (personalized, real-time)
  API responses with user-specific data
  Anything that changes per-request
```

**Cache-Control Headers (how you control CDN caching):**
```
Cache-Control: max-age=31536000, immutable
  → Cache for 1 year, never revalidate (for hashed filenames like app.a3f9b.js)

Cache-Control: max-age=3600, s-maxage=86400
  → Browser caches 1 hour, CDN caches 24 hours

Cache-Control: no-cache
  → Revalidate with origin before serving (dynamic pages)

Cache-Control: no-store
  → Don't cache at all (sensitive data)
```

**Cache Invalidation at CDN:**
```
Problem: You deployed new JavaScript. CDN still serves old version.
Solutions:
  1. Content hashing: app.a3f9b.js → deploy app.c7d2e.js
     Old URL never invalidated — just unused.
  2. Versioning in URL: /assets/v2/app.js
  3. CDN purge API: Tell CDN to delete specific URLs from cache
     (Cloudflare/CloudFront both provide this)
```

**Pros:**
- Dramatically lower latency for global users
- Reduces load on your origin servers
- Built-in DDoS protection (CDN absorbs attack traffic)
- High availability (CDN's infrastructure, not your problem)

**Cons:**
- Cost (pay per GB served)
- Cache invalidation is tricky
- Not for dynamic/personalized content
- Another vendor dependency

---

### 10. Microservices vs Monolith

**The Monolith:**
```
Everything in one codebase, one deployment.

[Monolith]
  ├── User Module
  ├── Order Module
  ├── Payment Module
  ├── Inventory Module
  └── Notification Module

All in one process. Modules talk via function calls.
```

**When Monolith is Right:**
```
✅ Starting a new product (speed of development matters most)
✅ Small team (< 10 engineers)
✅ Domain not yet well-understood (microservices need clear boundaries)
✅ Simple scaling requirements
✅ Most startups should start here

Reality check: Uber, Netflix, Amazon all started as monoliths.
They split into microservices when the monolith couldn't keep up.
```

**Microservices:**
```
Each module is its own independent service.

[User Service]    → own DB, own deployment
[Order Service]   → own DB, own deployment
[Payment Service] → own DB, own deployment
[Inventory Service] → own DB, own deployment

Talk via: HTTP/REST, gRPC, or message queues
```

**When Microservices Make Sense:**
```
✅ Large team (20+ engineers) — teams can own services independently
✅ Different scaling needs — payment service needs 2 servers, 
   image processing needs 50 GPU servers
✅ Different tech requirements — search service in Elasticsearch,
   main app in Postgres
✅ Independent deployment needed — deploy payment without touching user service
✅ Clear domain boundaries — you know where one service ends and another starts
```

**The Real Costs of Microservices:**
```
Distributed system complexity:
  Network calls can fail — need retries, timeouts, circuit breakers
  Debugging across 20 services requires distributed tracing
  
Data consistency:
  No cross-service transactions — need Saga pattern
  Each service has its own DB — JOINs impossible
  
Operational overhead:
  20 services = 20 CI/CD pipelines, 20 monitoring dashboards
  Need Kubernetes, service mesh, API gateway
  Need a platform team just to manage the infrastructure

Testing:
  Integration tests across services are complex
  Need contract testing (Pact)
  Local dev requires running all dependencies
```

**Honest Recommendation:**
```
Build a "modular monolith" first:
  One deployment, but clean module boundaries in code.
  When you feel the pain of the monolith, extract services one by one.
  
The most expensive mistake: Building microservices before you understand
your domain. You'll get the service boundaries wrong and spend months
refactoring the most complex possible architecture.
```

---

## PART 2 — Advanced Distributed Systems Concepts

---

### 11. Circuit Breaker — Preventing Cascade Failures

**The Problem:**
```
Your service calls Payment Service.
Payment Service is slow (DB issue) — takes 30 seconds to timeout.
Meanwhile, requests pile up in your service waiting for Payment.
Your service runs out of threads/connections.
Your service goes down too.
Your service's callers start failing.
The whole system cascades down like dominos.

This is called a Cascade Failure.
```

**How Circuit Breaker Works:**
```
Three states:

CLOSED (normal):
  Requests flow through normally.
  Track failure rate in a sliding window.
  If failures > threshold (e.g., 50% in last 60s) → OPEN

OPEN (tripped):
  ALL requests fail immediately (no call to downstream).
  Returns error instantly — no waiting 30s for timeout.
  Downstream service gets breathing room to recover.
  After timeout (e.g., 30s) → HALF-OPEN

HALF-OPEN (testing):
  Allow a few requests through to test if downstream recovered.
  If they succeed → CLOSED (fully recovered)
  If they fail → back to OPEN
```

```js
function createCircuitBreaker(fn, options = {}) {
  const {
    failureThreshold = 5,   // open after 5 failures
    successThreshold = 2,   // close after 2 successes in half-open
    timeout = 30000,        // stay open for 30s before trying again
  } = options;

  let state = "CLOSED";
  let failureCount = 0;
  let successCount = 0;
  let lastFailureTime = null;

  return async function (...args) {
    if (state === "OPEN") {
      // Check if timeout has passed — try half-open
      if (Date.now() - lastFailureTime > timeout) {
        state = "HALF-OPEN";
        successCount = 0;
      } else {
        // Still open — fail fast, don't even try
        throw new Error("Circuit OPEN — service unavailable");
      }
    }

    try {
      const result = await fn(...args);

      // Success!
      if (state === "HALF-OPEN") {
        successCount++;
        if (successCount >= successThreshold) {
          state = "CLOSED"; // fully recovered
          failureCount = 0;
          console.log("Circuit CLOSED — service recovered");
        }
      } else {
        failureCount = 0; // reset on success
      }

      return result;
    } catch (err) {
      failureCount++;
      lastFailureTime = Date.now();

      if (failureCount >= failureThreshold || state === "HALF-OPEN") {
        state = "OPEN";
        console.log(`Circuit OPEN — too many failures (${failureCount})`);
      }

      throw err;
    }
  };
}

// Usage
const callPaymentService = createCircuitBreaker(
  async (amount) => {
    const response = await fetch("/payment-service/charge", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error("Payment failed");
    return response.json();
  },
  { failureThreshold: 5, timeout: 30000 }
);

// If payment service is down, circuit opens.
// Your service stays up, fails fast, doesn't cascade.
```

**Pros:**
- Prevents cascade failures
- Fast failure response (don't wait for timeout)
- Gives downstream time to recover

**Cons:**
- Adds complexity
- Need to handle the "circuit open" error gracefully
- Configuration tuning needed (thresholds, timeouts)

**When to Use:** Any synchronous call to an external service/microservice that could be slow or unavailable

---

### 12. Distributed Transactions — The Hardest Problem

**The Problem:**
```
OrderService places an order:
  1. Deduct inventory in InventoryService
  2. Charge payment in PaymentService
  3. Create order in OrderService DB

What if Step 2 (payment) succeeds but Step 3 (create order) fails?
  → User was charged but no order created
  → Money taken, no product

These are in DIFFERENT services with DIFFERENT databases.
You can't use a database transaction across two different DBs.
```

**Solution: Saga Pattern**

**Choreography Saga (event-driven):**
```
Each service does its job then emits an event.
Other services react to events.

OrderService: Creates order, emits "OrderCreated"
  ↓
InventoryService: Hears "OrderCreated", reserves stock, emits "StockReserved"
  ↓
PaymentService: Hears "StockReserved", charges card, emits "PaymentComplete"
  ↓
ShippingService: Hears "PaymentComplete", schedules delivery

If PaymentService fails → emits "PaymentFailed"
  ↓
InventoryService: Hears "PaymentFailed", releases reserved stock (compensating action)
  ↓
OrderService: Hears "PaymentFailed", cancels order
```

- ✅ Loosely coupled — services don't know about each other
- ✅ No central coordinator = no single point of failure
- ❌ Hard to track the overall flow
- ❌ Hard to debug — "why did order 123 get cancelled?"
- ❌ Complex compensating logic needed

**Orchestration Saga (central coordinator):**
```
Saga Orchestrator manages the whole flow:

Orchestrator: "Start order saga for order 123"
  → Calls InventoryService.reserveStock()  ✅
  → Calls PaymentService.charge()          ❌ (fails)
  → Calls InventoryService.releaseStock()  (compensating action — rollback)
  → Mark order as failed

Orchestrator knows the exact state of every saga instance.
```

- ✅ Easy to understand the flow (it's all in orchestrator)
- ✅ Easy to monitor and debug
- ❌ Orchestrator is a single point of failure (needs HA)
- ❌ Orchestrator can become a bottleneck
- ❌ Services are coupled to orchestrator

**When to Use Saga:**
- Any multi-service operation that must be atomic (all succeed or all roll back)
- Order placement, booking, financial transfers across services

---

### 13. Observability — Knowing When Things Break

**The Three Pillars:**

**Logs:**
```
What: Timestamped records of events that happened
Use: Debugging specific incidents ("what happened at 2:34pm?")

Good logging:
  - Structured (JSON) not plain text
  - Include context (user_id, request_id, order_id)
  - Log at appropriate levels (debug/info/warn/error)
  - Don't log sensitive data (passwords, card numbers)

Bad:
  console.log("error occurred")

Good:
  logger.error({
    message: "Payment failed",
    orderId: "123",
    userId: "456",
    amount: 99.99,
    error: err.message,
    requestId: ctx.requestId,
  });
```

**Metrics:**
```
What: Numerical measurements over time
Use: Dashboards, alerts, trends ("is the system healthy RIGHT NOW?")

Key metrics to track:
  - Latency: P50, P95, P99 (not just average!)
  - Error rate: errors per minute
  - Throughput: requests per second
  - Saturation: CPU%, memory%, disk%
  - Business metrics: orders/minute, signups/day

P50 vs P99:
  P50 = 50% of requests faster than this (median)
  P99 = 99% of requests faster than this
  If P50=20ms and P99=5000ms → 1% of users wait 5 seconds!
  Always look at P99 for real user experience.

Tools: Prometheus + Grafana, DataDog, CloudWatch
```

**Distributed Tracing:**
```
What: Track a single request as it flows through multiple services
Use: "Why is this API slow?" when it touches 10 services

User request → API Gateway → UserService → OrderService → PaymentService
  |___ trace_id: abc123 propagated through all services ___|

Trace shows: each service's contribution to total latency
  API Gateway:    5ms
  UserService:   15ms
  OrderService:  10ms
  PaymentService: 450ms  ← BOTTLENECK FOUND

Tools: Jaeger, Zipkin, DataDog APM, AWS X-Ray
```

**Why This Matters in Interviews:**
Every senior engineer at a product company is expected to know how to operate their systems, not just build them. Mentioning observability shows you think about production, not just development.

---

## PART 3 — HLD Interview Framework

### How to Structure Your Answer (45 minutes)

**Minutes 0-5: Requirements**
```
Ask these EVERY time:

"What are the core features?"
"How many users? DAU/MAU?"
"What's the read/write ratio?"
"What are the latency requirements?"
"What consistency model is acceptable?"
"What's out of scope?"

Why: A Twitter answer and a WhatsApp answer both involve messaging,
but need completely different architectures.
Interviewers want to see you think before designing.
```

**Minutes 5-10: Estimation (Back of Envelope)**
```
Be approximate. Show your thinking process.

DAU: 10 million
Tweets per user per day: 2
Total writes: 20M/day = ~230/second = ~700/second peak

Read heavy? 100 reads per write = 23,000 reads/second

Storage:
  1 tweet = 300 bytes
  20M tweets × 300 bytes = 6GB/day
  6GB × 365 = ~2TB/year (text only)

This tells you:
  - You need a read-optimized system (caching!)
  - Storage isn't the primary concern
  - Write rate is manageable for a single DB initially
```

**Minutes 10-15: API Design**
```
Define 3-5 core endpoints.

POST /tweets          { content, media_ids }
GET  /feed            { cursor, limit }
GET  /tweets/:id      
POST /users/:id/follow
GET  /users/:id/tweets  { cursor, limit }

This tells the interviewer you understand the product.
```

**Minutes 15-30: High Level Design**
```
Draw the boxes and arrows. Explain each decision.

"I'll start with the core flow: user posts a tweet..."
  → API Gateway (why: single entry point, auth, rate limiting)
  → Tweet Service (why: SRP)
  → Cassandra for tweets (why: write-heavy, time-series, scales horizontally)
  → Kafka event (why: decouple from feed generation, async)
  → Feed Service subscribes to Kafka
  → Redis for feeds (why: fast reads, 100:1 read:write ratio)

Always explain WHY you chose each component.
"I chose X because Y" is what they're evaluating.
```

**Minutes 30-42: Deep Dive**
```
Pick 1-2 hardest parts. Go deep.
Interviewers usually direct you here.

"Let's deep dive on feed generation..."

Fanout on write (push):
  When tweet posted → push to all followers' feeds in Redis
  ✅ O(1) feed read
  ❌ Celebrity with 10M followers = 10M writes per tweet

Fanout on read (pull):
  When user reads feed → query all followees' tweets, merge
  ✅ Simple writes
  ❌ User follows 1000 people = 1000 DB queries per feed load

Hybrid:
  Regular users (<10K followers) → push
  Celebrities (>10K followers) → pull, merge at read time
  ✅ Best of both worlds
```

**Minutes 42-45: Scale & Failure Modes**
```
"What breaks at 10x scale?"
"What are single points of failure?"
"How do you handle the DB going down?"

Shows: You think about production, not just the happy path.
```

---

### Common Trade-off Questions in Interviews

**"SQL or NoSQL for this?"**
```
SQL when: Transactions needed, complex queries, known schema
NoSQL when: Massive scale, flexible schema, simple access patterns
Often: SQL first, migrate specific services to NoSQL when needed
```

**"Microservices or Monolith?"**
```
Monolith when: Small team, new product, unclear domain boundaries
Microservices when: Large team, need independent scaling/deployment
Default answer: Start modular monolith, extract as needed
```

**"Sync or Async?"**
```
Sync (direct API call) when: You need the result immediately, simple flow
Async (queue) when: Result not needed immediately, decoupling needed,
                    operation might fail and need retry, processing is slow
```

**"Strong Consistency or Eventual Consistency?"**
```
Strong when: Financial data, inventory, anything where stale = wrong
Eventual when: Social feeds, view counts, user preferences
Most systems use both: strong for critical paths, eventual elsewhere
```

**"Cache or No Cache?"**
```
Cache when: Same data read many times, slow to compute, stale data acceptable
Don't cache: Financial transactions, highly dynamic data, tiny datasets
```

---

### Numbers Every HLD Engineer Should Know

```
Latency (approximate):
  L1 cache:                1 nanosecond
  L2 cache:               10 nanoseconds
  RAM read:              100 nanoseconds
  SSD read:              150 microseconds
  Network (same DC):       0.5 milliseconds
  Network (cross-region): 50-150 milliseconds
  HDD seek:               10 milliseconds

Throughput (approximate):
  Redis:         100,000+ operations/second
  PostgreSQL:    10,000 - 50,000 transactions/second
  Kafka:         1,000,000+ messages/second
  Single server: 10,000 - 50,000 HTTP requests/second
  CDN edge:      100,000+ requests/second

Size (approximate):
  1 char   = 1 byte
  1 UUID   = 16 bytes (binary) / 36 bytes (string)
  1 tweet  = 300 bytes
  1 photo  = 300KB (thumbnail) to 5MB (full res)
  1 minute video = 50-100MB
  1 hour audio   = 60MB (MP3 128kbps)

Quick math:
  1M requests/day = ~12 req/second
  10M/day         = ~120 req/second
  100M/day        = ~1,200 req/second = 3,600 peak
  
  1B records × 1KB each = 1 TB storage
  100M users × 100 bytes = 10 GB (just IDs and metadata)
```

---

### Anti-Patterns That Kill Interviews

**❌ Jumping to solution without requirements**
"I'll use Kafka and microservices and Redis and..."
Stop. Ask: "How many users? What are the core features?"

**❌ Over-engineering from minute 1**
Starting with 15 microservices for what could be a monolith.
Start simple. Add complexity when you've justified it with scale.

**❌ Ignoring trade-offs**
Never say "I'll use MongoDB because it's better."
Always say "I'll use MongoDB because [specific reason] — the trade-off is [cost]."

**❌ No failure handling**
Every interviewer wants to know: "What happens when X goes down?"
Single point of failure = incomplete design.

**❌ Forgetting the read/write ratio**
Different ratios need completely different architectures.
Twitter (read-heavy) ≠ logging system (write-heavy).

**❌ Picking technology without justification**
"I'll use Kafka" — Why? What problem does it solve here?
Interviewers don't want buzzwords. They want reasoning.

**❌ No back-of-envelope math**
"I think we'll need a few servers."
Better: "At 100M DAU with 10 requests/user/day = 1B requests/day = ~12K req/sec peak.
At 10K req/server, we need ~12 servers plus headroom → 20 servers."

---

*The best HLD answers are not the most complex — they're the ones where every decision is justified.*
*Simple and correct > complex and impressive-sounding.*
