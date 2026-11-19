# Node.js Interview Questions & Answers

High-frequency Node.js core runtime interview questions with crisp 30-second spoken answers and direct links to deep-dive notes in the `Learning/` folder.

---

### Q1: What is Node.js and how does its architecture work?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-nodejs-architecture.md](../../Learning/Nodejs/01-nodejs-architecture.md)

#### 30-Second Spoken Answer
> "Node.js is a runtime environment that executes JavaScript outside the browser. Architecturally, it combines Google Chrome's V8 engine—which compiles and executes JavaScript on a single Call Stack—with Libuv, a C library that handles the Event Loop, asynchronous non-blocking OS system calls, and a background thread pool for heavy tasks like file I/O and cryptography."

#### Key Points to Mention
1. **Single-Threaded JS, Multi-Threaded Underneath:** V8 executes user JavaScript on 1 thread; Libuv manages a background pool of C++ worker threads (default 4).
2. **Event Demultiplexing:** Offloads network socket I/O to native OS kernel mechanisms like `epoll` (Linux), `kqueue` (macOS), or `IOCP` (Windows).
3. **C++ Bindings:** Node core modules (`node:fs`, `node:crypto`) serve as high-level JavaScript wrappers over low-level C/C++ implementations.

#### Common Follow-Up Questions
- *"Can you change the Libuv thread pool size?"* → Yes, by setting `UV_THREADPOOL_SIZE=8` (up to 128) before the Node process boots.

---

