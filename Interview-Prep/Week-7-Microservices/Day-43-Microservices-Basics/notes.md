# Day 43: Microservices Basics

## 📚 Table of Contents
1. Introduction to Microservices
2. Monolith vs Microservices
3. Service Boundaries
4. Communication Patterns
5. Data Management
6. Building Your First Microservice

---

## 1. Introduction to Microservices

**Microservices architecture** is an approach to building applications as a collection of small, independent services that communicate over a network.

### Core Characteristics

✅ **Small and Focused** - Each service does one thing well  
✅ **Independently Deployable** - Can deploy without affecting other services  
✅ **Loosely Coupled** - Services have minimal dependencies  
✅ **Technology Agnostic** - Each service can use different tech stack  
✅ **Organized Around Business Capabilities** - Services map to business domains  

### Benefits

```
✅ Independent Scaling     - Scale only what needs scaling
✅ Fault Isolation        - One service failure doesn't crash entire system
✅ Technology Flexibility - Use best tool for each service
✅ Faster Development     - Small teams work independently
✅ Easier Understanding   - Smaller codebases are easier to grasp
```

### Challenges

```
❌ Distributed System Complexity  - Network calls, latency, failures
❌ Data Consistency               - No single database transaction
❌ Testing Complexity             - Integration testing is harder
❌ Operational Overhead           - More services to deploy/monitor
❌ Network Overhead               - Inter-service communication latency
```

---

## 2. Monolith vs Microservices

### Monolithic Architecture

```
┌─────────────────────────────────┐
│      Single Application         │
│                                 │
│  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │  Orders  │   │
│  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐   │
│  │ Products │  │ Payments │   │
│  └──────────┘  └──────────┘   │
│                                 │
│      Single Database            │
└─────────────────────────────────┘
```

**Pros:**
- Simple to develop and test
- Easy to deploy (single unit)
- Single database transaction

**Cons:**
- Tight coupling
- Hard to scale specific features
- Long deployment cycles
- Technology lock-in

### Microservices Architecture

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Users     │   │   Orders    │   │  Products   │
│   Service   │◄─►│   Service   │◄─►│   Service   │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                  │
    ┌──▼───┐         ┌──▼───┐          ┌──▼───┐
    │  DB  │         │  DB  │          │  DB  │
    └──────┘         └──────┘          └──────┘

         ▲                ▲                 ▲
         └────────────────┴─────────────────┘
              Message Queue / API Calls
```

**Pros:**
- Independent deployment
- Technology flexibility
- Better fault isolation
- Team autonomy

**Cons:**
- Distributed system complexity
- Data consistency challenges
- More operational overhead

### When to Use Microservices

✅ **Use Microservices when:**
- Application is large and complex
- Different parts have different scaling needs
- Multiple teams working on different features
- Need to deploy features independently
- Long-term maintenance expected

❌ **Avoid Microservices when:**
- Starting a new product (start with monolith)
- Small team (< 5 developers)
- Simple CRUD application
- Limited operational expertise
- Tight budget

---

## 3. Service Boundaries

### Domain-Driven Design (DDD)

**Bounded Context** - A boundary within which a particular domain model applies.

```typescript
// E-Commerce Domain

// ❌ BAD: Single service handling everything
class ECommerceService {
  createUser() {}
  createOrder() {}
  manageInventory() {}
  processPayment() {}
}

// ✅ GOOD: Separate services with clear boundaries
class UserService {
  createUser() {}
  getUser() {}
  updateUser() {}
}

class OrderService {
  createOrder() {}
  getOrder() {}
  updateOrderStatus() {}
}

class InventoryService {
  checkAvailability() {}
  reserveItem() {}
  releaseItem() {}
}

class PaymentService {
  processPayment() {}
  refund() {}
}
```

### Identifying Service Boundaries

**1. Business Capabilities**
```
E-Commerce Platform
├── User Management (Users Service)
├── Product Catalog (Products Service)
├── Order Processing (Orders Service)
├── Payment Processing (Payments Service)
├── Inventory Management (Inventory Service)
└── Notifications (Notifications Service)
```

**2. Data Ownership**
```
Users Service owns:
- users table
- user_profiles table
- user_preferences table

