# Day 13: Redis & Caching

## 📚 Table of Contents
1. Redis Basics
2. Data Structures
3. Caching Strategies
4. API Caching Implementation
5. Rate Limiter Implementation
6. Best Practices

---

## 1. Redis Basics

**Redis** = Remote Dictionary Server
- In-memory data store
- Key-value database
- Supports complex data structures
- Sub-millisecond latency

### Installation & Setup

```bash
# Install Redis (Ubuntu/Mac)
sudo apt install redis-server  # Ubuntu
brew install redis             # Mac

# Start Redis
redis-server

# Connect with CLI
redis-cli
```

### Basic Commands

```bash
# SET key value
SET user:1:name "John Doe"

# GET key
GET user:1:name
# Returns: "John Doe"

# EXISTS key
EXISTS user:1:name
# Returns: 1 (true) or 0 (false)

# DEL key
DEL user:1:name

# KEYS pattern
KEYS user:*
# Returns all keys matching pattern
```

### TTL (Time To Live)

```bash
# SET with expiration (seconds)
SETEX session:abc123 3600 "user_data"  # Expires in 1 hour

# SET then set expiration
SET cache:product:1 "product_data"
EXPIRE cache:product:1 300  # Expires in 5 minutes

# Check TTL
TTL cache:product:1
# Returns: remaining seconds or -1 (no expiry) or -2 (doesn't exist)

# Remove expiration
PERSIST cache:product:1
```

---

## 2. Data Structures

### 1. Strings

```bash
# Simple key-value
SET user:1:email "john@example.com"
GET user:1:email

# Increment (atomic)
SET user:1:visits 0
INCR user:1:visits        # Returns: 1
INCRBY user:1:visits 10   # Returns: 11
DECR user:1:visits        # Returns: 10

# Multiple SET/GET
MSET user:1:name "John" user:1:age "30"
MGET user:1:name user:1:age
```

### 2. Hashes (Objects)

```bash
# Store object fields
HSET user:1 name "John" email "john@ex.com" age 30

# Get single field
HGET user:1 name
# Returns: "John"

# Get all fields
HGETALL user:1
# Returns: ["name", "John", "email", "john@ex.com", "age", "30"]

# Get multiple fields
HMGET user:1 name email

# Check if field exists
HEXISTS user:1 name

# Increment field
HINCRBY user:1 age 1

# Delete field
HDEL user:1 age
```

### 3. Lists (Arrays)

```bash
# Push to list
LPUSH notifications:user1 "New message"  # Left push
RPUSH notifications:user1 "New comment"  # Right push

# Get range
LRANGE notifications:user1 0 -1  # All items
LRANGE notifications:user1 0 9   # First 10

# Pop from list
LPOP notifications:user1  # Remove from left
RPOP notifications:user1  # Remove from right

# List length
LLEN notifications:user1

# Trim list (keep only range)
LTRIM notifications:user1 0 99  # Keep first 100 items
```

### 4. Sets (Unique Values)

```bash
# Add to set
SADD tags:post1 "nodejs" "mongodb" "redis"

# Get all members
SMEMBERS tags:post1

# Check membership
SISMEMBER tags:post1 "nodejs"  # Returns: 1

# Remove member
SREM tags:post1 "mongodb"

# Set operations
SINTER tags:post1 tags:post2      # Intersection
SUNION tags:post1 tags:post2      # Union
SDIFF tags:post1 tags:post2       # Difference

# Count
SCARD tags:post1  # Number of members
```

### 5. Sorted Sets (Leaderboards)

```bash
# Add with score
ZADD leaderboard 100 "player1"
ZADD leaderboard 150 "player2"
ZADD leaderboard 120 "player3"

# Get by rank (0-based)
ZRANGE leaderboard 0 -1          # All, lowest to highest
ZREVRANGE leaderboard 0 -1       # All, highest to lowest
ZREVRANGE leaderboard 0 9        # Top 10

# Get with scores
ZRANGE leaderboard 0 -1 WITHSCORES

# Get rank
ZRANK leaderboard "player1"      # 0-based rank (ascending)
ZREVRANK leaderboard "player1"   # 0-based rank (descending)

# Get score
ZSCORE leaderboard "player1"

# Increment score
ZINCRBY leaderboard 10 "player1"

# Get by score range
ZRANGEBYSCORE leaderboard 100 150
```

