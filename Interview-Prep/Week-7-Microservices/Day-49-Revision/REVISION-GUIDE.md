# Day 49: Microservices Revision & Mock Interview

## 📚 Week 7 Quick Recap

### Day 43: Microservices Basics
- Monolith vs Microservices architecture
- Service boundaries and domain-driven design
- Synchronous vs asynchronous communication
- Database per service pattern
- Saga pattern for distributed transactions

### Day 44: API Gateway & Service Registry
- API Gateway responsibilities (routing, auth, rate limiting)
- Service discovery with Consul
- Load balancing strategies (round-robin, least connections)
- Circuit breaker pattern for fault tolerance

### Day 45: Event-Driven Communication
- RabbitMQ (exchanges, queues, pub-sub)
- Redis Streams (consumer groups, acknowledgments)
- Event sourcing (storing events instead of state)
- Saga pattern (choreography vs orchestration)

### Day 46: Authentication Across Services
- JWT tokens (stateless, self-contained)
- Opaque tokens (centralized validation)
- Service-to-service authentication (API keys, mTLS)
- Token refresh strategies
- RBAC for authorization

### Day 47: Observability
- Three pillars: Logs, Metrics, Traces
- Centralized logging with ELK stack
- Metrics collection with Prometheus
- Distributed tracing with Jaeger
- Health checks and alerting

### Day 48: Mini Microservice System
- Users Service (authentication, user management)
- Orders Service (order management, event publishing)
- API Gateway (routing, authentication)
- RabbitMQ for event communication
- Docker Compose orchestration

---

## 🎯 10 Microservices Interview Questions

### 1. What is microservices architecture and when should you use it?

**Answer:**
Microservices is an architectural style where an application is built as a collection of small, independent services that communicate over a network. Each service:
- Runs in its own process
- Has its own database
- Can be deployed independently
- Is organized around business capabilities

**When to use:**
- ✅ Large, complex applications
- ✅ Different scaling needs for different features
- ✅ Multiple teams working independently
- ✅ Need for frequent, independent deployments

**When NOT to use:**
- ❌ Small applications or MVPs
- ❌ Small teams (< 5 developers)
- ❌ Limited operational expertise
- ❌ Simple CRUD applications

---

### 2. How do microservices communicate with each other?

**Answer:**

**Synchronous Communication:**
- **REST APIs:** HTTP request-response
- **gRPC:** High-performance RPC with Protocol Buffers
- **GraphQL:** Query language for APIs

**Asynchronous Communication:**
- **Message Queues:** RabbitMQ, Kafka
- **Event Streaming:** Redis Streams
- **Pub-Sub:** Event-driven architecture

**Example:**
```typescript
// Synchronous
const user = await axios.get('http://users-service/users/123');

// Asynchronous
await rabbitmq.publish('ORDER_CREATED', { orderId: '123' });
```

**Recommendation:** Use synchronous for real-time queries, asynchronous for background tasks and event notifications.

---

### 3. What is the API Gateway pattern and why is it important?

**Answer:**

**API Gateway** is a single entry point for all client requests. It routes requests to appropriate microservices.

**Responsibilities:**
- **Request Routing:** `/users/*` → Users Service
- **Authentication:** Verify JWT tokens
- **Rate Limiting:** Limit requests per client
- **Load Balancing:** Distribute across service instances
- **Response Aggregation:** Combine responses from multiple services
- **Protocol Translation:** REST to gRPC

**Benefits:**
- ✅ Single point of entry
- ✅ Simplified client code
- ✅ Centralized security
- ✅ Reduced round trips

**Example:**
```typescript
// Without Gateway: Client makes 3 requests
GET /users/123
GET /orders/user/123
GET /products/123

// With Gateway: Client makes 1 request
GET /api/user-dashboard/123
→ Gateway aggregates all data
```

---

### 4. How do you handle distributed transactions in microservices?

**Answer:**

Since each microservice has its own database, traditional ACID transactions don't work. Solutions:

**1. Saga Pattern**

**Choreography-Based:**
- Each service publishes events
- Other services listen and react
- No central coordinator

```typescript
// Order Service: Publishes ORDER_CREATED
// Inventory Service: Listens, reserves inventory, publishes INVENTORY_RESERVED
// Payment Service: Listens, processes payment, publishes PAYMENT_PROCESSED
```

**Orchestration-Based:**
- Central orchestrator coordinates saga
- Orchestrator calls services sequentially
- Handles compensating transactions

```typescript
class OrderSaga {
  async execute(orderData) {
    const orderId = await createOrder(orderData);
    try {
      await reserveInventory(orderId);
      await processPayment(orderId);
      await confirmOrder(orderId);
    } catch (error) {
      // Compensating transactions
      await releaseInventory(orderId);
      await cancelOrder(orderId);
    }
  }
}
```

