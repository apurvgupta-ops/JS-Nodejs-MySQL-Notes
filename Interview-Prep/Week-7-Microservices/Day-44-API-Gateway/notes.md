# Day 44: API Gateway & Service Registry

## 📚 Table of Contents
1. Introduction to API Gateway
2. API Gateway Patterns
3. Implementing API Gateway
4. Service Registry & Discovery
5. Load Balancing Strategies
6. Complete Implementation

---

## 1. Introduction to API Gateway

**API Gateway** is a single entry point for all client requests to microservices.

### Why API Gateway?

```
Without API Gateway:
┌────────┐
│ Client │────────────┐
└────────┘            │
                      ├──► Users Service (3001)
                      ├──► Orders Service (3002)
                      ├──► Products Service (3003)
                      └──► Payments Service (3004)

❌ Client needs to know all service URLs
❌ CORS issues for browser clients
❌ No centralized authentication
❌ No rate limiting
```

```
With API Gateway:
┌────────┐
│ Client │────────────► API Gateway (3000)
└────────┘                    │
                              ├──► Users Service
                              ├──► Orders Service
                              ├──► Products Service
                              └──► Payments Service

✅ Single entry point
✅ Centralized authentication
✅ Rate limiting
✅ Request routing
```

### API Gateway Responsibilities

```typescript
API Gateway handles:
✅ Request Routing        - Route /users/* to Users Service
✅ Authentication         - Verify JWT tokens
✅ Rate Limiting          - Limit requests per client
✅ Request/Response Transform - Modify headers, body
✅ Caching               - Cache frequent responses
✅ Load Balancing        - Distribute requests across instances
✅ Circuit Breaking      - Stop calling failing services
✅ Logging & Monitoring  - Centralized request logging
```

---

## 2. API Gateway Patterns

### 1. Simple Proxy Pattern

```typescript
// api-gateway/src/index.ts
import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// Route to Users Service
app.use('/users', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://users-service:3001${req.url}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
});

// Route to Orders Service
app.use('/orders', async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://orders-service:3002${req.url}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
```

### 2. Route Configuration Pattern

```typescript
// api-gateway/src/config/routes.ts
export const routes = [
  {
    path: '/users',
    target: 'http://users-service:3001',
    auth: false
  },
  {
    path: '/orders',
    target: 'http://orders-service:3002',
    auth: true,
    rateLimit: { windowMs: 60000, max: 100 }
  },
  {
    path: '/products',
    target: 'http://products-service:3003',
    auth: false,
    cache: { ttl: 300 } // 5 minutes
  },
  {
    path: '/payments',
    target: 'http://payments-service:3004',
    auth: true,
    rateLimit: { windowMs: 60000, max: 10 }
  }
];
```

```typescript
// api-gateway/src/index.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { routes } from './config/routes';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';

const app = express();

routes.forEach(route => {
  const middlewares = [];

  // Add auth middleware if required
  if (route.auth) {
    middlewares.push(authMiddleware);
  }

  // Add rate limiting if configured
  if (route.rateLimit) {
    middlewares.push(rateLimitMiddleware(route.rateLimit));
  }

  // Create proxy
  app.use(
    route.path,
    ...middlewares,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      pathRewrite: {
        [`^${route.path}`]: ''
      }
    })
  );
});

app.listen(3000);
```

---

## 3. Implementing API Gateway

### Complete API Gateway with Features

```typescript
// api-gateway/src/index.ts
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';

const app = express();
const redis = new Redis();

app.use(express.json());

// Middleware: Authentication
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware: Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later'
});

// Middleware: Cache
const cacheMiddleware = (ttl: number) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `cache:${req.originalUrl}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Store original send
    const originalSend = res.json.bind(res);
    res.json = (data: any) => {
      redis.setex(cacheKey, ttl, JSON.stringify(data));
      return originalSend(data);
    };

    next();
  };
};

// Proxy function
async function proxyRequest(
  req: express.Request,
  res: express.Response,
  targetUrl: string
) {
  try {
    const response = await axios({
      method: req.method,
      url: `${targetUrl}${req.url}`,
      data: req.body,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host
      }
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Service unavailable'
    });
  }
}

// Routes
app.use('/users', limiter, (req, res) => {
  proxyRequest(req, res, 'http://users-service:3001');
});

app.use('/orders', authenticate, limiter, (req, res) => {
  proxyRequest(req, res, 'http://orders-service:3002');
});

app.use('/products', limiter, cacheMiddleware(300), (req, res) => {
  proxyRequest(req, res, 'http://products-service:3003');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'api-gateway' });
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
```

### Circuit Breaker Pattern

```typescript
// api-gateway/src/utils/circuitBreaker.ts
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const usersServiceBreaker = new CircuitBreaker(5, 60000);

app.use('/users', async (req, res) => {
  try {
    await usersServiceBreaker.execute(() =>
      proxyRequest(req, res, 'http://users-service:3001')
    );
  } catch (error) {
    res.status(503).json({ error: 'Service temporarily unavailable' });
  }
});
```

---

## 4. Service Registry & Discovery

### Why Service Discovery?

```
Problem: Hardcoded service URLs
❌ const USERS_SERVICE = 'http://users-service:3001';
❌ What if service moves to different host?
❌ What if we have multiple instances?

Solution: Service Registry
✅ Services register themselves on startup
✅ Gateway queries registry for service locations
✅ Supports multiple instances with load balancing
```

### Service Registry with Consul

```typescript
// services/users/src/consul.ts
import Consul from 'consul';

const consul = new Consul({
  host: 'consul',
  port: 8500
});

