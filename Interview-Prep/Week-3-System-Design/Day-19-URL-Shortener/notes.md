# Day 19: URL Shortener System Design

## 📚 Table of Contents
1. Problem Statement
2. Requirements (Functional & Non-Functional)
3. Capacity Estimation
4. API Design
5. Database Schema
6. URL Shortening Algorithms
7. High-Level Design
8. Detailed Component Design
9. Scaling & Optimization

---

## 1. Problem Statement

Design a URL shortening service like bit.ly or TinyURL.

**Example:**
```
Long URL:  https://www.example.com/very/long/path/to/article?id=12345&ref=twitter
           ↓
Short URL: https://short.url/abc123
```

---

## 2. Requirements

### Functional Requirements

1. **Shorten URL:** Generate short URL from long URL
2. **Redirect:** Redirect short URL to original URL
3. **Custom URLs:** Optional custom short codes (e.g., `bit.ly/mylink`)
4. **Analytics:** Track click count, geography, referrers
5. **Expiration:** URLs can expire after time period
6. **User accounts:** Optional - manage URLs, view analytics

### Non-Functional Requirements

1. **High availability:** 99.99% uptime
2. **Low latency:** Redirect < 100ms
3. **Scalability:** Billions of URLs
4. **Reliability:** URLs never lost
5. **Security:** Prevent abuse, spam

---

## 3. Capacity Estimation

### Traffic Estimates

**Assumptions:**
- 100M new URLs per month
- Read:Write ratio = 100:1 (100 redirects per 1 creation)

**Calculations:**

```
Write (URL creation):
- 100M / month
- 100M / (30 days × 24 hours × 3600 sec) = ~38 URLs/sec
- Peak: 38 × 5 = 190 URLs/sec

Read (Redirects):
- 100M × 100 = 10B / month
- 10B / (30 × 24 × 3600) = ~3850 redirects/sec
- Peak: 3850 × 5 = 19,250 redirects/sec
```

### Storage Estimates

**URL storage:**
```
Per URL:
- Long URL: 500 bytes (average)
- Short code: 7 bytes
- Created at: 8 bytes
- User ID: 8 bytes
- Expiration: 8 bytes
- Metadata: 100 bytes
Total: ~630 bytes

100M URLs/month × 630 bytes = 63 GB/month
Over 5 years: 63 GB × 12 × 5 = 3.78 TB
```

**Cache requirement:**
```
80/20 rule: 20% URLs generate 80% traffic
Cache: 10B × 0.2 × 630 bytes = 1.26 TB
```

### Bandwidth

```
Write: 38 URLs/sec × 630 bytes = 24 KB/sec ≈ 0.024 MB/sec
Read: 3850 redirects/sec × 630 bytes = 2.4 MB/sec
```

**Summary:**
| Metric            | Value                    |
| ----------------- | ------------------------ |
| New URLs          | 38/sec (peak: 190/sec)   |
| Redirects         | 3850/sec (peak: 19K/sec) |
| Storage (5 years) | ~4 TB                    |
| Cache             | ~1.3 TB                  |
| Bandwidth         | ~2.5 MB/sec              |

---

## 4. API Design

### REST API

```javascript
// 1. Create short URL
POST /api/shorten
{
    "longUrl": "https://www.example.com/article/12345",
    "customAlias": "myarticle",  // optional
    "expiresAt": "2025-12-31"    // optional
}

Response:
{
    "shortUrl": "https://short.url/abc123",
    "shortCode": "abc123",
    "longUrl": "https://www.example.com/article/12345",
    "createdAt": "2024-11-21T10:00:00Z",
    "expiresAt": "2025-12-31T23:59:59Z"
}

// 2. Get URL info
GET /api/url/{shortCode}
Response:
{
    "shortCode": "abc123",
    "longUrl": "https://www.example.com/article/12345",
    "clicks": 1250,
    "createdAt": "2024-11-21T10:00:00Z"
}

// 3. Redirect (actual shortening)
GET /{shortCode}
→ 302 redirect to longUrl

// 4. Analytics
GET /api/analytics/{shortCode}
Response:
{
    "clicks": 1250,
    "clicksByCountry": {
        "US": 500,
        "UK": 300,
        "IN": 450
    },
    "clicksByReferrer": {
        "twitter.com": 600,
        "facebook.com": 400,
        "direct": 250
    }
}

// 5. Delete URL (optional)
DELETE /api/url/{shortCode}
```

---

## 5. Database Schema

### Option 1: SQL (MySQL/PostgreSQL)

