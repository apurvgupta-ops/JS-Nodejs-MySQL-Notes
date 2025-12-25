# Day 18: Message Queues & Event-Driven Architecture

## 📚 Table of Contents
1. What are Message Queues?
2. Message Queue Patterns
3. Kafka Architecture
4. Event-Driven Architecture
5. Use Cases & Patterns
6. Practical Implementation
7. Best Practices

---

## 1. What are Message Queues?

A **message queue** enables asynchronous communication between services.

### Without Message Queue

```
Service A → (direct call) → Service B
            (blocks until Service B responds)
```

**Problems:**
- ❌ Tight coupling
- ❌ Service B failure breaks Service A
- ❌ No load leveling
- ❌ Blocking operations

### With Message Queue

```
Service A → [Queue] → Service B
(returns immediately)  (processes async)
```

**Benefits:**
- ✅ Loose coupling
- ✅ Fault tolerance (retry on failure)
- ✅ Load leveling (queue absorbs traffic spikes)
- ✅ Non-blocking

---

## 2. Message Queue Patterns

### 2.1 Point-to-Point (Queue)

One message → One consumer

```
Producer → [Queue] → Consumer
                     (single receiver)

Message removed after consumption
```

**Use case:** Task processing

```javascript
// Producer
await queue.send({ task: 'send_email', to: 'user@example.com' });

// Consumer
const message = await queue.receive();
await sendEmail(message.to);
await queue.delete(message); // Acknowledge
```

### 2.2 Publish-Subscribe (Topic)

One message → Multiple consumers

```
              ┌─ Consumer A
Producer → [Topic] ─┼─ Consumer B
              └─ Consumer C

All consumers receive copy of message
```

**Use case:** Event broadcasting

```javascript
// Publisher
await topic.publish({ event: 'user_registered', userId: 123 });

// Subscriber 1: Send welcome email
topic.subscribe('user_registered', async (event) => {
    await sendWelcomeEmail(event.userId);
});

// Subscriber 2: Create user profile
topic.subscribe('user_registered', async (event) => {
    await createUserProfile(event.userId);
});

// Subscriber 3: Analytics
topic.subscribe('user_registered', async (event) => {
    await trackRegistration(event.userId);
});
```

### 2.3 Work Queue

Multiple consumers compete for messages.

```
              ┌─ Worker 1 (idle)
Producer → [Queue] ─┼─ Worker 2 (busy)
              └─ Worker 3 (idle)

Message goes to idle worker
```

**Use case:** Load distribution

```javascript
// Multiple workers processing image uploads
async function worker(workerId) {
    while (true) {
        const job = await queue.receive(); // Blocks until message
        console.log(`Worker ${workerId} processing ${job.imageId}`);
        
        await processImage(job.imageId);
        await queue.acknowledge(job);
    }
}

// Start 5 workers
for (let i = 1; i <= 5; i++) {
    worker(i);
}
```

### 2.4 Request-Reply

Consumer sends response back to producer.

```
Producer → [Request Queue] → Consumer
         ← [Reply Queue] ←
```

**Implementation:**

```javascript
// Producer
const correlationId = uuid();
await requestQueue.send({
    data: { userId: 123 },
    replyTo: 'reply-queue',
    correlationId
});

// Wait for reply
const reply = await replyQueue.receive({ correlationId });
console.log('Reply:', reply);

// Consumer
const request = await requestQueue.receive();
const result = await processRequest(request.data);

// Send reply
await queue.send(request.replyTo, {
    correlationId: request.correlationId,
    result
});
```

---

## 3. Kafka Architecture

### 3.1 Core Concepts

**Topic:** Category of messages (like a table)

**Partition:** Topic split into partitions for parallel processing

**Producer:** Sends messages to topics

**Consumer:** Reads messages from topics

**Consumer Group:** Group of consumers sharing work

### Architecture Diagram

```
                    Kafka Cluster
        ┌──────────────────────────────────┐
        │  Topic: orders                   │
        │  ┌─────────┐  ┌─────────┐       │
        │  │Partition│  │Partition│       │
        │  │    0    │  │    1    │       │
        │  │ msg1    │  │ msg2    │       │
        │  │ msg3    │  │ msg4    │       │
        │  └─────────┘  └─────────┘       │
        └──────────────────────────────────┘
              ↑                  ↓
         Producers          Consumer Groups
```

### 3.2 Partitions & Consumer Groups

**Single Consumer:**
```
Topic (3 partitions)
├─ Partition 0 ───┐
├─ Partition 1 ───┼─→ Consumer A (reads all)
└─ Partition 2 ───┘
```