**2. Event Sourcing**
- Store sequence of events instead of current state
- Can rebuild state by replaying events

**3. Two-Phase Commit (2PC)**
- Rarely used in microservices (blocking, slow)
- Only for critical transactions

---

### 5. Explain the difference between JWT and opaque tokens.

**Answer:**

**JWT (JSON Web Token):**
```
Structure: Header.Payload.Signature
Stateless: Self-contained, no database lookup
Size: Large (300-500 bytes)
Revocation: Can't revoke before expiration
Validation: Each service validates independently
```

**Opaque Token:**
```
Structure: Random string (e.g., "a1b2c3d4e5")
Stateful: Requires lookup in database/Redis
Size: Small (32-64 bytes)
Revocation: Immediate (delete from store)
Validation: Centralized (auth service)
```

**Comparison:**
```typescript
// JWT
const decoded = jwt.verify(token, SECRET);
// No database call, fast

// Opaque
const userData = await redis.get(`token:${token}`);
// Requires lookup, slower but revocable
```

**When to use:**
- **JWT:** High performance, short-lived tokens
- **Opaque:** Sensitive operations, need instant revocation

---

### 6. What is service discovery and why is it needed?

**Answer:**

**Problem:**
```typescript
// Hardcoded URLs - what if service moves or scales?
const USERS_SERVICE = 'http://10.0.1.5:3001';
const ORDERS_SERVICE = 'http://10.0.1.6:3002';
```

**Solution: Service Registry**

Services register themselves on startup:
```typescript
// Users Service registers
consul.register({
  name: 'users-service',
  address: '10.0.1.5',
  port: 3001,
  health: 'http://10.0.1.5:3001/health'
});
```

API Gateway discovers services dynamically:
```typescript
// Gateway queries registry
const instances = await consul.getService('users-service');
// Returns: [{ address: '10.0.1.5', port: 3001 }, ...]

const instance = loadBalancer.choose(instances);
await axios.get(`http://${instance.address}:${instance.port}/users`);
```

**Tools:** Consul, Eureka, etcd, Kubernetes Service Discovery

---

### 7. How do you implement observability in microservices?

**Answer:**

**Three Pillars:**

**1. Logging (What happened?)**
```typescript
logger.info('Order created', { 
  orderId: '123', 
  userId: '456', 
  total: 100 
});
```
- Centralized logging (ELK stack)
- Structured JSON logs
- Correlation IDs for tracing requests

**2. Metrics (How much/many?)**
```typescript
httpRequestDuration.observe({ method: 'POST', route: '/orders' }, duration);
httpRequestTotal.inc({ method: 'POST', status: 201 });
```
- Prometheus for collection
- Grafana for visualization
- Key metrics: request rate, error rate, latency

**3. Distributed Tracing (Where's the bottleneck?)**
```typescript
const span = tracer.startSpan('create_order');
span.setAttribute('user.id', userId);
// ... do work
span.end();
```
- Jaeger or Zipkin for tracing
- OpenTelemetry for instrumentation
- Trace requests across services

**Complete Setup:**
```yaml
- Elasticsearch + Kibana (logs)
- Prometheus + Grafana (metrics)
- Jaeger (traces)
- Alertmanager (alerts)
```

---

### 8. What are the challenges of microservices and how do you address them?

**Answer:**

| Challenge                          | Solution                                    |
| ---------------------------------- | ------------------------------------------- |
| **Distributed System Complexity**  | Service mesh (Istio), observability tools   |
| **Data Consistency**               | Saga pattern, event sourcing                |
| **Network Latency**                | Caching, async communication                |
| **Testing Complexity**             | Contract testing, consumer-driven contracts |
| **Deployment Complexity**          | CI/CD, Docker, Kubernetes                   |
| **Debugging Distributed Failures** | Distributed tracing, correlation IDs        |
| **Service Discovery**              | Service registry (Consul, Kubernetes)       |
| **Security**                       | API Gateway, service mesh, mTLS             |
| **Monitoring**                     | Centralized logging, metrics, tracing       |

---

### 9. How do you handle authentication and authorization in microservices?

**Answer:**

**Authentication:**

**1. API Gateway Pattern**
```typescript
// Gateway validates token
const user = jwt.verify(token, SECRET);

