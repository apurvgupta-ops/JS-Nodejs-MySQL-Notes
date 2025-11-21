# Day 45: Event-Driven Communication

## 📚 Table of Contents
1. Introduction to Event-Driven Architecture
2. RabbitMQ Basics
3. Redis Streams
4. Pub-Sub Pattern
5. Event Sourcing
6. Saga Pattern

---

## 1. Introduction to Event-Driven Architecture

**Event-Driven Architecture (EDA)** - Services communicate by publishing and consuming events asynchronously.

### Benefits

```
✅ Loose Coupling        - Services don't need to know about each other
✅ Scalability          - Process events at your own pace
✅ Fault Tolerance      - Messages persist even if consumer is down
✅ Flexibility          - Easy to add new consumers
✅ Asynchronous         - Non-blocking operations
```

### Event vs Message

```typescript
// Command (Request something to happen)
{
  type: 'CREATE_ORDER',
  userId: '123',
  items: [...]
}

// Event (Something happened)
{
  type: 'ORDER_CREATED',
  orderId: '456',
  userId: '123',
  timestamp: '2024-01-01T10:00:00Z'
}
```

---

## 2. RabbitMQ Basics

### Core Concepts

```
Producer → Exchange → Queue → Consumer

Exchange Types:
1. Direct    - Route by routing key
2. Topic     - Route by pattern matching
3. Fanout    - Broadcast to all queues
4. Headers   - Route by message headers
```

### Installation & Setup

```typescript
// lib/rabbitmq.ts
import amqp, { Channel, Connection } from 'amqplib';

class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  async connect() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    this.channel = await this.connection.createChannel();
    console.log('Connected to RabbitMQ');
  }

  async assertQueue(queueName: string) {
    if (!this.channel) throw new Error('Channel not initialized');
    await this.channel.assertQueue(queueName, { durable: true });
  }

  async sendToQueue(queueName: string, message: any) {
    if (!this.channel) throw new Error('Channel not initialized');
    
    this.channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  async consume(queueName: string, callback: (msg: any) => Promise<void>) {
    if (!this.channel) throw new Error('Channel not initialized');

    await this.channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          this.channel!.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel!.nack(msg, false, false); // Don't requeue
        }
      }
    });
  }

  async close() {
    await this.channel?.close();
    await this.connection?.close();
  }
}

export const rabbitmq = new RabbitMQClient();
```

### Direct Exchange Example

```typescript
// services/orders/src/publisher.ts
import { rabbitmq } from './lib/rabbitmq';

await rabbitmq.connect();
await rabbitmq.assertQueue('order_events');

// Publish event
export async function publishOrderCreated(order: any) {
  await rabbitmq.sendToQueue('order_events', {
    event: 'ORDER_CREATED',
    data: order,
    timestamp: new Date().toISOString()
  });
  
  console.log('Published ORDER_CREATED event');
}
```

```typescript
// services/notifications/src/consumer.ts
import { rabbitmq } from './lib/rabbitmq';
import { sendEmail } from './email';

await rabbitmq.connect();
await rabbitmq.assertQueue('order_events');

// Consume events
await rabbitmq.consume('order_events', async (event) => {
  if (event.event === 'ORDER_CREATED') {
    await sendEmail(event.data.userId, 'Order Confirmation', event.data);
    console.log('Sent order confirmation email');
  }
});
```

### Topic Exchange (Pattern Matching)

```typescript
// lib/rabbitmq.ts
class RabbitMQClient {
  async assertExchange(exchangeName: string, type: string) {
    if (!this.channel) throw new Error('Channel not initialized');
    await this.channel.assertExchange(exchangeName, type, { durable: true });
  }

  async publish(exchangeName: string, routingKey: string, message: any) {
    if (!this.channel) throw new Error('Channel not initialized');
    
    this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  async bindQueue(queueName: string, exchangeName: string, pattern: string) {
    if (!this.channel) throw new Error('Channel not initialized');
    await this.channel.bindQueue(queueName, exchangeName, pattern);
  }
}
```

