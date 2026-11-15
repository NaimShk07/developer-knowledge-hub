# Node.js Interview Questions & Answers

High-frequency Node.js interview questions with crisp 30-second spoken answers and direct links to deep-dive notes in the `Learning/` folder.

---

### Q1: How does Node.js handle concurrency despite being single-threaded?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-event-loop-and-architecture.md](file:///Users/nayemuddinshaikh/Developer/Learning/Nodejs/01-event-loop-and-architecture.md)

#### 30-Second Spoken Answer
> "Node.js runs your JavaScript code on a single thread, but offloads asynchronous I/O operations—like database queries and file access—to the operating system or the multi-threaded Libuv thread pool. When the asynchronous work completes, Libuv queues the callback, and the Event Loop pushes it back onto the call stack as soon as the stack is empty."

#### Key Points to Mention
1. **Single-Threaded JS, Multi-Threaded Underneath:** V8 executes JavaScript on 1 thread; Libuv manages a background pool of C++ threads (default 4).
2. **Non-Blocking I/O:** The server never sleeps while waiting for a network socket or file read; it continues processing other client requests.
3. **Event Demultiplexing:** Uses efficient OS system calls like `epoll` (Linux), `kqueue` (macOS), or `IOCP` (Windows).

#### Common Follow-Up Questions
- *"What is Libuv?"* → The cross-platform C library that provides the event loop, asynchronous file I/O, DNS, and thread pool.
- *"Can you change the Libuv thread pool size?"* → Yes, by setting `UV_THREADPOOL_SIZE=8` before the Node process boots.

---

### Q2: What is the difference between `process.nextTick()`, `setImmediate()`, and `setTimeout(0)`?
`[Level: Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-event-loop-and-architecture.md](file:///Users/nayemuddinshaikh/Developer/Learning/Nodejs/01-event-loop-and-architecture.md)
- **Hands-on Experiment:** [Sandbox/nodejs-event-loop-demo/](file:///Users/nayemuddinshaikh/Developer/Sandbox/nodejs-event-loop-demo/README.md)

#### 30-Second Spoken Answer
> "`process.nextTick()` is a high-priority microtask that executes immediately after the current operation finishes and before the Event Loop continues. `setTimeout(fn, 0)` is a macrotask scheduled for the Timers phase after a minimum 1ms threshold. `setImmediate()` is a macrotask designed to run in the Check phase, immediately after incoming I/O events are polled."

#### Key Points to Mention
1. **Priority Hierarchy:** `process.nextTick` > `Promise.then` (Microtasks) > Macrotasks (`setTimeout`, `setImmediate`).
2. **Inside I/O Callbacks:** If called inside an I/O callback (like `fs.readFile`), `setImmediate()` is **guaranteed** to run before `setTimeout(0)`.
3. **Starvation Warning:** Recursive calls to `process.nextTick()` can completely starve the Event Loop and block all I/O.

#### Minimal Code Example
```javascript
fs.readFile('data.txt', () => {
  setTimeout(() => console.log('Timer'), 0);
  setImmediate(() => console.log('Immediate')); // Always prints first!
});
```

---

### Q3: Why should you use Streams instead of `fs.readFile()` for large data?
`[Level: Mid]` `[Frequency: High]`

- **Related Learning Note:** [03-streams-and-buffers.md](file:///Users/nayemuddinshaikh/Developer/Learning/Nodejs/03-streams-and-buffers.md)

#### 30-Second Spoken Answer
> "`fs.readFile()` loads the entire file into V8 RAM before returning it, which will exhaust server memory and crash the process if the file is large. Streams process data in small, continuous chunks (usually 64KB), keeping RAM usage tiny and constant regardless of file size, while also allowing immediate data transmission to the client."

#### Key Points to Mention
1. **Memory Safety:** Streams prevent `ERR_STRING_TOO_LONG` and JavaScript heap out-of-memory crashes.
2. **Time to First Byte (TTFB):** The client starts receiving data immediately without waiting for the full file to be read.
3. **Pipeline Utility:** Always use `pipeline()` from `node:stream/promises` to automatically handle stream errors and cleanup without leaking file descriptors.

---

### Q4: When would you use Worker Threads vs Child Processes vs Cluster?
`[Level: Mid-Senior]` `[Frequency: Very High]`

- **Related Learning Note:** [05-workers-and-cluster.md](file:///Users/nayemuddinshaikh/Developer/Learning/Nodejs/05-workers-and-cluster.md)

#### 30-Second Spoken Answer
> "Use **Worker Threads** to execute CPU-intensive JavaScript tasks (like cryptography or image processing) in separate threads that share the same process memory. Use **Cluster** to spawn multiple identical Node.js processes sharing the same server port across multi-core CPUs. Use **Child Processes** when you need to execute external operating system commands or run separate non-Node binaries."

#### Key Points to Mention
1. **Worker Threads:** Lightest memory footprint for CPU math; supports `SharedArrayBuffer`.
2. **Cluster Module:** Distributes incoming HTTP connections across workers using round-robin; isolated memory prevents one crash from taking down all cores.
3. **Modern Alternative:** In containerized setups (Docker / Kubernetes), teams usually run multiple single-core container replicas behind a load balancer instead of Node.js clustering.

---

### Q5: How do you handle Unhandled Promise Rejections and Uncaught Exceptions?
`[Level: Mid-Senior]` `[Frequency: High]`

- **Related Learning Note:** [02-async-patterns.md](file:///Users/nayemuddinshaikh/Developer/Learning/Nodejs/02-async-patterns.md)

#### 30-Second Spoken Answer
> "You should listen to the `unhandledRejection` and `uncaughtException` events on the global `process` object. An uncaught exception leaves the application in an indeterminate, corrupted state, so the best practice is to log the error, gracefully close active connections, and exit the process (`process.exit(1)`), allowing a process supervisor like Docker or PM2 to restart a fresh container."

#### Key Points to Mention
1. **Never Just Ignore:** Catching `uncaughtException` and continuing to serve traffic is dangerous because memory or database sockets may be leaked or corrupted.
2. **Graceful Shutdown:** Stop accepting new requests (`server.close()`), wait for in-flight requests to complete, and exit within a timeout.
3. **Modern Node Behavior:** Modern Node.js versions crash by default on unhandled promise rejections (`--unhandled-rejections=throw`).
