// Task 3: Implement a Custom Debounce Function
// Create a debounce function that uses proper async concepts

console.log('=== Task 3: Custom Debounce ===\n');

// TODO: Implement debounce function
function debounce(func, delay) {
    // Your implementation here
    // Should delay function execution until after 'delay' ms have passed
    // since the last time it was invoked
}

// Test your implementation
const expensiveOperation = (value) => {
    console.log(`Processing: ${value}`);
};

const debouncedOperation = debounce(expensiveOperation, 300);

// Simulate rapid calls (like user typing)
console.log('Simulating rapid function calls...');
debouncedOperation('a');
debouncedOperation('ab');
debouncedOperation('abc');
debouncedOperation('abcd');
debouncedOperation('abcde');

// Only the last call should execute after 300ms
// Expected output (after 300ms): Processing: abcde

setTimeout(() => {
    console.log('\nTest completed');
}, 500);
