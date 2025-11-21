# Day 24: AWS IAM & EC2

## 📚 Table of Contents
1. Introduction to AWS
2. AWS IAM (Identity and Access Management)
3. EC2 (Elastic Compute Cloud) Basics
4. Launching an EC2 Instance
5. Connecting to EC2 via SSH
6. Deploying Node.js App to EC2
7. Security Best Practices

---

## 1. Introduction to AWS

**Amazon Web Services (AWS)** is a cloud computing platform offering 200+ services.

### Key Services for Backend Developers

| Service        | Purpose              | Use Case               |
| -------------- | -------------------- | ---------------------- |
| **EC2**        | Virtual servers      | Host applications      |
| **S3**         | Object storage       | Store files, images    |
| **Lambda**     | Serverless functions | Event-driven code      |
| **RDS**        | Managed databases    | MySQL, PostgreSQL      |
| **DynamoDB**   | NoSQL database       | High-scale apps        |
| **CloudFront** | CDN                  | Fast content delivery  |
| **Route 53**   | DNS service          | Domain management      |
| **ELB**        | Load balancer        | Distribute traffic     |
| **IAM**        | Access management    | Security & permissions |

### AWS Global Infrastructure

```
AWS Regions (30+)
├── US East (N. Virginia) - us-east-1
├── US West (Oregon) - us-west-2
├── EU (Ireland) - eu-west-1
├── Asia Pacific (Mumbai) - ap-south-1
└── ...

Each Region has multiple Availability Zones (AZs)
├── us-east-1a
├── us-east-1b
└── us-east-1c
```

---

## 2. AWS IAM (Identity and Access Management)

IAM controls **who** can access **what** in your AWS account.

### Core Concepts

```
┌─────────────────────────────────────────┐
│         AWS Account (Root)              │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────┐  ┌──────────┐  ┌───────┐ │
│  │  Users  │  │  Groups  │  │ Roles │ │
│  └────┬────┘  └─────┬────┘  └───┬───┘ │
│       │             │             │     │
│       └─────────┬───┴─────────────┘     │
│                 │                       │
│           ┌─────┴──────┐               │
│           │  Policies  │               │
│           └────────────┘               │
│        (Permissions JSON)              │
└─────────────────────────────────────────┘
```

### 1. Users

Individual people or services.

**Creating a User:**
```bash
# AWS CLI
aws iam create-user --user-name developer

# Add to group
aws iam add-user-to-group --user-name developer --group-name Developers
```

**Access Types:**
- **Programmatic Access:** Access Key + Secret Key (for CLI/SDK)
- **Console Access:** Username + Password (for AWS Console)

### 2. Groups

Collection of users with same permissions.

```bash
# Create group
aws iam create-group --group-name Developers

# Attach policy to group
aws iam attach-group-policy \
  --group-name Developers \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2FullAccess
```

### 3. Policies

JSON documents defining permissions.

**Policy Structure:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:RunInstances",
        "ec2:TerminateInstances"
      ],
      "Resource": "*"
    }
  ]
}
```

**AWS Managed Policies (Pre-built):**
- `AdministratorAccess` - Full access to all services
- `PowerUserAccess` - All services except IAM
- `ReadOnlyAccess` - Read-only access
- `AmazonEC2FullAccess` - Full EC2 access
- `AmazonS3FullAccess` - Full S3 access

**Custom Policy Example:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    },
    {
      "Effect": "Deny",
      "Action": "s3:DeleteBucket",
      "Resource": "*"
    }
  ]
}
```

### 4. Roles

Temporary permissions for services or users.

**Use Cases:**
- EC2 instance accessing S3
- Lambda function accessing DynamoDB
- Cross-account access

**Example: EC2 Role for S3 Access**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

