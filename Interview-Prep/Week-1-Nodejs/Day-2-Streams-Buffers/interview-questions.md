# Day 2: Interview Questions - Streams & Buffers

## Question 1: What are Buffers and why are they needed in Node.js?

**Answer:**

**Buffers** are temporary storage areas for binary data in Node.js. They represent fixed-size chunks of memory allocated outside the V8 JavaScript heap.

**Why needed:**
1. JavaScript wasn't originally designed to handle binary data
2. Needed for I/O operations (file system, TCP streams, etc.)
3. Efficient handling of raw binary data
4. Work with data before it's converted to string

**Key characteristics:**
- Fixed size (cannot be resized after creation)
- Store raw binary data (bytes 0-255)
- Allocated outside V8 heap
- More efficient than strings for binary data

**Example:**
```javascript
// Creating buffers
const buf1 = Buffer.from('Hello'); // From string
const buf2 = Buffer.alloc(10); // Allocate 10 bytes
const buf3 = Buffer.from([72, 101, 108, 108, 111]); // From array

console.log(buf1); // <Buffer 48 65 6c 6c 6f>
console.log(buf1.toString()); // "Hello"
console.log(buf1.toString('hex')); // "48656c6c6f"
console.log(buf1.toString('base64')); // "SGVsbG8="

// Buffer operations
const buf4 = Buffer.from('World');
const combined = Buffer.concat([buf1, buf4]);
console.log(combined.toString()); // "HelloWorld"
```

**When to use:**
- File I/O operations
- Network communication (TCP/UDP)
- Image/video processing
- Cryptography
- Any binary data manipulation

---

## Question 2: Explain the four types of streams in Node.js with examples.

**Answer:**

### 1. Readable Streams
**Sources** that provide data (read from).

**Examples:** `fs.createReadStream()`, `http.IncomingMessage`, `process.stdin`

```javascript
const fs = require('fs');
const readable = fs.createReadStream('file.txt');

readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

readable.on('end', () => {
  console.log('Finished reading');
});
```

### 2. Writable Streams
**Destinations** where you write data (write to).

**Examples:** `fs.createWriteStream()`, `http.ServerResponse`, `process.stdout`

```javascript
const writable = fs.createWriteStream('output.txt');

writable.write('Hello ');
writable.write('World');
writable.end();

writable.on('finish', () => {
  console.log('All data written');
});
```

### 3. Duplex Streams
Both **readable and writable** (bidirectional).

**Examples:** `net.Socket`, TCP sockets

```javascript
const net = require('net');
const socket = net.connect(8080);

// Write (writable side)
socket.write('Hello Server');

// Read (readable side)
socket.on('data', (data) => {
  console.log('Received:', data.toString());
});
```

### 4. Transform Streams
**Duplex streams that modify data** as it passes through.

**Examples:** `zlib.createGzip()`, `crypto.createCipher()`

```javascript
const { Transform } = require('stream');
const zlib = require('zlib');

// Built-in transform
fs.createReadStream('file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('file.txt.gz'));

// Custom transform
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

process.stdin.pipe(upperCase).pipe(process.stdout);
```

**Quick Reference:**

| Type      | Direction   | Use Case    | Example                   |
| --------- | ----------- | ----------- | ------------------------- |
| Readable  | Output →    | Read data   | File read, HTTP request   |
| Writable  | → Input     | Write data  | File write, HTTP response |
| Duplex    | ↔ Both      | Two-way     | Socket, TCP connection    |
| Transform | → Process → | Modify data | Compression, encryption   |

---

## Question 3: What is backpressure and how do you handle it in streams?

**Answer:**

**Backpressure** occurs when data is written to a stream faster than it can be consumed, causing memory buildup.

**The Problem:**
```javascript
// ❌ Can cause memory issues
const readable = fs.createReadStream('huge-file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('data', (chunk) => {
  writable.write(chunk); // Writing faster than disk can handle
});
```

**Why it's dangerous:**
- Memory consumption grows unbounded
- Can crash the application
- Poor performance