Orders Service owns:
- orders table
- order_items table
- order_history table
```

**3. Rate of Change**
```
High Change:     Product Catalog → Separate service
Medium Change:   Order Processing → Separate service
Low Change:      User Management → Can be combined
```

### Example: E-Commerce Service Design

```typescript
// services/users/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// User service endpoints
app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id }
  });
  res.json(user);
});

app.listen(3001, () => {
  console.log('Users service running on port 3001');
});
```

```typescript
// services/orders/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Order service endpoints
app.post('/orders', async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Call Users service to verify user
    const userResponse = await axios.get(`http://users-service:3001/users/${userId}`);
    
    if (!userResponse.data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        items: {
          create: items
        }
      },
      include: { items: true }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.listen(3002, () => {
  console.log('Orders service running on port 3002');
});
```

---

## 4. Communication Patterns

### Synchronous Communication

**REST API** - Request-response over HTTP

```typescript
// services/orders/index.ts
import axios from 'axios';

// Synchronous call to Users service
async function getUserDetails(userId: string) {
  try {
    const response = await axios.get(`http://users-service:3001/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

app.post('/orders', async (req, res) => {
  const { userId, items } = req.body;
  
  // Synchronous call - waits for response
  const user = await getUserDetails(userId);
  
  const order = await createOrder(userId, items);
  res.json(order);
});
```

**Pros:**
- Simple to understand
- Immediate response
- Easy to debug

**Cons:**
- Tight coupling
- If Users service is down, Orders service fails
- Slower due to network latency

### Asynchronous Communication

**Message Queue** - Publish events, other services consume

```typescript
// services/orders/index.ts
import amqp from 'amqplib';

let channel: amqp.Channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue('order_events');
}

app.post('/orders', async (req, res) => {
  const order = await prisma.order.create({
    data: req.body
  });

  // Publish event asynchronously
  channel.sendToQueue('order_events', Buffer.from(JSON.stringify({
    event: 'ORDER_CREATED',
    orderId: order.id,
    userId: order.userId
  })));

  // Return immediately
  res.json(order);
});
```

```typescript
// services/notifications/consumer.ts
import amqp from 'amqplib';

async function startConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  
  await channel.assertQueue('order_events');
  
  channel.consume('order_events', async (msg) => {
    if (msg) {
      const event = JSON.parse(msg.content.toString());
      
      if (event.event === 'ORDER_CREATED') {
        await sendNotification(event.userId, event.orderId);
      }
      
      channel.ack(msg);
    }
  });
}
```

**Pros:**
- Loose coupling
- Services don't need to be online simultaneously
- Better fault tolerance

**Cons:**
- More complex
- Eventual consistency
- Harder to debug

---

## 5. Data Management

### Database Per Service Pattern

Each service owns its database - no direct database access from other services.

```
┌─────────────────┐         ┌─────────────────┐
│  Users Service  │         │ Orders Service  │
│                 │         │                 │
│  ┌───────────┐  │         │  ┌───────────┐  │
│  │ Users DB  │  │         │  │ Orders DB │  │
│  └───────────┘  │         │  └───────────┘  │
└─────────────────┘         └─────────────────┘
```

**Benefits:**
- Service autonomy
- Independent scaling
- Technology flexibility

**Challenges:**
- No ACID transactions across services
- Data duplication
- Eventual consistency

### Handling Distributed Transactions

**Saga Pattern** - Break transaction into local transactions with compensating actions.

```typescript
// Order Saga Example
class OrderSaga {
  async createOrder(userId: string, items: any[]) {
    let orderId: string;
    
    try {
      // Step 1: Create order
      orderId = await this.ordersService.createOrder(userId, items);
      
      // Step 2: Reserve inventory
      await this.inventoryService.reserveItems(orderId, items);
      
      // Step 3: Process payment
      await this.paymentService.processPayment(orderId);
      
      // Step 4: Update order status
      await this.ordersService.updateStatus(orderId, 'CONFIRMED');
      
      return orderId;
    } catch (error) {
      // Compensating transactions (rollback)
      if (orderId) {
        await this.inventoryService.releaseItems(orderId);
        await this.ordersService.updateStatus(orderId, 'CANCELLED');
      }
      throw error;
    }
  }
}
```

### Data Consistency Patterns

**1. Event Sourcing**
```typescript
// Store events instead of current state
const events = [
  { type: 'ORDER_CREATED', orderId: '123', timestamp: '...' },
  { type: 'PAYMENT_PROCESSED', orderId: '123', timestamp: '...' },
  { type: 'ORDER_SHIPPED', orderId: '123', timestamp: '...' }
];

// Rebuild state by replaying events
function getOrderState(orderId: string) {
  return events
    .filter(e => e.orderId === orderId)
    .reduce((state, event) => applyEvent(state, event), {});
}
```

**2. CQRS (Command Query Responsibility Segregation)**
```typescript
// Write Model (Commands)
class OrderCommandService {
  async createOrder(data: CreateOrderDTO) {
    const order = await this.ordersRepo.create(data);
    await this.eventBus.publish('ORDER_CREATED', order);
    return order;
  }
}

// Read Model (Queries) - Optimized for reading
class OrderQueryService {
  async getOrder(orderId: string) {
    // Read from denormalized view
    return this.orderViewRepo.findOne(orderId);
  }
  
  async getUserOrders(userId: string) {
    // Read from user-orders materialized view
    return this.userOrdersViewRepo.findByUser(userId);
  }
}
```

---

## 6. Building Your First Microservice

### Project Structure

```
microservices-demo/
├── services/
│   ├── users/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   └── prisma/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── orders/
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   └── prisma/
│       ├── package.json
│       └── Dockerfile
└── docker-compose.yml
```

### Complete Example

```typescript
// services/users/src/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'users' });
});

// Create user
app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user
app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.listen(PORT, () => {
  console.log(`Users service running on port ${PORT}`);
});
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  users-service:
    build: ./services/users
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://user:password@users-db:5432/users
    depends_on:
      - users-db

  orders-service:
    build: ./services/orders
    ports:
      - "3002:3002"
    environment:
      DATABASE_URL: postgresql://user:password@orders-db:5432/orders
      USERS_SERVICE_URL: http://users-service:3001
    depends_on:
      - orders-db

  users-db:
    image: postgres:15
    environment:
      POSTGRES_DB: users
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password

  orders-db:
    image: postgres:15
    environment:
      POSTGRES_DB: orders
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
```

---

## 📝 Practice Tasks

### Task 1: Design Service Boundaries
Design service boundaries for a food delivery platform with:
- Customers
- Restaurants
- Orders
- Delivery tracking
- Payments

Identify:
- Service names
- Data ownership
- Communication patterns

### Task 2: Build Two Services
Create Users and Products services:
- Users: CRUD operations
- Products: CRUD operations
- Products service calls Users service to verify owner
- Use Docker Compose

### Task 3: Implement Saga Pattern
Build order creation saga:
1. Create order
2. Reserve inventory
3. Process payment
4. Send confirmation
With compensating transactions for failures.

---

## 🔗 Quick Reference

| Pattern                  | Use Case                 | Pros            | Cons             |
| ------------------------ | ------------------------ | --------------- | ---------------- |
| **Sync (REST)**          | Simple queries           | Easy, immediate | Tight coupling   |
| **Async (Events)**       | Background tasks         | Loose coupling  | Complex          |
| **Database per service** | Service autonomy         | Independence    | No ACID          |
| **Saga**                 | Distributed transactions | Consistency     | Complex rollback |

**Next:** Day 44 - API Gateway & Service Registry
