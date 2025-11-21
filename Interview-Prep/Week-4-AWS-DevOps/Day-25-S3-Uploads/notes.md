# Day 25: S3 File Uploads & Signed URLs

## 📚 Table of Contents
1. Introduction to S3
2. S3 Concepts & Terminology
3. AWS SDK for JavaScript
4. File Upload to S3
5. Presigned URLs
6. Secure File Upload Flow
7. Production Best Practices

---

## 1. Introduction to S3

**Amazon S3 (Simple Storage Service)** is object storage for the cloud.

### Why S3?

**Traditional File Storage Problems:**
- Server disk space limited
- No built-in CDN
- Hard to scale
- Costly backups

**S3 Benefits:**
- ✅ Unlimited storage
- ✅ 99.999999999% (11 nines) durability
- ✅ Built-in CDN (CloudFront)
- ✅ Pay-as-you-go pricing
- ✅ Versioning & lifecycle policies
- ✅ Access control (IAM, bucket policies)

### Use Cases

| Use Case            | Example                     |
| ------------------- | --------------------------- |
| **User Uploads**    | Profile pictures, documents |
| **Static Assets**   | Images, CSS, JS files       |
| **Backups**         | Database dumps, logs        |
| **Big Data**        | Data lakes, analytics       |
| **Media**           | Videos, audio files         |
| **Website Hosting** | Static websites             |

---

## 2. S3 Concepts & Terminology

### Buckets

**Bucket = Container** for objects (files).

- Globally unique name: `my-app-uploads-2024`
- Region-specific: `us-east-1`, `eu-west-1`
- Flat structure (no folders, but prefixes simulate them)

```
my-bucket/
├── users/
│   ├── profile-pics/
│   │   ├── user123.jpg
│   │   └── user456.png
│   └── documents/
│       └── resume.pdf
└── public/
    └── logo.png
```

**Note:** "Folders" are just key prefixes:
- `users/profile-pics/user123.jpg`
- `users/documents/resume.pdf`

### Objects

**Object = File** with metadata.

```javascript
{
  Key: 'users/profile-pics/user123.jpg',
  Size: 204800,  // bytes
  LastModified: '2024-01-15T10:30:00Z',
  ETag: '"d41d8cd98f00b204e9800998ecf8427e"',
  ContentType: 'image/jpeg',
  Metadata: {
    userId: '123',
    uploadedBy: 'admin'
  }
}
```

### Storage Classes

| Class                    | Use Case                    | Cost |
| ------------------------ | --------------------------- | ---- |
| **Standard**             | Frequently accessed         | $$$  |
| **Intelligent-Tiering**  | Unknown patterns            | $$   |
| **Standard-IA**          | Infrequent access           | $    |
| **Glacier**              | Archive (minutes retrieval) | ¢    |
| **Glacier Deep Archive** | Long-term (hours retrieval) | ¢¢   |

---

## 3. AWS SDK for JavaScript

### Installation

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Configuration

**Option 1: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
export AWS_REGION=us-east-1
```

**Option 2: IAM Role (EC2/Lambda)**
```javascript
// Credentials automatically loaded from instance metadata
const { S3Client } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({ region: 'us-east-1' });
```

**Option 3: Credentials in Code (NOT RECOMMENDED)**
```javascript
const { S3Client } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
```

---

## 4. File Upload to S3

### Basic Upload

**server.js:**
```javascript
const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const s3Client = new S3Client({ region: process.env.AWS_REGION });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const key = `uploads/${fileName}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      Metadata: {
        originalName: req.file.originalname,
        uploadedAt: new Date().toISOString()
      }
    });

    await s3Client.send(command);

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      key: key
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Upload with Progress

```javascript
const { Upload } = require('@aws-sdk/lib-storage');

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const key = `uploads/${crypto.randomUUID()}.${req.file.originalname.split('.').pop()}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      }
    });

    upload.on('httpUploadProgress', (progress) => {
      console.log(`Uploaded: ${progress.loaded} / ${progress.total} bytes`);
    });

    await upload.done();

    res.json({ message: 'Upload complete', key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Download File

```javascript
const { GetObjectCommand } = require('@aws-sdk/client-s3');

