# Day 28: Revision & Mock Interview - DevOps Mastery

## 🎯 Overview

This is your final day to **consolidate**, **revise**, and **practice** everything you've learned in Week 4 about AWS, Docker, and DevOps.

---

## 📚 Quick Revision Summary

### Docker (Days 22-23)

**Key Concepts:**
- **Images & Containers:** Images are templates, containers are running instances
- **Layers:** Each Dockerfile instruction creates a layer (cached for faster builds)
- **Multi-stage Builds:** Reduce image size by separating build and runtime stages
- **Docker Compose:** Orchestrate multiple containers (Node + Redis + MySQL)

**Essential Commands:**
```bash
# Images
docker build -t myapp .
docker images
docker rmi myapp

# Containers
docker run -d -p 3000:3000 myapp
docker ps
docker stop <container-id>
docker logs <container-id>

# Docker Compose
docker-compose up -d
docker-compose down
docker-compose logs -f
```

**Best Practices:**
- Use specific image tags (`node:18-alpine`)
- Optimize layer caching (COPY package.json before source code)
- Run as non-root user
- Use `.dockerignore`
- Multi-stage builds for production

---

### AWS (Days 24-26)

**IAM:**
- **Users:** Individual identities
- **Groups:** Collection of users
- **Roles:** Temporary permissions for services
- **Policies:** JSON documents defining permissions

**EC2:**
- Virtual servers in the cloud
- **Instance Types:** t2.micro (free tier), t3.small, etc.
- **Security Groups:** Firewall rules (SSH port 22, HTTP port 80)
- **Deployment:** Install Node.js, PM2, Nginx

**S3:**
- Object storage (unlimited capacity)
- **Presigned URLs:** Temporary access to private objects
- **Use Cases:** File uploads, static assets, backups

**Lambda:**
- Serverless functions (no server management)
- **Handler:** Entry point (`exports.handler = async (event, context) => {}`)
- **API Gateway:** HTTP endpoints triggering Lambda
- **Pricing:** Pay per execution (1M free requests/month)

---

### CI/CD (Day 27)

**GitHub Actions:**
- **Workflow:** Automated process (YAML file in `.github/workflows/`)
- **Jobs:** Parallel or sequential tasks
- **Steps:** Individual actions or commands

**Deployment Strategies:**
1. **SSH:** SSH into EC2, pull code, restart PM2
2. **Docker:** Build image, push to registry, pull and run on EC2

**Best Practices:**
- Use secrets for sensitive data
- Cache dependencies
- Health checks after deployment
- Environment-specific workflows (staging, production)

---

## ❓ 15 DevOps Interview Questions

### 1. What is Docker and why use it?

**Answer:**
Docker is a containerization platform that packages applications with dependencies into portable containers.

**Benefits:**
- **Consistency:** Same environment in dev, staging, production
- **Isolation:** Apps don't interfere with each other
- **Portability:** Run anywhere (local, cloud, CI/CD)
- **Efficiency:** Lightweight compared to VMs

**Example:**
```
Development: node:18-alpine + npm packages + my code
Production: SAME container → No "works on my machine"
```

---

### 2. Difference between Docker Image and Container?

**Answer:**
- **Image:** Read-only template (like a class in OOP)
- **Container:** Running instance of an image (like an object)

**Analogy:**
```
Image = Recipe
Container = Actual dish prepared from recipe
```

**Example:**
```bash
docker images  # List templates
docker ps      # List running instances
```

---

### 3. How does Docker layer caching work?

**Answer:**
Docker caches each layer. If a layer hasn't changed, it reuses the cached version.

**Bad Dockerfile (cache miss on every build):**
```dockerfile
FROM node:18-alpine
COPY . .              # Changes every time
RUN npm install       # Reinstalls every time
```

**Good Dockerfile (cache preserved):**
```dockerfile
FROM node:18-alpine
COPY package*.json ./ # Only invalidates if dependencies change
RUN npm install       # Cached if package.json unchanged
COPY . .              # Changes don't affect npm install cache
```

---

### 4. What is multi-stage Docker build?

**Answer:**
Multi-stage builds use multiple `FROM` statements to separate build and runtime environments.

**Benefits:**
- Smaller final image (no build tools in production)
- More secure (fewer attack surfaces)