```typescript
// Publisher
await rabbitmq.assertExchange('events', 'topic');

// Publish with routing keys
await rabbitmq.publish('events', 'order.created', { orderId: '123' });
await rabbitmq.publish('events', 'order.updated', { orderId: '123' });
await rabbitmq.publish('events', 'user.registered', { userId: '456' });

// Consumer 1: Subscribe to all order events
await rabbitmq.assertQueue('order_consumer');
await rabbitmq.bindQueue('order_consumer', 'events', 'order.*');

// Consumer 2: Subscribe to everything
await rabbitmq.assertQueue('audit_consumer');
await rabbitmq.bindQueue('audit_consumer', 'events', '#');
```

### Fanout Exchange (Broadcast)

```typescript
// Publisher
await rabbitmq.assertExchange('notifications', 'fanout');

await rabbitmq.publish('notifications', '', {
  message: 'System maintenance in 10 minutes'
});

// All consumers receive the message
await rabbitmq.bindQueue('email_queue', 'notifications', '');
await rabbitmq.bindQueue('sms_queue', 'notifications', '');
await rabbitmq.bindQueue('push_queue', 'notifications', '');
```

---

## 3. Redis Streams

### Why Redis Streams?

```
✅ Built into Redis (no extra infrastructure)
✅ Consumer Groups (multiple consumers)
✅ Message Acknowledgment
✅ Persistent (survives restarts)
✅ Fast (in-memory)
```

### Redis Streams Setup

```typescript
// lib/redisStreams.ts
import Redis from 'ioredis';

export class RedisStreamClient {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    });
  }

  // Add message to stream
  async publish(stream: string, data: Record<string, any>) {
    const id = await this.redis.xadd(
      stream,
      '*', // Auto-generate ID
      ...Object.entries(data).flat()
    );
    return id;
  }

  // Create consumer group
  async createConsumerGroup(stream: string, group: string) {
    try {
      await this.redis.xgroup('CREATE', stream, group, '0', 'MKSTREAM');
    } catch (error: any) {
      if (!error.message.includes('BUSYGROUP')) {
        throw error;
      }
    }
  }

  // Consume messages
  async consume(
    stream: string,
    group: string,
    consumer: string,
    callback: (messages: any[]) => Promise<void>
  ) {
    while (true) {
      const results = await this.redis.xreadgroup(
        'GROUP',
        group,
        consumer,
        'BLOCK',
        5000, // 5 second timeout
        'COUNT',
        10,
        'STREAMS',
        stream,
        '>'
      );

      if (results) {
        for (const [streamName, messages] of results) {
          if (messages.length > 0) {
            await callback(messages);
            
            // Acknowledge messages
            const ids = messages.map((msg: any) => msg[0]);
            await this.redis.xack(stream, group, ...ids);
          }
        }
      }
    }
  }
}
```

### Using Redis Streams

```typescript
// services/orders/src/index.ts
import { RedisStreamClient } from './lib/redisStreams';

const streams = new RedisStreamClient();

app.post('/orders', async (req, res) => {
  const order = await prisma.order.create({ data: req.body });

  // Publish to stream
  await streams.publish('order_events', {
    event: 'ORDER_CREATED',
    orderId: order.id,
    userId: order.userId,
    total: order.total.toString()
  });

  res.json(order);
});
```

```typescript
// services/notifications/src/consumer.ts
import { RedisStreamClient } from './lib/redisStreams';

const streams = new RedisStreamClient();

async function start() {
  await streams.createConsumerGroup('order_events', 'notification_group');

  await streams.consume(
    'order_events',
    'notification_group',
    'notification_worker_1',
    async (messages) => {
      for (const [id, fields] of messages) {
        const event = Object.fromEntries(
          fields.reduce((acc: any[], val: string, i: number, arr: string[]) => {
            if (i % 2 === 0) acc.push([val, arr[i + 1]]);
            return acc;
          }, [])
        );

        if (event.event === 'ORDER_CREATED') {
          await sendNotification(event.userId, event.orderId);
        }
      }
    }
  );
}

start();
```

