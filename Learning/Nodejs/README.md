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
| 1 | **Sync vs Async & Blocking vs Non-Blocking** | [01-sync-async-blocking-nonblocking.md](01-sync-async-blocking-nonblocking.md) | The mental model of waiting vs delegating, and avoiding thread starvation. |
| 2 | **Event Loop & Architecture** | [02-event-loop-and-architecture.md](02-event-loop-and-architecture.md) | How Node handles thousands of requests on a single thread. |
| 3 | **Modules (CJS vs ESM)** | [03-modules-and-packages.md](03-modules-and-packages.md) | CommonJS (`require`) vs ES Modules (`import`), and package setup. |
| 4 | **Async Patterns** | [04-async-patterns.md](04-async-patterns.md) | Callbacks, Promises, and modern `async/await` best practices. |
| 5 | **Streams & Buffers** | [05-streams-and-buffers.md](05-streams-and-buffers.md) | Handling huge files and data chunks without crashing memory. |
| 6 | **Worker Threads & Cluster** | [06-workers-and-cluster.md](06-workers-and-cluster.md) | Running CPU-heavy tasks without blocking the main event loop. |

---

## Related Hubs
- **Cheatsheet:** [Notes/Cheatsheets/nodejs.md](../../Notes/Cheatsheets/nodejs.md)
- **Hands-on Experiment:** [Sandbox/nodejs-event-loop-demo/](../../Sandbox/nodejs-event-loop-demo/README.md)
- **Interview Q&A:** [Interview-Prep/Nodejs/](../../Interview-Prep/Nodejs/nodejs-interview-qa.md)