**Consumer Group (parallel processing):**
```
Topic (3 partitions)
├─ Partition 0 ───→ Consumer A ─┐
├─ Partition 1 ───→ Consumer B ─┼─ Consumer Group
└─ Partition 2 ───→ Consumer C ─┘

Each partition consumed by exactly one consumer in group
```

### 3.3 Message Ordering

**Within partition:** Guaranteed order

```
Partition 0: msg1 → msg2 → msg3 (ordered)
Partition 1: msg4 → msg5 → msg6 (ordered)
```

**Across partitions:** No order guarantee

```
Topic:
Partition 0: msg1 (t=1) → msg3 (t=3)
Partition 1: msg2 (t=2) → msg4 (t=4)

Consumer may receive: msg2 → msg1 → msg4 → msg3
```

**Solution: Partition key**

```javascript
// All messages for same user go to same partition (ordered)
producer.send({
    topic: 'orders',
    messages: [{
        key: userId, // Partition key
        value: JSON.stringify(orderData)
    }]
});
```

### 3.4 Kafka Producer (Node.js)

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

await producer.connect();

// Send message
await producer.send({
    topic: 'orders',
    messages: [{
        key: 'user-123', // Optional partition key
        value: JSON.stringify({
            orderId: 'order-456',
            items: ['item1', 'item2'],
            total: 99.99
        }),
        headers: {
            'correlation-id': 'abc123'
        }
    }]
});

await producer.disconnect();
```

### 3.5 Kafka Consumer (Node.js)

```javascript
const consumer = kafka.consumer({ groupId: 'order-processors' });

await consumer.connect();
await consumer.subscribe({ topic: 'orders', fromBeginning: true });

await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log({
            partition,
            offset: message.offset,
            key: message.key.toString(),
            value: message.value.toString()
        });
        
        const order = JSON.parse(message.value.toString());
        await processOrder(order);
        
        // Auto-commit (by default)
    }
});
```

### 3.6 Consumer Groups in Action

```javascript
// Consumer Group: email-senders (3 consumers)
// Each processes different partition

// Consumer 1
const consumer1 = kafka.consumer({ groupId: 'email-senders' });
await consumer1.subscribe({ topic: 'user-events' });
await consumer1.run({
    eachMessage: async ({ message }) => {
        console.log('Consumer 1 processing:', message.offset);
        await sendEmail(JSON.parse(message.value));
    }
});

// Consumer 2
const consumer2 = kafka.consumer({ groupId: 'email-senders' });
await consumer2.subscribe({ topic: 'user-events' });
await consumer2.run({
    eachMessage: async ({ message }) => {
        console.log('Consumer 2 processing:', message.offset);
        await sendEmail(JSON.parse(message.value));
    }
});

// Result: Messages distributed across consumers
// Consumer 1: Partition 0, 2
// Consumer 2: Partition 1
```

### 3.7 Offset Management

**Offset:** Position in partition

```
Partition 0:
[msg0] [msg1] [msg2] [msg3] [msg4]
   ↑              ↑
offset=0    current offset=2
```

**Auto-commit (default):**
```javascript
await consumer.run({
    eachMessage: async ({ message }) => {
        await processMessage(message);
        // Offset auto-committed
    }
});
```

**Manual commit:**
```javascript
await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
        try {
            await processMessage(message);
            
            // Manually commit offset
            await consumer.commitOffsets([{
                topic,
                partition,
                offset: (parseInt(message.offset) + 1).toString()
            }]);
        } catch (error) {
            // Don't commit - will retry on restart
            console.error('Processing failed:', error);
        }
    }
});
```

---

## 4. Event-Driven Architecture

### 4.1 What is EDA?

Systems communicate through **events** instead of direct calls.

**Traditional (request-driven):**
```
Service A → Service B → Service C
(synchronous chain)
```

**Event-driven:**
```
Service A → Event: "Order Created"
              ↓
         [Event Bus]
         ↓    ↓    ↓
      Svc B  Svc C  Svc D
    (async listeners)
```

### 4.2 Event Types

**1. Event Notification**

Notify that something happened.

```javascript
// Publisher
events.publish('order.created', {
    orderId: '123',
    userId: '456'
});

// Subscribers
events.on('order.created', async (event) => {
    await emailService.sendOrderConfirmation(event.orderId);
});

events.on('order.created', async (event) => {
    await inventoryService.reserveItems(event.orderId);
});
```

**2. Event-Carried State Transfer**

Event contains full data (no need to query).

```javascript
// Event includes all order details
events.publish('order.created', {
    orderId: '123',
    userId: '456',
    items: [
        { productId: 'P1', quantity: 2, price: 29.99 },
        { productId: 'P2', quantity: 1, price: 49.99 }
    ],
    total: 109.97,
    shippingAddress: { /* ... */ }
});