// Passes user info to services
axios.get('http://orders-service/orders', {
  headers: { 'X-User-ID': user.id, 'X-User-Role': user.role }
});
```

**2. Token Propagation**
```typescript
// Service validates token independently
const user = jwt.verify(token, SECRET);
```

**Authorization:**

**1. RBAC (Role-Based Access Control)**
```typescript
function requirePermission(permission: string) {
  return (req, res, next) => {
    if (!rbac.can(req.user.role, permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

app.delete('/orders/:id', requirePermission('orders:delete'), handler);
```

**2. Service-to-Service Auth**
```typescript
// API Keys
headers: { 'X-API-Key': SERVICE_API_KEY }

// mTLS (Mutual TLS)
// Certificate-based authentication
```

---

### 10. Design a microservices architecture for an e-commerce platform.

**Answer:**

**Services:**

```
1. Users Service
   - User registration/login
   - Profile management
   - DB: PostgreSQL

2. Products Service
   - Product catalog
   - Search and filtering
   - DB: PostgreSQL + Elasticsearch

3. Orders Service
   - Order creation
   - Order history
   - DB: PostgreSQL

4. Inventory Service
   - Stock management
   - Reservation
   - DB: PostgreSQL

5. Payments Service
   - Payment processing
   - Refunds
   - DB: PostgreSQL

6. Notifications Service
   - Email/SMS notifications
   - Event consumer
   - DB: MongoDB (logs)

7. Cart Service
   - Shopping cart
   - DB: Redis (session-based)
```

**Communication:**

```
Synchronous (REST):
- API Gateway → All services
- Orders → Users (verify user)
- Orders → Inventory (check stock)

Asynchronous (RabbitMQ):
- Orders → ORDER_CREATED event
- Inventory → Listens, reserves stock
- Payments → Listens, processes payment
- Notifications → Listens, sends confirmation
```

**Architecture Diagram:**

```
                    ┌─────────────┐
                    │ API Gateway │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌─────▼─────┐     ┌─────▼─────┐
   │  Users  │       │  Products │     │   Orders  │
   └─────────┘       └───────────┘     └─────┬─────┘
                                              │
                                         RabbitMQ
                                              │
                    ┌─────────────────────────┼─────────────┐
                    │                         │             │
              ┌─────▼─────┐           ┌──────▼──────┐  ┌──▼───────┐
              │ Inventory │           │  Payments   │  │ Notifs   │
              └───────────┘           └─────────────┘  └──────────┘
```

**Key Decisions:**
- API Gateway for client requests
- Event-driven for order processing (saga pattern)
- Redis for cart (fast, session-based)
- Elasticsearch for product search
- Separate databases per service
- Observability with Prometheus + Jaeger

---

## 🎭 Mock Interview Scenarios

### Scenario 1: Design a notification system
**Question:** Design a microservices-based notification system that sends emails, SMS, and push notifications.

**Expected Answer:**
- Notification Service (event consumer)
- Email Service, SMS Service, Push Service (specialized workers)
- RabbitMQ with fanout exchange (broadcast to all channels)
- Template management
- Retry logic with dead letter queue
- Observability for delivery tracking

### Scenario 2: Handle service failure
**Question:** What happens if the Payments Service is down when processing an order?

**Expected Answer:**
- Circuit breaker opens after 5 failures
- Return error to user or queue for retry
- Saga compensating transactions (release inventory, cancel order)
- Fallback options (manual payment link)
- Monitoring and alerts

### Scenario 3: Scale specific service
**Question:** Orders Service is getting 10x more traffic. How do you scale it?

**Expected Answer:**
- Horizontal scaling (deploy more instances)
- Load balancer distributes traffic
- Database read replicas
- Caching with Redis
- Async processing with queues
- Metrics to monitor performance

---

## ✅ Week 7 Mastery Checklist

- [ ] Can explain microservices benefits and drawbacks
- [ ] Designed service boundaries for complex domain
- [ ] Implemented API Gateway with authentication
- [ ] Set up service discovery with Consul
- [ ] Built event-driven communication with RabbitMQ
- [ ] Implemented distributed authentication (JWT/opaque tokens)
- [ ] Added observability (logs, metrics, traces)
- [ ] Built complete microservice system (Users + Orders + Gateway)
- [ ] Answered 10 microservices interview questions
- [ ] Completed mock interview scenarios

---

## 🎯 Final Tips for Interviews

1. **Start with Why:** Always explain why microservices (or not)
2. **Trade-offs:** Discuss pros AND cons
3. **Draw Diagrams:** Visual explanations are powerful
4. **Real Examples:** Reference your Day 48 project
5. **Observability:** Always mention monitoring and logging
6. **Failure Scenarios:** Discuss what happens when services fail
7. **Data Consistency:** Understand saga pattern thoroughly
8. **Authentication:** Know JWT vs opaque tokens
9. **Communication:** Sync vs async trade-offs
10. **Scaling:** Know how to scale individual services

---

**Congratulations on completing Week 7: Microservices Architecture!** 🎉

You now have production-ready microservices knowledge covering architecture, communication, authentication, and observability.