---

## 3. Caching Strategies

### Cache-Aside (Lazy Loading)

```javascript
async function getUser(userId) {
    const cacheKey = `user:${userId}`;
    
    // 1. Try cache first
    let user = await redis.get(cacheKey);
    
    if (user) {
        console.log('Cache hit');
        return JSON.parse(user);
    }
    
    // 2. Cache miss - get from DB
    console.log('Cache miss');
    user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    // 3. Store in cache
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
    
    return user;
}
```

**When to use:**
- ✅ Read-heavy workloads
- ✅ Data doesn't change often
- ✅ Cache miss is acceptable

### Write-Through

```javascript
async function updateUser(userId, data) {
    const cacheKey = `user:${userId}`;
    
    // 1. Update database
    await db.query('UPDATE users SET ? WHERE id = ?', [data, userId]);
    
    // 2. Update cache
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    await redis.setex(cacheKey, 3600, JSON.stringify(user));
    
    return user;
}
```

**When to use:**
- ✅ Write and read both important
- ✅ Need consistency
- ❌ Slower writes

### Cache Invalidation

```javascript
// Delete cache on update
async function updateProduct(productId, data) {
    await db.query('UPDATE products SET ? WHERE id = ?', [data, productId]);
    await redis.del(`product:${productId}`);  // Invalidate cache
}

// Pattern-based invalidation
async function invalidateUserCache(userId) {
    const keys = await redis.keys(`user:${userId}:*`);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
}
```

---

## 4. API Caching Implementation

### Express Caching Middleware

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache middleware
function cacheMiddleware(duration = 300) {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl}`;
        
        try {
            const cachedResponse = await client.get(key);
            
            if (cachedResponse) {
                console.log('Cache hit:', key);
                return res.json(JSON.parse(cachedResponse));
            }
            
            // Modify res.json to cache response
            const originalJson = res.json.bind(res);
            res.json = (data) => {
                client.setex(key, duration, JSON.stringify(data));
                return originalJson(data);
            };
            
            next();
        } catch (error) {
            next();
        }
    };
}

// Use in routes
app.get('/api/products', cacheMiddleware(600), async (req, res) => {
    const products = await db.query('SELECT * FROM products');
    res.json(products);
});
```

### Complete Caching Example

```javascript
const express = require('express');
const redis = require('redis');
const mysql = require('mysql2/promise');

const app = express();
const redisClient = redis.createClient();
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydb'
});

// GET /api/users/:id
app.get('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    const cacheKey = `user:${userId}`;
    
    try {
        // Check cache
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json({
                source: 'cache',
                data: JSON.parse(cached)
            });
        }
        
        // Query database
        const [users] = await dbPool.query(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        
        if (!users.length) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = users[0];
        
        // Cache for 1 hour
        await redisClient.setex(cacheKey, 3600, JSON.stringify(user));
        
        res.json({
            source: 'database',
            data: user
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/users/:id (invalidate cache)
app.put('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    const cacheKey = `user:${userId}`;
    
    try {
        await dbPool.query(
            'UPDATE users SET ? WHERE id = ?',
            [req.body, userId]
        );
        
        // Invalidate cache
        await redisClient.del(cacheKey);
        
        res.json({ success: true });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

---

## 5. Rate Limiter Implementation

### Fixed Window Rate Limiter

```javascript
async function rateLimitFixedWindow(userId, limit = 10, window = 60) {
    const key = `ratelimit:${userId}`;
    
    const current = await redis.incr(key);
    
    if (current === 1) {
        await redis.expire(key, window);
    }
    
    if (current > limit) {
        const ttl = await redis.ttl(key);
        throw new Error(`Rate limit exceeded. Try again in ${ttl} seconds`);
    }
    
    return {
        allowed: true,
        remaining: limit - current
    };
}

