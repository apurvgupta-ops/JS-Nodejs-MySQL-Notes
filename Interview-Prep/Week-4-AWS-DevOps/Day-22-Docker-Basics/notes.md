# Day 22: Docker Basics

## 📚 Table of Contents
1. What is Docker?
2. Docker Architecture
3. Docker Images & Layers
4. Layer Caching & Optimization
5. Building Dockerfile for Node.js
6. Best Practices
7. Docker Commands Reference

---

## 1. What is Docker?

**Docker** is a platform for developing, shipping, and running applications in **containers**.

### Why Docker?

**Without Docker:**
```
Developer: "Works on my machine!" 🤷
Production: Different OS, different Node version, missing dependencies ❌
```

**With Docker:**
```
Developer: Builds container with exact environment ✅
Production: Runs same container ✅
Staging: Runs same container ✅
```

### Benefits

| Benefit         | Description                          |
| --------------- | ------------------------------------ |
| **Consistency** | Same environment everywhere          |
| **Isolation**   | Apps don't interfere with each other |
| **Portability** | Run anywhere (laptop, server, cloud) |
| **Efficiency**  | Lightweight (shares OS kernel)       |
| **Scalability** | Easy to scale horizontally           |

---

## 2. Docker Architecture

### Components

```
┌─────────────────────────────────────┐
│         Docker Client               │
│      (docker commands)              │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│       Docker Daemon                 │
│    (dockerd - manages containers)   │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        ↓             ↓
   ┌─────────┐   ┌─────────┐
   │  Images │   │Container│
   └─────────┘   └─────────┘
```

### Key Concepts

**Image:** Blueprint/template (like a class)  
**Container:** Running instance (like an object)  
**Dockerfile:** Instructions to build an image  
**Registry:** Storage for images (Docker Hub)

```
Dockerfile → (build) → Image → (run) → Container
```

---

## 3. Docker Images & Layers

### Image Layers

Images are built from **layers** stacked on top of each other.

```
┌──────────────────────┐
│ Layer 4: npm install │  ← Your dependencies
├──────────────────────┤
│ Layer 3: COPY code   │  ← Your application
├──────────────────────┤
│ Layer 2: Node.js     │  ← Runtime
├──────────────────────┤
│ Layer 1: Base OS     │  ← Ubuntu/Alpine
└──────────────────────┘
```

**Key Points:**
- Each `RUN`, `COPY`, `ADD` creates a new layer
- Layers are **cached** and **reused**
- Layers are **read-only** (except top layer)
- Smaller layers = faster builds

### Viewing Layers

```bash
# See image layers
docker history my-node-app

# Output:
IMAGE          CREATED BY                                      SIZE
abc123         COPY . /app                                     5MB
def456         RUN npm install                                 200MB
ghi789         FROM node:18-alpine                            100MB
```

---

## 4. Layer Caching & Optimization

### How Caching Works

Docker caches each layer. If nothing changed, it reuses the cached layer.

**Bad Example (Cache miss on every build):**

```dockerfile
FROM node:18-alpine

# Copy everything (includes package.json)
COPY . /app

# Install dependencies
RUN npm install

# If ANY file changes → cache invalidated → npm install runs again! ❌
```

**Good Example (Cache hit for dependencies):**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies (cached if package.json unchanged)
RUN npm install

# Copy rest of code (doesn't invalidate npm install cache)
COPY . .

# ✅ Code changes don't trigger npm install!
```

### Cache Invalidation

```
Layer 1: FROM node:18        (cached ✅)
Layer 2: COPY package.json   (cached ✅ - file unchanged)
Layer 3: RUN npm install     (cached ✅ - previous layer cached)
Layer 4: COPY . .            (❌ rebuilt - files changed)
Layer 5: CMD ["node", "app"] (❌ rebuilt - previous layer changed)
```

---

## 5. Building Dockerfile for Node.js

### Basic Dockerfile

```dockerfile
# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t my-node-app .

# Run container
docker run -p 3000:3000 my-node-app

# Run in background
docker run -d -p 3000:3000 my-node-app

# View running containers
docker ps

# Stop container
docker stop <container-id>
```

### Multi-Stage Build (Production)

Reduces image size by separating build and runtime.

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Optional: Build step (TypeScript, etc.)
# RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Use non-root user for security
USER node

EXPOSE 3000

CMD ["node", "server.js"]
```

**Benefits:**
- ✅ Smaller final image (no build tools)
- ✅ Faster deployments
- ✅ More secure

### Example: Express App

**Project structure:**
```
my-app/
├── Dockerfile
├── .dockerignore
├── package.json
├── server.js
└── src/
    └── routes/
```

**server.js:**
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Hello from Docker!' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy source code
COPY . .

# Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "server.js"]
```

**.dockerignore:**
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.DS_Store
*.log
.vscode
```

**Build and run:**
```bash
# Build
docker build -t express-app .

# Run with environment variable
docker run -p 3000:3000 -e PORT=3000 express-app

# Test
curl http://localhost:3000
# {"message":"Hello from Docker!"}
```

---

## 6. Best Practices

### 1. Use Specific Image Tags

