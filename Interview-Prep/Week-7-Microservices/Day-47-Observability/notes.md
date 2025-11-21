# Day 47: Observability - Logging, Monitoring, Tracing

## 📚 Table of Contents
1. Introduction to Observability
2. Centralized Logging
3. Metrics & Monitoring
4. Distributed Tracing
5. Health Checks & Alerting

---

## 1. Introduction to Observability

**Observability** = Ability to understand system internal state from external outputs.

### Three Pillars

```
1. Logs      - What happened? (events, errors)
2. Metrics   - How much/many? (CPU, memory, requests)
3. Traces    - Where is the bottleneck? (request flow)
```

---

## 2. Centralized Logging

### Winston with JSON Format

```typescript
// lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'unknown-service',
    version: process.env.SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Request logging middleware
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  });
  
  next();
}
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

```yaml
# docker-compose.yml
services:
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"

  logstash:
    image: logstash:8.11.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

```typescript
// Ship logs to Logstash
import { transports } from 'winston';
import TransportStream from 'winston-transport';

class LogstashTransport extends TransportStream {
  constructor(opts: any) {
    super(opts);
  }

  log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));
    
    // Send to Logstash via TCP/UDP
    const net = require('net');
    const client = net.createConnection({ port: 5000, host: 'logstash' });
    client.write(JSON.stringify(info) + '\n');
    client.end();
    
    callback();
  }
}

logger.add(new LogstashTransport({}));
```

---

## 3. Metrics & Monitoring

### Prometheus Client

```typescript
// lib/metrics.ts
import promClient from 'prom-client';

// Collect default metrics
promClient.collectDefaultMetrics();

// Custom metrics
export const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

export const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

export const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

export const orderProcessingDuration = new promClient.Summary({
  name: 'order_processing_duration_seconds',
  help: 'Time to process an order',
  percentiles: [0.5, 0.9, 0.99]
});
```

```typescript
// Metrics middleware
import { httpRequestDuration, httpRequestTotal } from './lib/metrics';

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || req.path, status: res.statusCode },
      duration
    );
    
    httpRequestTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });
  });
  
  next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'users-service'
    static_configs:
      - targets: ['users-service:3001']
  
  - job_name: 'orders-service'
    static_configs:
      - targets: ['orders-service:3002']
```

### Grafana Dashboards

```json
{
  "dashboard": {
    "title": "Microservices Overview",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_requests_total[5m])"
        }]
      },
      {
        "title": "Response Time (p95)",
        "targets": [{
          "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
        }]
      },
      {
        "title": "Error Rate",
        "targets": [{
          "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
        }]
      }
    ]
  }
}
```

---

## 4. Distributed Tracing

### OpenTelemetry Setup

```typescript
// lib/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces'
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: process.env.SERVICE_NAME || 'unknown-service'
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().then(() => process.exit(0));
});
```

### Manual Span Creation

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('orders-service');

app.post('/orders', async (req, res) => {
  const span = tracer.startSpan('create_order');
  
  try {
    span.setAttribute('user.id', req.body.userId);
    span.setAttribute('order.total', req.body.total);
    
    // Create order
    const order = await prisma.order.create({ data: req.body });
    
    // Call other service with trace context
    const childSpan = tracer.startSpan('validate_user', { parent: span });
    const user = await validateUser(order.userId);
    childSpan.end();
    
    span.setStatus({ code: 0 }); // Success
    span.end();
    
    res.json(order);
  } catch (error) {
    span.recordException(error as Error);
    span.setStatus({ code: 2, message: (error as Error).message });
    span.end();
    res.status(500).json({ error: 'Failed to create order' });
  }
});
```

### Propagating Trace Context

```typescript
// Automatically propagated by OpenTelemetry
import axios from 'axios';

// Trace context automatically added to headers
const response = await axios.get('http://users-service:3001/users/123');
```

---

## 5. Health Checks & Alerting

### Health Check Endpoints

```typescript
// lib/health.ts
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis();

export async function healthCheck() {
  const checks = {
    database: false,
    redis: false,
    timestamp: new Date().toISOString()
  };

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  // Check Redis
  try {
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  const healthy = checks.database && checks.redis;
  return { healthy, checks };
}

app.get('/health', async (req, res) => {
  const health = await healthCheck();
  res.status(health.healthy ? 200 : 503).json(health);
});

// Liveness probe (is service running?)
app.get('/health/live', (req, res) => {
  res.json({ status: 'alive' });
});

// Readiness probe (is service ready to accept traffic?)
app.get('/health/ready', async (req, res) => {
  const health = await healthCheck();
  res.status(health.healthy ? 200 : 503).json(health);
});
```

### Alerting with Prometheus Alertmanager

```yaml
# alertmanager.yml
groups:
  - name: microservices
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
      
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response time detected"
      
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
```

---

## 📝 Complete Observability Stack

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Logging
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
  
  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
  
  # Metrics
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
  
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
  
  # Tracing
  jaeger:
    image: jaegertracing/all-in-one
    ports:
      - "16686:16686"  # UI
      - "14268:14268"  # Collector
```

---

## 🔗 Quick Reference

| Tool              | Purpose               | Port  |
| ----------------- | --------------------- | ----- |
| **Elasticsearch** | Log storage           | 9200  |
| **Kibana**        | Log visualization     | 5601  |
| **Prometheus**    | Metrics collection    | 9090  |
| **Grafana**       | Metrics visualization | 3000  |
| **Jaeger**        | Distributed tracing   | 16686 |

**Next:** Day 48 - Mini Microservice System Project
