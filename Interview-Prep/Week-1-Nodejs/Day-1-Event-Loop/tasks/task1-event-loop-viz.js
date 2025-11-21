// Task 1: Event Loop Visualization
// Build a program that demonstrates the order of execution

console.log('=== Task 1: Event Loop Visualization ===');
console.log('Complete this task by predicting and verifying execution order\n');

// TODO: Add your predictions as comments, then run to verify

console.log('A');

setTimeout(() => console.log('B'), 0);
setTimeout(() => console.log('C'), 100);

Promise.resolve()
    .then(() => console.log('D'))
    .then(() => console.log('E'));

process.nextTick(() => console.log('F'));

setImmediate(() => console.log('G'));

Promise.resolve().then(() => {
    console.log('H');
    process.nextTick(() => console.log('I'));
});

console.log('J');

// Task:
// 1. Write down your predicted order: _________________
// 2. Run the program and check if you were correct
// 3. Explain why each output appears in that position