**Example:**
```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

**Result:** 900MB build image → 110MB production image

---

### 5. Explain Docker Compose and when to use it.

**Answer:**
Docker Compose orchestrates multiple containers as a single application.

**Use Cases:**
- Multi-service apps (Node + Redis + MySQL)
- Development environments
- Testing with dependencies

**Example:**
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - redis
      - mysql
  
  redis:
    image: redis:7-alpine
  
  mysql:
    image: mysql:8.0
```

**Commands:**
```bash
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
```

---

### 6. What is AWS IAM and why is it important?

**Answer:**
IAM (Identity and Access Management) controls **who** can access **what** in AWS.

**Components:**
- **Users:** Individual identities
- **Groups:** Collection of users (e.g., Developers, Admins)
- **Roles:** Temporary permissions for services (e.g., EC2 accessing S3)
- **Policies:** JSON documents defining permissions

**Best Practice:**
- Never use root account for daily tasks
- Use IAM roles for EC2/Lambda (not hardcoded credentials)
- Grant least privilege (minimum permissions needed)

**Example Policy:**
```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
```

---

### 7. How do you deploy a Node.js app to EC2?

**Answer:**

**Steps:**
1. **Launch EC2 instance** (t2.micro Ubuntu)
2. **Configure security group** (SSH 22, HTTP 80, Custom 3000)
3. **SSH into instance:** `ssh -i key.pem ubuntu@<IP>`
4. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
5. **Install PM2:** `sudo npm install -g pm2`
6. **Clone app:** `git clone <repo>`
7. **Install deps:** `npm install`
8. **Start with PM2:** `pm2 start server.js --name my-app`
9. **Setup Nginx reverse proxy** (port 80 → 3000)

**Nginx Config:**
```nginx
location / {
  proxy_pass http://localhost:3000;
  proxy_set_header Host $host;
}
```

---

### 8. What are S3 presigned URLs and when to use them?

**Answer:**
Presigned URLs provide **temporary access** to private S3 objects without exposing AWS credentials.

**Use Cases:**
- Secure file uploads (client → S3 directly)
- Temporary download links
- Sharing private files

**Flow:**
```
1. Client requests upload URL from server
2. Server generates presigned URL (valid 5 min)
3. Client uploads directly to S3 using URL
4. No server bandwidth used
```

**Code:**
```javascript
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const url = await getSignedUrl(s3Client, putCommand, { expiresIn: 300 });
```

---

### 9. Difference between EC2 and Lambda?

**Answer:**

| Feature        | EC2                    | Lambda            |
| -------------- | ---------------------- | ----------------- |
| **Management** | Manual (OS, updates)   | Fully managed     |
| **Scaling**    | Manual or auto-scaling | Automatic         |
| **Pricing**    | Pay for uptime         | Pay per execution |
| **Execution**  | Always running         | Event-driven      |
| **Use Case**   | Long-running apps      | Short tasks, APIs |

**When to use EC2:**
- Full control needed
- Long-running processes
- Stateful applications

**When to use Lambda:**
- Event-driven workloads
- REST APIs (with API Gateway)
- Scheduled tasks

---

### 10. What is a Lambda cold start and how to minimize it?

**Answer:**
**Cold start** = Delay when Lambda initializes for the first time (~1-3 seconds).

**Causes:**
- Creating execution environment
- Loading runtime
- Initializing code

**Optimization:**
```javascript
// ❌ Bad: Initialize inside handler
exports.handler = async (event) => {
  const dbClient = new DynamoDBClient({ ... });
  // Initialized every invocation
};

// ✅ Good: Initialize outside handler
const dbClient = new DynamoDBClient({ ... });  // Reused across invocations

exports.handler = async (event) => {
  // Use dbClient (already initialized)
};
```

**Other Strategies:**
- Keep functions warm (scheduled pings)
- Provisioned concurrency (AWS feature)
- Use lighter runtimes (Node.js faster than Java)

---

### 11. What is CI/CD?

**Answer:**
- **CI (Continuous Integration):** Automatically build & test on every commit
- **CD (Continuous Deployment):** Automatically deploy after tests pass

