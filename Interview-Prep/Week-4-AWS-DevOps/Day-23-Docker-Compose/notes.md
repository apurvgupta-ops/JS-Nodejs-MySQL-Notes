# Day 23: Docker Compose

## 📚 Table of Contents
1. What is Docker Compose?
2. docker-compose.yml Syntax
3. Multi-Container Architecture
4. Node + Redis + MySQL Example
5. Networking & Volumes
6. Environment Variables
7. Docker Compose Commands

---

## 1. What is Docker Compose?

**Docker Compose** orchestrates multiple containers as a single application.

### Why Docker Compose?

**Without Compose:**
```bash
# Start MySQL
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=secret mysql

# Start Redis
docker run -d --name redis redis

# Start Node app (needs to find MySQL and Redis)
docker run -d --name app --link mysql --link redis -p 3000:3000 my-app
```

**With Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
  
  redis:
    image: redis
  
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mysql
      - redis
```

```bash
# Start everything
docker-compose up
```

---

## 2. docker-compose.yml Syntax

### Basic Structure

```yaml
version: '3.8'  # Compose file version

services:  # Define containers
  service1:
    image: nginx
    ports:
      - "80:80"
  
  service2:
    build: ./app
    environment:
      NODE_ENV: production

networks:  # Custom networks
  my-network:
    driver: bridge

volumes:  # Persistent storage
  my-volume:
    driver: local
```

### Service Configuration

```yaml
services:
  app:
    # Build from Dockerfile
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_VERSION: 18
    
    # Or use existing image
    # image: node:18-alpine
    
    # Container name
    container_name: my-app
    
    # Port mapping
    ports:
      - "3000:3000"  # host:container
    
    # Environment variables
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      REDIS_HOST: redis
    
    # Or load from file
    env_file:
      - .env
    
    # Volumes
    volumes:
      - ./src:/app/src  # Bind mount (development)
      - node_modules:/app/node_modules  # Named volume
    
    # Depends on other services
    depends_on:
      - mysql
      - redis
    
    # Networks
    networks:
      - backend
    
    # Restart policy
    restart: unless-stopped
    
    # Health check
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
    
    # Command override
    command: npm run dev
```

---

## 3. Multi-Container Architecture

### Typical Architecture

```
┌─────────────────────────────────────────────┐
│              Docker Compose                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  │
│  │  Node   │  │  Redis  │  │  MySQL   │  │
│  │   App   │  │  Cache  │  │    DB    │  │
│  └────┬────┘  └────┬────┘  └─────┬────┘  │
│       │            │              │        │
│       └────────────┴──────────────┘        │
│              Backend Network               │
└─────────────────────────────────────────────┘
```

### Service Communication

Containers communicate using **service names** as hostnames.

```javascript
// Node app connects to MySQL
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'mysql',  // Service name in docker-compose.yml
  user: 'root',
  password: 'secret',
  database: 'myapp'
});

// Connect to Redis
const redis = require('redis');
const client = redis.createClient({
  host: 'redis',  // Service name
  port: 6379
});
```

---

## 4. Node + Redis + MySQL Example

### Project Structure

```
my-app/
├── docker-compose.yml
├── Dockerfile
├── .env
├── package.json
├── server.js
└── init.sql
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: mysql-db
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis-cache
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - backend
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Node.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: node-app
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: ${NODE_ENV}
      PORT: 3000
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - backend
    volumes:
      - ./src:/app/src  # Hot reload for development
      - /app/node_modules  # Don't override node_modules
    restart: unless-stopped

networks:
  backend:
    driver: bridge

volumes:
  mysql-data:
  redis-data:
```

### .env

```env
NODE_ENV=development

# MySQL
DB_ROOT_PASSWORD=rootsecret
DB_NAME=myapp
DB_USER=appuser
DB_PASSWORD=appsecret

# Redis
REDIS_PASSWORD=redissecret
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### server.js

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const redis = require('redis');

const app = express();
app.use(express.json());

// MySQL connection pool
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Redis client
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect();

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check MySQL
    await dbPool.query('SELECT 1');
    
    // Check Redis
    await redisClient.ping();
    
    res.json({ status: 'healthy', services: { mysql: 'up', redis: 'up' } });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Get users (with Redis cache)
