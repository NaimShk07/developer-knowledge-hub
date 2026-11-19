# Node.js Async Patterns

> Asynchronous patterns allow Node.js to wait for external operations without freezing execution.

---

## 1. Key Takeaways (TL;DR)

- **Callbacks:** The original pattern, but nested callbacks lead to "Callback Hell."
- **Promises:** Represent an eventual result with `.then()`, `.catch()`, and `.finally()`.
- **Async / Await:** Syntactic sugar on top of Promises that makes asynchronous code look synchronous.
- Always handle errors with `try...catch` blocks or `.catch()` handlers.
- Use `Promise.allSettled()` when you want all tasks to finish even if one fails.

---

## 2. Why & When to Use

- **Why:** Reading a file or querying a database takes time. Async patterns prevent the server from pausing while waiting.
- **When:** Use `async/await` as your default for all network calls, database queries, and file operations.

---

## 3. Minimal Example

Comparing the modern `async/await` style against Promises:

```javascript
import fs from 'node:fs/promises';

// Clean, modern async function
async function readConfigFile(filePath) {
  try {
    // Await pauses this function until file is read, without blocking Node
    const rawData = await fs.readFile(filePath, 'utf-8');
    const config = JSON.parse(rawData);
    return config;
  } catch (error) {
    console.error(`Failed to read config from ${filePath}:`, error.message);
    throw error;
  }
}
```

Running multiple async tasks concurrently:

```javascript
// Runs both database queries in parallel
const [users, orders] = await Promise.all([
  fetchUsersFromDB(),
  fetchOrdersFromDB(),
]);
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Awaiting inside a loop sequentially instead of running in parallel.
  - _Fix:_ Avoid `for (item of list) { await doWork(item); }` when tasks are independent. Use `Promise.all(list.map(doWork))` instead.
- **Tip:** Unhandled promise rejections can crash modern Node.js processes. Always handle rejections.

---

## 5. Quick Reference

| Pattern | Syntax | Best For |
| :--- | :--- | :--- |
| **Async / Await** | `const res = await fetch(...)` | Clean, linear code logic |
| **Promise.all** | `Promise.all([p1, p2])` | Parallel tasks where all must succeed |
| **Promise.allSettled** | `Promise.allSettled([p1, p2])` | Parallel tasks where failures are tolerable |
| **Promise.race** | `Promise.race([p1, p2])` | Timeout implementations (first to finish wins) |
