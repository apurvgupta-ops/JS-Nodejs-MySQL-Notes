# Day 27: CI/CD with GitHub Actions

## 📚 Table of Contents
1. Introduction to CI/CD
2. GitHub Actions Basics
3. Workflow Syntax
4. Build & Test Pipeline
5. Deploy to EC2
6. Secrets Management
7. Production Best Practices

---

## 1. Introduction to CI/CD

**CI/CD = Continuous Integration / Continuous Deployment**

### What is CI/CD?

**Continuous Integration (CI):**
- Automatically build and test code on every commit
- Catch bugs early
- Ensure code quality

**Continuous Deployment (CD):**
- Automatically deploy to production after tests pass
- Faster releases
- Reduce manual errors

### Traditional vs CI/CD

**Traditional:**
```
Developer → Manual Testing → Manual Deployment
(slow, error-prone, inconsistent)
```

**CI/CD:**
```
Developer → Push Code → Automated Tests → Automated Deployment
(fast, reliable, consistent)
```

### Benefits

| Benefit                    | Description                        |
| -------------------------- | ---------------------------------- |
| **Faster Releases**        | Deploy multiple times per day      |
| **Fewer Bugs**             | Automated testing catches issues   |
| **Consistency**            | Same process every time            |
| **Developer Productivity** | Focus on code, not deployment      |
| **Rollback**               | Easy to revert to previous version |

---

## 2. GitHub Actions Basics

**GitHub Actions** automates workflows directly in GitHub.

### Key Concepts

```
┌─────────────────────────────────────┐
│          Repository                 │
├─────────────────────────────────────┤
│                                     │
│  .github/workflows/                 │
│    ├── ci.yml      ← Workflow       │
│    └── deploy.yml                   │
│                                     │
│  Workflow = YAML file               │
│    ├── Triggered by events          │
│    │   (push, pull_request, etc.)   │
│    │                                │
│    └── Contains Jobs                │
│          ├── Job 1: Build           │
│          └── Job 2: Deploy          │
│                 └── Steps           │
│                    ├── Checkout     │
│                    ├── Install deps │
│                    └── Deploy       │
└─────────────────────────────────────┘
```

### Workflow Components

| Component    | Description                     |
| ------------ | ------------------------------- |
| **Workflow** | Automated process (YAML file)   |
| **Event**    | Trigger (push, PR, schedule)    |
| **Job**      | Group of steps (runs on runner) |
| **Step**     | Individual task                 |
| **Action**   | Reusable command                |
| **Runner**   | Server that runs workflows      |

---

## 3. Workflow Syntax

### Basic Structure

**.github/workflows/ci.yml:**
```yaml
name: CI Pipeline  # Workflow name

on:  # Events that trigger workflow
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:  # Jobs to run
  build:
    runs-on: ubuntu-latest  # Runner environment
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
```

### Triggers (on)

**Push:**
```yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'src/**'
      - 'package.json'
```

**Pull Request:**
```yaml
on:
  pull_request:
    branches: [ main ]
    types: [ opened, synchronize ]
```

**Schedule (Cron):**
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Every day at 2 AM
```

**Multiple Events:**
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:  # Manual trigger
```

### Jobs

**Single Job:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."
```

**Multiple Jobs (Parallel):**
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
  
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

**Sequential Jobs:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
  
  deploy:
    runs-on: ubuntu-latest
    needs: build  # Wait for build to finish
    steps:
      - run: npm run deploy
```

### Steps

**Using Actions:**
```yaml
steps:
  - uses: actions/checkout@v3
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
```

**Running Commands:**
```yaml
steps:
  - name: Install dependencies
    run: npm install
  
  - name: Build
    run: npm run build
```

**Multi-line Commands:**
```yaml
steps:
  - name: Setup
    run: |
      echo "Setting up environment"
      npm install
      npm run build
```

---

## 4. Build & Test Pipeline

### Complete CI Pipeline

**.github/workflows/ci.yml:**
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16, 18, 20]  # Test on multiple Node versions

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Run build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

### With Docker

**.github/workflows/docker.yml:**
```yaml
name: Docker Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: username/app:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 5. Deploy to EC2

### Deployment Strategies

**1. SSH & Deploy**
- SSH into EC2
- Pull latest code
- Restart application

**2. Docker Image**
- Build Docker image
- Push to registry (Docker Hub, ECR)
- Pull and run on EC2

### Strategy 1: SSH Deployment

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/app
            git pull origin main
            npm install
            npm run build
            pm2 restart all
```

### Strategy 2: Docker Deployment

**.github/workflows/deploy-docker.yml:**
```yaml
name: Deploy Docker to EC2

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: username/app:${{ github.sha }}

      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            docker pull username/app:${{ github.sha }}
            docker stop app || true
            docker rm app || true
            docker run -d --name app -p 3000:3000 username/app:${{ github.sha }}
```

### Complete Production Workflow

