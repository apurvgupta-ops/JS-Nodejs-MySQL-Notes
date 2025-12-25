# Day 15: Load Balancers, Reverse Proxy & CDN

## 📚 Table of Contents
1. What is a Load Balancer?
2. Load Balancing Algorithms
3. Types of Load Balancers
4. Reverse Proxy vs Forward Proxy
5. CDN (Content Delivery Network)
6. Health Checks & Failover
7. Practical Examples

---

## 1. What is a Load Balancer?

A **load balancer** distributes incoming traffic across multiple servers to:
- ✅ Prevent server overload
- ✅ Improve availability
- ✅ Enable horizontal scaling
- ✅ Reduce latency

### Without Load Balancer
```
Client → Server (single point of failure)
```
**Problems:**
- Server crashes → entire service down
- Limited capacity
- No scalability

### With Load Balancer
```
               Load Balancer
              /      |      \
          Server1  Server2  Server3
```
**Benefits:**
- High availability (if one fails, others handle traffic)
- Horizontal scaling (add more servers)
- Better performance (distribute load)

---

## 2. Load Balancing Algorithms

### 2.1 Round Robin

Distributes requests sequentially across servers.

```
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1 (cycle repeats)
```

**Pros:**
- ✅ Simple to implement
- ✅ Fair distribution

**Cons:**
- ❌ Doesn't consider server load
- ❌ All servers treated equally

**When to use:** Servers have similar capacity

### 2.2 Weighted Round Robin

Servers assigned weights based on capacity.

```
Server 1 (weight: 3) → Gets 3 requests
Server 2 (weight: 2) → Gets 2 requests
Server 3 (weight: 1) → Gets 1 request
```

**Use case:** Servers have different capacities

### 2.3 Least Connections

Routes to server with fewest active connections.

```
Server 1: 10 connections
Server 2: 5 connections  ← New request goes here
Server 3: 8 connections
```

**Pros:**
- ✅ Considers actual load
- ✅ Better for long-lived connections

**When to use:** WebSocket, streaming, long requests

### 2.4 IP Hash

Uses client IP to determine server.

```
hash(client_ip) % num_servers = server_id

Client A (IP: 192.168.1.10) → Always → Server 2
Client B (IP: 192.168.1.20) → Always → Server 1
```

**Pros:**
- ✅ Session persistence (same client → same server)
- ✅ Good for stateful applications

**Cons:**
- ❌ Uneven distribution if few clients

### 2.5 Least Response Time

Routes to server with lowest response time.

```
Server 1: 200ms average
Server 2: 150ms average ← New request
Server 3: 300ms average
```

**Use case:** Performance-critical applications

---

## 3. Types of Load Balancers

### Layer 4 (Transport Layer) Load Balancer

Operates at TCP/UDP level. Routes based on IP + Port.

```
Client → [Layer 4 LB] → Server
         (TCP/UDP)
```

**Characteristics:**
- Fast (no content inspection)
- Simple routing (IP/Port only)
- Cannot route based on URL path

**Example:**
```
All traffic on port 80 → Web servers
All traffic on port 443 → HTTPS servers
```

### Layer 7 (Application Layer) Load Balancer

Operates at HTTP level. Routes based on content.

```
Client → [Layer 7 LB] → Server
         (HTTP headers, URL, cookies)
```

**Capabilities:**
- Route by URL path
- Route by HTTP headers
- SSL termination
- Content-based routing

**Example:**
```
/api/* → API servers
/static/* → Static file servers
/admin/* → Admin servers
```

### Comparison

| Feature      | Layer 4         | Layer 7                     |
| ------------ | --------------- | --------------------------- |
| **Speed**    | Faster          | Slower (content inspection) |
| **Routing**  | IP/Port         | URL, Headers, Cookies       |
| **SSL**      | Pass-through    | Termination possible        |
| **Use Case** | High throughput | Complex routing             |

---

## 4. Reverse Proxy vs Forward Proxy

### Forward Proxy

Client-side proxy. Hides **client** identity.

