# Day 20: Large System Designs

## 📚 Table of Contents
1. WhatsApp Messaging System
2. File Upload System
3. Common Patterns Across Both

---

# Design 1: WhatsApp Messaging System

## 1. Problem Statement

Design a real-time messaging system like WhatsApp supporting:
- One-to-one messaging
- Group chats
- Real-time delivery
- Read receipts
- Media sharing
- End-to-end encryption

---

## 2. Requirements

### Functional Requirements

1. **Send/receive messages** (text, images, videos)
2. **One-to-one and group chat**
3. **Online/offline status**
4. **Delivery and read receipts**
5. **Push notifications** for offline users
6. **Message history**
7. **Search messages**

### Non-Functional Requirements

1. **Real-time:** < 1 second message delivery
2. **High availability:** 99.99% uptime
3. **Scalability:** 1 billion users
4. **Reliability:** No message loss
5. **Low latency:** < 100ms
6. **Security:** End-to-end encryption

---

## 3. Capacity Estimation

**Assumptions:**
- 1 billion users
- 500 million daily active users (DAU)
- Each user sends 40 messages/day

**Calculations:**

```
Messages per day:
500M users × 40 messages = 20 billion messages/day

Messages per second:
20B / (24 × 3600) = 231,000 messages/sec

Storage per message:
- Text: 100 bytes (average)
- Metadata: 50 bytes (timestamp, sender, recipient)
- Total: 150 bytes

Daily storage:
20B × 150 bytes = 3 TB/day

5-year storage:
3 TB × 365 × 5 = 5.5 PB

Bandwidth:
- Send: 231K msg/sec × 150 bytes = 35 MB/sec
- Media (images/videos): 10× = 350 MB/sec
```

---

## 4. API Design

### WebSocket API

```javascript
// Connect
ws://chat.whatsapp.com/connect?userId=123&token=abc

// Send message
{
    "type": "send_message",
    "data": {
        "messageId": "msg-uuid",
        "to": "user-456",
        "content": "Hello!",
        "timestamp": 1700000000000
    }
}

// Receive message
{
    "type": "new_message",
    "data": {
        "messageId": "msg-uuid",
        "from": "user-789",
        "content": "Hi there!",
        "timestamp": 1700000001000
    }
}

// Delivery receipt
{
    "type": "message_delivered",
    "data": {
        "messageId": "msg-uuid",
        "timestamp": 1700000002000
    }
}

// Read receipt
{
    "type": "message_read",
    "data": {
        "messageId": "msg-uuid",
        "timestamp": 1700000003000
    }
}

// Typing indicator
{
    "type": "typing",
    "data": {
        "userId": "user-456",
        "chatId": "chat-789"
    }
}
```

### REST API

```javascript
// Get messages
GET /api/messages/{chatId}?limit=50&before={messageId}

// Upload media
POST /api/media/upload
Content-Type: multipart/form-data

// Get user info
GET /api/users/{userId}

// Create group
POST /api/groups
{
    "name": "Family Group",
    "members": ["user-1", "user-2", "user-3"]
}
```

---

## 5. Database Schema

### Cassandra (Main Message Store)

```sql
-- Messages table (partitioned by chat_id)
CREATE TABLE messages (
    chat_id UUID,
    message_id TIMEUUID,
    sender_id UUID,
    content TEXT,
    media_url TEXT,
    created_at TIMESTAMP,
    status TEXT, -- sent, delivered, read
    PRIMARY KEY (chat_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);

-- User chats (for listing conversations)
CREATE TABLE user_chats (
    user_id UUID,
    chat_id UUID,
    last_message_id TIMEUUID,
    last_message_content TEXT,
    last_message_time TIMESTAMP,
    unread_count INT,
    PRIMARY KEY (user_id, last_message_time, chat_id)
) WITH CLUSTERING ORDER BY (last_message_time DESC);
```

### Redis (Online Status & Caching)

```javascript
// Online users (set)
SADD online_users user:123

// User connections (hash - multiple devices)
HSET user:123:connections device1 "ws-server-1"
HSET user:123:connections device2 "ws-server-2"

// Last seen (string)
SET user:123:last_seen 1700000000000

// Unread counts (hash)
HSET user:123:unread chat:456 5
HSET user:123:unread chat:789 2
```

