// Example 4: Transform Streams
const { Transform } = require('stream');
const fs = require('fs');
const path = require('path');

console.log('=== Example 4: Transform Streams ===\n');

// 1. Simple uppercase transform
console.log('1. Uppercase Transform:');

class UpperCaseTransform extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}

const upperCase = new UpperCaseTransform();

// Create test input
const inputFile = path.join(__dirname, 'input.txt');
fs.writeFileSync(inputFile, 'hello world\nthis is a test\nnode.js streams are cool');

const outputFile1 = path.join(__dirname, 'uppercase-output.txt');

fs.createReadStream(inputFile)
    .pipe(upperCase)
    .pipe(fs.createWriteStream(outputFile1))
    .on('finish', () => {
        console.log('   ✓ Uppercase transform complete');
        console.log('   Output:', fs.readFileSync(outputFile1, 'utf8'));
    });

// 2. CSV to JSON transform
console.log('\n2. CSV to JSON Transform:');

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
                this.headers = line.split(',').map(h => h.trim());
            } else {
                const values = line.split(',').map(v => v.trim());
                const obj = {};
                this.headers.forEach((header, i) => {
                    obj[header] = values[i];
                });
                this.push(JSON.stringify(obj) + '\n');
            }
        }

        callback();
    }

    _flush(callback) {
        // Process remaining buffer
        if (this.buffer.trim()) {
            const values = this.buffer.split(',').map(v => v.trim());
            const obj = {};
            this.headers.forEach((header, i) => {
                obj[header] = values[i];
            });
            this.push(JSON.stringify(obj) + '\n');
        }
        callback();
    }
}

// Create CSV file
const csvFile = path.join(__dirname, 'data.csv');
fs.writeFileSync(csvFile, 'name,age,city\nJohn,30,New York\nJane,25,London\nBob,35,Paris');

const jsonFile = path.join(__dirname, 'data.json');
const csvToJson = new CsvToJsonTransform();

fs.createReadStream(csvFile)
    .pipe(csvToJson)
    .pipe(fs.createWriteStream(jsonFile))
    .on('finish', () => {
        console.log('   ✓ CSV to JSON transform complete');
        console.log('   Output:');
        const jsonOutput = fs.readFileSync(jsonFile, 'utf8');
        jsonOutput.split('\n').filter(l => l).forEach(line => {
            console.log('  ', line);
        });
    });

// 3. Line counter transform
console.log('\n3. Line Counter Transform:');

class LineCounterTransform extends Transform {
    constructor(options) {
        super(options);
        this.lineCount = 0;
    }

    _transform(chunk, encoding, callback) {
        const lines = chunk.toString().split('\n');
        this.lineCount += lines.length - 1; // Don't count incomplete last line
        this.push(chunk);
        callback();
    }

    _flush(callback) {
        this.push(`\n\n--- Total lines: ${this.lineCount} ---\n`);
        callback();
    }
}

const counterFile = path.join(__dirname, 'counted-output.txt');
const counter = new LineCounterTransform();

fs.createReadStream(inputFile)
    .pipe(counter)
    .pipe(fs.createWriteStream(counterFile))
    .on('finish', () => {
        console.log('   ✓ Line counter transform complete');
        console.log('   Output:', fs.readFileSync(counterFile, 'utf8'));
    });

// 4. Data validation transform
console.log('\n4. Data Validation Transform:');

class ValidationTransform extends Transform {
    constructor(validator, options) {
        super(options);
        this.validator = validator;
    }

    _transform(chunk, encoding, callback) {
        const data = chunk.toString();

        try {
            const isValid = this.validator(data);

            if (isValid) {
                this.push(chunk);
                callback();
            } else {
                callback(new Error(`Validation failed for: ${data.substring(0, 50)}...`));
            }
        } catch (err) {
            callback(err);
        }
    }
}

// Example: Only allow lines with at least 5 characters
const validator = (data) => {
    const lines = data.split('\n');
    return lines.every(line => !line.trim() || line.length >= 5);
};

const validationTransform = new ValidationTransform(validator);
const validatedFile = path.join(__dirname, 'validated-output.txt');

fs.createReadStream(inputFile)
    .pipe(validationTransform)
    .pipe(fs.createWriteStream(validatedFile))
    .on('finish', () => {
        console.log('   ✓ Validation transform complete');
    })
    .on('error', (err) => {
        console.log('   ✗ Validation failed:', err.message);
    });
