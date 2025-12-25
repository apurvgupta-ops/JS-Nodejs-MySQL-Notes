// Example 1: Buffer Basics
console.log('=== Example 1: Buffer Basics ===\n');

// Creating buffers
const buf1 = Buffer.from('Hello World');
const buf2 = Buffer.alloc(10);
const buf3 = Buffer.from([72, 101, 108, 108, 111]); // "Hello"

console.log('1. Buffer from string:');
console.log('  ', buf1);
console.log('   String:', buf1.toString());
console.log('   Hex:', buf1.toString('hex'));
console.log('   Base64:', buf1.toString('base64'));

console.log('\n2. Allocated buffer (10 bytes):');
console.log('  ', buf2);

console.log('\n3. Buffer from array:');
console.log('  ', buf3);
console.log('   String:', buf3.toString());

// Buffer operations
console.log('\n4. Buffer operations:');
const buf4 = Buffer.from('Node.js');
console.log('   Original:', buf4.toString());
console.log('   Length:', buf4.length, 'bytes');
console.log('   First byte:', buf4[0], '(', String.fromCharCode(buf4[0]), ')');

// Slice (creates a view)
const slice = buf4.slice(0, 4);
console.log('   Slice (0-4):', slice.toString());

// Concatenate
const buf5 = Buffer.from(' Streams');
const combined = Buffer.concat([buf4, buf5]);
console.log('   Concatenated:', combined.toString());

// Compare
const buf6 = Buffer.from('Node.js');
const buf7 = Buffer.from('Node.js');
console.log('   Equals:', buf6.equals(buf7));
console.log('   Compare:', buf6.compare(buf7)); // 0 means equal
