# Day 26: Serverless with Lambda & API Gateway

## 📚 Table of Contents
1. Introduction to Serverless
2. AWS Lambda Basics
3. Lambda Function Anatomy
4. API Gateway Integration
5. Building Your First Lambda
6. Environment Variables & Secrets
7. Production Best Practices

---

## 1. Introduction to Serverless

**Serverless = Run code without managing servers.**

### Traditional vs Serverless

**Traditional (EC2):**
```
┌─────────────────────────────────┐
│         EC2 Instance            │
│  - Always running (24/7)        │
│  - Pay for idle time            │
│  - Manage OS, updates, scaling  │
│  - Fixed capacity               │
└─────────────────────────────────┘
```

**Serverless (Lambda):**
```
┌─────────────────────────────────┐
│       AWS Lambda                │
│  - Runs only when triggered     │
│  - Pay per execution            │
│  - Auto-scaling                 │
│  - No server management         │
└─────────────────────────────────┘
```

### Serverless Benefits

| Benefit                  | Description                 |
| ------------------------ | --------------------------- |
| **No Server Management** | AWS handles infrastructure  |
| **Auto-Scaling**         | Scales from 0 to thousands  |
| **Pay Per Use**          | Only pay for execution time |
| **High Availability**    | Built-in fault tolerance    |
| **Fast Deployment**      | Deploy in seconds           |

### When to Use Serverless

✅ **Good For:**
- REST APIs
- Scheduled tasks (cron jobs)
- Event processing (S3 upload triggers)
- Webhooks
- Image/video processing
- IoT backends

❌ **Not Good For:**
- Long-running processes (>15 min)
- Stateful applications
- WebSocket connections (use API Gateway WebSocket)
- High-frequency low-latency (cold starts)

---

## 2. AWS Lambda Basics

### Lambda Execution Model

```
Event → Lambda Function → Response

Examples:
- HTTP Request (API Gateway) → Lambda → JSON Response
- S3 Upload → Lambda → Process Image
- Schedule (EventBridge) → Lambda → Send Report
- DynamoDB Change → Lambda → Update Cache
```

### Lambda Limits

| Limit                     | Value                             |
| ------------------------- | --------------------------------- |
| **Max Execution Time**    | 15 minutes                        |
| **Memory**                | 128 MB - 10 GB                    |
| **Package Size**          | 50 MB (zipped), 250 MB (unzipped) |
| **Ephemeral Storage**     | 512 MB - 10 GB (/tmp)             |
| **Concurrent Executions** | 1000 (default, can increase)      |

### Lambda Pricing

**Free Tier:**
- 1 million requests/month
- 400,000 GB-seconds compute time

**Paid:**
- $0.20 per 1M requests
- $0.0000166667 per GB-second

**Example Cost:**
```
1 million requests
× 512 MB memory
× 200 ms average execution
= $5.83/month
```

---

## 3. Lambda Function Anatomy

### Handler Function

The **handler** is the entry point for your Lambda function.

**Basic Structure:**
```javascript
exports.handler = async (event, context) => {
  // Your code here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' })
  };
};
```

### Event Object

Contains input data from the trigger.

**API Gateway Event:**
```javascript
{
  "httpMethod": "POST",
  "path": "/users",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123"
  },
  "queryStringParameters": {
    "page": "1"
  },
  "body": "{\"name\":\"John\"}",
  "pathParameters": {
    "id": "123"
  }
}
```

**S3 Event:**
```javascript
{
  "Records": [
    {
      "s3": {
        "bucket": { "name": "my-bucket" },
        "object": { "key": "uploads/image.jpg" }
      }
    }
  ]
}
```

### Context Object

Contains runtime information.

```javascript
{
  "requestId": "abc-123",
  "functionName": "my-function",
  "memoryLimitInMB": "512",
  "awsRequestId": "xyz-789",
  "getRemainingTimeInMillis": function() { ... }
}
```

### Response Format (API Gateway)

```javascript
{
  "statusCode": 200,  // HTTP status code
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  "body": JSON.stringify({ message: "Success" })  // Must be string
}
```

---

## 4. API Gateway Integration

**API Gateway** creates HTTP endpoints that trigger Lambda functions.

### Architecture

```
Client
  ↓
API Gateway (https://xyz.execute-api.us-east-1.amazonaws.com/prod/users)
  ↓
Lambda Function
  ↓
Response
```

### REST API vs HTTP API

