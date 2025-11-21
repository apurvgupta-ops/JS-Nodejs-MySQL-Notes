// Example 6: Real-world Stream Applications
const fs = require('fs');
const zlib = require('zlib');
const crypto = require('crypto');
const { Transform, pipeline } = require('stream');
const path = require('path');

console.log('=== Example 6: Real-world Stream Applications ===\n');

// 1. File Compression and Decompression
console.log('1. File Compression and Decompression:');

async function compressFile(input, output) {
    return new Promise((resolve, reject) => {
        pipeline(
            fs.createReadStream(input),
            zlib.createGzip(),
            fs.createWriteStream(output),
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

async function decompressFile(input, output) {
    return new Promise((resolve, reject) => {
        pipeline(
            fs.createReadStream(input),
            zlib.createGunzip(),
            fs.createWriteStream(output),
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

(async () => {
    const originalFile = path.join(__dirname, 'compress-test.txt');
    fs.writeFileSync(originalFile, 'Hello World! '.repeat(1000));

    const compressed = path.join(__dirname, 'compress-test.txt.gz');
    const decompressed = path.join(__dirname, 'compress-test-restored.txt');

    await compressFile(originalFile, compressed);
    console.log('   ✓ File compressed');

    await decompressFile(compressed, decompressed);
    console.log('   ✓ File decompressed');

    const original = fs.readFileSync(originalFile, 'utf8');
    const restored = fs.readFileSync(decompressed, 'utf8');
    console.log('   Verification:', original === restored ? '✓ Match' : '✗ Mismatch');
})();

// 2. File Encryption and Decryption
setTimeout(() => {
    console.log('\n2. File Encryption and Decryption:');

    async function encryptFile(input, output, password) {
        const algorithm = 'aes-256-cbc';
        const key = crypto.scryptSync(password, 'salt', 32);
        const iv = crypto.randomBytes(16);

        return new Promise((resolve, reject) => {
            const cipher = crypto.createCipheriv(algorithm, key, iv);

            // Write IV first (needed for decryption)
            const writeStream = fs.createWriteStream(output);
            writeStream.write(iv);

            pipeline(
                fs.createReadStream(input),
                cipher,
                writeStream,
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    async function decryptFile(input, output, password) {
        const algorithm = 'aes-256-cbc';
        const key = crypto.scryptSync(password, 'salt', 32);

        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(input);

            // Read IV first
            let iv;
            readStream.once('readable', () => {
                iv = readStream.read(16);

                const decipher = crypto.createDecipheriv(algorithm, key, iv);

                pipeline(
                    readStream,
                    decipher,
                    fs.createWriteStream(output),
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        });
    }

    (async () => {
        const plainFile = path.join(__dirname, 'secret.txt');
        fs.writeFileSync(plainFile, 'This is a secret message!');

        const encryptedFile = path.join(__dirname, 'secret.txt.enc');
        const decryptedFile = path.join(__dirname, 'secret-restored.txt');

        const password = 'mySecretPassword123';

        await encryptFile(plainFile, encryptedFile, password);
        console.log('   ✓ File encrypted');

        await decryptFile(encryptedFile, decryptedFile, password);
        console.log('   ✓ File decrypted');

        const original = fs.readFileSync(plainFile, 'utf8');
        const restored = fs.readFileSync(decryptedFile, 'utf8');
        console.log('   Verification:', original === restored ? '✓ Match' : '✗ Mismatch');
    })();
}, 1000);

// 3. CSV Processing Stream
setTimeout(() => {
    console.log('\n3. CSV Processing (Filter and Transform):');

    class CsvFilterTransform extends Transform {
        constructor(filterFn, options) {
            super(options);
            this.filterFn = filterFn;
            this.headers = null;
            this.buffer = '';
        }

        _transform(chunk, encoding, callback) {
            this.buffer += chunk.toString();
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;

                if (!this.headers) {
                    this.headers = line.split(',');
                    this.push(line + '\n');
                } else {
                    const values = line.split(',');
                    const row = {};
                    this.headers.forEach((header, i) => {
                        row[header.trim()] = values[i]?.trim();
                    });

                    if (this.filterFn(row)) {
                        this.push(line + '\n');
                    }
                }
            }
            callback();
        }

        _flush(callback) {
            if (this.buffer.trim()) {
                this.push(this.buffer);
            }
            callback();
        }
    }

    // Create sample CSV
    const csvInput = path.join(__dirname, 'users.csv');
    fs.writeFileSync(csvInput,
        'name,age,city,salary\n' +
        'John,25,New York,50000\n' +
        'Jane,35,London,75000\n' +
        'Bob,28,Paris,60000\n' +
        'Alice,32,Tokyo,80000\n' +
        'Charlie,22,Berlin,45000\n'
    );

    const csvOutput = path.join(__dirname, 'filtered-users.csv');

    // Filter: only users with salary > 55000
    const filter = (row) => parseInt(row.salary) > 55000;

    pipeline(
        fs.createReadStream(csvInput),
        new CsvFilterTransform(filter),
        fs.createWriteStream(csvOutput),
        (err) => {
            if (err) {
                console.error('   ✗ CSV processing error:', err);
            } else {
                console.log('   ✓ CSV filtering complete');
                console.log('   Filtered results:');
                console.log(fs.readFileSync(csvOutput, 'utf8'));
            }
        }
    );
}, 2000);

// 4. Log File Processing (Real-time monitoring)
setTimeout(() => {
    console.log('\n4. Log File Processing (Error Detection):');

    class LogAnalyzerTransform extends Transform {
        constructor(options) {
            super(options);
            this.errorCount = 0;
            this.warningCount = 0;
        }

        _transform(chunk, encoding, callback) {
            const line = chunk.toString();

            if (line.includes('ERROR')) {
                this.errorCount++;
                this.push(`❌ ${line}`);
            } else if (line.includes('WARN')) {
                this.warningCount++;
                this.push(`⚠️  ${line}`);
            } else {
                this.push(line);
            }

            callback();
        }

        _flush(callback) {
            const summary = `\n--- Summary ---\nErrors: ${this.errorCount}\nWarnings: ${this.warningCount}\n`;
            this.push(summary);
            callback();
        }
    }

    // Create sample log file
    const logInput = path.join(__dirname, 'app.log');
    fs.writeFileSync(logInput,
        '[2024-01-01 10:00:00] INFO: Server started\n' +
        '[2024-01-01 10:01:00] WARN: High memory usage\n' +
        '[2024-01-01 10:02:00] INFO: Request received\n' +
        '[2024-01-01 10:03:00] ERROR: Database connection failed\n' +
        '[2024-01-01 10:04:00] INFO: Retrying connection\n' +
        '[2024-01-01 10:05:00] ERROR: Authentication failed\n' +
        '[2024-01-01 10:06:00] WARN: Rate limit exceeded\n'
    );

    const logOutput = path.join(__dirname, 'analyzed-log.txt');

    pipeline(
        fs.createReadStream(logInput),
        new LogAnalyzerTransform(),
        fs.createWriteStream(logOutput),
        (err) => {
            if (err) {
                console.error('   ✗ Log analysis error:', err);
            } else {
                console.log('   ✓ Log analysis complete');
                console.log('   Results:');
                console.log(fs.readFileSync(logOutput, 'utf8'));
            }
        }
    );
}, 3000);

// 5. Memory-efficient large file processing
setTimeout(() => {
    console.log('\n5. Memory-efficient Large File Processing:');

    // Create a large file (100MB simulation with smaller size for demo)
    const largeFile = path.join(__dirname, 'large-file.txt');
    const writeStream = fs.createWriteStream(largeFile);

    for (let i = 0; i < 100000; i++) {
        writeStream.write(`Line ${i}: Some data here\n`);
    }
    writeStream.end();

    writeStream.on('finish', () => {
        const stats = fs.statSync(largeFile);
        console.log(`   Created file: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

        // Process the large file with streams (constant memory usage)
        let lineCount = 0;
        const countStream = new Transform({
            transform(chunk, encoding, callback) {
                lineCount += chunk.toString().split('\n').length - 1;
                callback();
            }
        });

        const startMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`   Memory before processing: ${startMemory.toFixed(2)} MB`);

        pipeline(
            fs.createReadStream(largeFile),
            countStream,
            (err) => {
                if (err) {
                    console.error('   ✗ Error:', err);
                } else {
                    const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
                    console.log(`   Memory after processing: ${endMemory.toFixed(2)} MB`);
                    console.log(`   Memory increase: ${(endMemory - startMemory).toFixed(2)} MB`);
                    console.log(`   ✓ Processed ${lineCount} lines`);
                    console.log('   Note: Memory usage stays constant with streams!');
                }
            }
        );
    });
}, 4000);
