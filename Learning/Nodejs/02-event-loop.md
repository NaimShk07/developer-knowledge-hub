# Node.js Event Loop

> The Event Loop is the central coordinator in Node.js that monitors the Call Stack and moves waiting asynchronous callbacks from queues into execution.

---

## 1. Key Takeaways (TL;DR)

- The Event Loop starts automatically when a Node.js process starts and runs continuously as long as there is pending work.
- It operates in a loop of **6 distinct phases**.
- **Microtasks** (`process.nextTick` and `Promise.then`) run with maximum priority and drain completely **between each phase** and immediately after the current operation finishes.
- **Macrotasks** (`setTimeout`, `setInterval`, `setImmediate`) run inside their respective phases of the loop.
- Never write infinite or synchronous loops inside the Event Loop, or all incoming traffic will freeze.

---

## 2. The 6 Phases of the Event Loop

```text
   ┌────────────────────────────────────────┐
┌─>│ 1. Timers (setTimeout, setInterval)    │
│  └──────────────────┬─────────────────────┘
│                     ▼
│  ┌────────────────────────────────────────┐
│  │ 2. Pending Callbacks (Deferred OS I/O) │
│  └──────────────────┬─────────────────────┘
│                     ▼
│  ┌────────────────────────────────────────┐
│  │ 3. Idle, Prepare (Internal Libuv use)  │
│  └──────────────────┬─────────────────────┘
│                     ▼
│  ┌────────────────────────────────────────┐
│  │ 4. Poll (Retrieve new I/O events)      │
│  └──────────────────┬─────────────────────┘
│                     ▼
│  ┌────────────────────────────────────────┐
│  │ 5. Check (setImmediate callbacks)      │
│  └──────────────────┬─────────────────────┘
│                     ▼
│  ┌────────────────────────────────────────┐
│  │ 6. Close Callbacks (socket.on('close'))│
└──┴──────────────────┬─────────────────────┘
```

> **Important:** Between **every single phase** shown above, Node drains the **Microtask Queue** (`process.nextTick()` first, followed by `Promise.then()`).

---

## 3. Detailed Phase Breakdown

1. **Timers Phase:** Executes callbacks scheduled by `setTimeout()` and `setInterval()` whose threshold time has elapsed.
2. **Pending Callbacks Phase:** Executes I/O callbacks deferred from the previous loop iteration (e.g. some TCP socket errors).
3. **Idle / Prepare Phase:** Used only internally by Node and Libuv.
4. **Poll Phase:** The heart of the loop:
   - Calculates how long it should block and wait for I/O.
   - Processes events in the I/O queue (reading incoming network packets, reading file buffers).
   - If poll queue is empty and `setImmediate` is scheduled, it proceeds to the Check phase.
5. **Check Phase:** Executes callbacks scheduled specifically by `setImmediate()`.
6. **Close Callbacks Phase:** Executes cleanup callbacks like `socket.on('close', ...)`.

---

## 4. Microtasks vs Macrotasks (The Priority Rule)

```text
Priority 1: process.nextTick() (Microtask)
Priority 2: Promise.then() / await (Microtask)
Priority 3: setTimeout() / setInterval() (Timers Macrotask)
Priority 4: setImmediate() (Check Macrotask)
```

### Minimal Code Example
```javascript
console.log('1. Synchronous');

setTimeout(() => {
  console.log('5. Macrotask: setTimeout');
}, 0);

setImmediate(() => {
  console.log('6. Macrotask: setImmediate');
});

Promise.resolve().then(() => {
  console.log('4. Microtask: Promise.then');
});

process.nextTick(() => {
  console.log('2. Microtask: process.nextTick (Runs before promises in CJS/runtime)');
});

console.log('3. Synchronous end');
```

> **Live Test:** Run this script directly in [Sandbox/nodejs-event-loop-demo/](../../Sandbox/nodejs-event-loop-demo/README.md).

---

## 5. Common Mistakes & Tips

- **Mistake:** Assuming `setTimeout(fn, 0)` means "execute immediately in 0 milliseconds."
  - _Fix:_ It means "execute after a *minimum* of 1 millisecond has elapsed, whenever the Timers phase is reached."
- **Mistake:** Starving the Event Loop using recursive `process.nextTick()`.
  - _Fix:_ Because nextTick drains before moving to the next phase, calling `process.nextTick` inside itself creates an infinite microtask loop that starves all I/O!

---

## 6. Quick Reference

| Phase / Queue | Trigger Method | When It Executes |
| :--- | :--- | :--- |
| **nextTick Queue** | `process.nextTick()` | Immediately after current operation finishes |
| **Promise Queue** | `Promise.resolve().then()` | Immediately after nextTick queue drains |
| **Timers Phase** | `setTimeout(fn, ms)` | When timer threshold passes in the Timers phase |
| **Poll Phase** | Incoming HTTP / File I/O | Retrieves and executes I/O callbacks |
| **Check Phase** | `setImmediate(fn)` | In the Check phase, right after the Poll phase |

---

## Related Hubs
- **Previous Topic:** [01-nodejs-architecture.md](01-nodejs-architecture.md)
- **Next Topic:** [03-blocking-vs-non-blocking.md](03-blocking-vs-non-blocking.md)
- **Experiment:** [Sandbox/nodejs-event-loop-demo/](../../Sandbox/nodejs-event-loop-demo/README.md)
- **Interview Q&A:** [Interview-Prep/Nodejs/nodejs-interview-qa.md](../../Interview-Prep/Nodejs/nodejs-interview-qa.md)