**Solution 1: Manual Backpressure Handling**
```javascript
// ✅ Proper backpressure handling
const readable = fs.createReadStream('huge-file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  
  if (!canContinue) {
    // Buffer is full, pause reading
    console.log('Backpressure! Pausing...');
    readable.pause();
  }
});

writable.on('drain', () => {
  // Buffer emptied, resume reading
  console.log('Drained! Resuming...');
  readable.resume();
});

readable.on('end', () => {
  writable.end();
});
```

**Solution 2: Use pipe() (Automatic)**
```javascript
// ✅ pipe() handles backpressure automatically
readable.pipe(writable);
```

**Solution 3: Use pipeline() (Best Practice)**
```javascript
// ✅ pipeline() with error handling
const { pipeline } = require('stream');

pipeline(
  fs.createReadStream('input.txt'),
  someTransform,
  fs.createWriteStream('output.txt'),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

**How backpressure works:**
1. `write()` returns `false` when internal buffer is full
2. Consumer pauses producing more data
3. `drain` event fires when buffer is empty
4. Consumer resumes producing data

**Key Points:**
- Always handle backpressure for large data
- Use `pipe()` or `pipeline()` for automatic handling
- Monitor `write()` return value for manual handling
- Listen to `drain` event to resume

---

## Question 4: What's the difference between pipe() and pipeline()? Which should you use?

**Answer:**

### pipe() - Classic Method

**Pros:**
- Simple syntax
- Automatic backpressure handling
- Chainable

**Cons:**
- Poor error handling
- Doesn't clean up resources properly
- Memory leaks possible on errors
- Need to attach error handlers to each stream

```javascript
// Using pipe()
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('output.txt.gz'));

// Problem: No error handling!
// If any stream errors, others may not clean up

// Better with error handling
const read = fs.createReadStream('input.txt');
const gzip = zlib.createGzip();
const write = fs.createWriteStream('output.txt.gz');

read.on('error', (err) => console.error('Read error:', err));
gzip.on('error', (err) => console.error('Gzip error:', err));
write.on('error', (err) => console.error('Write error:', err));

read.pipe(gzip).pipe(write);
```

### pipeline() - Modern Method (Recommended)

**Pros:**
- Single error handler for entire pipeline
- Automatic cleanup on errors
- Calls `destroy()` on all streams when error occurs
- Works with promises (async/await)
- No memory leaks

**Cons:**
- Slightly more verbose

```javascript
const { pipeline } = require('stream');

// Using pipeline() with callback
pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('output.txt.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
      // All streams automatically cleaned up
    } else {
      console.log('Pipeline succeeded');
    }
  }
);

// Using pipeline() with promises (async/await)
const { pipeline: pipelinePromise } = require('stream/promises');

async function compress() {
  try {
    await pipelinePromise(
      fs.createReadStream('input.txt'),
      zlib.createGzip(),
      fs.createWriteStream('output.txt.gz')
    );
    console.log('Compression successful');
  } catch (err) {
    console.error('Compression failed:', err);
  }
}
```

### Comparison Table

| Feature          | pipe()               | pipeline()     |
| ---------------- | -------------------- | -------------- |
| Error handling   | Manual (each stream) | Single handler |
| Cleanup          | Manual               | Automatic      |
| Memory leaks     | Possible             | Prevented      |
| Promises support | No                   | Yes            |
| destroy() called | No                   | Yes            |
| Recommended      | ❌                    | ✅              |

### Recommendation

**Always use `pipeline()` over `pipe()`** for production code because:
1. Better error handling
2. Automatic resource cleanup
3. Prevents memory leaks
4. Works with async/await
5. More maintainable

**Only use `pipe()` for:**
- Quick scripts/demos
- When backward compatibility required
- Simple one-liners where error handling isn't critical

---

## Question 5: How would you implement a custom Transform stream for data processing?

**Answer:**

**Custom Transform Stream** allows you to modify data as it passes through the stream.

### Basic Structure

```javascript
const { Transform } = require('stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // Initialize state
  }

  _transform(chunk, encoding, callback) {
    // Process chunk
    // this.push(modifiedData); // Send data to next stream
    // callback(error);         // Signal completion or error
  }

  _flush(callback) {
    // Called at the end, clean up or finalize
    // Optional
    callback();
  }
}
```

### Example 1: Uppercase Transform

```javascript
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