app.get('/download/:key(*)', async (req, res) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.params.key
    });

    const response = await s3Client.send(command);

    res.setHeader('Content-Type', response.ContentType);
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.key.split('/').pop()}"`);

    response.Body.pipe(res);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});
```

### Delete File

```javascript
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

app.delete('/delete/:key(*)', async (req, res) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.params.key
    });

    await s3Client.send(command);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 5. Presigned URLs

**Presigned URLs** allow temporary access to private S3 objects **without** exposing AWS credentials.

### Why Presigned URLs?

**Problem:**
```
Client → Upload file → Server → Upload to S3
         (slow, uses server bandwidth)
```

**Solution:**
```
Client → Get presigned URL from server
      → Upload directly to S3 using presigned URL
         (fast, no server bandwidth)
```

### Generate Presigned URL for Upload

**server.js:**
```javascript
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

app.post('/get-upload-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    // Generate unique key
    const key = `uploads/${crypto.randomUUID()}-${fileName}`;

    // Create presigned URL (valid for 5 minutes)
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    res.json({ uploadUrl, key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Client (JavaScript):**
```javascript
async function uploadFile(file) {
  // Step 1: Get presigned URL from server
  const response = await fetch('/get-upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type
    })
  });

  const { uploadUrl, key } = await response.json();

  // Step 2: Upload directly to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });

  console.log('Upload complete!', key);
}
```

**HTML:**
```html
<input type="file" id="fileInput">
<button onclick="upload()">Upload</button>

<script>
async function upload() {
  const file = document.getElementById('fileInput').files[0];
  await uploadFile(file);
  alert('Upload successful!');
}
</script>
```

### Generate Presigned URL for Download

**server.js:**
```javascript
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

app.get('/get-download-url/:key(*)', async (req, res) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.params.key
    });

    // Valid for 1 hour
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({ downloadUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Client:**
```javascript
async function downloadFile(key) {
  const response = await fetch(`/get-download-url/${key}`);
  const { downloadUrl } = await response.json();

  window.location.href = downloadUrl;  // Download file
}
```

---

## 6. Secure File Upload Flow

### Complete Example

**Project Structure:**
```
s3-upload-app/
├── server.js
├── package.json
├── .env
└── public/
    ├── index.html
    └── upload.js
```

**package.json:**
```json
{
  "name": "s3-upload-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "@aws-sdk/client-s3": "^3.470.0",
    "@aws-sdk/s3-request-presigner": "^3.470.0",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1"
  }
}
```

**.env:**
```env
AWS_REGION=us-east-1
S3_BUCKET_NAME=my-app-uploads
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

**server.js:**
```javascript
require('dotenv').config();
const express = require('express');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Get presigned URL for upload
app.post('/api/upload-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType required' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Generate unique key
    const fileExtension = fileName.split('.').pop();
    const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      // Additional security
      ServerSideEncryption: 'AES256',
      Metadata: {
        originalName: fileName,
        uploadedAt: new Date().toISOString()
      }
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300  // 5 minutes
    });

    res.json({ uploadUrl, key });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Get presigned URL for download
app.get('/api/download-url/:key(*)', async (req, res) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: req.params.key
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600  // 1 hour
    });

    res.json({ downloadUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

**public/index.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>S3 Upload</title>
  <style>
    body { font-family: Arial; max-width: 600px; margin: 50px auto; }
    .upload-area { border: 2px dashed #ccc; padding: 40px; text-align: center; }
    .progress { width: 100%; height: 20px; background: #f0f0f0; margin: 10px 0; }
    .progress-bar { height: 100%; background: #4CAF50; width: 0%; transition: width 0.3s; }
    #fileList { list-style: none; padding: 0; }
    #fileList li { padding: 10px; border: 1px solid #ddd; margin: 5px 0; }
  </style>
</head>
<body>
  <h1>S3 File Upload</h1>
  
  <div class="upload-area">
    <input type="file" id="fileInput" accept="image/*,.pdf">
    <button onclick="uploadFile()">Upload</button>
  </div>

  <div class="progress" id="progressContainer" style="display:none">
    <div class="progress-bar" id="progressBar"></div>
  </div>

  <h2>Uploaded Files</h2>
  <ul id="fileList"></ul>

  <script src="upload.js"></script>
</body>
</html>
```

**public/upload.js:**
```javascript
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file');
    return;
  }

  try {
    // Step 1: Get presigned URL
    const response = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, key } = await response.json();

    // Step 2: Upload to S3 with progress
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    
    progressContainer.style.display = 'block';

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        progressBar.style.width = percentComplete + '%';
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        alert('Upload successful!');
        addFileToList(key, file.name);
        fileInput.value = '';
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
      } else {
        alert('Upload failed');
      }
    });

    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);

  } catch (error) {
    console.error('Error:', error);
    alert('Upload failed: ' + error.message);
  }
}