| Feature      | REST API      | HTTP API      |
| ------------ | ------------- | ------------- |
| **Cost**     | $3.50/million | $1.00/million |
| **Features** | More features | Simpler       |
| **Use Case** | Complex APIs  | Simple APIs   |

### Creating API Gateway

**AWS Console:**
1. API Gateway → Create API → HTTP API
2. Add Integration → Lambda
3. Define Routes:
   - `GET /users`
   - `POST /users`
   - `GET /users/{id}`
4. Deploy to stage (e.g., `prod`)

**Result:**
```
https://abc123.execute-api.us-east-1.amazonaws.com/prod/users
```

---

## 5. Building Your First Lambda

### Example 1: Hello World

**index.js:**
```javascript
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      timestamp: new Date().toISOString(),
      input: event
    })
  };
};
```

**Deploy:**
```bash
# Zip code
zip function.zip index.js

# Create function
aws lambda create-function \
  --function-name hello-world \
  --runtime nodejs18.x \
  --role arn:aws:iam::123456789012:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://function.zip

# Test
aws lambda invoke \
  --function-name hello-world \
  --payload '{"name":"John"}' \
  response.json

cat response.json
```

### Example 2: REST API (CRUD Users)

**Project Structure:**
```
lambda-crud-api/
├── index.js
├── db.js
├── package.json
└── .env
```

**index.js:**
```javascript
const db = require('./db');

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));

  const { httpMethod, path, pathParameters, body } = event;

  try {
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          // GET /users/{id}
          const user = await db.getUserById(pathParameters.id);
          return response(200, user);
        } else {
          // GET /users
          const users = await db.getAllUsers();
          return response(200, users);
        }

      case 'POST':
        // POST /users
        const newUser = JSON.parse(body);
        const created = await db.createUser(newUser);
        return response(201, created);

      case 'PUT':
        // PUT /users/{id}
        const updateData = JSON.parse(body);
        const updated = await db.updateUser(pathParameters.id, updateData);
        return response(200, updated);

      case 'DELETE':
        // DELETE /users/{id}
        await db.deleteUser(pathParameters.id);
        return response(200, { message: 'User deleted' });

      default:
        return response(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return response(500, { error: error.message });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  };
}
```

**db.js:**
```javascript
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'Users';

async function getAllUsers() {
  const result = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME
  }));
  return result.Items;
}

async function getUserById(id) {
  const result = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
  return result.Item;
}

async function createUser(user) {
  const item = {
    id: Date.now().toString(),
    ...user,
    createdAt: new Date().toISOString()
  };
  
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));
  
  return item;
}

async function updateUser(id, data) {
  const item = {
    id,
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));
  
  return item;
}

async function deleteUser(id) {
  await docClient.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  }));
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
```

**package.json:**
```json
{
  "name": "lambda-crud-api",
  "version": "1.0.0",
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.470.0",
    "@aws-sdk/lib-dynamodb": "^3.470.0"
  }
}
```

**Deploy:**
```bash
# Install dependencies
npm install

# Create deployment package
zip -r function.zip index.js db.js node_modules/

# Update function
aws lambda update-function-code \
  --function-name users-api \
  --zip-file fileb://function.zip
```

### Example 3: S3 Image Processor

**index.js:**
```javascript
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');

const s3Client = new S3Client({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  // Triggered by S3 upload
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;

  console.log(`Processing image: ${bucket}/${key}`);

  try {
    // Download image from S3
    const getCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const { Body } = await s3Client.send(getCommand);
    const imageBuffer = await streamToBuffer(Body);

    // Resize image
    const resized = await sharp(imageBuffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload thumbnail
    const thumbnailKey = key.replace('uploads/', 'thumbnails/');
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: thumbnailKey,
      Body: resized,
      ContentType: 'image/jpeg'
    });
    await s3Client.send(putCommand);

    console.log(`Thumbnail created: ${thumbnailKey}`);

    return { statusCode: 200, body: 'Image processed' };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
```

**Deploy with Layer (for sharp):**
```bash
# Create layer for sharp (native dependency)
mkdir nodejs
npm install --prefix nodejs sharp
zip -r layer.zip nodejs/

# Create layer
aws lambda publish-layer-version \
  --layer-name sharp-layer \
  --zip-file fileb://layer.zip \
  --compatible-runtimes nodejs18.x

# Attach layer to function
aws lambda update-function-configuration \
  --function-name image-processor \
  --layers arn:aws:lambda:us-east-1:123456789012:layer:sharp-layer:1
```