Attach to EC2:
```bash
aws iam create-role --role-name EC2-S3-Access --assume-role-policy-document file://trust-policy.json
aws iam attach-role-policy --role-name EC2-S3-Access --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

### IAM Best Practices

✅ **Do:**
- Use IAM users, not root account
- Enable MFA (Multi-Factor Authentication)
- Use groups to assign permissions
- Grant least privilege (minimum permissions needed)
- Use roles for EC2/Lambda
- Rotate access keys regularly

❌ **Don't:**
- Share credentials
- Use root account for daily tasks
- Give overly broad permissions
- Hard-code access keys in code

---

## 3. EC2 (Elastic Compute Cloud) Basics

EC2 provides **virtual servers (instances)** in the cloud.

### Instance Types

| Type      | Name              | Use Case                | Example            |
| --------- | ----------------- | ----------------------- | ------------------ |
| **t2/t3** | General Purpose   | Web servers, small apps | t2.micro, t3.small |
| **c5**    | Compute Optimized | CPU-intensive apps      | c5.large           |
| **r5**    | Memory Optimized  | Databases, caching      | r5.large           |
| **m5**    | Balanced          | Most workloads          | m5.large           |

**Free Tier:** t2.micro (750 hours/month for 12 months)

### Instance Specifications

```
t2.micro
├── 1 vCPU
├── 1 GB RAM
└── EBS Storage

t3.small
├── 2 vCPUs
├── 2 GB RAM
└── EBS Storage

t3.medium
├── 2 vCPUs
├── 4 GB RAM
└── EBS Storage
```

### AMI (Amazon Machine Image)

Pre-configured OS templates.

**Common AMIs:**
- Amazon Linux 2023
- Ubuntu 22.04 LTS
- Red Hat Enterprise Linux
- Windows Server

---

## 4. Launching an EC2 Instance

### Option 1: AWS Console (GUI)

1. **Go to EC2 Dashboard**
   - Services → EC2 → Launch Instance

2. **Configure Instance:**
   - **Name:** `my-node-app`
   - **AMI:** Ubuntu 22.04 LTS
   - **Instance Type:** t2.micro (free tier)
   - **Key Pair:** Create new key pair (download .pem file)
   - **Network:** Default VPC
   - **Security Group:**
     - SSH (port 22) - Your IP
     - HTTP (port 80) - Anywhere
     - Custom TCP (port 3000) - Anywhere

3. **Launch Instance**

### Option 2: AWS CLI

```bash
# Create key pair
aws ec2 create-key-pair --key-name my-key --query 'KeyMaterial' --output text > my-key.pem
chmod 400 my-key.pem

# Create security group
aws ec2 create-security-group \
  --group-name my-sg \
  --description "Security group for Node.js app"

# Add rules
aws ec2 authorize-security-group-ingress \
  --group-name my-sg \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name my-sg \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0

# Launch instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --count 1 \
  --instance-type t2.micro \
  --key-name my-key \
  --security-groups my-sg
```

### Security Groups

**Firewall rules** controlling inbound/outbound traffic.

```
Security Group: my-app-sg
├── Inbound Rules
│   ├── SSH (22) - 0.0.0.0/0 (or your IP)
│   ├── HTTP (80) - 0.0.0.0/0
│   └── Custom TCP (3000) - 0.0.0.0/0
└── Outbound Rules
    └── All traffic - 0.0.0.0/0
```

**Best Practice:** Restrict SSH to your IP only.

---

## 5. Connecting to EC2 via SSH

### Step 1: Get Public IP

```bash
# List instances
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress,State.Name]' --output table
```

### Step 2: SSH Connection

**Linux/Mac:**
```bash
# Set key permissions
chmod 400 my-key.pem

# Connect
ssh -i my-key.pem ubuntu@<PUBLIC_IP>
```

**Windows (PowerShell):**
```powershell
ssh -i my-key.pem ubuntu@<PUBLIC_IP>
```

**Windows (PuTTY):**
1. Convert .pem to .ppk using PuTTYgen
2. Use .ppk in PuTTY

### Common Issues

**Permission denied:**
```bash
chmod 400 my-key.pem
```

**Connection refused:**
- Check security group allows SSH (port 22)
- Verify instance is running
- Check correct username (ubuntu, ec2-user, admin)

**Default Usernames:**
- Ubuntu: `ubuntu`
- Amazon Linux: `ec2-user`
- Debian: `admin`
- Red Hat: `ec2-user`

---

## 6. Deploying Node.js App to EC2

### Complete Deployment Guide

#### Step 1: Connect to EC2

```bash
ssh -i my-key.pem ubuntu@<PUBLIC_IP>
```

#### Step 2: Install Node.js

```bash
# Update packages
sudo apt update

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Step 3: Install Git

```bash
sudo apt install -y git
```

#### Step 4: Clone Your Application

```bash
# Clone repository
git clone https://github.com/yourusername/your-app.git
cd your-app

# Install dependencies
npm install
```