---

## 4. Pub-Sub Pattern

### Complete Pub-Sub Implementation

```typescript
// lib/eventBus.ts
import { EventEmitter } from 'events';

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(100);
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  async publish(event: string, data: any) {
    console.log(`Publishing event: ${event}`);
    this.emit(event, data);
  }

  subscribe(event: string, handler: (data: any) => Promise<void>) {
    console.log(`Subscribed to event: ${event}`);
    this.on(event, async (data) => {
      try {
        await handler(data);
      } catch (error) {
        console.error(`Error handling event ${event}:`, error);
      }
    });
  }
}

export const eventBus = EventBus.getInstance();
```

```typescript
// services/orders/src/index.ts
import { eventBus } from './lib/eventBus';

app.post('/orders', async (req, res) => {
  const order = await prisma.order.create({ data: req.body });

  // Publish event
  await eventBus.publish('ORDER_CREATED', {
    orderId: order.id,
    userId: order.userId,
    total: order.total
  });

  res.json(order);
});
```

```typescript
// services/notifications/src/subscribers.ts
import { eventBus } from './lib/eventBus';
import { sendEmail } from './email';

// Subscribe to ORDER_CREATED
eventBus.subscribe('ORDER_CREATED', async (data) => {
  await sendEmail(data.userId, 'Order Confirmation', data);
});

// Subscribe to ORDER_SHIPPED
eventBus.subscribe('ORDER_SHIPPED', async (data) => {
  await sendEmail(data.userId, 'Order Shipped', data);
});
```

---

## 5. Event Sourcing

### What is Event Sourcing?

Instead of storing current state, store **sequence of events** that led to current state.

```typescript
// Traditional approach
const order = {
  id: '123',
  status: 'DELIVERED',
  total: 100
};

// Event Sourcing approach
const events = [
  { type: 'ORDER_CREATED', orderId: '123', total: 100 },
  { type: 'ORDER_PAID', orderId: '123' },
  { type: 'ORDER_SHIPPED', orderId: '123' },
  { type: 'ORDER_DELIVERED', orderId: '123' }
];
```

### Implementing Event Store

```typescript
// lib/eventStore.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EventStore {
  async append(streamId: string, event: any) {
    await prisma.event.create({
      data: {
        streamId,
        eventType: event.type,
        eventData: event,
        timestamp: new Date()
      }
    });
  }

  async getEvents(streamId: string) {
    const events = await prisma.event.findMany({
      where: { streamId },
      orderBy: { timestamp: 'asc' }
    });
    return events.map(e => e.eventData);
  }

  async rebuildState(streamId: string, reducer: (state: any, event: any) => any) {
    const events = await this.getEvents(streamId);
    return events.reduce(reducer, {});
  }
}
```

```typescript
// Usage
const eventStore = new EventStore();

// Append events
await eventStore.append('order-123', {
  type: 'ORDER_CREATED',
  orderId: '123',
  items: [...]
});

await eventStore.append('order-123', {
  type: 'ORDER_PAID',
  orderId: '123',
  amount: 100
});

// Rebuild state
const orderState = await eventStore.rebuildState('order-123', (state, event) => {
  switch (event.type) {
    case 'ORDER_CREATED':
      return { ...state, id: event.orderId, status: 'CREATED', items: event.items };
    case 'ORDER_PAID':
      return { ...state, status: 'PAID', paidAmount: event.amount };
    default:
      return state;
  }
});
```

---

## 6. Saga Pattern

### Choreography-Based Saga

Each service publishes events, others react.

