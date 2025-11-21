# Day 17: Scaling, Replication & Sharding

## 📚 Table of Contents
1. Vertical vs Horizontal Scaling
2. Database Replication
3. Sharding (Horizontal Partitioning)
4. Consistent Hashing
5. CAP Theorem
6. Scaling Patterns
7. Practical Examples

---

## 1. Vertical vs Horizontal Scaling

### Vertical Scaling (Scale Up)

Add more resources to a single server.

```
Before:          After:
┌─────────┐     ┌─────────┐
│ 8GB RAM │ →   │ 32GB RAM│
│ 4 CPU   │     │ 16 CPU  │
│ 500GB   │     │ 2TB SSD │
└─────────┘     └─────────┘
```

**How:**
- Upgrade CPU
- Add more RAM
- Faster storage (HDD → SSD → NVMe)
- Better network card

**Pros:**
- ✅ Simple (no code changes)
- ✅ No data consistency issues
- ✅ Lower latency (single machine)

**Cons:**
- ❌ Hardware limits (can't scale infinitely)
- ❌ Single point of failure
- ❌ Expensive
- ❌ Downtime during upgrade

**When to use:**
- Initial growth phase
- Legacy applications
- Limited budget for re-architecture

### Horizontal Scaling (Scale Out)

Add more servers.

```
Before:          After:
┌─────────┐     ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Server  │ →   │ Server1 │  │ Server2 │  │ Server3 │
└─────────┘     └─────────┘  └─────────┘  └─────────┘
                      \            |           /
                       \           |          /
                          [Load Balancer]
```

**How:**
- Add more identical servers
- Load balancer distributes traffic
- Stateless application design

**Pros:**
- ✅ Nearly infinite scaling
- ✅ High availability (redundancy)
- ✅ Cost-effective (commodity hardware)
- ✅ No downtime

**Cons:**
- ❌ Complex architecture
- ❌ Data consistency challenges
- ❌ Network overhead

**When to use:**
- High traffic applications
- Need high availability
- Cost optimization

### Comparison Table

| Aspect               | Vertical                | Horizontal       |
| -------------------- | ----------------------- | ---------------- |
| **Cost**             | Expensive               | Cost-effective   |
| **Limit**            | Hardware limit          | Nearly unlimited |
| **Complexity**       | Simple                  | Complex          |
| **Downtime**         | Required                | Zero downtime    |
| **Availability**     | Single point of failure | Highly available |
| **Data Consistency** | Easy                    | Challenging      |

---

## 2. Database Replication

### What is Replication?

Copying data from one database server (master/primary) to one or more servers (replicas/secondary).

### 2.1 Master-Slave Replication

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

**How it works:**
1. Application writes to **Master**
2. Master logs changes (binary log)
3. Slaves pull and apply changes
4. Application reads from **Slaves**

**Configuration (MySQL):**

```sql
-- Master configuration (my.cnf)
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-format = ROW

-- Slave configuration
[mysqld]
server-id = 2
relay-log = mysql-relay-bin
read-only = 1

-- On Master: Create replication user
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- On Slave: Connect to Master
CHANGE MASTER TO
    MASTER_HOST='master-ip',
    MASTER_USER='repl',
    MASTER_PASSWORD='password',
    MASTER_LOG_FILE='mysql-bin.000001',
    MASTER_LOG_POS=0;

START SLAVE;
```

**Application Code:**

```javascript
const mysql = require('mysql2/promise');

// Connection pools
const masterPool = mysql.createPool({
    host: 'master-db',
    user: 'app',
    password: 'secret',
    database: 'myapp'
});

const slavePool = mysql.createPool({
    host: 'slave-db',
    user: 'app',
    password: 'secret',
    database: 'myapp'
});

// Write to master
async function createUser(userData) {
    const [result] = await masterPool.query(
        'INSERT INTO users SET ?',
        [userData]
    );
    return result.insertId;
}

// Read from slave
async function getUser(userId) {
    const [users] = await slavePool.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );
    return users[0];
}

// Read from master (when consistency required)
async function getUserConsistent(userId) {
    const [users] = await masterPool.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );
    return users[0];
}
```

**Pros:**
- ✅ Read scalability (add more slaves)
- ✅ High availability (failover to slave)
- ✅ Analytics on slave (no master impact)
- ✅ Backups from slave

**Cons:**
- ❌ Replication lag (slaves behind master)
- ❌ Single master bottleneck (writes)
- ❌ Consistency issues (eventual consistency)

### 2.2 Master-Master Replication

Both servers accept writes.

```
      ┌─────────┐ ←→ ┌─────────┐
      │ Master1 │    │ Master2 │
      └─────────┘    └─────────┘
       Write/Read    Write/Read
```

**Challenges:**
- **Write conflicts** (same row updated on both)
- **Auto-increment conflicts** (use odd/even IDs)

**Configuration:**

```sql
-- Master1
[mysqld]
server-id = 1
log-bin = mysql-bin
auto-increment-offset = 1
auto-increment-increment = 2  # Odd IDs: 1,3,5,7...

-- Master2
[mysqld]
server-id = 2
log-bin = mysql-bin
auto-increment-offset = 2
auto-increment-increment = 2  # Even IDs: 2,4,6,8...
```

**Use case:** Geographic distribution (Master1 in US, Master2 in EU)

### 2.3 Replication Lag

**Problem:** Slave data behind master.

```
Time 0: Master writes User A
Time 1ms: Slave still doesn't have User A
Time 10ms: Slave gets User A (replication lag = 10ms)
```

**Impact:**

```javascript
// User registers
await masterPool.query('INSERT INTO users SET ?', [userData]);

// Immediately try to login (reads from slave)
const user = await slavePool.query('SELECT * FROM users WHERE email = ?', [email]);
// ❌ User not found! (replication lag)
```

**Solutions:**

```javascript
// 1. Read-after-write from master
async function register(userData) {
    const result = await masterPool.query('INSERT INTO users SET ?', [userData]);
    
    // Read from master immediately after write
    const [users] = await masterPool.query(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
    );
    return users[0];
}

// 2. Read from master for critical operations
async function login(email, password) {
    // Always read from master for authentication
    const [users] = await masterPool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return users[0];
}

// 3. Eventual consistency (acceptable for non-critical)
async function getUserProfile(userId) {
    // Slave is OK (profile can be slightly stale)
    const [users] = await slavePool.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );
    return users[0];
}
```

---

## 3. Sharding (Horizontal Partitioning)

### What is Sharding?

Split data across multiple databases.

```
                    Load Balancer
                          |
        ┌─────────────────┼─────────────────┐
        |                 |                 |
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │ Shard 1 │       │ Shard 2 │       │ Shard 3 │
   │Users 1-1M│      │Users 1M-2M│     │Users 2M-3M│
   └─────────┘       └─────────┘       └─────────┘
```

### Why Shard?

- **Scalability:** Single DB can't handle billions of rows
- **Performance:** Smaller dataset = faster queries
- **Cost:** Cheaper to scale horizontally

### 3.1 Sharding Strategies

#### Range-Based Sharding

Split by ID range.

```
Shard 1: user_id 1 - 1,000,000
Shard 2: user_id 1,000,001 - 2,000,000
Shard 3: user_id 2,000,001 - 3,000,000
```

**Code:**

```javascript
function getShardId(userId) {
    if (userId <= 1000000) return 1;
    if (userId <= 2000000) return 2;
    return 3;
}

function getShardConnection(shardId) {
    const shards = {
        1: mysql.createPool({ host: 'shard1.db' }),
        2: mysql.createPool({ host: 'shard2.db' }),
        3: mysql.createPool({ host: 'shard3.db' })
    };
    return shards[shardId];
}

async function getUser(userId) {
    const shardId = getShardId(userId);
    const conn = getShardConnection(shardId);
    
    const [users] = await conn.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );
    return users[0];
}
```

**Pros:**
- ✅ Simple range queries
- ✅ Easy to understand

**Cons:**
- ❌ Uneven distribution (hotspots)
- ❌ Difficult to rebalance

#### Hash-Based Sharding

Use hash function to determine shard.

```
shard_id = hash(user_id) % num_shards

user_id 123 → hash → 456789 → % 3 → Shard 0
user_id 456 → hash → 123456 → % 3 → Shard 0
user_id 789 → hash → 987654 → % 3 → Shard 0
```

**Code:**

```javascript
const crypto = require('crypto');

function getShardId(userId, numShards = 3) {
    const hash = crypto.createHash('md5')
        .update(userId.toString())
        .digest('hex');
    
    const hashInt = parseInt(hash.substring(0, 8), 16);
    return hashInt % numShards;
}

async function getUser(userId) {
    const shardId = getShardId(userId);
    const conn = getShardConnection(shardId);
    
    const [users] = await conn.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );
    return users[0];
}
```

**Pros:**
- ✅ Even distribution
- ✅ Simple

**Cons:**
- ❌ Adding shards requires rehashing (expensive!)
- ❌ No range queries

#### Geographic Sharding

Split by location.

```
Shard US: users in USA
Shard EU: users in Europe
Shard ASIA: users in Asia
```

**Pros:**
- ✅ Low latency (data close to users)
- ✅ Compliance (GDPR, data residency)

**Cons:**
- ❌ Uneven load
- ❌ Cross-shard queries difficult

### 3.2 Shard Key Selection

**Good shard key:**
- ✅ High cardinality (many unique values)
- ✅ Even distribution
- ✅ Queried frequently

**Examples:**

| Shard Key   | Cardinality | Distribution  | Queryable |
| ----------- | ----------- | ------------- | --------- |
| **user_id** | ✅ High      | ✅ Even        | ✅ Yes     |
| **email**   | ✅ High      | ✅ Even        | ✅ Yes     |
| **country** | ❌ Low       | ❌ Uneven      | ✅ Yes     |
| **gender**  | ❌ Very Low  | ❌ Very Uneven | ❌ No      |

### 3.3 Cross-Shard Queries

**Problem:** Query spans multiple shards.

```sql
-- Get all users (across all shards)
SELECT * FROM users ORDER BY created_at DESC LIMIT 100;
```

**Solutions:**

```javascript
// 1. Query all shards and merge
async function getAllUsers(limit = 100) {
    const shards = [1, 2, 3];
    
    // Query each shard
    const promises = shards.map(shardId => {
        const conn = getShardConnection(shardId);
        return conn.query('SELECT * FROM users ORDER BY created_at DESC LIMIT ?', [limit]);
    });
    
    const results = await Promise.all(promises);
    
    // Merge and sort
    const allUsers = results.flatMap(([users]) => users);
    allUsers.sort((a, b) => b.created_at - a.created_at);
    
    return allUsers.slice(0, limit);
}

// 2. Maintain global index (separate service)
// Global index knows which shard has which user
async function searchUsers(query) {
    // Query global index
    const userIds = await indexService.search(query);
    
    // Fetch from respective shards
    const users = await Promise.all(
        userIds.map(userId => getUser(userId))
    );
    
    return users;
}
```

---

## 4. Consistent Hashing

Solves the problem of adding/removing shards in hash-based sharding.

### Problem with Simple Hash

```
// With 3 shards
hash(key) % 3

// Add 4th shard
hash(key) % 4  // 🚨 Most keys now map to different shards!
```

### Consistent Hashing Solution

```
           0°
          ┌─┐
    270° │   │ 90°
         │ ○ │
         └─┘
         180°

Servers placed on ring:
Server A at 30°
Server B at 120°
Server C at 240°

Key hashed to ring:
Key1 → 45° → Next server (B at 120°)
Key2 → 200° → Next server (C at 240°)
Key3 → 280° → Next server (A at 30°)
```

**When Server D added at 60°:**
- Only keys between 30°-60° move from B to D
- Other keys unaffected!

**Implementation:**

```javascript
class ConsistentHash {
    constructor() {
        this.ring = new Map();
        this.sortedKeys = [];
        this.replicas = 150; // Virtual nodes
    }
    
    addServer(server) {
        // Add virtual nodes for better distribution
        for (let i = 0; i < this.replicas; i++) {
            const hash = this.hash(`${server}:${i}`);
            this.ring.set(hash, server);
            this.sortedKeys.push(hash);
        }
        this.sortedKeys.sort((a, b) => a - b);
    }
    
    removeServer(server) {
        for (let i = 0; i < this.replicas; i++) {
            const hash = this.hash(`${server}:${i}`);
            this.ring.delete(hash);
        }
        this.sortedKeys = Array.from(this.ring.keys()).sort((a, b) => a - b);
    }
    
    getServer(key) {
        if (this.ring.size === 0) return null;
        
        const hash = this.hash(key);
        
        // Find first server >= hash
        let idx = this.sortedKeys.findIndex(k => k >= hash);
        
        // Wrap around if needed
        if (idx === -1) idx = 0;
        
        return this.ring.get(this.sortedKeys[idx]);
    }
    
    hash(key) {
        // Simple hash function (use better in production)
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = ((hash << 5) - hash) + key.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
}

// Usage
const ch = new ConsistentHash();
ch.addServer('server1');
ch.addServer('server2');
ch.addServer('server3');

console.log(ch.getServer('user:123')); // server2
console.log(ch.getServer('user:456')); // server1

// Add server - minimal key movement
ch.addServer('server4');
```

---

## 5. CAP Theorem

In a distributed system, you can only have **2 out of 3**:

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

### Definitions

**Consistency (C):**
All nodes see the same data at the same time.

```
Write to Node1 → All nodes immediately see new value
```

**Availability (A):**
Every request gets a response (success/failure).

```
Request → Always get response (even if data stale)
```

**Partition Tolerance (P):**
System continues despite network failures.

```
Node1 ←X→ Node2 (network split)
System still works
```

### Trade-offs

**CP (Consistency + Partition Tolerance):**
- System unavailable during partition
- Examples: MongoDB, HBase, Redis
- Use when: Banking, inventory

**AP (Availability + Partition Tolerance):**
- System available but data may be stale
- Examples: Cassandra, DynamoDB, Riak
- Use when: Social media feeds, analytics

**CA (Consistency + Availability):**
- Not partition-tolerant (single-node or perfect network)
- Examples: Traditional RDBMS (single server)
- Reality: Networks fail, so CA is impractical in distributed systems

---

## 6. Scaling Patterns

### 6.1 Read Replicas

```
Write → Master
Reads → Replicas (scaled horizontally)
```

**When:** Read-heavy workload (10:1 read/write ratio)

### 6.2 Write Sharding

```
Writes → Shard by key → Multiple shards
```

**When:** Write-heavy workload

### 6.3 Caching Layer

```
Request → Cache (Redis) → Database
```

**When:** Expensive queries, hot data

### 6.4 Microservices

```
Monolith → Split into services → Scale independently
```

**When:** Different services have different scaling needs

---

## 📝 Quick Reference

### Scaling Decision Tree

```
Need more capacity?
    │
    ├─ Easy to scale code?
    │   ├─ Yes → Horizontal scaling
    │   └─ No → Vertical scaling (temporary)
    │
    ├─ Read-heavy?
    │   └─ Add read replicas
    │
    ├─ Write-heavy?
    │   └─ Shard database
    │
    └─ Expensive queries?
        └─ Add caching layer
```

### Replication vs Sharding

| Aspect          | Replication           | Sharding          |
| --------------- | --------------------- | ----------------- |
| **Purpose**     | Read scalability      | Write scalability |
| **Data**        | Full copy             | Subset            |
| **Complexity**  | Low                   | High              |
| **Consistency** | Eventually consistent | Partition-based   |

---

## 📝 Practice Tasks

See `/tasks` folder for:
1. Set up MySQL master-slave replication
2. Implement hash-based sharding layer
3. Build consistent hashing ring
4. Handle cross-shard queries

