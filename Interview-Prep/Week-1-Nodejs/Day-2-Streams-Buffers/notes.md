# Day 2: Streams and Buffers

## 📚 Table of Contents

1. What are Buffers?
2. Buffer Operations
3. What are Streams?
4. Types of Streams
5. Stream Events
6. Pipe and Pipeline
7. Backpressure
8. Best Practices

---

## 1. What are Buffers?

**Buffers** are temporary storage for binary data in Node.js. They represent fixed-size chunks of memory allocated outside the V8 heap.

### Why Buffers?

- JavaScript traditionally doesn't handle binary data well
- Needed for TCP streams, file system operations, and other I/O
- Efficient for handling raw binary data

### Buffer Characteristics:

- Fixed size (cannot be resized)
- Store raw binary data
- Similar to arrays of integers (0-255)
- Each element represents a byte

### Creating Buffers:

```javascript
// 1. From string
const buf1 = Buffer.from('Hello World');
console.log(buf1); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>

// 2. Allocate with size (filled with zeros)
const buf2 = Buffer.alloc(10);
console.log(buf2); // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 3. Allocate without initializing (faster but unsafe)
const buf3 = Buffer.allocUnsafe(10);

// 4. From array
const buf4 = Buffer.from([72, 101, 108, 108, 111]); // "Hello"
```

---

## 2. Buffer Operations

### Reading from Buffers:

```javascript
const buf = Buffer.from('Hello World');

// Read as string
console.log(buf.toString()); // "Hello World"
console.log(buf.toString('hex')); // "48656c6c6f20576f726c64"
console.log(buf.toString('base64')); // "SGVsbG8gV29ybGQ="

// Access individual bytes
console.log(buf[0]); // 72 (H)
console.log(buf.length); // 11
```

### Writing to Buffers:

```javascript
const buf = Buffer.alloc(10);

// Write string
buf.write('Hello');
console.log(buf.toString()); // "Hello"

// Write at specific position
buf.write('World', 5);
console.log(buf.toString()); // "HelloWorld"

// Write individual bytes
buf[0] = 72; // H
```

Buffer Methods:

```javascript
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.from('World');

// Concatenate
const combined = Buffer.concat([buf1, buf2]);
console.log(combined.toString()); // "HelloWorld"

// Slice (creates a view, not a copy)
const slice = buf1.slice(0, 2);
console.log(slice.toString()); // "He"

// Copy
const target = Buffer.alloc(5);
buf1.copy(target);
console.log(target.toString()); // "Hello"

// Compare
console.log(buf1.compare(buf2)); // -1 (buf1 < buf2)
console.log(buf1.equals(buf2)); // false
```

---

## 3. What are Streams?

**Streams** are collections of data that might not be available all at once and don't have to fit in memory. They process data piece by piece (chunks).

### Benefits of Streams:

1. **Memory efficient**: Process data without loading entirely into memory
2. **Time efficient**: Start processing immediately, don't wait for all data
3. **Composable**: Pipe streams together like Unix commands

### Real-World Analogy:

Think of streaming video: you don't download the entire movie before watching. You receive chunks and start playing immediately.

---

## 4. Types of Streams

### 1. Readable Streams

Sources that provide data (read from).

**Examples:**

- `fs.createReadStream()` - Read files
- `http.IncomingMessage` - Request in server, response in client
- `process.stdin` - Standard input

**Events:**

- `data` - Emitted when chunk is available
- `end` - No more data
- `error` - Error occurred
- `close` - Stream closed

```javascript
const fs = require('fs');
const readable = fs.createReadStream('file.txt');

readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

readable.on('end', () => {
  console.log('No more data');
});
```

### 2. Writable Streams

Destinations where you can write data (write to).

**Examples:**

- `fs.createWriteStream()` - Write to files
- `http.ServerResponse` - Response in server
- `process.stdout` - Standard output

**Events:**

- `drain` - Can write more data
- `finish` - All data written
- `error` - Error occurred
- `close` - Stream closed

```javascript
const writable = fs.createWriteStream('output.txt');

writable.write('Hello ');
writable.write('World');
writable.end(); // Close stream

writable.on('finish', () => {
  console.log('All data written');
});
```

### 3. Duplex Streams

Both readable and writable (bidirectional).

**Examples:**

- `net.Socket` - TCP sockets
- `crypto.Cipher` - Encryption streams

```javascript
const net = require('net');
const socket = net.connect(8080, 'localhost');

// Write to socket (writable side)
socket.write('Hello Server');

// Read from socket (readable side)
socket.on('data', (data) => {
  console.log('Received:', data.toString());
});
```

### 4. Transform Streams

Duplex streams that modify data as it passes through.

**Examples:**

- `zlib.createGzip()` - Compression
- `crypto.createCipher()` - Encryption
- Custom transforms

```javascript
const { Transform } = require('stream');

// Create uppercase transform
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

process.stdin.pipe(upperCase).pipe(process.stdout);
```

---

## 5. Stream Modes

### Two Reading Modes:

**1. Flowing Mode (Push)**
Data is read automatically and provided via events.

```javascript
const readable = fs.createReadStream('file.txt');

readable.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});
```

**2. Paused Mode (Pull)**
Data must be explicitly requested.