```
Client → [Forward Proxy] → Internet → Server

Example: VPN, corporate proxy
```

**Use cases:**
- Bypass geo-restrictions
- Anonymity
- Content filtering
- Caching

### Reverse Proxy

Server-side proxy. Hides **server** identity.

```
Client → Internet → [Reverse Proxy] → Backend Servers

Example: Nginx, HAProxy, AWS ALB
```

**Use cases:**
- Load balancing
- SSL termination
- Caching
- Security (DDoS protection)
- Compression

### Key Differences

| Aspect       | Forward Proxy    | Reverse Proxy     |
| ------------ | ---------------- | ----------------- |
| **Location** | Client-side      | Server-side       |
| **Hides**    | Client IP        | Server IP         |
| **Purpose**  | Client anonymity | Server protection |
| **Example**  | VPN              | Nginx             |

---

## 5. CDN (Content Delivery Network)

CDN caches content at **edge locations** near users.

### Architecture

```
User in USA → [USA Edge Server] ──┐
                                   │
User in Europe → [EU Edge Server] ─┼─→ Origin Server
                                   │
User in Asia → [Asia Edge Server] ─┘
```

### How CDN Works

1. **User requests** static file (image, CSS, JS)
2. **DNS resolves** to nearest edge server
3. **Edge server checks** cache:
   - **Cache hit** → Return cached content (fast!)
   - **Cache miss** → Fetch from origin, cache, then return
4. **Subsequent requests** served from cache

### CDN Benefits

| Benefit                 | Impact                              |
| ----------------------- | ----------------------------------- |
| **Reduced Latency**     | Content served from nearby location |
| **Reduced Load**        | Origin handles fewer requests       |
| **Better Availability** | Redundant edge servers              |
| **DDoS Protection**     | Distributed infrastructure          |
| **Lower Bandwidth**     | Offload traffic from origin         |

### CDN Use Cases

**Static Assets:**
```html
<!-- Without CDN -->
<img src="https://myserver.com/logo.png">

<!-- With CDN -->
<img src="https://cdn.myserver.com/logo.png">
```

**Video Streaming:**
- Netflix, YouTube use CDN for video delivery
- Adaptive bitrate streaming

**API Caching:**
```javascript
// Cache API response at edge
GET /api/products
Cache-Control: public, max-age=3600
```

### Popular CDN Providers

- **Cloudflare** - Free tier, DDoS protection
- **AWS CloudFront** - Integrates with AWS
- **Akamai** - Enterprise-grade
- **Fastly** - Real-time purging

---

## 6. Health Checks & Failover

### Health Checks

Load balancer periodically checks server health.

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
    // Check database connection
    const dbHealthy = await checkDatabase();
    
    // Check critical services
    const redisHealthy = await checkRedis();
    
    if (dbHealthy && redisHealthy) {
        res.status(200).json({ status: 'healthy' });
    } else {
        res.status(503).json({ status: 'unhealthy' });
    }
});
```

### Health Check Types

**1. HTTP Health Check**
```
Load Balancer → GET /health → Server
                ← 200 OK ←
```

**2. TCP Health Check**
```
Load Balancer → TCP Connect → Server:3000
                ← Success ←
```

**3. Custom Health Check**
```javascript
// Check specific application logic
app.get('/health', async (req, res) => {
    const checks = {
        database: await db.ping(),
        cache: await redis.ping(),
        diskSpace: checkDiskSpace() > 0.1, // 10% free
        memory: process.memoryUsage().heapUsed < 1e9 // < 1GB
    };
    
    const healthy = Object.values(checks).every(c => c);
    res.status(healthy ? 200 : 503).json(checks);
});
```

### Failover

**Scenario:** Server crashes

```
Before:
LB → Server1 ✅
  → Server2 ✅
  → Server3 💥 (crashed)

After health check:
LB → Server1 ✅
  → Server2 ✅
  (Server3 removed from pool)
```

**Configuration:**
```nginx
# Nginx health check
upstream backend {
    server server1.com max_fails=3 fail_timeout=30s;
    server server2.com max_fails=3 fail_timeout=30s;
    server server3.com max_fails=3 fail_timeout=30s;
}

