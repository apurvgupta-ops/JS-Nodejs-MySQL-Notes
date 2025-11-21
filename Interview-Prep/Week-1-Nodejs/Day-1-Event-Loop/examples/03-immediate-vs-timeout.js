// Example 3: setImmediate vs setTimeout
const fs = require('fs');

console.log('=== Example 3: setImmediate vs setTimeout ===\n');

// Case 1: From main module (order is non-deterministic)
console.log('Case 1: Main module');
setTimeout(() => console.log('  setTimeout'), 0);
setImmediate(() => console.log('  setImmediate'));

// Case 2: Inside I/O callback (setImmediate always first)
setTimeout(() => {
    console.log('\nCase 2: Inside I/O callback');
    fs.readFile(__filename, () => {
        setTimeout(() => console.log('  setTimeout'), 0);
        setImmediate(() => console.log('  setImmediate'));
    });
}, 100);

// Case 1 output is unpredictable
// Case 2 output is always:
//   setImmediate
//   setTimeout