app.get('/users', async (req, res) => {
  try {
    // Check cache
    const cached = await redisClient.get('users');
    if (cached) {
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }
    
    // Query database
    const [users] = await dbPool.query('SELECT * FROM users');
    
    // Cache for 60 seconds
    await redisClient.setEx('users', 60, JSON.stringify(users));
    
    res.json({ source: 'database', data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const [result] = await dbPool.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    
    // Invalidate cache
    await redisClient.del('users');
    
    res.status(201).json({ id: result.insertId, name, email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
```

### init.sql

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com');
```

### package.json

```json
{
  "name": "node-redis-mysql-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "redis": "^4.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## 5. Networking & Volumes

### Networking

**Default Network:**
```yaml
services:
  app:
    image: my-app
  db:
    image: mysql
# Both automatically on same network
# Can reach each other by service name
```

**Custom Networks:**
```yaml
services:
  frontend:
    image: nginx
    networks:
      - frontend-net
  
  backend:
    image: my-api
    networks:
      - frontend-net
      - backend-net
  
  db:
    image: mysql
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:
```

```
┌─────────┐
│ Nginx   │
└────┬────┘
     │ frontend-net
┌────┴────┐
│   API   │
└────┬────┘
     │ backend-net
┌────┴────┐
│  MySQL  │
└─────────┘
```

### Volumes

**Named Volumes (Persistent Data):**
```yaml
services:
  mysql:
    image: mysql
    volumes:
      - mysql-data:/var/lib/mysql  # Named volume

volumes:
  mysql-data:  # Persists after container stops
```

**Bind Mounts (Development):**
```yaml
services:
  app:
    image: my-app
    volumes:
      - ./src:/app/src  # Host directory → Container
      # Changes on host immediately reflected in container
```

**Anonymous Volumes:**
```yaml
services:
  app:
    image: my-app
    volumes:
      - /app/node_modules  # Prevents override from bind mount
```

---

## 6. Environment Variables

### Method 1: Inline

```yaml
services:
  app:
    environment:
      NODE_ENV: production
      DB_HOST: mysql
```

### Method 2: .env File

```yaml
services:
  app:
    env_file:
      - .env
```

**.env:**
```env
NODE_ENV=production
DB_HOST=mysql
DB_PASSWORD=secret
```

### Method 3: Variable Substitution

```yaml
services:
  app:
    environment:
      DB_PASSWORD: ${DB_PASSWORD}  # From host environment or .env
```

### Override for Different Environments

**docker-compose.yml (base):**
```yaml
services:
  app:
    build: .
    environment:
      NODE_ENV: development
```

**docker-compose.prod.yml (production override):**
```yaml
services:
  app:
    environment:
      NODE_ENV: production
    restart: always
```

```bash
# Use production config
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

## 7. Docker Compose Commands

### Basic Commands

```bash
# Start services
docker-compose up
docker-compose up -d  # Detached mode (background)

# Start specific services
docker-compose up app redis

# Build and start
docker-compose up --build

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v

# View logs
docker-compose logs
docker-compose logs -f  # Follow
docker-compose logs app  # Specific service

# List running services
docker-compose ps

# Execute command in service
docker-compose exec app sh
docker-compose exec mysql mysql -u root -p

# Run one-off command
docker-compose run app npm test

# Restart services
docker-compose restart
docker-compose restart app

# View service config
docker-compose config

# Scale services
docker-compose up -d --scale app=3

# Pull latest images
docker-compose pull

# Build images
docker-compose build
docker-compose build --no-cache
```

### Development Workflow

```bash
# Initial setup
docker-compose up -d

# View logs
docker-compose logs -f app

# Make code changes (auto-reload with volume mount)

# Rebuild after dependency change
docker-compose up -d --build app

# Access database
docker-compose exec mysql mysql -u root -p

# Access Redis
docker-compose exec redis redis-cli

# Run migrations
docker-compose exec app npm run migrate

# Run tests
docker-compose run --rm app npm test

# Stop everything
docker-compose down
```

### Production Workflow

```bash
# Build for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start in production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Monitor
docker-compose ps
docker-compose logs -f

# Update application
docker-compose pull app
docker-compose up -d app

# Backup database
docker-compose exec mysql mysqldump -u root -p myapp > backup.sql

# Cleanup
docker-compose down
```

---

## 📝 Best Practices

### 1. Health Checks

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      start_period: 40s
      retries: 3
    depends_on:
      db:
        condition: service_healthy  # Wait for DB to be healthy
```

### 2. Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### 3. Security

```yaml
services:
  db:
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password
    secrets:
      - db_root_password

secrets:
  db_root_password:
    file: ./secrets/db_root_password.txt
```

### 4. Separate Configs

```yaml
# docker-compose.yml - Base config
# docker-compose.dev.yml - Development overrides
# docker-compose.prod.yml - Production overrides
```

### 5. Named Volumes for Data

```yaml
volumes:
  mysql-data:
  redis-data:
  # Data persists across restarts
```

---

## 📝 Practice Tasks

### Task 1: Build Multi-Container App

Create Node.js + PostgreSQL + Redis app with Docker Compose.

**Requirements:**
- API with CRUD operations
- Redis caching
- PostgreSQL persistence
- Health checks

### Task 2: Development vs Production

Create two compose files:
- `docker-compose.dev.yml` with hot reload
- `docker-compose.prod.yml` optimized for production

### Task 3: Add Nginx Reverse Proxy

Add Nginx service to existing Node + MySQL + Redis setup.

```
Client → Nginx → Node App → MySQL/Redis
```

See `/tasks` folder for detailed exercises and solutions.

---

## 🔗 Quick Reference

### Common Issues

**Issue: Port already in use**
```bash
# Change port mapping
ports:
  - "3001:3000"  # Use different host port
```

**Issue: Service not reachable**
```yaml
# Ensure services on same network
services:
  app:
    networks:
      - backend
  db:
    networks:
      - backend
```

**Issue: Data lost after restart**
```yaml
# Use named volumes
volumes:
  - db-data:/var/lib/mysql

volumes:
  db-data:
```

**Next:** Day 24 - AWS IAM & EC2 Deployment
