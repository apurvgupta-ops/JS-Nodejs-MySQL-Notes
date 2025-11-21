# Task: File Upload/Download API using Streams

Build a simple HTTP API that handles file uploads and downloads using streams efficiently.

## Requirements

### 1. Upload Endpoint (POST /upload)
- Accept file upload via multipart/form-data
- Use streams to write the file to disk
- Handle backpressure properly
- Return upload progress if possible
- Support large files (> 100MB)

### 2. Download Endpoint (GET /download/:filename)
- Stream file to client
- Set appropriate headers (Content-Type, Content-Length)
- Handle range requests for video streaming (optional)
- Support compression (gzip) if client accepts it

### 3. File List Endpoint (GET /files)
- Return list of available files with metadata
- Include file size, upload date, etc.

## Starter Code

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const server = http.createServer((req, res) => {
  // TODO: Implement routing
  
  if (req.method === 'POST' && req.url === '/upload') {
    // TODO: Implement file upload using streams
  }
  
  if (req.method === 'GET' && req.url.startsWith('/download/')) {
    // TODO: Implement file download using streams
  }
  
  if (req.method === 'GET' && req.url === '/files') {
    // TODO: Implement file listing
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Testing

```bash
# Upload a file
curl -X POST -F "file=@./testfile.txt" http://localhost:3000/upload

# List files
curl http://localhost:3000/files

# Download a file
curl http://localhost:3000/download/testfile.txt -o downloaded.txt
```

## Bonus Challenges

1. Add file compression during upload
2. Implement chunk upload with resume capability
3. Add file encryption/decryption
4. Implement streaming video with range requests
5. Add upload/download speed limiting
6. Implement progress tracking

## Expected Learning Outcomes

- Understanding readable and writable streams
- Proper backpressure handling
- Using pipeline for error handling
- Working with HTTP streams
- Memory-efficient file operations
