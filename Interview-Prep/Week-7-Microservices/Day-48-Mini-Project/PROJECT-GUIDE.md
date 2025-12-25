# Day 48: Mini Microservice System Project

## 🎯 Project Overview

Build a **complete microservices system** with:
- ✅ Users Service (authentication, user management)
- ✅ Orders Service (order creation, order management)
- ✅ RabbitMQ (event-driven communication)
- ✅ API Gateway (single entry point)
- ✅ Observability (logging, metrics, tracing)

**Time Estimate:** 6-8 hours

---

## 📋 Requirements

### Users Service
- User registration
- User login (JWT)
- Get user profile
- PostgreSQL database

### Orders Service
- Create order
- Get user orders
- Update order status
- PostgreSQL database
- Publishes events to RabbitMQ

### API Gateway
- Routes requests to services
- JWT authentication
- Rate limiting

### Event Communication
- ORDER_CREATED event
- ORDER_UPDATED event
- Consumers in both services

---

## 🛠️ Tech Stack

```
Framework:     Express + TypeScript
Databases:     PostgreSQL (per service)
Message Queue: RabbitMQ
API Gateway:   Express Gateway
Observability: Winston + Prometheus
Containerization: Docker Compose
```

---

## 📁 Project Structure

```
microservices-project/
├── services/
│   ├── users/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   └── lib/
│   │   ├── prisma/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── orders/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── consumers/
│   │   │   └── lib/
│   │   ├── prisma/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── api-gateway/
│       ├── src/
│       │   ├── index.ts
│       │   ├── middleware/
│       │   └── lib/
│       ├── Dockerfile
│       └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🚀 Implementation

### Step 1: Users Service (90 mins)

```typescript
// services/users/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```typescript
// services/users/src/index.ts
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from './lib/logger';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(express.json());

// Register
app.post('/users/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });
    
    logger.info('User registered', { userId: user.id });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    logger.error('Registration failed', { error });
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h'
    });
    
    logger.info('User logged in', { userId: user.id });
    res.json({ token });
  } catch (error) {
    logger.error('Login failed', { error });
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user
app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, name: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'users' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Users service running on port ${PORT}`);
});
```

### Step 2: Orders Service with RabbitMQ (90 mins)

```typescript
// services/orders/prisma/schema.prisma
model Order {
  id        String   @id @default(cuid())
  userId    String
  items     Json
  total     Float
  status    String   @default("PENDING")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```typescript
// services/orders/src/lib/rabbitmq.ts
import amqp, { Channel, Connection } from 'amqplib';

class RabbitMQService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  async connect() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('order_events', { durable: true });
    console.log('Connected to RabbitMQ');
  }

  async publish(event: string, data: any) {
    if (!this.channel) throw new Error('Channel not initialized');
    
    this.channel.sendToQueue(
      'order_events',
      Buffer.from(JSON.stringify({ event, data, timestamp: new Date() })),
      { persistent: true }
    );
  }

  async consume(callback: (msg: any) => Promise<void>) {
    if (!this.channel) throw new Error('Channel not initialized');

    await this.channel.consume('order_events', async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          this.channel!.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel!.nack(msg, false, false);
        }
      }
    });
  }
}

export const rabbitmq = new RabbitMQService();
```

```typescript
// services/orders/src/index.ts
import express from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { rabbitmq } from './lib/rabbitmq';
import { logger } from './lib/logger';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Create order
app.post('/orders', async (req, res) => {
  try {
    const { userId, items } = req.body;
    
    // Verify user exists
    const userResponse = await axios.get(`http://users-service:3001/users/${userId}`);
    if (!userResponse.data) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    
    const order = await prisma.order.create({
      data: { userId, items, total, status: 'PENDING' }
    });
    
    // Publish event
    await rabbitmq.publish('ORDER_CREATED', {
      orderId: order.id,
      userId: order.userId,
      total: order.total
    });
    
    logger.info('Order created', { orderId: order.id, userId: order.userId });
    res.status(201).json(order);
  } catch (error) {
    logger.error('Order creation failed', { error });
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
app.get('/orders/user/:userId', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
app.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });
    
    await rabbitmq.publish('ORDER_UPDATED', {
      orderId: order.id,
      status: order.status
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'orders' });
});

const PORT = process.env.PORT || 3002;

async function start() {
  await rabbitmq.connect();
  
  // Start event consumer
  await rabbitmq.consume(async (message) => {
    logger.info('Received event', { event: message.event, data: message.data });
  });
  
  app.listen(PORT, () => {
    logger.info(`Orders service running on port ${PORT}`);
  });
}

start();
```

### Step 3: API Gateway (60 mins)

```typescript
// services/api-gateway/src/index.ts
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100
});

app.use(limiter);

// Auth middleware
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Proxy function
async function proxy(req: express.Request, res: express.Response, target: string) {
  try {
    const response = await axios({
      method: req.method,
      url: `${target}${req.url}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Service unavailable'
    });
  }
}

// Routes
app.use('/users/register', (req, res) => proxy(req, res, 'http://users-service:3001'));
app.use('/users/login', (req, res) => proxy(req, res, 'http://users-service:3001'));
app.use('/users', authenticate, (req, res) => proxy(req, res, 'http://users-service:3001'));
app.use('/orders', authenticate, (req, res) => proxy(req, res, 'http://orders-service:3002'));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'api-gateway' });
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
```

### Step 4: Docker Compose (30 mins)

```yaml
# docker-compose.yml
version: '3.8'

services:
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3000:3000"
    environment:
      JWT_SECRET: your-secret-key
    depends_on:
      - users-service
      - orders-service

  users-service:
    build: ./services/users
    environment:
      DATABASE_URL: postgresql://user:password@users-db:5432/users
      JWT_SECRET: your-secret-key
      PORT: 3001
    depends_on:
      - users-db

  orders-service:
    build: ./services/orders
    environment:
      DATABASE_URL: postgresql://user:password@orders-db:5432/orders
      RABBITMQ_URL: amqp://rabbitmq
      PORT: 3002
    depends_on:
      - orders-db
      - rabbitmq

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

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
```

---

## ✅ Testing Checklist

```bash
# 1. Start all services
docker-compose up --build

# 2. Register user
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'

# 3. Login
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# 4. Create order (use token from login)
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId":"USER_ID","items":[{"name":"Product","price":100,"quantity":2}]}'

# 5. Get user orders
curl http://localhost:3000/orders/user/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Extension Ideas

1. **Add Inventory Service** - Check product availability
2. **Add Payment Service** - Process payments
3. **Implement Saga Pattern** - Distributed transactions
4. **Add Observability** - Prometheus metrics, Jaeger tracing
5. **Add Service Discovery** - Consul integration
6. **Add Circuit Breaker** - Fault tolerance
7. **Add Caching** - Redis for frequently accessed data

---

**Next:** Day 49 - Revision & Mock Interview
