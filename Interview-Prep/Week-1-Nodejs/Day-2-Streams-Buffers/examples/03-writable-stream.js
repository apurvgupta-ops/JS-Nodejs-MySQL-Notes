// Example 3: Writable Streams
const fs = require('fs');
const path = require('path');

console.log('=== Example 3: Writable Streams ===\n');

const outputFile = path.join(__dirname, 'output.txt');

// Create writable stream
const writable = fs.createWriteStream(outputFile);

console.log('1. Writing data to file...\n');

// Write multiple chunks
for (let i = 1; i <= 5; i++) {
    const chunk = `Line ${i}: This is some sample data\n`;
    const canContinue = writable.write(chunk);
    console.log(`   Written line ${i}, can continue: ${canContinue}`);
}

// Handle drain event (buffer emptied)
writable.on('drain', () => {
    console.log('\n2. Buffer drained, ready for more data');
});

// End the stream
writable.end('\nThis is the final line.\n');

writable.on('finish', () => {
    console.log('\n3. All data written successfully!');
    console.log(`   Check ${outputFile}`);

    // Read and display the file
    const content = fs.readFileSync(outputFile, 'utf8');
    console.log('\n4. File contents:');
    console.log('---');
    console.log(content);
    console.log('---');
});

writable.on('error', (err) => {
    console.error('   Error:', err.message);
});

// Demonstrate backpressure handling
console.log('\n5. Demonstrating backpressure handling:\n');

const bigFile = path.join(__dirname, 'big-output.txt');
const writer = fs.createWriteStream(bigFile, {
    highWaterMark: 16 // Small buffer for demo
});

let canWrite = true;
let written = 0;

function writeData() {
    while (written < 100 && canWrite) {
        written++;
        const data = `Data chunk ${written}\n`;

        if (written === 100) {
            writer.write(data, () => {
                console.log('   Last chunk written');
            });
        } else {
            canWrite = writer.write(data);

            if (!canWrite) {
                console.log(`   Backpressure at chunk ${written}! Waiting for drain...`);
            }
        }
    }

    if (written < 100) {
        writer.once('drain', () => {
            console.log('   Drained! Resuming writes...');
            canWrite = true;
            writeData();
        });
    }
}

writeData();

writer.on('finish', () => {
    console.log(`\n6. Wrote ${written} chunks with backpressure handling`);
});

writer.end();