---

## 6. Environment Variables & Secrets

### Environment Variables

**AWS Console:**
Lambda → Configuration → Environment Variables

**CLI:**
```bash
aws lambda update-function-configuration \
  --function-name my-function \
  --environment Variables={DB_HOST=localhost,DB_PORT=3306}
```

**In Code:**
```javascript
exports.handler = async (event) => {
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;
  
  // Use variables...
};
```

### Secrets Manager

**Store Secret:**
```bash
aws secretsmanager create-secret \
  --name prod/db/password \
  --secret-string "mysecretpassword"
```

**Retrieve in Lambda:**
```javascript
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const client = new SecretsManagerClient({ region: 'us-east-1' });

async function getSecret(secretName) {
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const data = await client.send(command);
  return data.SecretString;
}

exports.handler = async (event) => {
  const password = await getSecret('prod/db/password');
  
  // Use password to connect to database...
};
```

---

## 7. Production Best Practices

### 1. Cold Start Optimization

**Problem:** First invocation is slow (~1-3 seconds).

**Solution:**
```javascript
// Initialize outside handler (reused across invocations)
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const dbClient = new DynamoDBClient({ region: 'us-east-1' });

exports.handler = async (event) => {
  // Use dbClient (already initialized)
};
```

### 2. Error Handling

```javascript
exports.handler = async (event) => {
  try {
    // Your code
    return response(200, { message: 'Success' });
  } catch (error) {
    console.error('Error:', error);
    
    // Return proper error response
    return response(500, {
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  };
}
```

### 3. Logging

```javascript
exports.handler = async (event) => {
  // CloudWatch Logs
  console.log('Event:', JSON.stringify(event));
  console.log('Processing request...');
  
  // Structured logging
  console.log(JSON.stringify({
    level: 'INFO',
    message: 'User created',
    userId: '123',
    timestamp: new Date().toISOString()
  }));
};
```

### 4. CORS Headers

```javascript
function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',  // Or specific domain
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    },
    body: JSON.stringify(body)
  };
}
```

### 5. Timeout Configuration

```bash
# Set timeout (default 3 seconds, max 15 minutes)
aws lambda update-function-configuration \
  --function-name my-function \
  --timeout 30
```

### 6. Memory Optimization

```bash
# More memory = more CPU = faster execution
aws lambda update-function-configuration \
  --function-name my-function \
  --memory-size 512
```

**Tip:** Test with different memory sizes to find optimal cost/performance.

### 7. Monitoring

**CloudWatch Metrics:**
- Invocations
- Duration
- Errors
- Throttles

**Set Alarms:**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name lambda-errors \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

---

## 📝 Practice Tasks

### Task 1: Hello World Lambda

Create a simple Lambda function that:
- Returns a JSON response
- Accepts query parameters
- Logs the event

### Task 2: REST API

Build a CRUD API with Lambda + API Gateway for a `Tasks` resource:
- `GET /tasks` - List all tasks
- `POST /tasks` - Create task
- `GET /tasks/{id}` - Get task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### Task 3: S3 Trigger

Create Lambda that:
- Triggers on S3 upload
- Reads file content
- Stores metadata in DynamoDB

### Task 4: Scheduled Task

Create Lambda that runs every hour and:
- Fetches data from an API
- Processes data
- Stores in DynamoDB

See `/tasks` folder for detailed exercises.

---

## 🔗 Quick Reference

### Lambda CLI Commands

```bash
# Create function
aws lambda create-function \
  --function-name my-function \
  --runtime nodejs18.x \
  --role arn:aws:iam::123456789012:role/lambda-role \
  --handler index.handler \
  --zip-file fileb://function.zip

# Update code
aws lambda update-function-code \
  --function-name my-function \
  --zip-file fileb://function.zip

# Invoke
aws lambda invoke \
  --function-name my-function \
  --payload '{"key":"value"}' \
  response.json

# View logs
aws logs tail /aws/lambda/my-function --follow

# Delete
aws lambda delete-function --function-name my-function
```

### Common Runtimes

- Node.js: `nodejs18.x`, `nodejs20.x`
- Python: `python3.11`, `python3.12`
- Java: `java17`, `java21`
- Go: `go1.x`
- .NET: `dotnet6`, `dotnet8`

**Next:** Day 27 - CI/CD with GitHub Actions