function addFileToList(key, fileName) {
  const fileList = document.getElementById('fileList');
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${fileName}</strong>
    <button onclick="downloadFile('${key}')">Download</button>
  `;
  fileList.appendChild(li);
}

async function downloadFile(key) {
  try {
    const response = await fetch(`/api/download-url/${key}`);
    const { downloadUrl } = await response.json();
    window.open(downloadUrl, '_blank');
  } catch (error) {
    alert('Download failed: ' + error.message);
  }
}
```

---

## 7. Production Best Practices

### 1. Set CORS Policy

**AWS Console → S3 → Bucket → Permissions → CORS**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 2. Bucket Policy (Public Read)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/public/*"
    }
  ]
}
```

### 3. File Validation

```javascript
app.post('/api/upload-url', async (req, res) => {
  const { fileName, fileType, fileSize } = req.body;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(fileType)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  // Validate file size (10MB limit)
  if (fileSize > 10 * 1024 * 1024) {
    return res.status(400).json({ error: 'File too large (max 10MB)' });
  }

  // Generate presigned URL...
});
```

### 4. Organize by User/Date

```javascript
const userId = req.user.id;
const date = new Date().toISOString().split('T')[0];
const key = `users/${userId}/${date}/${crypto.randomUUID()}.jpg`;
```

### 5. Use CloudFront CDN

```javascript
const cloudfrontDomain = 'https://d1234567890.cloudfront.net';
const fileUrl = `${cloudfrontDomain}/${key}`;
```

### 6. Lifecycle Policies

Delete old files automatically:
```json
{
  "Rules": [
    {
      "Id": "DeleteOldUploads",
      "Status": "Enabled",
      "Prefix": "temp/",
      "Expiration": {
        "Days": 7
      }
    }
  ]
}
```

### 7. Server-Side Encryption

```javascript
const command = new PutObjectCommand({
  Bucket: process.env.S3_BUCKET_NAME,
  Key: key,
  Body: file.buffer,
  ServerSideEncryption: 'AES256'  // or 'aws:kms'
});
```

---

## 📝 Practice Tasks

### Task 1: Basic Upload

Create Express server that uploads files to S3 using `multer` and `@aws-sdk/client-s3`.

### Task 2: Presigned URLs

Implement presigned URLs for:
- Upload (client → S3 directly)
- Download (temporary access)

### Task 3: Secure Upload System

Build complete upload system with:
- File type validation
- Size limits
- User-specific folders
- Download links

### Task 4: Image Optimization

Add image resizing using `sharp` before uploading to S3.

See `/tasks` folder for detailed exercises.

---

## 🔗 Quick Reference

### Common S3 Commands

```javascript
// Upload
const { PutObjectCommand } = require('@aws-sdk/client-s3');
await s3Client.send(new PutObjectCommand({ Bucket, Key, Body }));

// Download
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const response = await s3Client.send(new GetObjectCommand({ Bucket, Key }));

// Delete
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
await s3Client.send(new DeleteObjectCommand({ Bucket, Key }));

// List objects
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
await s3Client.send(new ListObjectsV2Command({ Bucket, Prefix: 'uploads/' }));

// Presigned URL
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
```

**Next:** Day 26 - Serverless with Lambda & API Gateway
