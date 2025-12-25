// Example 6: Microtask Queue Starvation
console.log('=== Example 6: Microtask Queue Starvation ===\n');

let count = 0;

// This will starve the event loop!
// Uncomment at your own risk - will freeze the process
/*
function recursiveNextTick() {
  if (count++ < 1000000) {
    process.nextTick(recursiveNextTick);
  }
}
recursiveNextTick();
*/

// Better approach: Use setImmediate for recursion
function safeRecursion() {
    if (count++ < 5) {
        console.log(`Iteration ${count}`);
        setImmediate(safeRecursion); // Allows other events to process
    } else {
        console.log('Done safely!');
    }
}

safeRecursion();

// Demonstration of the difference
console.log('\nDemonstration:');

// This setTimeout will execute after safe recursion
setTimeout(() => {
    console.log('setTimeout executed (event loop not starved)');
}, 0);

// This demonstrates nextTick priority
process.nextTick(() => {
    console.log('nextTick has highest priority');
});
