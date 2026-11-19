# Node.js Architecture

> Node.js is a runtime system that executes JavaScript on a single thread while delegating heavy I/O tasks to a multi-threaded C/C++ background engine.

---

## 1. Key Takeaways (TL;DR)

- Node.js is **not** a programming language and **not** a multi-threaded web server like Apache. It is a runtime built on Google Chrome's **V8 engine** and **Libuv**.
- **V8 Engine:** Parses, compiles, and executes your JavaScript code on a single Call Stack.
- **Libuv:** A multi-platform C library that handles the Event Loop, operating system event demultiplexing, and maintains a background thread pool (default 4 threads).
- JavaScript runs on **1 main thread**, but Node.js internally uses **many threads** via Libuv and the OS kernel.
- CPU tasks run directly on the V8 Call Stack; I/O tasks (disk, network, DNS) are delegated to the OS kernel or Libuv.

---

## 2. The Architectural Blueprint

```text
┌─────────────────────────────────────────────────────────────┐
│                 Your Application JavaScript                 │
│              (e.g., Express, Fastify, Scripts)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  Node.js Core APIs & Bindings               │
│               (node:fs, node:http, node:crypto)             │
├──────────────────────────────┬──────────────────────────────┤
│          V8 Engine           │            Libuv             │
│   • Memory Heap (objects)    │   • Event Loop               │
│   • Call Stack (single thread│   • Thread Pool (4 threads)  │
│     executes all JS)         │   • Event Demultiplexer      │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Operating System / Hardware                 │
│         (epoll on Linux / kqueue on macOS / IOCP Windows)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. The Core Components Explained

### A. V8 Engine
- Google Chrome's open-source JavaScript and WebAssembly engine written in C++.
- Compiles JavaScript directly into machine code via JIT (Just-In-Time) compilation.
- Provides the **Call Stack** (where functions run) and the **Memory Heap** (where variables and objects live).

### B. Libuv
- An open-source C library specifically designed for Node.js.
- Responsible for:
  1. Managing the **Event Loop**.
  2. Providing asynchronous non-blocking network I/O via native OS system calls (`epoll` on Linux, `kqueue` on macOS, `IOCP` on Windows).
  3. Managing a hidden **Thread Pool** (default 4 worker threads) for tasks that cannot be handled non-blockingly by the OS (file system I/O, DNS lookups, compression, cryptography).

### C. C++ Bindings & Core Libraries
- Bridges JavaScript calls (like `fs.readFile`) to the underlying C/C++ Libuv implementations.

---

## 4. Minimal Code Demonstration

Observe how Node's architecture handles synchronous execution vs background delegation:

```javascript
import fs from 'node:fs';
import crypto from 'node:crypto';

console.log('1. Runs on V8 single-thread Call Stack');

// Handled by Libuv Thread Pool in the background
crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', (err, key) => {
  console.log('4. Libuv worker thread finished crypto hashing');
});

// Handled by Libuv Thread Pool in the background
fs.readFile(new URL(import.meta.url), () => {
  console.log('3. Libuv worker thread finished file read');
});

console.log('2. Runs immediately on V8 Call Stack without waiting');
```

**Output:**
```text
1. Runs on V8 single-thread Call Stack
2. Runs immediately on V8 Call Stack without waiting
3. Libuv worker thread finished file read
4. Libuv worker thread finished crypto hashing
```

---

## 5. Common Mistakes & Tips

- **Mistake:** Believing Node.js is completely single-threaded.
  - _Fix:_ Your *JavaScript* code runs on a single thread. The *Node.js runtime* is heavily multi-threaded under the hood via Libuv.
- **Tip:** You can scale the Libuv thread pool size for I/O heavy servers by setting `UV_THREADPOOL_SIZE=8` (max 128) in your environment before starting Node.

---

## 6. Quick Reference

| Component | Language | Primary Responsibility |
| :--- | :--- | :--- |
| **V8** | C++ | Compiles and executes JavaScript on the Call Stack |
| **Libuv** | C | Event Loop, async OS system calls, and thread pool |
| **Node Core** | JS & C++ | Standard APIs (`fs`, `http`, `crypto`, `net`) |
| **Thread Pool** | C threads | Background file I/O, DNS, crypto, zlib (default 4 threads) |

---

## Related Hubs
- **Next Topic:** [02-event-loop.md](02-event-loop.md)
- **Cheatsheet:** [Notes/Cheatsheets/nodejs.md](../../Notes/Cheatsheets/nodejs.md)
- **Interview Q&A:** [Interview-Prep/Nodejs/nodejs-interview-qa.md](../../Interview-Prep/Nodejs/nodejs-interview-qa.md)