```javascript
const readable = fs.createReadStream('file.txt');

readable.on('readable', () => {
  let chunk;
  while ((chunk = readable.read()) !== null) {
    console.log('Read chunk:', chunk);
  }
});
```

### Switching Modes:

- Add `data` event listener → Flowing mode
- Call `pause()` → Paused mode
- Call `resume()` → Flowing mode
- Call `read()` → Paused mode

---

## 6. Pipe and Pipeline

### pipe() - Classic Method

```javascript
const fs = require('fs');

// Simple pipe
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));

// Chain multiple pipes
fs.createReadStream('file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('file.txt.gz'));
```

**Issues with pipe():**

- Poor error handling
- Doesn't properly cleanup on errors
- Memory leaks possible

### pipeline() - Modern Method (Recommended)

```javascript
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('input.txt.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

**Benefits of pipeline():**

- Proper error handling
- Automatic cleanup on errors
- Calls destroy() on all streams
- Callback when complete or on error

### Promises with pipeline:

```javascript
const { pipeline } = require('stream/promises');

async function compress() {
  try {
    await pipeline(
      fs.createReadStream('input.txt'),
      zlib.createGzip(),
      fs.createWriteStream('input.txt.gz')
    );
    console.log('Compression complete');
  } catch (err) {
    console.error('Compression failed:', err);
  }
}
```

---

## 7. Backpressure

**Backpressure** occurs when data is written to a stream faster than it can be consumed.

### The Problem:

```javascript
// ❌ Can cause memory issues
const readable = fs.createReadStream('huge-file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('data', (chunk) => {
  writable.write(chunk); // Might write faster than disk can handle
});
```

### The Solution - Handle Backpressure:

```javascript
// ✅ Proper backpressure handling
const readable = fs.createReadStream('huge-file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  
  if (!canContinue) {
    // Buffer is full, pause reading
    readable.pause();
  }
});

writable.on('drain', () => {
  // Buffer is empty, resume reading
  readable.resume();
});
```

### Why pipe() Handles Backpressure Automatically:

```javascript
// ✅ pipe() automatically handles backpressure
readable.pipe(writable);
```

---

## 8. Best Practices

### 1. Always Handle Errors

```javascript
// ❌ Bad
fs.createReadStream('file.txt')
  .pipe(fs.createWriteStream('output.txt'));

// ✅ Good
const readable = fs.createReadStream('file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('error', (err) => console.error('Read error:', err));
writable.on('error', (err) => console.error('Write error:', err));

readable.pipe(writable);

// ✅ Better - Use pipeline
pipeline(
  fs.createReadStream('file.txt'),
  fs.createWriteStream('output.txt'),
  (err) => {
    if (err) console.error('Pipeline error:', err);
  }
);
```

### 2. Use Streams for Large Files

```javascript
// ❌ Bad - Loads entire file in memory
const data = fs.readFileSync('large-file.txt');
response.send(data);

// ✅ Good - Streams the file
fs.createReadStream('large-file.txt').pipe(response);
```

### 3. Implement Custom Transform Streams

```javascript
const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const upperChunk = chunk.toString().toUpperCase();
    this.push(upperChunk);
    callback();
  }
}

// Usage
fs.createReadStream('input.txt')
  .pipe(new UpperCaseTransform())
  .pipe(fs.createWriteStream('output.txt'));
```

### 4. Use Object Mode for Non-Binary Data

```javascript
const { Transform } = require('stream');

const jsonParse = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    try {
      const obj = JSON.parse(chunk);
      this.push(obj);
      callback();
    } catch (err) {
      callback(err);
    }
  }
});
```

### 5. Clean Up Resources

```javascript
const readable = fs.createReadStream('file.txt');

// Clean up on error or finish
readable.on('close', () => {
  console.log('Stream closed');
});

readable.on('error', (err) => {
  readable.destroy(); // Ensure cleanup
  console.error(err);
});
```

---

## Quick Reference

### Buffer Methods

- `Buffer.from(str)` - Create from string
- `Buffer.alloc(size)` - Create with size
- `buf.toString()` - Convert to string
- `buf.write(str)` - Write string
- `Buffer.concat([buf1, buf2])` - Concatenate

### Stream Types

- **Readable**: Read data from source
- **Writable**: Write data to destination
- **Duplex**: Both readable and writable
- **Transform**: Modify data while passing through

### Common Patterns

```javascript
// Reading file
fs.createReadStream('file.txt')

// Writing file
fs.createWriteStream('file.txt')

// Piping
source.pipe(destination)

// Pipeline (recommended)
pipeline(source, transform, destination, callback)

// Transform
new Transform({ transform(chunk, enc, cb) { ... } })
```

---

## 📝 Key Takeaways

1. **Buffers** store raw binary data, fixed size
2. **Streams** process data in chunks, memory efficient
3. Four stream types: Readable, Writable, Duplex, Transform
4. Use **pipeline()** over pipe() for better error handling
5. Always handle **backpressure** when not using pipe()
6. Streams are perfect for large files and real-time data
7. Implement custom transforms for data processing
8. Object mode for non-binary data streams

---

## 🔗 Further Reading

- [Node.js Stream Documentation](https://nodejs.org/api/stream.html)
- [Node.js Buffer Documentation](https://nodejs.org/api/buffer.html)
- [Stream Handbook by substack](https://github.com/substack/stream-handbook)