**Benefits:**
- Faster releases
- Fewer bugs (automated testing)
- Consistent deployments
- Quick rollback

**Example Pipeline:**
```
Developer pushes code
  ↓
GitHub Actions triggered
  ↓
Run tests
  ↓ (if pass)
Build Docker image
  ↓
Push to Docker Hub
  ↓
Deploy to EC2
  ↓
Health check
```

---

### 12. Explain a GitHub Actions workflow.

**Answer:**
A workflow is an automated process defined in YAML.

**Components:**
- **Trigger:** `on: push, pull_request, schedule`
- **Jobs:** Tasks that run (can be parallel or sequential)
- **Steps:** Individual actions or commands

**Example:**
```yaml
name: CI

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
  
  deploy:
    needs: test  # Wait for test job
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

---

### 13. How do you secure sensitive data in CI/CD?

**Answer:**
Use **GitHub Secrets** to store sensitive data (passwords, API keys, SSH keys).

**Setup:**
1. GitHub → Repository → Settings → Secrets
2. Add secrets (e.g., `EC2_SSH_KEY`, `DB_PASSWORD`)
3. Reference in workflow: `${{ secrets.EC2_SSH_KEY }}`

**Example:**
```yaml
steps:
  - name: Deploy
    uses: appleboy/ssh-action@master
    with:
      host: ${{ secrets.EC2_HOST }}
      username: ubuntu
      key: ${{ secrets.EC2_SSH_KEY }}
```

**Best Practices:**
- Never commit secrets to code
- Use environment-specific secrets
- Rotate secrets regularly

---

### 14. Difference between volumes and bind mounts in Docker?

**Answer:**

| Type                 | Description                | Use Case                    |
| -------------------- | -------------------------- | --------------------------- |
| **Bind Mount**       | Host directory → Container | Development (hot reload)    |
| **Named Volume**     | Managed by Docker          | Persistent data (databases) |
| **Anonymous Volume** | Temporary, auto-created    | Prevent override            |

**Example:**
```yaml
services:
  app:
    volumes:
      - ./src:/app/src           # Bind mount (development)
      - /app/node_modules        # Anonymous volume
  
  mysql:
    volumes:
      - mysql-data:/var/lib/mysql  # Named volume (persistent)

volumes:
  mysql-data:
```

---

### 15. How would you implement zero-downtime deployment?

**Answer:**
Use **Blue-Green Deployment** or **Rolling Updates**.

**Blue-Green Strategy:**
```
Blue (current) → Running on port 3000
Green (new)    → Deploy to port 3001

1. Deploy to Green
2. Health check Green
3. Switch Nginx to point to Green (port 3001)
4. Stop Blue
```

**Rolling Update (Docker Compose):**
```bash
# Update one container at a time
docker-compose up -d --scale app=2  # 2 instances
docker-compose up -d --no-deps app  # Update without downtime
```

**Health Checks:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 10s
  retries: 3
```

**Load Balancer:**
- Use Nginx/HAProxy to distribute traffic
- Remove unhealthy instances automatically

---

## 🎤 Mock Interview Practice

### Scenario-Based Questions

#### Q1: Design a deployment pipeline for a Node.js app

**Expected Answer:**
```
1. Code pushed to GitHub
2. GitHub Actions triggers:
   a. Install dependencies
   b. Run linter
   c. Run tests
   d. Build Docker image
   e. Push to Docker Hub
3. If tests pass:
   a. SSH into EC2
   b. Pull latest image
   c. Stop old container
   d. Start new container
   e. Health check
4. If health check fails:
   a. Rollback to previous version
```

---

#### Q2: You need to store user uploads. What AWS service and how?

**Expected Answer:**
**Service:** S3

**Flow:**
1. Client requests upload URL from server
2. Server generates S3 presigned URL (expires in 5 min)
3. Client uploads directly to S3
4. Server stores S3 key in database

**Benefits:**
- No server bandwidth
- Scalable storage
- Presigned URL = secure (no exposed credentials)

**Code:**
```javascript
// Server
const uploadUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 300 });
res.json({ uploadUrl, key });

// Client
await fetch(uploadUrl, { method: 'PUT', body: file });
```

---

#### Q3: Application runs fine locally but crashes in Docker. How to debug?

**Expected Answer:**