**.github/workflows/production.yml:**
```yaml
name: Production Deployment

on:
  push:
    branches: [ main ]

env:
  NODE_VERSION: '18'
  DOCKER_IMAGE: username/app

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  build-docker:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ env.DOCKER_IMAGE }}:latest
            ${{ env.DOCKER_IMAGE }}:${{ github.sha }}

  deploy:
    needs: build-docker
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            # Pull latest image
            docker pull ${{ env.DOCKER_IMAGE }}:latest
            
            # Stop old container
            docker stop app || true
            docker rm app || true
            
            # Start new container
            docker run -d \
              --name app \
              -p 3000:3000 \
              -e NODE_ENV=production \
              -e DB_HOST=${{ secrets.DB_HOST }} \
              -e DB_PASSWORD=${{ secrets.DB_PASSWORD }} \
              --restart unless-stopped \
              ${{ env.DOCKER_IMAGE }}:latest
            
            # Clean up old images
            docker image prune -af

      - name: Verify deployment
        run: |
          sleep 10
          curl -f http://${{ secrets.EC2_HOST }}:3000/health || exit 1
```

---

## 6. Secrets Management

### Adding Secrets

**GitHub UI:**
1. Repository → Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `EC2_SSH_KEY`, Value: `<private key>`

### Using Secrets

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    run: |
      echo "Deploying with API_KEY"
      ./deploy.sh
```

### Common Secrets

| Secret                  | Purpose             |
| ----------------------- | ------------------- |
| `EC2_HOST`              | EC2 public IP       |
| `EC2_SSH_KEY`           | SSH private key     |
| `DOCKER_USERNAME`       | Docker Hub username |
| `DOCKER_PASSWORD`       | Docker Hub password |
| `DB_PASSWORD`           | Database password   |
| `AWS_ACCESS_KEY_ID`     | AWS credentials     |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials     |

---

## 7. Production Best Practices

### 1. Use Environment-Specific Workflows

**.github/workflows/staging.yml:**
```yaml
name: Deploy to Staging

on:
  push:
    branches: [ develop ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging  # Use environment protection rules
    
    steps:
      - name: Deploy to staging server
        run: echo "Deploying to staging"
```

**.github/workflows/production.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval
    
    steps:
      - name: Deploy to production server
        run: echo "Deploying to production"
```

### 2. Caching

```yaml
steps:
  - name: Cache node modules
    uses: actions/cache@v3
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
```

### 3. Notifications

**Slack Notification:**
```yaml
steps:
  - name: Notify Slack
    uses: 8398a7/action-slack@v3
    with:
      status: ${{ job.status }}
      text: 'Deployment completed'
      webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    if: always()
```

### 4. Rollback Strategy

```yaml
jobs:
  deploy:
    steps:
      - name: Deploy
        id: deploy
        run: ./deploy.sh
      
      - name: Rollback on failure
        if: failure()
        run: ./rollback.sh
```

### 5. Health Checks

```yaml
steps:
  - name: Deploy
    run: ./deploy.sh
  
  - name: Health check
    run: |
      sleep 10
      for i in {1..5}; do
        if curl -f http://${{ secrets.EC2_HOST }}/health; then
          echo "Health check passed"
          exit 0
        fi
        echo "Attempt $i failed, retrying..."
        sleep 5
      done
      echo "Health check failed"
      exit 1
```

### 6. Blue-Green Deployment

```yaml
steps:
  - name: Deploy to green environment
    run: |
      docker run -d --name app-green -p 3001:3000 myapp:latest
      
  - name: Health check green
    run: curl -f http://localhost:3001/health
  
  - name: Switch traffic (Nginx reload)
    run: |
      # Update Nginx to point to port 3001
      sudo nginx -s reload
  
  - name: Stop blue environment
    run: docker stop app-blue && docker rm app-blue
```

---

## 📝 Complete Example Project

### Project Structure

```
my-app/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── src/
│   └── server.js
├── tests/
│   └── server.test.js
├── Dockerfile
├── package.json
└── README.md
```

### package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "test": "jest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "eslint": "^8.54.0"
  }
}
```

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

### .github/workflows/deploy.yml

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/app
            git pull origin main
            npm install
            pm2 restart app
```

---

## 📝 Practice Tasks

### Task 1: Basic CI

Create workflow that:
- Runs on every push
- Installs dependencies
- Runs linter
- Runs tests

### Task 2: Docker Build

Create workflow that:
- Builds Docker image
- Pushes to Docker Hub
- Tags with commit SHA

### Task 3: EC2 Deployment

Create workflow that:
- SSHs into EC2
- Pulls latest code
- Restarts PM2

### Task 4: Complete Pipeline

Build full CI/CD pipeline:
- Run tests on PR
- Build Docker image on merge
- Deploy to staging
- Manual approval
- Deploy to production

See `/tasks` folder for detailed exercises.

---

## 🔗 Quick Reference

### Useful Actions

```yaml
# Checkout code
- uses: actions/checkout@v3

# Setup Node.js
- uses: actions/setup-node@v3
  with:
    node-version: '18'

# Cache dependencies
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# Docker login
- uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

# SSH deploy
- uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.HOST }}
    username: ubuntu
    key: ${{ secrets.SSH_KEY }}
    script: |
      cd app
      git pull
      pm2 restart all
```

### Workflow Commands

```yaml
# Set output
run: echo "version=1.0" >> $GITHUB_OUTPUT

# Set environment variable
run: echo "NODE_ENV=production" >> $GITHUB_ENV

# Exit with error
run: exit 1

# Conditional execution
if: success()
if: failure()
if: always()
```

**Next:** Day 28 - Revision & Mock Interview