```sql
CREATE TABLE urls (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    clicks BIGINT DEFAULT 0,
    
    INDEX idx_short_code (short_code),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

CREATE TABLE analytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_code VARCHAR(10) NOT NULL,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    country VARCHAR(2),
    referrer TEXT,
    user_agent TEXT,
    
    INDEX idx_short_code (short_code),
    INDEX idx_clicked_at (clicked_at),
    FOREIGN KEY (short_code) REFERENCES urls(short_code)
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Option 2: NoSQL (MongoDB)

```javascript
// URLs collection
{
    _id: ObjectId,
    shortCode: "abc123",
    longUrl: "https://example.com/article",
    userId: ObjectId,
    createdAt: ISODate("2024-11-21"),
    expiresAt: ISODate("2025-12-31"),
    clicks: 1250,
    analytics: {
        totalClicks: 1250,
        countries: { "US": 500, "UK": 300 },
        referrers: { "twitter.com": 600 }
    }
}

// Index
db.urls.createIndex({ shortCode: 1 }, { unique: true });
db.urls.createIndex({ userId: 1 });
db.urls.createIndex({ createdAt: 1 });
```

**SQL vs NoSQL:**

| Aspect          | SQL                  | NoSQL             |
| --------------- | -------------------- | ----------------- |
| **Schema**      | Fixed                | Flexible          |
| **Joins**       | Easy                 | Complex           |
| **Scalability** | Vertical (initially) | Horizontal        |
| **Analytics**   | Better (joins)       | Needs aggregation |

**Recommendation:** Use **SQL** for structured data and complex analytics.

---

## 6. URL Shortening Algorithms

### 6.1 Hash-Based (MD5, SHA256)

```javascript
const crypto = require('crypto');

function generateShortCode(longUrl) {
    const hash = crypto.createHash('md5')
        .update(longUrl)
        .digest('base64');
    
    // Take first 7 characters
    return hash.substring(0, 7).replace(/[+/=]/g, '');
}

// Example
generateShortCode('https://example.com/article/12345');
// → "a3fR9kL"
```

**Pros:**
- ✅ Fast
- ✅ Same URL → same short code (idempotent)

**Cons:**
- ❌ Collisions possible (multiple URLs → same hash)
- ❌ Need collision handling

**Collision handling:**
```javascript
async function shortenUrl(longUrl) {
    let shortCode = generateShortCode(longUrl);
    let suffix = 0;
    
    while (await db.exists(shortCode)) {
        // Collision - append suffix
        shortCode = generateShortCode(longUrl + suffix);
        suffix++;
    }
    
    await db.insert({ shortCode, longUrl });
    return shortCode;
}
```

### 6.2 Base62 Encoding

Convert integer ID to Base62 string.

**Base62:** [a-zA-Z0-9] = 62 characters

```javascript
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase62(num) {
    if (num === 0) return BASE62[0];
    
    let encoded = '';
    while (num > 0) {
        encoded = BASE62[num % 62] + encoded;
        num = Math.floor(num / 62);
    }
    return encoded;
}

function decodeBase62(str) {
    let num = 0;
    for (let char of str) {
        num = num * 62 + BASE62.indexOf(char);
    }
    return num;
}

// Example
encodeBase62(12345);  // → "3D7"
decodeBase62("3D7");  // → 12345

// With auto-increment ID
async function shortenUrl(longUrl) {
    const result = await db.insert({ longUrl });
    const id = result.insertId;
    const shortCode = encodeBase62(id);
    
    await db.update({ id }, { shortCode });
    return shortCode;
}
```

**How many URLs?**

```
7 characters, Base62:
62^7 = 3.5 trillion unique URLs
```

**Pros:**
- ✅ No collisions (unique ID)
- ✅ Short codes (7 chars for billions of URLs)
- ✅ Predictable length

**Cons:**
- ❌ Sequential (security concern)
- ❌ Database required for ID generation

### 6.3 Random String Generation

```javascript
function generateRandomCode(length = 7) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function shortenUrl(longUrl) {
    let shortCode;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
        shortCode = generateRandomCode();
        attempts++;
    } while (await db.exists(shortCode) && attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique code');
    }
    
    await db.insert({ shortCode, longUrl });
    return shortCode;
}
```

**Pros:**
- ✅ Non-sequential (secure)
- ✅ Simple

**Cons:**
- ❌ Collision checks required
- ❌ Multiple DB queries

### 6.4 Counter Range Allocation

Distribute ID ranges to servers.

```
Server 1: IDs 1 - 1,000,000
Server 2: IDs 1,000,001 - 2,000,000
Server 3: IDs 2,000,001 - 3,000,000

