# Blocking vs Non-Blocking in Node.js

> Blocking refers to code that halts the single JavaScript thread from doing anything else. Non-blocking refers to code that delegates the work and yields the thread immediately.

---

## 1. Key Takeaways (TL;DR)

- **Blocking:** When the execution of additional JavaScript in the Node.js process must wait until a non-JavaScript operation completes.
- **Non-Blocking:** When JavaScript initiates an operation (like reading a file or making a network request) and immediately continues executing subsequent code.
- In Node.js, JavaScript execution is single-threaded. **If one request blocks the thread, every other user on the server is completely frozen.**
- I/O operations should almost always be non-blocking.
- CPU-intensive code is inherently blocking in JavaScript unless moved to a separate Worker Thread.

---

## 2. Real-World Analogy

```text
[ BLOCKING (The Drive-Through with One Cook) ]
Car 1 orders a complex burger.
The cook stops everything and cooks for 15 minutes.
Car 2, Car 3, and Car 4 are stuck behind Car 1, waiting in line unable to even place an order.

[ NON-BLOCKING (The Order-and-Buzzer System) ]
Car 1 orders.
The worker gives Car 1 a buzzer and tells them to park in a pickup bay.
Car 2 immediately pulls up and places their order.
When Car 1's burger is ready, the buzzer sounds and they receive their food.
```

---

## 3. Side-by-Side Code Comparison

### A. Blocking Code (What to AVOID)

```javascript
import fs from 'node:fs';

console.log('1. User A requests file');

// BLOCKING: The main thread sits completely idle waiting for disk I/O.
// If this file takes 3 seconds to read, all other users wait 3 seconds!
const content = fs.readFileSync('large-report.pdf');

console.log('2. File read complete');
console.log('3. Server can finally handle User B request');
```

**Output:**
```text
1. User A requests file
2. File read complete
3. Server can finally handle User B request
```

---

### B. Non-Blocking Code (The Standard Node.js Way)

```javascript
import fs from 'node:fs/promises';

console.log('1. User A requests file');

// NON-BLOCKING: Node delegates the file reading to Libuv's thread pool.
// The main thread immediately continues to line 11!
fs.readFile('large-report.pdf')
  .then((content) => {
    console.log('3. User A file read complete (Callback executed)');
  });

console.log('2. Server immediately handles User B request!');
```

**Output:**
```text
1. User A requests file
2. Server immediately handles User B request!
3. User A file read complete (Callback executed)
```

---

## 4. The 3 Dangerous Blocking Traps

It is not just `Sync` methods that cause blocking. Watch out for these three:

1. **Synchronous File & Cryptography APIs:**
   - `fs.readFileSync()`, `fs.writeFileSync()`
   - `crypto.pbkdf2Sync()`
   - *Fix:* Always use `node:fs/promises` or asynchronous callback versions.
2. **CPU-Intensive Loops:**
   - Running loops with billions of iterations, complex data transformations, or calculating large prime numbers directly on the main thread.
   - *Fix:* Use `worker_threads` to run heavy CPU math in a parallel thread.
3. **JSON Parsing & Regular Expressions (ReDoS):**
   - Running `JSON.parse()` on a 500MB string blocks the thread synchronously for seconds.
   - Using poorly structured regular expressions with catastrophic backtracking (ReDoS) locks the CPU at 100%.

---

## 5. Quick Reference

| Characteristic | Blocking | Non-Blocking |
| :--- | :--- | :--- |
| **Call Stack State** | Occupied / Frozen | Frees immediately after initiating task |
| **Server Concurrency** | Drops to 1 request at a time | High (thousands of concurrent requests) |
| **Methods** | `fs.readFileSync`, `crypto.pbkdf2Sync` | `fs.readFile`, `fetch`, `db.query` |
| **When to Use** | Only at startup / configuration loading | Everywhere inside request handlers & API routes |

---

## Related Hubs
- **Previous Topic:** [02-event-loop.md](02-event-loop.md)
- **Next Topic:** [04-synchronous-vs-asynchronous.md](04-synchronous-vs-asynchronous.md)
- **Interview Q&A:** [Interview-Prep/Nodejs/nodejs-interview-qa.md](../../Interview-Prep/Nodejs/nodejs-interview-qa.md)
