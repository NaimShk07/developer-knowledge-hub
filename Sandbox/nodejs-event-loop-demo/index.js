// Demonstrating Node.js Event Loop Priority Ordering

console.log('1. Synchronous: Start of Script');

// 1. Timer Macrotask
setTimeout(() => {
  console.log('5. Macrotask: setTimeout(0ms)');
}, 0);

// 2. Check Macrotask
setImmediate(() => {
  console.log('6. Macrotask: setImmediate()');
});

// 3. Process nextTick
process.nextTick(() => {
  console.log('3. Microtask: process.nextTick()');
});

// 4. Promise Microtask
Promise.resolve().then(() => {
  console.log('4. Microtask: Promise.then()');
});

console.log('2. Synchronous: End of Script');
