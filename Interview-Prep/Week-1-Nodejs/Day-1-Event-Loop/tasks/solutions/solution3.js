// Solution 3: Custom Debounce Function
console.log('=== Solution 3: Custom Debounce ===\n');

function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
        // Clear existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Advanced version with immediate execution option
function debounceAdvanced(func, delay, immediate = false) {
    let timeoutId;

    return function (...args) {
        const callNow = immediate && !timeoutId;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            timeoutId = null;
            if (!immediate) {
                func.apply(this, args);
            }
        }, delay);

        if (callNow) {
            func.apply(this, args);
        }
    };
}

// Test basic debounce
console.log('Test 1: Basic Debounce');
const expensiveOperation = (value) => {
    console.log(`  Processing: ${value}`);
};

const debouncedOperation = debounce(expensiveOperation, 300);

console.log('Simulating rapid calls...');
debouncedOperation('a');
debouncedOperation('ab');
debouncedOperation('abc');
debouncedOperation('abcd');
debouncedOperation('abcde');
// Only 'abcde' should be processed after 300ms

// Test advanced debounce with immediate
setTimeout(() => {
    console.log('\nTest 2: Debounce with Immediate Execution');
    const immediateDebounced = debounceAdvanced(expensiveOperation, 300, true);

    console.log('First call (should execute immediately):');
    immediateDebounced('first');

    console.log('Rapid calls (should be debounced):');
    setTimeout(() => immediateDebounced('second'), 50);
    setTimeout(() => immediateDebounced('third'), 100);

    // 'first' executes immediately
    // 'second' and 'third' are debounced, only 'third' won't execute
    // because we call again within 300ms
}, 500);

// Real-world example: Search input
setTimeout(() => {
    console.log('\nTest 3: Real-world Search Example');

    const searchAPI = (query) => {
        console.log(`  🔍 API Call: Searching for "${query}"`);
        // Simulate API call
    };

    const debouncedSearch = debounce(searchAPI, 500);

    // Simulate user typing "javascript"
    const userInput = ['j', 'ja', 'jav', 'java', 'javas', 'javasc', 'javascr', 'javascri', 'javascrip', 'javascript'];

    console.log('Simulating user typing "javascript"...');
    userInput.forEach((input, index) => {
        setTimeout(() => {
            console.log(`  User typed: ${input}`);
            debouncedSearch(input);
        }, index * 50);
    });

    // Only the last input 'javascript' will trigger the API call
    // (500ms after last keystroke)
}, 1500);

setTimeout(() => {
    console.log('\n✅ Debounce demo completed!');
    console.log('\nKey Learnings:');
    console.log('1. Debounce delays execution until calls stop');
    console.log('2. Perfect for search inputs, window resize, scroll events');
    console.log('3. Reduces unnecessary API calls and improves performance');
    console.log('4. Immediate option executes first call right away');
}, 3500);