### PostgreSQL (User Data)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(50),
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE groups (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_members (
    group_id UUID REFERENCES groups(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20), -- admin, member
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);
```

---

## 6. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Mobile Clients                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓ (WebSocket)
┌───────────────────────────────────────────────────────────────┐
│                    Load Balancer (Layer 7)                    │
└───────────────────────┬───────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  WebSocket   │ │  WebSocket   │ │  WebSocket   │
│   Server 1   │ │   Server 2   │ │   Server 3   │
│ (Node.js)    │ │ (Node.js)    │ │ (Node.js)    │
└───────┬──────┘ └──────┬───────┘ └──────┬───────┘
        │               │                │
        └───────────────┼────────────────┘
                        │
        ┌───────────────┼───────────────┬────────────────┐
        ↓               ↓               ↓                ↓
┌──────────────┐ ┌──────────────┐ ┌─────────┐  ┌──────────────┐
│    Redis     │ │  Cassandra   │ │ Kafka   │  │  PostgreSQL  │
│  (Presence)  │ │  (Messages)  │ │(Events) │  │ (User Data)  │
└──────────────┘ └──────────────┘ └─────────┘  └──────────────┘
                                        │
                                        ↓
                                ┌──────────────┐
                                │ Push Notif   │
                                │   Service    │
                                └──────────────┘
```

---

## 7. Component Design

### 7.1 WebSocket Server

```javascript
const WebSocket = require('ws');
const Redis = require('ioredis');
const { Kafka } = require('kafkajs');

const redis = new Redis();
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

const wss = new WebSocket.Server({ port: 8080 });

// User connections (userId → [WebSocket connections])
const connections = new Map();

wss.on('connection', async (ws, req) => {
    const userId = getUserIdFromToken(req.headers.authorization);
    
    // Store connection
    if (!connections.has(userId)) {
        connections.set(userId, []);
    }
    connections.get(userId).push(ws);
    
    // Mark user online
    await redis.sadd('online_users', userId);
    
    console.log(`User ${userId} connected`);
    
    ws.on('message', async (data) => {
        const message = JSON.parse(data);
        
        switch (message.type) {
            case 'send_message':
                await handleSendMessage(userId, message.data);
                break;
            case 'message_delivered':
                await handleDeliveryReceipt(message.data);
                break;
            case 'message_read':
                await handleReadReceipt(message.data);
                break;
            case 'typing':
                await handleTyping(userId, message.data);
                break;
        }
    });
    
    ws.on('close', async () => {
        // Remove connection
        const userConnections = connections.get(userId);
        const index = userConnections.indexOf(ws);
        userConnections.splice(index, 1);
        
        // If no more connections, mark offline
        if (userConnections.length === 0) {
            connections.delete(userId);
            await redis.srem('online_users', userId);
            await redis.set(`user:${userId}:last_seen`, Date.now());
        }
        
        console.log(`User ${userId} disconnected`);
    });
});

// Handle send message
async function handleSendMessage(senderId, data) {
    const { messageId, to, content, timestamp } = data;
    
    // Save to Cassandra
    await cassandra.execute(
        `INSERT INTO messages (chat_id, message_id, sender_id, content, created_at, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [getChatId(senderId, to), messageId, senderId, content, timestamp, 'sent']
    );
    
    // Publish to Kafka (for async processing)
    await producer.send({
        topic: 'messages',
        messages: [{
            key: to,
            value: JSON.stringify({ messageId, senderId, to, content, timestamp })
        }]
    });
    
    // Deliver to recipient if online
    const recipientConnections = connections.get(to);
    if (recipientConnections) {
        const message = JSON.stringify({
            type: 'new_message',
            data: { messageId, from: senderId, content, timestamp }
        });
        
        recipientConnections.forEach(conn => conn.send(message));
        
        // Update status to delivered
        await cassandra.execute(
            `UPDATE messages SET status = 'delivered' WHERE chat_id = ? AND message_id = ?`,
            [getChatId(senderId, to), messageId]
        );
        
        // Send delivery receipt to sender
        const senderConnections = connections.get(senderId);
        if (senderConnections) {
            senderConnections.forEach(conn => conn.send(JSON.stringify({
                type: 'message_delivered',
                data: { messageId, timestamp: Date.now() }
            })));
        }
    } else {
        // Recipient offline - send push notification
        await sendPushNotification(to, {
            title: `New message from ${senderId}`,
            body: content
        });
    }
}

