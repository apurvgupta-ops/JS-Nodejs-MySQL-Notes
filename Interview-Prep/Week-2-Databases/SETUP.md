# Week 2 Database Setup Guide

## Prerequisites

Before starting Week 2, ensure you have these installed:

### 1. MySQL 8.0+

**Windows:**
```bash
# Download from: https://dev.mysql.com/downloads/installer/
# Run MySQL Installer and select "MySQL Server"
```

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu:**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**Verify:**
```bash
mysql --version
mysql -u root -p
```

### 2. MongoDB 6.0+

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Run installer
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install mongodb-org
sudo systemctl start mongod
```

**Verify:**
```bash
mongosh --version
mongosh
```

### 3. Redis 7.0+

**Windows:**
```bash
# Download from: https://github.com/microsoftarchive/redis/releases
# Or use WSL2 with Linux installation
```

**Mac:**
```bash
brew install redis
brew services start redis
```

**Ubuntu:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

**Verify:**
```bash
redis-cli --version
redis-cli ping
# Should return: PONG
```

---

## Initial Setup

### MySQL Setup

```bash
# Connect to MySQL
mysql -u root -p

# Create databases for Week 2
CREATE DATABASE company_db;
CREATE DATABASE performance_test;
CREATE DATABASE bank_db;

# Verify
SHOW DATABASES;
```

### MongoDB Setup

```bash
# Connect to MongoDB
mongosh

# Create databases (auto-created on first use)
use social_media_db
use ecommerce_db
use analytics_db

# Verify
show dbs
```

### Redis Setup

```bash
# Connect to Redis
redis-cli

# Test basic commands
SET test "Hello Redis"
GET test
# Should return: "Hello Redis"

# Clear test data
DEL test
```

---

## Node.js Dependencies

Install required packages for Week 2 projects:

```bash
# Create a new project directory
mkdir week2-practice
cd week2-practice

# Initialize
npm init -y

# Install MySQL driver
npm install mysql2

# Install MongoDB driver
npm install mongodb

# Install Redis client
npm install redis

# Install Express for APIs
npm install express

# Install utilities
npm install dotenv cors
```

---

## Sample Environment Setup

Create `.env` file:

```env
# MySQL
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=company_db

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=social_media_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
PORT=3000
NODE_ENV=development
```

---

## Quick Test Script

Create `test-connections.js`:

```javascript
const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');
const redis = require('redis');

async function testConnections() {
    console.log('Testing database connections...\n');
    
    // Test MySQL
    try {
        const mysqlConn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'your_password'
        });
        console.log('✅ MySQL: Connected');
        await mysqlConn.end();
    } catch (error) {
        console.error('❌ MySQL: Failed -', error.message);
    }
    
    // Test MongoDB
    try {
        const mongoClient = new MongoClient('mongodb://localhost:27017');
        await mongoClient.connect();
        console.log('✅ MongoDB: Connected');
        await mongoClient.close();
    } catch (error) {
        console.error('❌ MongoDB: Failed -', error.message);
    }
    
    // Test Redis
    try {
        const redisClient = redis.createClient();
        await redisClient.connect();
        await redisClient.ping();
        console.log('✅ Redis: Connected');
        await redisClient.quit();
    } catch (error) {
        console.error('❌ Redis: Failed -', error.message);
    }
    
    console.log('\nAll connections tested!');
}

testConnections();
```

Run:
```bash
node test-connections.js
```

Expected output:
```
Testing database connections...

✅ MySQL: Connected
✅ MongoDB: Connected
✅ Redis: Connected

All connections tested!
```

---

## GUI Tools (Optional but Recommended)

### MySQL GUI
- **MySQL Workbench** (Free): https://dev.mysql.com/downloads/workbench/
- **DBeaver** (Free): https://dbeaver.io/

### MongoDB GUI
- **MongoDB Compass** (Free): https://www.mongodb.com/products/compass
- **Studio 3T** (Free trial): https://studio3t.com/

### Redis GUI
- **RedisInsight** (Free): https://redis.com/redis-enterprise/redis-insight/
- **Another Redis Desktop Manager** (Free): https://github.com/qishibo/AnotherRedisDesktopManager

---

## Troubleshooting

### MySQL Connection Refused
```bash
# Check if MySQL is running
sudo systemctl status mysql    # Linux
brew services list             # Mac

# Start MySQL
sudo systemctl start mysql     # Linux
brew services start mysql      # Mac
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
sudo systemctl status mongod   # Linux
brew services list             # Mac

# Start MongoDB
sudo systemctl start mongod    # Linux
brew services start mongodb-community  # Mac
```

### Redis Connection Error
```bash
# Check if Redis is running
sudo systemctl status redis    # Linux
brew services list             # Mac

# Start Redis
sudo systemctl start redis     # Linux
brew services start redis      # Mac
```

### Port Already in Use
```bash
# Check what's using port 3306 (MySQL)
sudo lsof -i :3306

# Check what's using port 27017 (MongoDB)
sudo lsof -i :27017

# Check what's using port 6379 (Redis)
sudo lsof -i :6379
```

---

## Ready to Start!

Once all connections test successfully:

1. **Read** [Week-2-Databases/README.md](./README.md)
2. **Follow** [Week-2-Databases/STUDY-PLAN.md](./STUDY-PLAN.md)
3. **Start** with Day 8: SQL Joins

Good luck! 🚀