// Express middleware
function rateLimiter(limit = 10, window = 60) {
    return async (req, res, next) => {
        const userId = req.user?.id || req.ip;
        
        try {
            const result = await rateLimitFixedWindow(userId, limit, window);
            res.set({
                'X-RateLimit-Limit': limit,
                'X-RateLimit-Remaining': result.remaining
            });
            next();
        } catch (error) {
            res.status(429).json({
                error: error.message,
                retryAfter: await redis.ttl(`ratelimit:${userId}`)
            });
        }
    };
}

// Use in route
app.get('/api/data', rateLimiter(100, 3600), (req, res) => {
    res.json({ data: '...' });
});
```

### Sliding Window Rate Limiter

```javascript
async function rateLimitSlidingWindow(userId, limit = 10, window = 60) {
    const key = `ratelimit:${userId}`;
    const now = Date.now();
    const windowStart = now - (window * 1000);
    
    // Remove old entries
    await redis.zremrangebyscore(key, 0, windowStart);
    
    // Count recent requests
    const count = await redis.zcard(key);
    
    if (count >= limit) {
        throw new Error('Rate limit exceeded');
    }
    
    // Add current request
    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.expire(key, window);
    
    return {
        allowed: true,
        remaining: limit - count - 1
    };
}
```

### Token Bucket Rate Limiter

```javascript
async function rateLimitTokenBucket(userId, capacity = 10, refillRate = 1) {
    const key = `ratelimit:bucket:${userId}`;
    
    const data = await redis.get(key);
    let tokens, lastRefill;
    
    if (data) {
        ({ tokens, lastRefill } = JSON.parse(data));
    } else {
        tokens = capacity;
        lastRefill = Date.now();
    }
    
    // Refill tokens
    const now = Date.now();
    const timePassed = (now - lastRefill) / 1000;
    tokens = Math.min(capacity, tokens + (timePassed * refillRate));
    lastRefill = now;
    
    if (tokens < 1) {
        throw new Error('Rate limit exceeded');
    }
    
    // Consume token
    tokens -= 1;
    
    await redis.setex(key, 3600, JSON.stringify({ tokens, lastRefill }));
    
    return {
        allowed: true,
        remaining: Math.floor(tokens)
    };
}
```

---

## 6. Best Practices

### ✅ Set Expiration on All Keys

```javascript
// ✅ Good
redis.setex('key', 3600, 'value');

// ❌ Bad (memory leak if never deleted)
redis.set('key', 'value');
```

### ✅ Use Pipelining for Multiple Commands

```javascript
// ❌ Bad: Multiple round trips
await redis.set('key1', 'value1');
await redis.set('key2', 'value2');
await redis.set('key3', 'value3');

// ✅ Good: Single round trip
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');
await pipeline.exec();
```

### ✅ Handle Connection Errors

```javascript
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
    // Fallback to database
});

redisClient.on('connect', () => {
    console.log('Redis connected');
});
```

### ✅ Use Appropriate Data Structures

```javascript
// ❌ Bad: JSON for counters
redis.set('counter', JSON.stringify({ count: 0 }));

// ✅ Good: Use INCR
redis.incr('counter');
```

---

## Practice Tasks

Build these projects (see `/examples` folder):
1. API caching middleware
2. Fixed window rate limiter
3. Sliding window rate limiter
4. Session store
5. Real-time leaderboard

---

## Quick Reference

```bash
# Strings
SET key value EX 3600
GET key
INCR counter

# Hashes
HSET user:1 name "John"
HGET user:1 name
HGETALL user:1

# Lists
LPUSH queue "item"
RPOP queue
LRANGE queue 0 -1

# Sets
SADD tags "redis"
SMEMBERS tags

# Sorted Sets
ZADD leaderboard 100 "player1"
ZREVRANGE leaderboard 0 9
```