```dockerfile
# ❌ Bad: Latest might break
FROM node:latest

# ✅ Good: Pin to specific version
FROM node:18.17.0-alpine

# ✅ Better: Use Alpine for smaller size
FROM node:18-alpine
```

### 2. Optimize Layer Order

```dockerfile
# ✅ Good: Least frequently changed → Most frequently changed
FROM node:18-alpine
WORKDIR /app

# Rarely changes
COPY package*.json ./
RUN npm ci --only=production

# Changes often
COPY . .
```

### 3. Use .dockerignore

```
# .dockerignore
node_modules
.git
.env
*.log
coverage/
dist/
.vscode/
```

### 4. Run as Non-Root User

```dockerfile
# Create user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Switch to user
USER nodejs

# Now container runs as nodejs user (not root)
```

### 5. Use npm ci Instead of npm install

```dockerfile
# ❌ npm install: Uses package-lock.json as fallback
RUN npm install

# ✅ npm ci: Requires package-lock.json, faster, more reliable
RUN npm ci --only=production
```

### 6. Multi-Stage for Smaller Images

```dockerfile
# Build stage (includes dev dependencies)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage (only runtime dependencies)
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
CMD ["node", "dist/server.js"]
```

### 7. Environment Variables

```dockerfile
# Default values
ENV NODE_ENV=production
ENV PORT=3000

# Override at runtime:
# docker run -e NODE_ENV=development -e PORT=8080 my-app
```

### 8. Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"
```

### 9. Minimize Layer Count

```dockerfile
# ❌ Bad: Multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# ✅ Good: Single layer
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 10. Use Build Arguments

```dockerfile
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine

ARG APP_PORT=3000
ENV PORT=${APP_PORT}

# Build with custom args:
# docker build --build-arg NODE_VERSION=20 --build-arg APP_PORT=8080 -t my-app .
```

---

## 7. Docker Commands Reference

### Image Commands

```bash
# Build image
docker build -t my-app .
docker build -t my-app:v1.0 .  # With tag

# List images
docker images

# Remove image
docker rmi my-app

# Pull from registry
docker pull node:18-alpine

# Push to registry
docker push username/my-app:v1.0

# Tag image
docker tag my-app:latest my-app:v1.0

# Save/load image
docker save my-app > my-app.tar
docker load < my-app.tar

# View image details
docker inspect my-app
docker history my-app  # See layers
```

### Container Commands

```bash
# Run container
docker run my-app
docker run -d my-app                    # Detached (background)
docker run -p 3000:3000 my-app          # Port mapping
docker run -e NODE_ENV=dev my-app       # Environment variable
docker run -v $(pwd):/app my-app        # Volume mount
docker run --name my-container my-app   # Named container
docker run --rm my-app                  # Auto-remove after stop

# List containers
docker ps           # Running
docker ps -a        # All (including stopped)

# Stop container
docker stop <container-id>
docker stop $(docker ps -q)  # Stop all

# Remove container
docker rm <container-id>
docker rm -f <container-id>  # Force remove running container

# View logs
docker logs <container-id>
docker logs -f <container-id>  # Follow logs

# Execute command in container
docker exec -it <container-id> sh
docker exec <container-id> ls /app

# Copy files
docker cp <container-id>:/app/file.txt ./
docker cp ./file.txt <container-id>:/app/

# View container details
docker inspect <container-id>
docker stats <container-id>  # Resource usage
```

### Cleanup Commands

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything unused
docker system prune

# Remove everything (including volumes)
docker system prune -a --volumes

# View disk usage
docker system df
```

---

## 📝 Practice Tasks

### Task 1: Basic Node.js Dockerfile

Create a Dockerfile for a simple Express app with optimized caching.

**Requirements:**
- Use Node.js 18 Alpine
- Install dependencies with caching
- Run as non-root user
- Expose port 3000

### Task 2: Multi-Stage Build

Build a TypeScript Node.js app with multi-stage Dockerfile.

**Requirements:**
- Stage 1: Build TypeScript
- Stage 2: Production runtime
- Compare image sizes

### Task 3: Debug Slow Builds

Given a slow-building Dockerfile, optimize it for faster builds.

### Task 4: Environment-Specific Images

Create Dockerfiles for development and production environments.

See `/tasks` folder for detailed exercises and solutions.

---

## 🔗 Quick Reference

### Image Size Comparison

| Base Image       | Size    |
| ---------------- | ------- |
| `node:18`        | ~900 MB |
| `node:18-slim`   | ~180 MB |
| `node:18-alpine` | ~110 MB |

**Recommendation:** Use `alpine` for production.

### Common Issues

**Issue: node_modules cached incorrectly**
```dockerfile
# Solution: Copy package.json before npm install
COPY package*.json ./
RUN npm ci
COPY . .
```

**Issue: Container exits immediately**
```bash
# Check logs
docker logs <container-id>

# Run interactively
docker run -it my-app sh
```

**Issue: Port not accessible**
```bash
# Ensure port mapping: -p <host>:<container>
docker run -p 3000:3000 my-app
```

---

## 📖 Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Docker Hub](https://hub.docker.com/)

**Next:** Day 23 - Docker Compose for multi-container applications