Each server generates short codes from its range
```

**Implementation:**

```javascript
class CounterService {
    constructor(serverId, rangeSize = 1000000) {
        this.serverId = serverId;
        this.rangeStart = serverId * rangeSize;
        this.rangeEnd = this.rangeStart + rangeSize;
        this.current = this.rangeStart;
    }
    
    getNextId() {
        if (this.current >= this.rangeEnd) {
            throw new Error('Range exhausted, request new range');
        }
        return this.current++;
    }
}

const counter = new CounterService(1);

async function shortenUrl(longUrl) {
    const id = counter.getNextId();
    const shortCode = encodeBase62(id);
    
    await db.insert({ id, shortCode, longUrl });
    return shortCode;
}
```

**Pros:**
- ✅ No collisions
- ✅ No coordination between servers
- ✅ High performance

---

## 7. High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Client                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌───────────────────────────────────────────────────────────────┐
│                    Load Balancer                              │
└───────────────────────┬───────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ App Server 1 │ │ App Server 2 │ │ App Server 3 │
└───────┬──────┘ └──────┬───────┘ └──────┬───────┘
        │               │                │
        └───────────────┼────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    Cache     │ │   Database   │ │  Analytics   │
│   (Redis)    │ │   (MySQL)    │ │   (ClickHouse)│
└──────────────┘ └──────────────┘ └──────────────┘
```

### Component Flow

**1. Shorten URL:**
```
Client → LB → App Server
              ↓
         Generate short code
              ↓
         Check DB for collision
              ↓
         Insert into DB
              ↓
         Return short URL
```

**2. Redirect:**
```
Client → LB → App Server
              ↓
         Check Cache (Redis)
              ├─ HIT → Return long URL → 302 Redirect
              └─ MISS → Query DB → Cache it → 302 Redirect
```

---

## 8. Detailed Component Design

### 8.1 URL Shortening Service

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const redis = require('redis');

const app = express();
const dbPool = mysql.createPool({ /* config */ });
const redisClient = redis.createClient();

app.use(express.json());

