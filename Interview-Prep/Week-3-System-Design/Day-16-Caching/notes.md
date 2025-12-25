# Day 16: Caching Strategies

## 📚 Table of Contents
1. What is Caching?
2. Multi-Layer Caching
3. Cache Invalidation Strategies
4. Caching Patterns
5. CDN Caching
6. Application-Level Caching
7. Database Query Caching
8. Practical Implementation

---

## 1. What is Caching?

**Caching** stores frequently accessed data in fast storage to reduce:
- Response time
- Database load
- Network bandwidth
- Server compute

### Cache Hit vs Miss

```
Request → Cache
         ├─ HIT: Data found → Return (fast!)
         └─ MISS: Data not found → Fetch from DB → Store in cache → Return
```

### Performance Impact

```
Without cache:
Request → Database (100ms) → Response
Total: 100ms

With cache:
Request → Cache (1ms) → Response
Total: 1ms (100x faster!)
```

---

## 2. Multi-Layer Caching

### Cache Hierarchy

```
Client Request
    ↓
┌─────────────────────┐
│ Browser Cache       │ ← Layer 1 (0ms - local)
└─────────────────────┘
    ↓ (miss)
┌─────────────────────┐
│ CDN Edge Cache      │ ← Layer 2 (10-50ms)
└─────────────────────┘
    ↓ (miss)
┌─────────────────────┐
│ Application Cache   │ ← Layer 3 (1-5ms - Redis)
│ (Redis)             │
└─────────────────────┘
    ↓ (miss)
┌─────────────────────┐
│ Database Cache      │ ← Layer 4 (10-20ms - DB cache)
└─────────────────────┘
    ↓ (miss)
┌─────────────────────┐
│ Database Disk       │ ← Layer 5 (50-100ms)
└─────────────────────┘
```

### Layer 1: Browser Cache

```http
# Response headers
Cache-Control: public, max-age=86400
ETag: "33a64df551425fcc55e4d42a148795d9"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

**Controlled by:** HTTP headers  
**TTL:** Minutes to days  
**Invalidation:** Hard reload, versioned URLs

### Layer 2: CDN Cache

```
User → Nearest Edge Server → (if miss) → Origin
```

**TTL:** Hours to days  
**Use for:** Static assets (images, CSS, JS)

### Layer 3: Application Cache (Redis)

```javascript
// Fast in-memory cache
const cached = await redis.get('user:123');
if (cached) return JSON.parse(cached);

const user = await db.query('SELECT * FROM users WHERE id = ?', [123]);
await redis.setex('user:123', 3600, JSON.stringify(user));
return user;
```

**TTL:** Seconds to hours  
**Use for:** Session data, API responses, computed results

### Layer 4: Database Cache

```sql
-- MySQL query cache (deprecated in 8.0)
-- InnoDB buffer pool

-- Result set caching
SELECT SQL_CACHE * FROM products WHERE category = 'electronics';
```

**TTL:** Query-dependent  
**Automatic:** Managed by DB

---

## 3. Cache Invalidation Strategies

> "There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton

### 3.1 Time-To-Live (TTL)

Cache expires after fixed time.

```javascript
// Set with TTL
await redis.setex('key', 3600, 'value'); // Expires in 1 hour