### Q2: How does the Node.js Event Loop work, and what are its phases?
`[Level: Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [02-event-loop.md](../../Learning/Nodejs/02-event-loop.md)
- **Hands-on Experiment:** [Sandbox/nodejs-event-loop-demo/](../../Sandbox/nodejs-event-loop-demo/README.md)

#### 30-Second Spoken Answer
> "The Event Loop continuously cycles through 6 distinct phases—Timers, Pending Callbacks, Idle/Prepare, Poll, Check, and Close. The Poll phase retrieves and processes new I/O events. Crucially, between every single phase, Node immediately drains the Microtask Queue, meaning `process.nextTick` and resolved Promises always run before any other scheduled phase continues."

#### Key Points to Mention
1. **Microtasks vs Macrotasks:** Microtasks (`process.nextTick` $\rightarrow$ `Promise.then`) have absolute priority over macrotasks (`setTimeout`, `setImmediate`).
2. **Poll Phase Role:** Waits for incoming connections, executes I/O callbacks, and decides when to transition to the Check phase.
3. **Inside I/O Callbacks:** If called inside an I/O callback (like `fs.readFile`), `setImmediate()` is **guaranteed** to run before `setTimeout(0)`.

---

### Q3: What is the difference between Blocking and Non-Blocking code?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [03-blocking-vs-non-blocking.md](../../Learning/Nodejs/03-blocking-vs-non-blocking.md)

#### 30-Second Spoken Answer
> "Blocking code freezes the single JavaScript thread, preventing the Event Loop from executing any other code until that operation finishes. Non-blocking code initiates the operation in the background and immediately frees the Call Stack so the server can continue answering other incoming requests."

#### Key Points to Mention
1. **Server Starvation:** Because Node runs on one main thread, one blocking function (like `fs.readFileSync` or an infinite loop) freezes the server for every connected user.
2. **Beyond File I/O:** Blocking includes heavy CPU loops, massive `JSON.parse` operations, and ReDoS (catastrophic regex backtracking).
3. **Best Practice:** Use non-blocking async APIs for all I/O, and offload CPU math to Worker Threads.

---

### Q4: What is the difference between Synchronous and Asynchronous in Node.js?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [04-synchronous-vs-asynchronous.md](../../Learning/Nodejs/04-synchronous-vs-asynchronous.md)

#### 30-Second Spoken Answer
> "Synchronous refers to sequential, line-by-line execution where each operation waits for the previous line to finish before moving forward. Asynchronous refers to deferred execution where an operation is scheduled to complete in the future, allowing JavaScript to register a handler and immediately execute the next line."

#### Key Points to Mention
1. **Flow vs Thread:** Synchronous vs asynchronous is about execution order; blocking vs non-blocking is about whether the thread is held hostage.
2. **JavaScript Nature:** JavaScript itself is synchronous and single-threaded; asynchronous behavior is provided by the surrounding Node.js runtime.
3. **Modern Syntax:** Modern asynchronous code is handled cleanly with `async/await` and Promises, replacing legacy nested callbacks.

---

### Q5: How does Node.js handle thousands of Concurrent Requests on a single thread?
`[Level: Mid-Senior]` `[Frequency: Very High]`

- **Related Learning Note:** [05-concurrent-requests.md](../../Learning/Nodejs/05-concurrent-requests.md)

#### 30-Second Spoken Answer
> "Node.js uses an event-driven I/O multiplexing model. Instead of creating a new operating system thread for every client connection like Apache or Java, Node registers client sockets with the OS kernel via `epoll` or `kqueue`. While a request waits for database or disk I/O, the single thread is 100% free to serve other incoming requests, consuming only kilobytes of RAM per connection."

#### Key Points to Mention
1. **Memory Efficiency:** Avoids 1MB–2MB thread stack memory per user, allowing 10,000+ idle or waiting connections with minimal RAM.
2. **Zero Context Switching:** Eliminates CPU thread context switching overhead.
3. **Multi-Core Scaling:** To utilize all CPU cores, run multiple Node instances using Docker replicas, Kubernetes pods, or the native `node:cluster` module.

---

### Q6: What happens if you execute a CPU-intensive task in Node.js, and how do you fix it?
`[Level: Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [03-blocking-vs-non-blocking.md](../../Learning/Nodejs/03-blocking-vs-non-blocking.md)

#### 30-Second Spoken Answer
> "Because Node.js executes JavaScript on a single thread, a CPU-intensive task—like a massive calculation, image processing, or large JSON parsing—monopolizes the Call Stack. While that task computes, the Event Loop is completely frozen, meaning no other incoming requests, timer callbacks, or I/O events can be processed until it finishes. You fix this by offloading CPU-bound tasks to Worker Threads or dedicated microservices."

#### Key Points to Mention
1. **Thread Starvation:** Even though network I/O is asynchronous, executing synchronous CPU-heavy work inside an API route freezes the entire application for every concurrent user.
2. **Worker Threads Solution:** Use the built-in `node:worker_threads` module to execute intensive tasks on separate OS threads while keeping the main Event Loop responsive.
3. **Process Delegation:** For massive compute loads (e.g. video encoding or machine learning), offload the job to an external background worker queue (e.g., BullMQ with Redis) or a separate Go/Python service.

#### Common Follow-Up Questions
- *"Does `await` or wrapping a CPU task in a Promise unblock the Event Loop?"* → **No!** Promises only handle asynchronous completion; the synchronous JavaScript calculations inside the Promise still run on the single main Call Stack.

---

### Q7: What is the difference between Concurrency and Parallelism?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [05-concurrent-requests.md](../../Learning/Nodejs/05-concurrent-requests.md)

#### 30-Second Spoken Answer
> "Concurrency is about **dealing** with lots of things at once; parallelism is about **doing** lots of things at once. Concurrency is an architectural structure where tasks interleave and make progress on a single core by yielding while waiting. Parallelism requires multiple physical CPU cores executing distinct tasks at the exact same physical instant."

#### Key Points to Mention
1. **The Juggler Analogy:** Concurrency is one juggler handling multiple balls in the air (interleaving tasks). Parallelism is two jugglers each holding and throwing their own ball simultaneously.
2. **Single Core Capability:** Concurrency can exist on a single-core machine through time-slicing and non-blocking I/O (Node's default mode).
3. **Node.js Context:** A default Node.js web server is **concurrent** on 1 thread because it interleaves I/O requests. It achieves **parallelism** only when utilizing multiple CPU cores via Worker Threads, the Cluster module, or container replicas.

