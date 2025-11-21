// Example 5: Pipe vs Pipeline
const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream');
const { pipeline: pipelinePromise } = require('stream/promises');
const path = require('path');

console.log('=== Example 5: Pipe vs Pipeline ===\n');

// Create sample file
const inputFile = path.join(__dirname, 'sample-data.txt');
const largeContent = 'This is sample data for compression.\n'.repeat(100);
fs.writeFileSync(inputFile, largeContent);

// 1. Using pipe() - Classic way
console.log('1. Using pipe() (classic):');

const outputPipe = path.join(__dirname, 'pipe-output.gz');

fs.createReadStream(inputFile)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(outputPipe))
    .on('finish', () => {
        console.log('   ✓ Pipe compression complete');
        const originalSize = fs.statSync(inputFile).size;
        const compressedSize = fs.statSync(outputPipe).size;
        console.log(`   Original: ${originalSize} bytes, Compressed: ${compressedSize} bytes`);
        console.log(`   Compression ratio: ${(compressedSize / originalSize * 100).toFixed(2)}%`);
    })
    .on('error', (err) => {
        console.error('   ✗ Pipe error:', err.message);
    });

// Problem with pipe(): Poor error handling
setTimeout(() => {
    console.log('\n2. Problem with pipe() - Poor error handling:');

    const nonExistentFile = path.join(__dirname, 'does-not-exist.txt');
    const errorOutput = path.join(__dirname, 'error-output.gz');

    const readStream = fs.createReadStream(nonExistentFile);
    const gzip = zlib.createGzip();
    const writeStream = fs.createWriteStream(errorOutput);

    // Need to handle errors on each stream separately
    readStream.on('error', (err) => {
        console.log('   ✗ Read stream error:', err.message);
    });

    gzip.on('error', (err) => {
        console.log('   ✗ Gzip stream error:', err.message);
    });

    writeStream.on('error', (err) => {
        console.log('   ✗ Write stream error:', err.message);
    });

    readStream.pipe(gzip).pipe(writeStream);
}, 1000);

// 3. Using pipeline() - Modern way with callback
setTimeout(() => {
    console.log('\n3. Using pipeline() with callback (modern):');

    const outputPipeline = path.join(__dirname, 'pipeline-output.gz');

    pipeline(
        fs.createReadStream(inputFile),
        zlib.createGzip(),
        fs.createWriteStream(outputPipeline),
        (err) => {
            if (err) {
                console.error('   ✗ Pipeline error:', err.message);
            } else {
                console.log('   ✓ Pipeline compression complete');
                const originalSize = fs.statSync(inputFile).size;
                const compressedSize = fs.statSync(outputPipeline).size;
                console.log(`   Original: ${originalSize} bytes, Compressed: ${compressedSize} bytes`);
            }
        }
    );
}, 2000);

// 4. Using pipeline() with promises - Best for async/await
setTimeout(async () => {
    console.log('\n4. Using pipeline() with promises (best for async/await):');

    const outputPromise = path.join(__dirname, 'promise-pipeline-output.gz');

    try {
        await pipelinePromise(
            fs.createReadStream(inputFile),
            zlib.createGzip(),
            fs.createWriteStream(outputPromise)
        );

        console.log('   ✓ Promise pipeline compression complete');
        const originalSize = fs.statSync(inputFile).size;
        const compressedSize = fs.statSync(outputPromise).size;
        console.log(`   Original: ${originalSize} bytes, Compressed: ${compressedSize} bytes`);
    } catch (err) {
        console.error('   ✗ Promise pipeline error:', err.message);
    }
}, 3000);

// 5. Multiple transforms with pipeline
setTimeout(async () => {
    console.log('\n5. Multiple transforms with pipeline:');

    const { Transform } = require('stream');

    // Custom transform: Add line numbers
    const addLineNumbers = new Transform({
        transform(chunk, encoding, callback) {
            const lines = chunk.toString().split('\n');
            const numbered = lines
                .map((line, i) => line ? `${i + 1}: ${line}` : line)
                .join('\n');
            callback(null, numbered);
        }
    });

    // Custom transform: Convert to uppercase
    const toUpperCase = new Transform({
        transform(chunk, encoding, callback) {
            callback(null, chunk.toString().toUpperCase());
        }
    });

    const multiTransformOutput = path.join(__dirname, 'multi-transform-output.txt');

    try {
        await pipelinePromise(
            fs.createReadStream(inputFile),
            addLineNumbers,
            toUpperCase,
            fs.createWriteStream(multiTransformOutput)
        );

        console.log('   ✓ Multi-transform pipeline complete');
        console.log('   First 5 lines:');
        const output = fs.readFileSync(multiTransformOutput, 'utf8');
        output.split('\n').slice(0, 5).forEach(line => {
            console.log('  ', line);
        });
    } catch (err) {
        console.error('   ✗ Multi-transform error:', err.message);
    }
}, 4000);

// 6. Error handling comparison
setTimeout(() => {
    console.log('\n6. Error handling comparison:');
    console.log('   pipe():     ✗ Must handle errors on each stream separately');
    console.log('   pipeline(): ✓ Single error handler for entire pipeline');
    console.log('   pipeline(): ✓ Automatic cleanup on error');
    console.log('   pipeline(): ✓ Calls destroy() on all streams');
    console.log('\n   Recommendation: Always use pipeline() over pipe()');
}, 5000);