// Subscriber has all data needed
events.on('order.created', async (event) => {
    // No need to query order service
    await generateInvoice(event);
});
```

**3. Event Sourcing**

Store all state changes as events.

```javascript
// Events as source of truth
const events = [
    { type: 'OrderCreated', orderId: '123', items: [...] },
    { type: 'PaymentReceived', orderId: '123', amount: 109.97 },
    { type: 'OrderShipped', orderId: '123', trackingId: 'ABC' }
];

// Rebuild state by replaying events
function getOrderState(orderId) {
    const orderEvents = events.filter(e => e.orderId === orderId);
    
    const state = { status: 'pending' };
    for (const event of orderEvents) {
        switch (event.type) {
            case 'OrderCreated':
                state.items = event.items;
                break;
            case 'PaymentReceived':
                state.status = 'paid';
                break;
            case 'OrderShipped':
                state.status = 'shipped';
                state.trackingId = event.trackingId;
                break;
        }
    }
    return state;
}
```

### 4.3 Saga Pattern

Manage distributed transactions using events.

**Scenario:** Create order (requires payment + inventory + shipping)

```javascript
// Orchestrator-based Saga
class OrderSaga {
    async execute(orderData) {
        const sagaId = uuid();
        
        try {
            // Step 1: Reserve inventory
            await events.publish('saga.reserveInventory', {
                sagaId,
                orderId: orderData.orderId,
                items: orderData.items
            });
            
            await this.waitForEvent(`saga.inventoryReserved.${sagaId}`);
            
            // Step 2: Process payment
            await events.publish('saga.processPayment', {
                sagaId,
                orderId: orderData.orderId,
                amount: orderData.total
            });
            
            await this.waitForEvent(`saga.paymentProcessed.${sagaId}`);
            
            // Step 3: Create shipment
            await events.publish('saga.createShipment', {
                sagaId,
                orderId: orderData.orderId
            });
            
            console.log('Order completed successfully');
            
        } catch (error) {
            // Compensate (rollback)
            console.error('Saga failed, compensating...');
            await this.compensate(sagaId, orderData);
        }
    }
    
    async compensate(sagaId, orderData) {
        // Rollback in reverse order
        await events.publish('saga.cancelShipment', { sagaId });
        await events.publish('saga.refundPayment', { sagaId });
        await events.publish('saga.releaseInventory', { sagaId });
    }
}
```

---

## 5. Use Cases & Patterns

### 5.1 Async Task Processing

```javascript
// API endpoint
app.post('/api/videos', async (req, res) => {
    const videoId = await db.createVideo(req.file);
    
    // Queue for processing (don't block response)
    await queue.send({
        task: 'process_video',
        videoId,
        formats: ['720p', '1080p', '4K']
    });
    
    res.json({ videoId, status: 'processing' });
});

// Worker
async function videoWorker() {
    const job = await queue.receive();
    
    for (const format of job.formats) {
        await transcodeVideo(job.videoId, format);
    }
    
    await queue.acknowledge(job);
}
```

### 5.2 Event Log / Audit Trail

```javascript
// Log all user actions
events.on('user.*', async (event) => {
    await auditLog.insert({
        eventType: event.type,
        userId: event.userId,
        timestamp: new Date(),
        data: event
    });
});

// Trigger events
events.publish('user.login', { userId: '123', ip: '1.2.3.4' });
events.publish('user.passwordChanged', { userId: '123' });
events.publish('user.deleted', { userId: '123', reason: 'GDPR' });
```

### 5.3 Real-time Updates

```javascript
// Order status changes
events.on('order.statusChanged', async (event) => {
    // Push to WebSocket clients
    io.to(`order-${event.orderId}`).emit('orderUpdate', {
        status: event.newStatus
    });
});

// Notify user
events.publish('order.statusChanged', {
    orderId: '123',
    userId: '456',
    oldStatus: 'processing',
    newStatus: 'shipped'
});
```

### 5.4 CQRS (Command Query Responsibility Segregation)

Separate read and write models.

```javascript
// Write model (commands)
class OrderCommandHandler {
    async createOrder(command) {
        const order = new Order(command);
        await orderRepository.save(order);
        
        // Publish event
        await events.publish('order.created', {
            orderId: order.id,
            userId: order.userId,
            items: order.items
        });
    }
}

// Read model (queries) - separate database
events.on('order.created', async (event) => {
    // Update denormalized read model
    await orderReadModel.insert({
        orderId: event.orderId,
        userId: event.userId,
        itemCount: event.items.length,
        totalAmount: event.items.reduce((sum, i) => sum + i.price, 0)
    });
});

// Query from read model (optimized for reads)
async function getUserOrders(userId) {
    return await orderReadModel.find({ userId });
}
```

---

## 6. Practical Implementation

### Complete E-commerce Example

```javascript
const { Kafka } = require('kafkajs');
const express = require('express');

