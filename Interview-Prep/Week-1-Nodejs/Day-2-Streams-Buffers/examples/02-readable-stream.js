// Example 2: Readable Streams
const fs = require('fs');
const path = require('path');

console.log('=== Example 2: Readable Streams ===\n');

// Create a sample file first
const sampleFile = path.join(__dirname, 'sample.txt');
fs.writeFileSync(sampleFile, 'This is a sample file for demonstrating readable streams.\n'.repeat(10));

console.log('1. Reading file with streams:\n');

// Create readable stream
const readable = fs.createReadStream(sampleFile, {
    encoding: 'utf8',
    highWaterMark: 64 // Read 64 bytes at a time (smaller chunks for demo)
});

let chunkCount = 0;
let totalSize = 0;

// Listen to data events
readable.on('data', (chunk) => {
    chunkCount++;
    totalSize += chunk.length;
    console.log(`   Chunk ${chunkCount}: ${chunk.length} bytes`);
    console.log(`   Preview: ${chunk.substring(0, 50)}...`);
});

readable.on('end', () => {
    console.log(`\n2. Stream finished:`);
    console.log(`   Total chunks: ${chunkCount}`);
    console.log(`   Total bytes: ${totalSize}`);
});

readable.on('error', (err) => {
    console.error('   Error:', err.message);
});

// Demonstrate pause/resume
setTimeout(() => {
    console.log('\n3. Pausing stream for 1 second...');
    readable.pause();

    setTimeout(() => {
        console.log('   Resuming stream...\n');
        readable.resume();
    }, 1000);
}, 100);