# After 3 failed attempts, mark server down for 30s
```

---

## 7. Practical Examples

### Example 1: Nginx as Load Balancer

```nginx
# nginx.conf

http {
    # Define backend servers
    upstream backend {
        # Least connections algorithm
        least_conn;
        
        server server1.com:3000 weight=3;
        server server2.com:3000 weight=2;
        server server3.com:3000 weight=1;
        
        # Health check
        server server4.com:3000 max_fails=3 fail_timeout=30s;
    }
    
    # Server block
    server {
        listen 80;
        server_name example.com;
        
        location / {
            proxy_pass http://backend;
            
            # Headers
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            
            # Timeouts
            proxy_connect_timeout 5s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
    }
}
```

### Example 2: Node.js Simple Load Balancer

```javascript
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

// Backend servers
const servers = [
    { host: 'localhost', port: 3001 },
    { host: 'localhost', port: 3002 },
    { host: 'localhost', port: 3003 }
];

let currentServer = 0;

// Round Robin load balancer
const loadBalancer = http.createServer((req, res) => {
    const target = servers[currentServer];
    
    console.log(`Routing to ${target.host}:${target.port}`);
    
    proxy.web(req, res, {
        target: `http://${target.host}:${target.port}`
    });
    
    // Next server (round robin)
    currentServer = (currentServer + 1) % servers.length;
});

// Error handling
proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
});

loadBalancer.listen(8000, () => {
    console.log('Load balancer running on port 8000');
});
```

### Example 3: HAProxy Configuration

```haproxy
# haproxy.cfg

global
    maxconn 4096
    
defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

# Frontend (entry point)
frontend http_front
    bind *:80
    default_backend http_back

# Backend (servers)
backend http_back
    balance roundrobin
    
    # Health check
    option httpchk GET /health
    http-check expect status 200
    
    # Servers
    server server1 192.168.1.10:3000 check
    server server2 192.168.1.11:3000 check
    server server3 192.168.1.12:3000 check

# Stats page
listen stats
    bind *:8080
    stats enable
    stats uri /stats
    stats refresh 30s
```

### Example 4: AWS Application Load Balancer (Terraform)

```hcl
# Create Application Load Balancer
resource "aws_lb" "main" {
  name               = "my-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = aws_subnet.public[*].id
}

# Target group
resource "aws_lb_target_group" "app" {
  name     = "app-target-group"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  
  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# Register targets
resource "aws_lb_target_group_attachment" "app" {
  count            = 3
  target_group_arn = aws_lb_target_group.app.arn
  target_id        = aws_instance.app[count.index].id
  port             = 3000
}
```

---

## Quick Reference

### Load Balancing Algorithms

| Algorithm             | Use Case                   |
| --------------------- | -------------------------- |
| **Round Robin**       | Equal capacity servers     |
| **Least Connections** | Long-lived connections     |
| **IP Hash**           | Session persistence        |
| **Weighted**          | Different capacity servers |

### Layer 4 vs Layer 7

| Feature      | Layer 4      | Layer 7      |
| ------------ | ------------ | ------------ |
| **Protocol** | TCP/UDP      | HTTP/HTTPS   |
| **Speed**    | Faster       | Slower       |
| **Routing**  | IP:Port      | URL, Headers |
| **SSL**      | Pass-through | Termination  |

### CDN Cache Headers

```http
# Cache for 1 hour
Cache-Control: public, max-age=3600

# Don't cache
Cache-Control: no-cache, no-store, must-revalidate

# Cache, but revalidate
Cache-Control: public, max-age=3600, must-revalidate
```

---

## 📝 Practice Tasks

1. **Draw diagram:** 3-tier architecture with load balancer
2. **Implement:** Simple round-robin load balancer in Node.js
3. **Configure:** Nginx as reverse proxy with health checks
4. **Design:** CDN strategy for a global e-commerce site

See `/tasks` folder for detailed exercises and solutions.
