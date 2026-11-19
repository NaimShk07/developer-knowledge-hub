# Experiment: Node.js Event Loop Phase Ordering

> **Concept Tested:** [Learning/Nodejs/02-event-loop-and-architecture.md](../../Learning/Nodejs/02-event-loop-and-architecture.md)

## Objective
Directly observe the execution order between Synchronous code, `process.nextTick()`, `Promise.then()` (Microtasks), `setTimeout(0)`, and `setImmediate()`.

## How to Run

```bash
# Run the script directly with Node
node index.js
```

## What to Observe

```text
1. Synchronous: Start of Script
2. Synchronous: End of Script
4. Microtask: Promise.then()
3. Microtask: process.nextTick()
6. Macrotask: setImmediate()
5. Macrotask: setTimeout(0ms)
```

## Gotchas & Real-World Findings
- **ESM vs CommonJS Microtask Quirk:** In ES Modules (`"type": "module"`), top-level file evaluation is itself wrapped in a Promise job by V8. As a result, Promise microtasks scheduled in the top level drain before `nextTick` during the initial module evaluation. In standard CommonJS callbacks, `process.nextTick()` strictly runs before Promise microtasks.
- **`setTimeout(0)` vs `setImmediate()`:** In the main process startup, their relative order is non-deterministic because it depends on OS process scheduling timer resolution. However, inside an I/O callback (e.g. `fs.readFile`), `setImmediate()` is **guaranteed** to run before `setTimeout()`.