```typescript
// Order Service
app.post('/orders', async (req, res) => {
  const order = await prisma.order.create({ data: req.body });
  
  await rabbitmq.publish('events', 'order.created', {
    orderId: order.id,
    userId: order.userId,
    items: order.items
  });
  
  res.json(order);
});

// Inventory Service
await rabbitmq.consume('inventory_queue', async (event) => {
  if (event.routingKey === 'order.created') {
    try {
      await reserveInventory(event.data.items);
      
      await rabbitmq.publish('events', 'inventory.reserved', {
        orderId: event.data.orderId
      });
    } catch (error) {
      await rabbitmq.publish('events', 'inventory.failed', {
        orderId: event.data.orderId
      });
    }
  }
});

// Payment Service
await rabbitmq.consume('payment_queue', async (event) => {
  if (event.routingKey === 'inventory.reserved') {
    try {
      await processPayment(event.data.orderId);
      
      await rabbitmq.publish('events', 'payment.processed', {
        orderId: event.data.orderId
      });
    } catch (error) {
      await rabbitmq.publish('events', 'payment.failed', {
        orderId: event.data.orderId
      });
    }
  }
});

// Order Service (listening for completion)
await rabbitmq.consume('order_saga_queue', async (event) => {
  if (event.routingKey === 'payment.processed') {
    await updateOrderStatus(event.data.orderId, 'CONFIRMED');
  } else if (event.routingKey === 'inventory.failed' || event.routingKey === 'payment.failed') {
    await updateOrderStatus(event.data.orderId, 'CANCELLED');
  }
});
```

### Orchestration-Based Saga

Central orchestrator coordinates the saga.

```typescript
// lib/sagaOrchestrator.ts
class OrderSaga {
  async execute(orderData: any) {
    let orderId: string;
    
    try {
      // Step 1: Create order
      orderId = await this.createOrder(orderData);
      
      // Step 2: Reserve inventory
      await this.reserveInventory(orderId, orderData.items);
      
      // Step 3: Process payment
      await this.processPayment(orderId, orderData.total);
      
      // Step 4: Confirm order
      await this.confirmOrder(orderId);
      
      return { success: true, orderId };
    } catch (error) {
      // Compensating transactions
      if (orderId) {
        await this.releaseInventory(orderId);
        await this.cancelOrder(orderId);
      }
      
      return { success: false, error: error.message };
    }
  }

  private async createOrder(data: any) {
    const response = await axios.post('http://orders-service/orders', data);
    return response.data.id;
  }

  private async reserveInventory(orderId: string, items: any[]) {
    await axios.post('http://inventory-service/reserve', { orderId, items });
  }

  private async processPayment(orderId: string, amount: number) {
    await axios.post('http://payment-service/process', { orderId, amount });
  }

  private async confirmOrder(orderId: string) {
    await axios.patch(`http://orders-service/orders/${orderId}`, { status: 'CONFIRMED' });
  }

  private async releaseInventory(orderId: string) {
    await axios.post('http://inventory-service/release', { orderId });
  }

  private async cancelOrder(orderId: string) {
    await axios.patch(`http://orders-service/orders/${orderId}`, { status: 'CANCELLED' });
  }
}
```

---

## 📝 Practice Tasks

### Task 1: RabbitMQ Integration
- Set up RabbitMQ with Docker
- Create publisher in Orders service
- Create consumer in Notifications service
- Implement topic exchange

### Task 2: Redis Streams
- Implement Redis Streams for events
- Create consumer group
- Handle message acknowledgment
- Add error handling

### Task 3: Saga Pattern
- Implement choreography-based saga
- Add compensating transactions
- Test failure scenarios

---

## 🔗 Quick Reference

| Technology         | Use Case                 | Pros                   | Cons                  |
| ------------------ | ------------------------ | ---------------------- | --------------------- |
| **RabbitMQ**       | Complex routing          | Feature-rich, reliable | Extra infrastructure  |
| **Redis Streams**  | High throughput          | Fast, simple           | Limited features      |
| **Event Sourcing** | Audit trail              | Complete history       | Complex queries       |
| **Saga**           | Distributed transactions | Data consistency       | Complex orchestration |

**Next:** Day 46 - Authentication Across Services