// Handle read receipt
async function handleReadReceipt(data) {
    const { messageId } = data;
    
    // Update status
    await cassandra.execute(
        `UPDATE messages SET status = 'read' WHERE message_id = ?`,
        [messageId]
    );
    
    // Notify sender
    const message = await cassandra.execute(
        `SELECT sender_id FROM messages WHERE message_id = ?`,
        [messageId]
    );
    
    const senderId = message.rows[0].sender_id;
    const senderConnections = connections.get(senderId);
    
    if (senderConnections) {
        senderConnections.forEach(conn => conn.send(JSON.stringify({
            type: 'message_read',
            data: { messageId, timestamp: Date.now() }
        })));
    }
}

function getChatId(user1, user2) {
    // Sort to ensure same chat ID regardless of order
    return [user1, user2].sort().join('-');
}
```

### 7.2 Message Consumer (Kafka)

```javascript
const consumer = kafka.consumer({ groupId: 'message-processors' });

await consumer.connect();
await consumer.subscribe({ topic: 'messages' });

await consumer.run({
    eachMessage: async ({ message }) => {
        const msg = JSON.parse(message.value);
        
        // Update user_chats table (for inbox)
        await cassandra.execute(
            `INSERT INTO user_chats (user_id, chat_id, last_message_id, last_message_content, last_message_time)
             VALUES (?, ?, ?, ?, ?)`,
            [msg.to, getChatId(msg.senderId, msg.to), msg.messageId, msg.content, msg.timestamp]
        );
        
        // Increment unread count
        await redis.hincrby(`user:${msg.to}:unread`, getChatId(msg.senderId, msg.to), 1);
        
        // Update search index (Elasticsearch)
        await elasticsearch.index({
            index: 'messages',
            body: {
                messageId: msg.messageId,
                chatId: getChatId(msg.senderId, msg.to),
                senderId: msg.senderId,
                content: msg.content,
                timestamp: msg.timestamp
            }
        });
    }
});
```

---

# Design 2: File Upload System

## 1. Problem Statement

Design a file upload system supporting:
- Large files (up to 10GB)
- Resumable uploads
- Multiple file formats
- Progress tracking
- Fast retrieval

---

## 2. Requirements

### Functional Requirements

1. **Upload files** (up to 10GB)
2. **Download files**
3. **Resumable uploads** (pause/resume)
4. **Progress tracking**
5. **File sharing** (generate shareable links)
6. **Access control** (private/public)
7. **File versioning**

### Non-Functional Requirements

1. **Scalability:** 100M files
2. **Reliability:** 99.99% availability
3. **Performance:** Fast upload/download
4. **Storage efficiency:** Deduplication
5. **Cost-effective:** Use object storage

---

## 3. Capacity Estimation

**Assumptions:**
- 10M users
- Each user uploads 10 files/month
- Average file size: 50MB

**Calculations:**

```
Files per month:
10M users × 10 files = 100M files/month

Storage per month:
100M × 50MB = 5 PB/month

Uploads per second:
100M / (30 × 24 × 3600) = 38 uploads/sec

Bandwidth (upload):
38 uploads/sec × 50MB = 1.9 GB/sec

Downloads (10× upload):
190 downloads/sec × 50MB = 9.5 GB/sec
```

---

## 4. API Design

### REST API

```javascript
// 1. Initiate upload
POST /api/upload/initiate
{
    "fileName": "video.mp4",
    "fileSize": 104857600,
    "contentType": "video/mp4"
}

Response:
{
    "uploadId": "upload-uuid",
    "chunkSize": 5242880, // 5MB chunks
    "totalChunks": 20
}

// 2. Upload chunk
PUT /api/upload/{uploadId}/chunk/{chunkNumber}
Content-Type: application/octet-stream
[Binary data]

Response:
{
    "chunkNumber": 1,
    "uploaded": true
}

// 3. Complete upload
POST /api/upload/{uploadId}/complete
{
    "chunks": [1, 2, 3, ... 20]
}