// Check TTL
const ttl = await redis.ttl('key'); // Remaining seconds
```

**Pros:**
- ✅ Simple to implement
- ✅ Automatic cleanup

**Cons:**
- ❌ Stale data until expiry
- ❌ May expire too soon or late

**Best for:** Data that changes infrequently

### 3.2 Cache Invalidation on Write

Invalidate cache when data changes.

```javascript
// Write-through: Update DB then cache
async function updateUser(userId, data) {
    // Update database
    await db.query('UPDATE users SET ? WHERE id = ?', [data, userId]);
    
    // Invalidate cache
    await redis.del(`user:${userId}`);
    
    // Or update cache
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
}
```

**Pros:**
- ✅ Always fresh data
- ✅ Predictable behavior

**Cons:**
- ❌ Write overhead
- ❌ Complexity

### 3.3 Cache Aside (Lazy Loading)

```javascript
async function getUser(userId) {
    // Try cache
    let user = await redis.get(`user:${userId}`);
    if (user) return JSON.parse(user);
    
    // Cache miss - fetch from DB
    user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    // Store in cache
    await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
    
    return user;
}
```

**Pros:**
- ✅ Only caches what's needed
- ✅ Cache failures don't break app

**Cons:**
- ❌ Initial request slow (cache miss)
- ❌ Cache can become stale

### 3.4 Write-Through Cache

Write to cache and database simultaneously.

```javascript
async function createUser(userData) {
    // Write to database
    const result = await db.query('INSERT INTO users SET ?', [userData]);
    const userId = result.insertId;
    
    // Write to cache
    await redis.setex(`user:${userId}`, 3600, JSON.stringify({
        id: userId,
        ...userData
    }));
    
    return userId;
}
```

**Pros:**
- ✅ Cache always consistent
- ✅ Read performance

**Cons:**
- ❌ Slower writes
- ❌ Wasted cache space

### 3.5 Write-Behind (Write-Back) Cache

Write to cache immediately, database later (async).

```javascript
async function updateUser(userId, data) {
    // Update cache immediately
    await redis.setex(`user:${userId}`, 3600, JSON.stringify(data));
    
    // Queue database update (async)
    await queue.push({
        type: 'UPDATE_USER',
        userId,
        data
    });
}

// Background worker processes queue
async function processQueue() {
    const job = await queue.pop();
    await db.query('UPDATE users SET ? WHERE id = ?', [job.data, job.userId]);
}
```

**Pros:**
- ✅ Very fast writes
- ✅ Batching possible

**Cons:**
- ❌ Data loss risk (if cache fails)
- ❌ Complexity

### 3.6 Event-Based Invalidation

Use events/messages to invalidate cache.

```javascript
// Service A updates user
async function updateUser(userId, data) {
    await db.query('UPDATE users SET ? WHERE id = ?', [data, userId]);
    
    // Publish event
    await pubsub.publish('user.updated', { userId });
}

// Service B listens and invalidates cache
pubsub.subscribe('user.updated', async (message) => {
    await redis.del(`user:${message.userId}`);
});
```

**Best for:** Microservices, distributed systems

---

## 4. Caching Patterns

### 4.1 Cache-Aside (Lazy Loading)

**Flow:**
```
1. App checks cache
2. Cache miss → Fetch from DB
3. Store in cache
4. Return data
```

**Code:**
```javascript
async function getData(key) {
    // Check cache
    const cached = await cache.get(key);
    if (cached) return cached;
    
    // Fetch from source
    const data = await fetchFromDB(key);
    
    // Cache it
    await cache.set(key, data, 3600);
    
    return data;
}
```

### 4.2 Read-Through Cache

Cache sits between app and database. Cache handles fetching.

```javascript
class ReadThroughCache {
    async get(key) {
        let value = await this.cache.get(key);
        
        if (!value) {
            value = await this.database.get(key);
            await this.cache.set(key, value);
        }
        
        return value;
    }
}

// Usage
const value = await cache.get('user:123'); // Cache handles everything
```

### 4.3 Cache Stampede Prevention

**Problem:** Many requests miss cache simultaneously, all hit DB.

```
Time T:
Cache expires
Request 1 → miss → DB query
Request 2 → miss → DB query  } All hit DB
Request 3 → miss → DB query  } at once!
```

**Solution: Lock-based**
```javascript
const locks = new Map();