#### Step 5: Configure Environment

```bash
# Create .env file
nano .env
```

**.env:**
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-rds-endpoint
DB_USER=admin
DB_PASSWORD=secret
```

#### Step 6: Start Application with PM2

```bash
# Start app
pm2 start server.js --name my-app

# View logs
pm2 logs my-app

# Monitor
pm2 monit

# Save PM2 configuration
pm2 save

# Auto-restart on reboot
pm2 startup systemd
```

#### Step 7: Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

**/etc/nginx/sites-available/default:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

#### Step 8: Access Application

```
http://<PUBLIC_IP>
```

### Full Deployment Script

**deploy.sh:**
```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Clone application
git clone https://github.com/yourusername/your-app.git /home/ubuntu/app
cd /home/ubuntu/app

# Install dependencies
npm install

# Create .env
cat > .env << EOF
NODE_ENV=production
PORT=3000
EOF

# Start with PM2
pm2 start server.js --name my-app
pm2 save
pm2 startup systemd

# Install Nginx
sudo apt install -y nginx

# Configure Nginx
sudo tee /etc/nginx/sites-available/default > /dev/null << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "Deployment complete!"
echo "Access your app at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
```

**Run:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### PM2 Commands

```bash
# Start
pm2 start server.js --name my-app

# List apps
pm2 list

# Stop
pm2 stop my-app

# Restart
pm2 restart my-app

# Delete
pm2 delete my-app

# Logs
pm2 logs my-app
pm2 logs my-app --lines 100

# Monitor
pm2 monit

# Save configuration
pm2 save

# Startup script
pm2 startup

# Update PM2
pm2 update
```

### Example Node.js App

**server.js:**
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from EC2!',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**package.json:**
```json
{
  "name": "ec2-node-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

---

## 7. Security Best Practices

### 1. Use IAM Roles (Not Access Keys)

**Bad:**
```javascript
// Hard-coded credentials
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
});
```

**Good:**
```javascript
// Attach IAM role to EC2 instance
const AWS = require('aws-sdk');
// Credentials automatically loaded from instance metadata
```

### 2. Restrict Security Groups

```bash
# Bad: SSH open to world
Type: SSH
Port: 22
Source: 0.0.0.0/0

# Good: SSH restricted to your IP
Type: SSH
Port: 22
Source: <YOUR_IP>/32
```

### 3. Keep Software Updated

```bash
# Regular updates
sudo apt update && sudo apt upgrade -y

# Automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 4. Use HTTPS

```bash
# Install Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### 5. Enable CloudWatch Monitoring

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### 6. Backup Strategy

```bash
# Create AMI snapshot
aws ec2 create-image --instance-id i-1234567890abcdef0 --name "my-app-backup"

# Automated backups using Data Lifecycle Manager
```

---

## 📝 Practice Tasks

### Task 1: Launch EC2 Instance

1. Launch t2.micro Ubuntu instance
2. Configure security group (SSH, HTTP, port 3000)
3. Connect via SSH
4. Install Node.js and PM2

### Task 2: Deploy Node.js App

1. Clone a Node.js repository
2. Install dependencies
3. Configure environment variables
4. Start with PM2
5. Setup Nginx reverse proxy
6. Access via public IP

### Task 3: Create IAM Role

1. Create IAM role for EC2
2. Attach S3 read-only policy
3. Attach role to EC2 instance
4. Test S3 access from EC2

### Task 4: Automate Deployment

Create a deployment script that:
- Updates system packages
- Pulls latest code from Git
- Installs dependencies
- Restarts PM2 application

See `/tasks` folder for detailed exercises.

---

## 🔗 Quick Reference

### Useful AWS CLI Commands

```bash
# List instances
aws ec2 describe-instances

# Start instance
aws ec2 start-instances --instance-ids i-1234567890abcdef0

# Stop instance
aws ec2 stop-instances --instance-ids i-1234567890abcdef0

# Terminate instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0

# Get instance public IP
aws ec2 describe-instances --instance-ids i-1234567890abcdef0 --query 'Reservations[0].Instances[0].PublicIpAddress'
```

### EC2 Instance Metadata (from inside instance)

```bash
# Get instance ID
curl http://169.254.169.254/latest/meta-data/instance-id

# Get public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Get IAM role credentials
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME
```

**Next:** Day 25 - S3 File Uploads & Signed URLs