export async function registerService() {
  const serviceName = 'users-service';
  const serviceId = `${serviceName}-${process.env.HOSTNAME}`;
  const port = parseInt(process.env.PORT || '3001');

  await consul.agent.service.register({
    id: serviceId,
    name: serviceName,
    address: process.env.HOSTNAME,
    port,
    check: {
      http: `http://${process.env.HOSTNAME}:${port}/health`,
      interval: '10s',
      timeout: '5s'
    }
  });

  console.log(`Registered ${serviceName} with Consul`);

  // Deregister on shutdown
  process.on('SIGINT', async () => {
    await consul.agent.service.deregister(serviceId);
    process.exit();
  });
}
```

```typescript
// services/users/src/index.ts
import express from 'express';
import { registerService } from './consul';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(3001, async () => {
  await registerService();
  console.log('Users service running on 3001');
});
```

### Service Discovery in API Gateway

```typescript
// api-gateway/src/serviceDiscovery.ts
import Consul from 'consul';

const consul = new Consul({
  host: 'consul',
  port: 8500
});

export async function getServiceUrl(serviceName: string): Promise<string> {
  const services = await consul.health.service({
    service: serviceName,
    passing: true
  });

  if (services.length === 0) {
    throw new Error(`No healthy instances of ${serviceName}`);
  }

  // Simple round-robin
  const randomIndex = Math.floor(Math.random() * services.length);
  const instance = services[randomIndex];

  return `http://${instance.Service.Address}:${instance.Service.Port}`;
}
```

```typescript
// api-gateway/src/index.ts
import { getServiceUrl } from './serviceDiscovery';

app.use('/users', async (req, res) => {
  try {
    const serviceUrl = await getServiceUrl('users-service');
    await proxyRequest(req, res, serviceUrl);
  } catch (error) {
    res.status(503).json({ error: 'Service unavailable' });
  }
});
```

---

## 5. Load Balancing Strategies

### Client-Side Load Balancing

```typescript
// api-gateway/src/loadBalancer.ts
class LoadBalancer {
  private currentIndex = 0;

  // Round Robin
  roundRobin(instances: string[]): string {
    const instance = instances[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % instances.length;
    return instance;
  }

  // Random
  random(instances: string[]): string {
    return instances[Math.floor(Math.random() * instances.length)];
  }

  // Least Connections (requires tracking)
  private connections = new Map<string, number>();

  leastConnections(instances: string[]): string {
    let minConnections = Infinity;
    let selectedInstance = instances[0];

    for (const instance of instances) {
      const count = this.connections.get(instance) || 0;
      if (count < minConnections) {
        minConnections = count;
        selectedInstance = instance;
      }
    }

    return selectedInstance;
  }

  incrementConnections(instance: string) {
    this.connections.set(instance, (this.connections.get(instance) || 0) + 1);
  }

  decrementConnections(instance: string) {
    const count = this.connections.get(instance) || 0;
    this.connections.set(instance, Math.max(0, count - 1));
  }
}

// Usage
const loadBalancer = new LoadBalancer();

app.use('/users', async (req, res) => {
  const instances = await getServiceInstances('users-service');
  const instance = loadBalancer.roundRobin(instances);
  
  await proxyRequest(req, res, instance);
});
```

---

## 6. Complete Implementation

### Docker Compose with Consul

```yaml
# docker-compose.yml
version: '3.8'

services:
  consul:
    image: consul:latest
    ports:
      - "8500:8500"
    command: agent -server -ui -bootstrap-expect=1 -client=0.0.0.0

  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      CONSUL_HOST: consul
      JWT_SECRET: your-secret-key
    depends_on:
      - consul
      - users-service
      - orders-service

  users-service:
    build: ./services/users
    environment:
      CONSUL_HOST: consul
      PORT: 3001
    depends_on:
      - consul
      - users-db
    deploy:
      replicas: 2

  orders-service:
    build: ./services/orders
    environment:
      CONSUL_HOST: consul
      PORT: 3002
    depends_on:
      - consul
      - orders-db
    deploy:
      replicas: 2

  users-db:
    image: postgres:15
    environment:
      POSTGRES_DB: users

  orders-db:
    image: postgres:15
    environment:
      POSTGRES_DB: orders
```

### Kong API Gateway (Production Alternative)

```yaml
# kong.yml
_format_version: "2.1"

services:
  - name: users-service
    url: http://users-service:3001
    routes:
      - name: users-route
        paths:
          - /users
    plugins:
      - name: rate-limiting
        config:
          minute: 100

  - name: orders-service
    url: http://orders-service:3002
    routes:
      - name: orders-route
        paths:
          - /orders
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 50
```

---

## 📝 Practice Tasks

### Task 1: Build API Gateway
Create API Gateway with:
- Route to 3 services
- JWT authentication
- Rate limiting (100 req/min)
- Caching for GET requests

### Task 2: Implement Circuit Breaker
Add circuit breaker:
- Open after 5 failures
- Half-open after 60 seconds
- Log state changes

### Task 3: Service Discovery
Integrate Consul:
- Services register on startup
- Gateway discovers services
- Round-robin load balancing

---

## 🔗 Quick Reference

| Component            | Purpose             | Example                         |
| -------------------- | ------------------- | ------------------------------- |
| **API Gateway**      | Single entry point  | Express + http-proxy-middleware |
| **Service Registry** | Service discovery   | Consul, Eureka                  |
| **Load Balancer**    | Distribute requests | Round-robin, least connections  |
| **Circuit Breaker**  | Fault tolerance     | Open/Closed/Half-Open states    |

**Next:** Day 45 - Event-Driven Communication