### Example 2: CSV to JSON Transform

```javascript
class CsvToJsonTransform extends Transform {
  constructor(options) {
    super(options);
    this.headers = null;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    
    // Keep incomplete line in buffer
    this.buffer = lines.pop();
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      if (!this.headers) {
        // First line is headers
        this.headers = line.split(',');
      } else {
        // Convert to JSON
        const values = line.split(',');
        const obj = {};
        this.headers.forEach((header, i) => {
          obj[header.trim()] = values[i]?.trim();
        });
        this.push(JSON.stringify(obj) + '\n');
      }
    }
    
    callback();
  }

  _flush(callback) {
    // Process remaining buffer
    if (this.buffer.trim() && this.headers) {
      const values = this.buffer.split(',');
      const obj = {};
      this.headers.forEach((header, i) => {
        obj[header.trim()] = values[i]?.trim();
      });
      this.push(JSON.stringify(obj) + '\n');
    }
    callback();
  }
}

// Usage
fs.createReadStream('data.csv')
  .pipe(new CsvToJsonTransform())
  .pipe(fs.createWriteStream('data.json'));
```

### Example 3: Data Validation Transform

```javascript
class ValidationTransform extends Transform {
  constructor(validatorFn, options) {
    super(options);
    this.validator = validatorFn;
  }

  _transform(chunk, encoding, callback) {
    const data = chunk.toString();
    
    try {
      if (this.validator(data)) {
        this.push(chunk);
        callback();
      } else {
        callback(new Error(`Validation failed: ${data.substring(0, 50)}...`));
      }
    } catch (err) {
      callback(err);
    }
  }
}

// Usage: Only allow JSON objects
const isValidJson = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
};

const validator = new ValidationTransform(isValidJson);
```

### Example 4: Object Mode Transform

```javascript
// For processing JavaScript objects instead of buffers
class FilterTransform extends Transform {
  constructor(filterFn, options) {
    super({ ...options, objectMode: true });
    this.filter = filterFn;
  }

  _transform(obj, encoding, callback) {
    if (this.filter(obj)) {
      this.push(obj);
    }
    callback();
  }
}

// Usage: Filter users by age
const filterAdults = new FilterTransform(user => user.age >= 18);

// Input stream of objects
sourceStream
  .pipe(filterAdults)
  .pipe(destinationStream);
```

### Key Methods

| Method                                  | Purpose                  | Required |
| --------------------------------------- | ------------------------ | -------- |
| `_transform(chunk, encoding, callback)` | Process each chunk       | Yes      |
| `_flush(callback)`                      | Finalize at the end      | No       |
| `this.push(data)`                       | Send data to next stream | -        |
| `callback(err)`                         | Signal completion/error  | Yes      |

### Best Practices

1. **Always call callback()** - Signals processing is complete
2. **Handle errors** - Pass errors to callback
3. **Use _flush()** - For cleanup or final processing
4. **Consider objectMode** - For non-binary data
5. **Buffer incomplete data** - For line/record-based processing
6. **Be memory efficient** - Don't buffer entire input

---

## Bonus Tips for Interviews

### Common Follow-ups
- How do streams improve performance?
- When would you NOT use streams?
- Explain memory usage: streams vs loading entire file
- How do you debug stream issues?
- What's the difference between object mode and normal mode?

### Performance Comparison
```javascript
// Without streams (loads entire file in memory)
const data = fs.readFileSync('1GB-file.txt');
// Memory usage: ~1GB

// With streams (constant memory)
fs.createReadStream('1GB-file.txt')
  .pipe(fs.createWriteStream('output.txt'));
// Memory usage: ~64KB (default highWaterMark)
```

### When NOT to use streams
- Small files that fit easily in memory
- Need random access to data
- Data must be processed all at once
- Simpler code is more valuable than marginal performance gain