// Base62 encoding
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encodeBase62(num) {
    if (num === 0) return BASE62[0];
    let result = '';
    while (num > 0) {
        result = BASE62[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
}

// Shorten URL
app.post('/api/shorten', async (req, res) => {
    const { longUrl, customAlias, expiresAt } = req.body;
    
    // Validate URL
    try {
        new URL(longUrl);
    } catch {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    
    let shortCode;
    
    if (customAlias) {
        // Check if custom alias available
        const [existing] = await dbPool.query(
            'SELECT id FROM urls WHERE short_code = ?',
            [customAlias]
        );
        
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Alias already taken' });
        }
        
        shortCode = customAlias;
    } else {
        // Generate short code
        const [result] = await dbPool.query(
            'INSERT INTO urls (long_url, expires_at) VALUES (?, ?)',
            [longUrl, expiresAt || null]
        );
        
        shortCode = encodeBase62(result.insertId);
        
        // Update with short code
        await dbPool.query(
            'UPDATE urls SET short_code = ? WHERE id = ?',
            [shortCode, result.insertId]
        );
    }
    
    // Cache it
    await redisClient.setex(
        `url:${shortCode}`,
        3600, // 1 hour TTL
        longUrl
    );
    
    res.json({
        shortUrl: `https://short.url/${shortCode}`,
        shortCode,
        longUrl
    });
});

// Redirect
app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    
    try {
        // Check cache
        let longUrl = await redisClient.get(`url:${shortCode}`);
        
        if (!longUrl) {
            // Cache miss - query DB
            const [rows] = await dbPool.query(
                `SELECT long_url, expires_at 
                 FROM urls 
                 WHERE short_code = ? AND (expires_at IS NULL OR expires_at > NOW())`,
                [shortCode]
            );
            
            if (rows.length === 0) {
                return res.status(404).send('URL not found or expired');
            }
            
            longUrl = rows[0].long_url;
            
            // Cache it
            await redisClient.setex(`url:${shortCode}`, 3600, longUrl);
        }
        
        // Increment click count (async - don't block redirect)
        dbPool.query(
            'UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?',
            [shortCode]
        ).catch(console.error);
        
        // Track analytics (async)
        trackAnalytics(shortCode, req).catch(console.error);
        
        // Redirect
        res.redirect(302, longUrl);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Analytics tracking (async)
async function trackAnalytics(shortCode, req) {
    await dbPool.query(
        `INSERT INTO analytics (short_code, ip_address, country, referrer, user_agent)
         VALUES (?, ?, ?, ?, ?)`,
        [
            shortCode,
            req.ip,
            req.headers['cf-ipcountry'] || 'Unknown',
            req.headers.referer || 'Direct',
            req.headers['user-agent']
        ]
    );
}

app.listen(3000);
```

### 8.2 Analytics Service

```javascript
// Get analytics
app.get('/api/analytics/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    
    const [urlInfo] = await dbPool.query(
        'SELECT clicks, created_at FROM urls WHERE short_code = ?',
        [shortCode]
    );
    
    if (urlInfo.length === 0) {
        return res.status(404).json({ error: 'URL not found' });
    }
    
    // Get clicks by country
    const [byCountry] = await dbPool.query(
        `SELECT country, COUNT(*) as count
         FROM analytics
         WHERE short_code = ?
         GROUP BY country
         ORDER BY count DESC
         LIMIT 10`,
        [shortCode]
    );
    
    // Get clicks by referrer
    const [byReferrer] = await dbPool.query(
        `SELECT referrer, COUNT(*) as count
         FROM analytics
         WHERE short_code = ?
         GROUP BY referrer
         ORDER BY count DESC
         LIMIT 10`,
        [shortCode]
    );
    
    res.json({
        totalClicks: urlInfo[0].clicks,
        createdAt: urlInfo[0].created_at,
        clicksByCountry: byCountry.reduce((obj, row) => {
            obj[row.country] = row.count;
            return obj;
        }, {}),
        clicksByReferrer: byReferrer.reduce((obj, row) => {
            obj[row.referrer] = row.count;
            return obj;
        }, {})
    });
});
```

---

## 9. Scaling & Optimization

### 9.1 Database Sharding

Shard by short code hash.

```javascript
function getShardId(shortCode) {
    const hash = shortCode.charCodeAt(0);
    return hash % NUM_SHARDS;
}

function getDbConnection(shortCode) {
    const shardId = getShardId(shortCode);
    return dbPools[shardId];
}

// Use
const db = getDbConnection(shortCode);
const [rows] = await db.query('SELECT long_url FROM urls WHERE short_code = ?', [shortCode]);
```

### 9.2 Read Replicas

```javascript
// Write to master
await masterDb.query('INSERT INTO urls ...');

// Read from replica
const longUrl = await replicaDb.query('SELECT long_url FROM urls WHERE short_code = ?', [shortCode]);
```

### 9.3 CDN for Static Content

```html
<!-- Serve static assets from CDN -->
<script src="https://cdn.short.url/js/app.js"></script>
```

### 9.4 Rate Limiting

Prevent abuse.

```javascript
const rateLimit = require('express-rate-limit');

const createLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 min
    message: 'Too many URLs created, please try again later'
});

app.post('/api/shorten', createLimiter, async (req, res) => {
    // ... shorten logic
});
```

### 9.5 Cache Warming

Pre-populate cache with popular URLs.

```javascript
// Periodic job
setInterval(async () => {
    const [popularUrls] = await db.query(
        'SELECT short_code, long_url FROM urls ORDER BY clicks DESC LIMIT 1000'
    );
    
    for (const url of popularUrls) {
        await redis.setex(`url:${url.short_code}`, 3600, url.long_url);
    }
}, 3600000); // Every hour
```

---

## 📝 Summary

### Key Decisions

| Decision                  | Choice                               | Reason                     |
| ------------------------- | ------------------------------------ | -------------------------- |
| **Short code generation** | Base62 encoding of auto-increment ID | No collisions, predictable |
| **Database**              | SQL (MySQL)                          | Structured data, analytics |
| **Caching**               | Redis                                | Low-latency redirects      |
| **Analytics**             | Separate table/service               | Don't slow down redirects  |

### System Characteristics

- **Writes:** 38/sec → 190/sec peak
- **Reads:** 3850/sec → 19K/sec peak
- **Storage:** ~4 TB (5 years)
- **Latency:** < 100ms (with cache)
- **Availability:** 99.99% (load balancing + replication)

---

## 📝 Interview Discussion Points

1. **Short code algorithm:** Explain trade-offs (hash vs Base62 vs random)
2. **Caching strategy:** Cache-aside with Redis
3. **Database choice:** SQL for analytics vs NoSQL for simplicity
4. **Scalability:** Sharding, read replicas, CDN
5. **Analytics:** Separate service, don't block redirects
6. **Rate limiting:** Prevent abuse
7. **Expiration:** TTL on URLs, cleanup job
8. **Custom URLs:** Check availability, reserve popular ones