Response:
{
    "fileId": "file-uuid",
    "url": "https://cdn.example.com/files/file-uuid"
}

// 4. Download file
GET /api/files/{fileId}
→ Redirect to CDN URL or presigned S3 URL

// 5. Get upload progress
GET /api/upload/{uploadId}/progress
Response:
{
    "uploadedChunks": [1, 2, 3],
    "totalChunks": 20,
    "percentage": 15
}
```

---

## 5. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                               │
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
│ Upload API   │ │ Upload API   │ │ Upload API   │
│  Server 1    │ │  Server 2    │ │  Server 3    │
└───────┬──────┘ └──────┬───────┘ └──────┬───────┘
        │               │                │
        └───────────────┼────────────────┘
                        │
        ┌───────────────┼───────────────┬────────────────┐
        ↓               ↓               ↓                ↓
┌──────────────┐ ┌──────────────┐ ┌─────────┐  ┌──────────────┐
│    Redis     │ │  PostgreSQL  │ │   S3    │  │     CDN      │
│  (Metadata)  │ │ (Files Data) │ │(Storage)│  │(Serve Files) │
└──────────────┘ └──────────────┘ └─────────┘  └──────────────┘
                                        │
                                        ↓
                                ┌──────────────┐
                                │   Lambda     │
                                │ (Processing) │
                                └──────────────┘
```

---

## 6. Component Design

### 6.1 Chunked Upload

```javascript
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const Redis = require('ioredis');

const app = express();
const redis = new Redis();
const s3 = new AWS.S3();

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

// Initiate upload
app.post('/api/upload/initiate', async (req, res) => {
    const { fileName, fileSize, contentType } = req.body;
    
    const uploadId = generateUUID();
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
    
    // Create multipart upload in S3
    const multipart = await s3.createMultipartUpload({
        Bucket: 'my-bucket',
        Key: uploadId,
        ContentType: contentType
    }).promise();
    
    // Store metadata in Redis
    await redis.hmset(`upload:${uploadId}`, {
        fileName,
        fileSize,
        contentType,
        totalChunks,
        s3UploadId: multipart.UploadId,
        uploadedChunks: JSON.stringify([])
    });
    
    // Set expiration (24 hours)
    await redis.expire(`upload:${uploadId}`, 86400);
    
    res.json({ uploadId, chunkSize: CHUNK_SIZE, totalChunks });
});

// Upload chunk
const upload = multer({ storage: multer.memoryStorage() });

app.put('/api/upload/:uploadId/chunk/:chunkNumber', upload.single('chunk'), async (req, res) => {
    const { uploadId, chunkNumber } = req.params;
    const chunkData = req.file.buffer;
    
    // Get metadata
    const metadata = await redis.hgetall(`upload:${uploadId}`);
    
    if (!metadata.s3UploadId) {
        return res.status(404).json({ error: 'Upload not found' });
    }
    
    // Upload chunk to S3
    const part = await s3.uploadPart({
        Bucket: 'my-bucket',
        Key: uploadId,
        PartNumber: parseInt(chunkNumber),
        UploadId: metadata.s3UploadId,
        Body: chunkData
    }).promise();
    
    // Store part ETag
    await redis.hset(`upload:${uploadId}:parts`, chunkNumber, part.ETag);
    
    // Update uploaded chunks
    const uploadedChunks = JSON.parse(metadata.uploadedChunks);
    uploadedChunks.push(parseInt(chunkNumber));
    await redis.hset(`upload:${uploadId}`, 'uploadedChunks', JSON.stringify(uploadedChunks));
    
    res.json({ chunkNumber: parseInt(chunkNumber), uploaded: true });
});

// Complete upload
app.post('/api/upload/:uploadId/complete', async (req, res) => {
    const { uploadId } = req.params;
    
    const metadata = await redis.hgetall(`upload:${uploadId}`);
    const parts = await redis.hgetall(`upload:${uploadId}:parts`);
    
    // Prepare parts for S3
    const multipartParts = Object.entries(parts)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([partNumber, etag]) => ({
            PartNumber: parseInt(partNumber),
            ETag: etag
        }));
    
    // Complete multipart upload
    await s3.completeMultipartUpload({
        Bucket: 'my-bucket',
        Key: uploadId,
        UploadId: metadata.s3UploadId,
        MultipartUpload: { Parts: multipartParts }
    }).promise();
    
    // Save file metadata to database
    const fileId = generateUUID();
    await db.query(
        `INSERT INTO files (id, upload_id, file_name, file_size, content_type, s3_key)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [fileId, uploadId, metadata.fileName, metadata.fileSize, metadata.contentType, uploadId]
    );
    
    // Generate CDN URL
    const cdnUrl = `https://cdn.example.com/files/${fileId}`;
    
    // Cleanup Redis
    await redis.del(`upload:${uploadId}`, `upload:${uploadId}:parts`);
    
    res.json({ fileId, url: cdnUrl });
});