async function getWithLock(key) {
    // Check cache
    let data = await redis.get(key);
    if (data) return JSON.parse(data);
    
    // Acquire lock
    if (locks.has(key)) {
        // Wait for lock holder to populate cache
        await locks.get(key);
        return JSON.parse(await redis.get(key));
    }
    
    // Set lock
    const lock = new Promise(async (resolve) => {
        // Fetch from DB
        data = await db.query('SELECT ...');
        
        // Cache it
        await redis.setex(key, 3600, JSON.stringify(data));
        
        resolve();
    });
    
    locks.set(key, lock);
    await lock;
    locks.delete(key);
    
    return data;
}
```

**Solution: Probabilistic Early Expiration**
```javascript
async function getWithPEE(key, ttl = 3600) {
    const data = await redis.get(key);
    
    if (data) {
        const ttlRemaining = await redis.ttl(key);
        
        // Probabilistically refresh before expiry
        const refreshProbability = 1 - (ttlRemaining / ttl);
        
        if (Math.random() < refreshProbability) {
            // Refresh cache asynchronously
            refreshCache(key).catch(console.error);
        }
        
        return JSON.parse(data);
    }
    
    // Cache miss - fetch and cache
    return await fetchAndCache(key, ttl);
}
```

---

## 5. CDN Caching

### Cache-Control Headers

```http
# Public, cacheable by CDN and browser
Cache-Control: public, max-age=86400

# Private, only browser cache (no CDN)
Cache-Control: private, max-age=3600

# No caching
Cache-Control: no-cache, no-store, must-revalidate

# Cache but revalidate
Cache-Control: public, max-age=3600, must-revalidate
```

### CDN Cache Key

**Default:**
```
https://example.com/image.jpg
```

**With query strings:**
```
https://example.com/image.jpg?width=800&format=webp
```

**Custom cache key:**
```javascript
// Cloudflare: Cache based on device type
Cache-Control: public, max-age=3600
Vary: User-Agent

// Cache key includes:
// - URL
// - User-Agent (mobile vs desktop)
```

### CDN Purging

```javascript
// Cloudflare API
async function purgeCDN(urls) {
    await fetch('https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache', {
        method: 'POST',
        headers: {
            'X-Auth-Email': 'user@example.com',
            'X-Auth-Key': 'api_key'
        },
        body: JSON.stringify({ files: urls })
    });
}

// Purge specific URLs
await purgeCDN([
    'https://example.com/image.jpg',
    'https://example.com/styles.css'
]);
```

---

## 6. Application-Level Caching

### In-Memory Cache (Node.js)

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 min default

// Set
cache.set('key', { data: 'value' }, 3600); // Override TTL

// Get
const value = cache.get('key');

// Delete
cache.del('key');

// Get with callback (cache-aside pattern)
cache.get('key', async (err, value) => {
    if (value) return value;
    
    const data = await fetchFromDB();
    cache.set('key', data);
    return data;
});
```

### Redis Cache

```javascript
const redis = require('redis');
const client = redis.createClient();

// Set with TTL
await client.setex('user:123', 3600, JSON.stringify(user));

// Get
const cached = await client.get('user:123');
const user = cached ? JSON.parse(cached) : null;

// Set multiple
await client.mset(
    'key1', 'value1',
    'key2', 'value2'
);

// Get multiple
const [val1, val2] = await client.mget('key1', 'key2');

// Hash (for objects)
await client.hset('user:123', 'name', 'John');
await client.hset('user:123', 'email', 'john@example.com');
const name = await client.hget('user:123', 'name');
```

---

## 7. Database Query Caching

### Application-Level Query Cache

