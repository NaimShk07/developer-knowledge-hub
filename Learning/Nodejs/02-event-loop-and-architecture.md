# Node.js Event Loop & Architecture

> The Event Loop is the engine inside Node.js that coordinates asynchronous tasks on a single main thread.

---

## 1. Key Takeaways (TL;DR)

- Node.js runs your JavaScript code on a single thread.
- Heavy I/O tasks (file reads, network calls, database queries) are offloaded to **Libuv** and operating system threads.
- When an I/O task finishes, its callback is placed in a queue.
- The Event Loop picks callbacks from queues and executes them when the call stack is empty.
- **Microtasks** (`process.nextTick`, Promises) run immediately before regular timer callbacks.

---

## 2. Why & When to Use

- **Why:** Avoids creating thousands of threads, saving CPU memory and context-switching overhead.
- **When:** Ideal for I/O-heavy applications like REST APIs, streaming services, and chat backends.

### Simple Analogy
- **The Call Stack** is a chef cooking one dish at a time.
- **Libuv** is the oven. The chef puts food in the oven and keeps cooking other dishes.
- **The Event Loop** checks when the oven timer rings and brings the food back.

---

## 3. Minimal Example

Notice how the asynchronous timers run after synchronous code:

```javascript
console.log("1. Synchronous start");

setTimeout(() => {
  console.log("4. Timer callback (Macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise callback (Microtask)");
});

process.nextTick(() => {
  console.log("2. NextTick callback (Top priority microtask)");
});

console.log("1.5. Synchronous end");
```

**Output:**
```text
1. Synchronous start
1.5. Synchronous end
2. NextTick callback (Top priority microtask)
3. Promise callback (Microtask)
4. Timer callback (Macrotask)
```

> **Try this live:** Run the complete experiment in [Sandbox/nodejs-event-loop-demo/](../../Sandbox/nodejs-event-loop-demo/README.md).

---

## 4. Common Mistakes & Tips

- **Mistake:** Running CPU-heavy loops (e.g., image resizing, huge JSON parsing) on the main thread.
  - _Fix:_ Heavy calculations freeze the Event Loop for all users. Offload CPU-heavy work to **Worker Threads**.
- **Tip:** `setImmediate()` runs on the Check phase (after I/O polling), whereas `setTimeout(fn, 0)` runs on the Timers phase.

---

## 5. Quick Reference

| Phase / Queue | What Runs There |
| :--- | :--- |
| **Call Stack** | Synchronous JavaScript functions |
| **Microtask Queue** | `process.nextTick()` and `Promise.then()` callbacks |
| **Timers Phase** | `setTimeout()` and `setInterval()` callbacks |
| **Poll Phase** | Incoming I/O events (network data, file reads) |
| **Check Phase** | `setImmediate()` callbacks |
| **Close Phase** | Socket and resource close callbacks (e.g., `socket.on('close')`) |