const kafka = new Kafka({
    clientId: 'ecommerce-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();
const app = express();

app.use(express.json());

// Connect producer on startup
producer.connect();

// API: Create order
app.post('/api/orders', async (req, res) => {
    const order = {
        orderId: uuid(),
        userId: req.body.userId,
        items: req.body.items,
        total: req.body.total,
        timestamp: Date.now()
    };
    
    // Publish event
    await producer.send({
        topic: 'orders',
        messages: [{
            key: order.userId,
            value: JSON.stringify(order)
        }]
    });
    
    res.json({ orderId: order.orderId, status: 'processing' });
});

// Consumer: Process orders
const orderConsumer = kafka.consumer({ groupId: 'order-processors' });

async function startOrderProcessor() {
    await orderConsumer.connect();
    await orderConsumer.subscribe({ topic: 'orders' });
    
    await orderConsumer.run({
        eachMessage: async ({ message }) => {
            const order = JSON.parse(message.value.toString());
            
            console.log('Processing order:', order.orderId);
            
            // 1. Reserve inventory
            await reserveInventory(order.items);
            
            // 2. Process payment
            await processPayment(order.userId, order.total);
            
            // 3. Publish completion event
            await producer.send({
                topic: 'order-completed',
                messages: [{
                    key: order.userId,
                    value: JSON.stringify({
                        orderId: order.orderId,
                        status: 'completed'
                    })
                }]
            });
        }
    });
}

// Consumer: Send notifications
const notificationConsumer = kafka.consumer({ groupId: 'notifiers' });

async function startNotifier() {
    await notificationConsumer.connect();
    await notificationConsumer.subscribe({ topic: 'order-completed' });
    
    await notificationConsumer.run({
        eachMessage: async ({ message }) => {
            const event = JSON.parse(message.value.toString());
            
            // Send email
            await sendEmail({
                to: event.userId,
                subject: 'Order Confirmed',
                body: `Your order ${event.orderId} is confirmed!`
            });
        }
    });
}

// Start services
startOrderProcessor();
startNotifier();
app.listen(3000);
```

---

## 7. Best Practices

### 7.1 Idempotency

Handle duplicate messages gracefully.

```javascript
// Problem: Message processed twice
await consumer.run({
    eachMessage: async ({ message }) => {
        const order = JSON.parse(message.value);
        await chargeUser(order.userId, order.total); // 🚨 Double charge!
    }
});

// Solution: Idempotency key
await consumer.run({
    eachMessage: async ({ message }) => {
        const order = JSON.parse(message.value);
        const idempotencyKey = `order-${order.orderId}`;
        
        // Check if already processed
        const processed = await redis.get(idempotencyKey);
        if (processed) {
            console.log('Already processed, skipping');
            return;
        }
        
        // Process
        await chargeUser(order.userId, order.total);
        
        // Mark as processed (24 hour TTL)
        await redis.setex(idempotencyKey, 86400, 'true');
    }
});
```

### 7.2 Dead Letter Queue

Handle failed messages.

```javascript
await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        try {
            await processMessage(message);
        } catch (error) {
            console.error('Processing failed:', error);
            
            // Send to dead letter queue
            await producer.send({
                topic: 'orders-dlq',
                messages: [{
                    value: message.value,
                    headers: {
                        'original-topic': topic,
                        'error': error.message
                    }
                }]
            });
        }
    }
});
```

### 7.3 Message Schema Validation

```javascript
const Joi = require('joi');

const orderSchema = Joi.object({
    orderId: Joi.string().required(),
    userId: Joi.string().required(),
    items: Joi.array().items(Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required()
    })).min(1).required(),
    total: Joi.number().positive().required()
});

await consumer.run({
    eachMessage: async ({ message }) => {
        const order = JSON.parse(message.value);
        
        // Validate schema
        const { error } = orderSchema.validate(order);
        if (error) {
            console.error('Invalid message:', error);
            // Send to DLQ
            return;
        }
        
        await processOrder(order);
    }
});
```

---

## 📝 Quick Reference

### Queue vs Topic

| Feature       | Queue                | Topic              |
| ------------- | -------------------- | ------------------ |
| **Pattern**   | Point-to-point       | Pub-sub            |
| **Consumers** | One receives message | All receive copy   |
| **Use case**  | Task distribution    | Event broadcasting |

### Kafka Key Concepts

- **Topic:** Message category
- **Partition:** Parallel processing unit
- **Consumer Group:** Load balancing
- **Offset:** Message position
- **Replication:** Fault tolerance

---

## 📝 Practice Tasks

See `/tasks` folder for:
1. Build Kafka producer/consumer
2. Implement Saga pattern
3. Create event-driven microservice
4. Handle message failures with DLQ

