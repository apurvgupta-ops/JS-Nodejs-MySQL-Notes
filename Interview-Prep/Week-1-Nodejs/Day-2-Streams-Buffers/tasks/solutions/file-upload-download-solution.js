// Solution: File Upload/Download API using Streams

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { pipeline } = require('stream');
const { Transform } = require('stream');

const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Create uploads directory
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Helper: Parse multipart form data
class MultipartParser extends Transform {
    constructor(boundary) {
        super();
        this.boundary = Buffer.from(`--${boundary}`);
        this.buffer = Buffer.alloc(0);
        this.filename = null;
    }

    _transform(chunk, encoding, callback) {
        this.buffer = Buffer.concat([this.buffer, chunk]);

        // Find filename in headers
        if (!this.filename) {
            const headerEnd = this.buffer.indexOf('\r\n\r\n');
            if (headerEnd !== -1) {
                const headers = this.buffer.slice(0, headerEnd).toString();
                const filenameMatch = headers.match(/filename="(.+?)"/);
                if (filenameMatch) {
                    this.filename = filenameMatch[1];
                }
                this.buffer = this.buffer.slice(headerEnd + 4);
            }
        }

        // Find boundary to get actual file data
        const boundaryIndex = this.buffer.indexOf(this.boundary);
        if (boundaryIndex !== -1) {
            // Push only file data (remove trailing boundary)
            const fileData = this.buffer.slice(0, boundaryIndex - 2); // -2 for \r\n
            this.push(fileData);
            callback();
        } else {
            // Keep some buffer for boundary detection
            if (this.buffer.length > this.boundary.length) {
                const keepSize = this.boundary.length + 10;
                const pushData = this.buffer.slice(0, -keepSize);
                this.buffer = this.buffer.slice(-keepSize);
                this.push(pushData);
            }
            callback();
        }
    }

    _flush(callback) {
        if (this.buffer.length > 0) {
            // Remove trailing boundary if exists
            const boundaryIndex = this.buffer.indexOf(this.boundary);
            if (boundaryIndex !== -1) {
                this.push(this.buffer.slice(0, boundaryIndex - 2));
            }
        }
        callback();
    }
}

// Progress tracking transform
class ProgressTransform extends Transform {
    constructor(total, onProgress) {
        super();
        this.total = total;
        this.transferred = 0;
        this.onProgress = onProgress;
    }

    _transform(chunk, encoding, callback) {
        this.transferred += chunk.length;
        const percent = ((this.transferred / this.total) * 100).toFixed(2);
        this.onProgress(this.transferred, this.total, percent);
        this.push(chunk);
        callback();
    }
}

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // POST /upload - Handle file upload
    if (req.method === 'POST' && req.url === '/upload') {
        const contentType = req.headers['content-type'];

        if (!contentType || !contentType.includes('multipart/form-data')) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Content-Type must be multipart/form-data' }));
            return;
        }

        // Extract boundary
        const boundary = contentType.split('boundary=')[1];
        if (!boundary) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No boundary found' }));
            return;
        }

        const parser = new MultipartParser(boundary);
        let filename = null;

        // Wait to get filename from parser
        parser.once('readable', () => {
            filename = parser.filename;

            if (!filename) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No filename provided' }));
                return;
            }

            const filePath = path.join(UPLOAD_DIR, filename);
            const writeStream = fs.createWriteStream(filePath);

            // Progress tracking
            const contentLength = parseInt(req.headers['content-length'] || '0');
            const progress = new ProgressTransform(contentLength, (transferred, total, percent) => {
                console.log(`Upload progress: ${percent}% (${transferred}/${total} bytes)`);
            });

            pipeline(
                req,
                progress,
                parser,
                writeStream,
                (err) => {
                    if (err) {
                        console.error('Upload error:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Upload failed', message: err.message }));

                        // Clean up partial file
                        fs.unlink(filePath, () => { });
                    } else {
                        const stats = fs.statSync(filePath);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            message: 'File uploaded successfully',
                            filename: filename,
                            size: stats.size,
                            path: `/download/${filename}`
                        }));
                    }
                }
            );
        });

        // Start parsing
        req.pipe(parser);
    }

    // GET /download/:filename - Handle file download
    else if (req.method === 'GET' && req.url.startsWith('/download/')) {
        const filename = decodeURIComponent(req.url.substring('/download/'.length));
        const filePath = path.join(UPLOAD_DIR, filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'File not found' }));
            return;
        }

        const stats = fs.statSync(filePath);
        const acceptEncoding = req.headers['accept-encoding'] || '';

        // Set headers
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Support compression
        if (acceptEncoding.includes('gzip')) {
            res.setHeader('Content-Encoding', 'gzip');
            res.writeHead(200);

            pipeline(
                fs.createReadStream(filePath),
                zlib.createGzip(),
                res,
                (err) => {
                    if (err) {
                        console.error('Download error:', err);
                    }
                }
            );
        } else {
            res.setHeader('Content-Length', stats.size);
            res.writeHead(200);

            pipeline(
                fs.createReadStream(filePath),
                res,
                (err) => {
                    if (err) {
                        console.error('Download error:', err);
                    }
                }
            );
        }
    }

    // GET /files - List all files
    else if (req.method === 'GET' && req.url === '/files') {
        fs.readdir(UPLOAD_DIR, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to list files' }));
                return;
            }

            const fileList = files.map(file => {
                const filePath = path.join(UPLOAD_DIR, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    size: stats.size,
                    sizeFormatted: formatBytes(stats.size),
                    uploadDate: stats.birthtime,
                    downloadUrl: `/download/${encodeURIComponent(file)}`
                };
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ files: fileList, count: fileList.length }));
        });
    }

    // Root - API info
    else if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'File Upload/Download API',
            endpoints: {
                upload: 'POST /upload (multipart/form-data)',
                download: 'GET /download/:filename',
                listFiles: 'GET /files'
            },
            examples: {
                upload: 'curl -X POST -F "file=@./myfile.txt" http://localhost:3000/upload',
                download: 'curl http://localhost:3000/download/myfile.txt -o downloaded.txt',
                list: 'curl http://localhost:3000/files'
            }
        }));
    }

    // 404 Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Helper function
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`  Upload directory: ${UPLOAD_DIR}`);
    console.log(`\nAPI Endpoints:`);
    console.log(`  GET  /          - API info`);
    console.log(`  POST /upload    - Upload file`);
    console.log(`  GET  /files     - List files`);
    console.log(`  GET  /download/:filename - Download file`);
});