**Steps:**
1. **Check logs:**
   ```bash
   docker logs <container-id>
   ```

2. **Exec into container:**
   ```bash
   docker exec -it <container-id> sh
   ls -la
   env
   ```

3. **Common issues:**
   - **Port mismatch:** Dockerfile `EXPOSE 3000` but app runs on 8080
   - **Environment variables missing:** Add to `docker run -e NODE_ENV=production`
   - **Permissions:** Run as non-root user
   - **Missing dependencies:** Check `package.json` includes all deps

4. **Test build:**
   ```bash
   docker build -t myapp .
   docker run -it myapp sh  # Interactive shell
   ```

---

## 📝 Hands-On Challenge

### Build Complete DevOps Pipeline

**Requirements:**
1. Node.js REST API (Express)
2. Dockerfile (multi-stage, optimized)
3. docker-compose.yml (Node + Redis + PostgreSQL)
4. GitHub Actions workflow:
   - CI: Test on every PR
   - CD: Deploy to EC2 on merge to main
5. EC2 deployment with PM2

**Bonus:**
- S3 integration for file uploads
- Lambda function triggered by S3 upload
- Health check endpoint

**Time:** 2-3 hours

**Evaluation:**
- Does pipeline work end-to-end?
- Are Docker best practices followed?
- Is deployment automated?
- Are secrets managed securely?

---

## 🗂️ Quick Reference Cheat Sheet

### Docker Commands
```bash
docker build -t myapp .
docker run -d -p 3000:3000 myapp
docker ps
docker logs <id>
docker exec -it <id> sh
docker-compose up -d
docker-compose down
```

### AWS CLI
```bash
# EC2
aws ec2 describe-instances
aws ec2 start-instances --instance-ids i-123

# S3
aws s3 cp file.txt s3://bucket/
aws s3 ls s3://bucket/

# Lambda
aws lambda invoke --function-name fn response.json
```

### GitHub Actions Syntax
```yaml
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test
```

---

## ✅ Final Checklist

Before your interview, ensure you can:

- [ ] Explain Docker images, containers, and layers
- [ ] Write optimized Dockerfile with multi-stage builds
- [ ] Use Docker Compose for multi-container apps
- [ ] Describe AWS IAM (users, groups, roles, policies)
- [ ] Deploy Node.js app to EC2 (SSH, PM2, Nginx)
- [ ] Implement S3 file uploads with presigned URLs
- [ ] Create Lambda function with API Gateway
- [ ] Write GitHub Actions workflow for CI/CD
- [ ] Deploy to EC2 using GitHub Actions
- [ ] Debug containerized applications
- [ ] Design deployment pipeline
- [ ] Implement zero-downtime deployment

---

## 🎯 Interview Tips

1. **Explain the "Why":** Don't just say what you did, explain why you chose that approach
2. **Trade-offs:** Discuss pros/cons (e.g., "Lambda is cheaper but has cold starts")
3. **Real Examples:** Mention projects where you used these tools
4. **Ask Clarifying Questions:** Before answering system design questions
5. **Think Aloud:** Interviewers want to see your thought process
6. **Security First:** Always mention security best practices

---

## 📖 What's Next?

After completing Week 4, you have covered:
- **Week 1:** Node.js fundamentals
- **Week 2:** Databases (SQL, NoSQL, Redis)
- **Week 3:** System design (Load balancing, Caching, Scaling, Message Queues)
- **Week 4:** AWS + DevOps + Docker

**Next Steps:**
1. Build a complete project using all 4 weeks' knowledge
2. Practice mock interviews (LeetCode, Pramp, Interviewing.io)
3. Contribute to open source projects
4. Stay updated with latest DevOps trends

---

## 🚀 Good Luck!

You've covered a comprehensive curriculum. Stay confident, practice regularly, and you'll ace your backend interviews!

**Remember:**
- Consistency > Intensity
- Build projects to solidify learning
- Interview others to improve your own skills
- Never stop learning

**Questions? Stuck somewhere?**
- Review previous days' materials
- Practice hands-on tasks
- Join developer communities (Discord, Reddit)

---

**End of Week 4: AWS + DevOps + Docker** 🎉

You are now ready for **backend engineer interviews**!