// Get progress
app.get('/api/upload/:uploadId/progress', async (req, res) => {
    const { uploadId } = req.params;
    
    const metadata = await redis.hgetall(`upload:${uploadId}`);
    
    if (!metadata.totalChunks) {
        return res.status(404).json({ error: 'Upload not found' });
    }
    
    const uploadedChunks = JSON.parse(metadata.uploadedChunks);
    const percentage = Math.round((uploadedChunks.length / parseInt(metadata.totalChunks)) * 100);
    
    res.json({
        uploadedChunks,
        totalChunks: parseInt(metadata.totalChunks),
        percentage
    });
});
```

### 6.2 Download with Presigned URL

```javascript
// Generate presigned URL
app.get('/api/files/:fileId', async (req, res) => {
    const { fileId } = req.params;
    
    // Get file metadata
    const [files] = await db.query('SELECT s3_key FROM files WHERE id = ?', [fileId]);
    
    if (files.length === 0) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    // Generate presigned URL (valid for 1 hour)
    const url = s3.getSignedUrl('getObject', {
        Bucket: 'my-bucket',
        Key: files[0].s3_key,
        Expires: 3600
    });
    
    res.redirect(302, url);
});
```

### 6.3 Deduplication

```javascript
// Check if file already exists (by hash)
app.post('/api/upload/check', async (req, res) => {
    const { fileHash } = req.body; // Client sends file hash (MD5/SHA256)
    
    const [files] = await db.query(
        'SELECT id, file_name FROM files WHERE hash = ?',
        [fileHash]
    );
    
    if (files.length > 0) {
        // File already exists - create reference instead of re-uploading
        const fileId = generateUUID();
        await db.query(
            `INSERT INTO files (id, file_name, hash, s3_key, is_duplicate)
             VALUES (?, ?, ?, ?, true)`,
            [fileId, req.body.fileName, fileHash, files[0].s3_key]
        );
        
        res.json({
            fileId,
            url: `https://cdn.example.com/files/${fileId}`,
            deduplicated: true
        });
    } else {
        res.json({ deduplicated: false });
    }
});
```

---

## 3. Common Patterns

### Pattern 1: WebSocket for Real-time
- Used in: WhatsApp (messaging)
- Benefit: Bidirectional, low latency

### Pattern 2: Chunked Upload
- Used in: File Upload (large files)
- Benefit: Resumable, better reliability

### Pattern 3: Object Storage (S3)
- Used in: Both (media in WhatsApp, files in File Upload)
- Benefit: Scalable, cost-effective

### Pattern 4: CDN
- Used in: Both (fast delivery)
- Benefit: Low latency, global distribution

### Pattern 5: Redis for Caching
- Used in: Both (presence, upload metadata)
- Benefit: Fast access, temporary data

### Pattern 6: Kafka for Async Processing
- Used in: WhatsApp (message processing)
- Benefit: Decoupling, scalability

---

## 📝 Summary

### WhatsApp Key Points
- **WebSocket** for real-time messaging
- **Cassandra** for message storage (time-series)
- **Redis** for online presence
- **Kafka** for async processing
- **Push notifications** for offline users

### File Upload Key Points
- **Chunked upload** for large files
- **S3 multipart upload** for reliability
- **Presigned URLs** for secure access
- **Deduplication** to save storage
- **CDN** for fast downloads

Both systems require:
- High availability
- Horizontal scalability
- Efficient caching
- Async processing
- Security (encryption, access control)

