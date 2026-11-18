# Node.js Learning Notes

A beginner-friendly guide to core Node.js concepts, written in simple and short English.

---

## What is Node.js?

> Node.js is a runtime environment that lets you execute JavaScript code outside a web browser, typically on a server.

### The Problem Node.js Solves
- **Traditional Servers (e.g., Apache/PHP):** Create a new operating system thread for every client connection (heavy RAM usage, slow under high traffic).
- **Node.js:** Uses a single thread with non-blocking I/O to handle tens of thousands of concurrent connections effortlessly.

---

## Core Topics

| # | Topic | File | What You Learn |
| :- | :--- | :--- | :--- |
| 1 | **Event Loop & Architecture** | [01-event-loop-and-architecture.md](01-event-loop-and-architecture.md) | How Node handles thousands of requests on a single thread. |
| 2 | **Async Patterns** | [02-async-patterns.md](02-async-patterns.md) | Callbacks, Promises, and modern `async/await` best practices. |
| 3 | **Streams & Buffers** | [03-streams-and-buffers.md](03-streams-and-buffers.md) | Handling huge files and data chunks without crashing memory. |
| 4 | **Modules (CJS vs ESM)** | [04-modules-and-packages.md](04-modules-and-packages.md) | CommonJS (`require`) vs ES Modules (`import`), and package setup. |
| 5 | **Worker Threads & Cluster** | [05-workers-and-cluster.md](05-workers-and-cluster.md) | Running CPU-heavy tasks without blocking the main event loop. |

---

## Related Hubs
- **Cheatsheet:** [Notes/Cheatsheets/nodejs.md](../../Notes/Cheatsheets/nodejs.md)
- **Hands-on Experiment:** [Sandbox/nodejs-event-loop-demo/](../../Sandbox/nodejs-event-loop-demo/README.md)
- **Interview Q&A:** [Interview-Prep/Nodejs/](../../Interview-Prep/Nodejs/nodejs-interview-qa.md)