```javascript
class QueryCache {
    constructor(redis, ttl = 3600) {
        this.redis = redis;
        this.ttl = ttl;
    }
    
    async query(sql, params) {
        // Generate cache key from query
        const key = `query:${crypto
            .createHash('md5')
            .update(sql + JSON.stringify(params))
            .digest('hex')}`;
        
        // Check cache
        const cached = await this.redis.get(key);
        if (cached) {
            console.log('Query cache hit');
            return JSON.parse(cached);
        }
        
        // Execute query
        console.log('Query cache miss');
        const result = await db.query(sql, params);
        
        // Cache result
        await this.redis.setex(key, this.ttl, JSON.stringify(result));
        
        return result;
    }
    
    async invalidate(pattern) {
        const keys = await this.redis.keys(`query:${pattern}*`);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }
}

// Usage
const queryCache = new QueryCache(redis);

// Cache query result
const users = await queryCache.query(
    'SELECT * FROM users WHERE status = ?',
    ['active']
);

// Invalidate on update
await db.query('UPDATE users SET status = ? WHERE id = ?', ['inactive', 123]);
await queryCache.invalidate('*users*');
```

---

## 8. Practical Implementation

### Complete Caching Layer

```javascript
const express = require('express');
const redis = require('redis');
const mysql = require('mysql2/promise');

const app = express();
const redisClient = redis.createClient();
const dbPool = mysql.createPool({ /* config */ });

// Caching middleware
function cacheMiddleware(ttl = 300) {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        
        try {
            // Check cache
            const cached = await redisClient.get(key);
            
            if (cached) {
                console.log('Cache hit:', key);
                res.set('X-Cache', 'HIT');
                return res.json(JSON.parse(cached));
            }
            
            console.log('Cache miss:', key);
            res.set('X-Cache', 'MISS');
            
            // Override res.json to cache response
            const originalJson = res.json.bind(res);
            res.json = (data) => {
                // Cache response
                redisClient.setex(key, ttl, JSON.stringify(data))
                    .catch(console.error);
                
                return originalJson(data);
            };
            
            next();
        } catch (error) {
            console.error('Cache error:', error);
            next(); // Continue without cache
        }
    };
}

// Routes
app.get('/api/products', cacheMiddleware(600), async (req, res) => {
    const [products] = await dbPool.query('SELECT * FROM products');
    res.json(products);
});

app.get('/api/products/:id', cacheMiddleware(3600), async (req, res) => {
    const [products] = await dbPool.query(
        'SELECT * FROM products WHERE id = ?',
        [req.params.id]
    );
    res.json(products[0]);
});

// Invalidate cache on update
app.put('/api/products/:id', async (req, res) => {
    await dbPool.query(
        'UPDATE products SET ? WHERE id = ?',
        [req.body, req.params.id]
    );
    
    // Invalidate caches
    await redisClient.del(`cache:/api/products/${req.params.id}`);
    await redisClient.del('cache:/api/products');
    
    res.json({ success: true });
});

app.listen(3000);
```

---

## Quick Reference

### Cache Strategies

| Strategy          | Write Speed | Read Speed         | Consistency | Complexity |
| ----------------- | ----------- | ------------------ | ----------- | ---------- |
| **Cache-Aside**   | Fast        | Fast (after first) | Eventual    | Low        |
| **Read-Through**  | Fast        | Fast               | Strong      | Medium     |
| **Write-Through** | Slow        | Fast               | Strong      | Medium     |
| **Write-Behind**  | Very Fast   | Fast               | Eventual    | High       |

### TTL Guidelines

| Data Type          | TTL              |
| ------------------ | ---------------- |
| **Static assets**  | 1 year           |
| **Product data**   | 1 hour - 1 day   |
| **User profile**   | 5-30 minutes     |
| **Search results** | 5-15 minutes     |
| **Session data**   | Session duration |
| **Real-time data** | 1-60 seconds     |

### Cache Headers

```http
# Long-term static
Cache-Control: public, max-age=31536000, immutable

# Short-term dynamic
Cache-Control: public, max-age=300

# No cache
Cache-Control: no-store
```

---

## 📝 Practice Task

**Build a complete caching layer** for a mock e-commerce API with:
1. Multi-layer caching (Redis + in-memory)
2. Cache invalidation on updates
3. Cache stampede prevention
4. Metrics (hit rate, miss rate)

See `/tasks` folder for requirements and solution.
