# Node.js Worker Threads & Clustering

> Worker Threads and Cluster allow Node.js to use multiple CPU cores for heavy computation and scaling.

---

## 1. Key Takeaways (TL;DR)

- Node.js runs on a single thread. CPU-heavy calculations freeze the whole server.
- **Worker Threads:** Run CPU-intensive JavaScript tasks in parallel threads inside the same process (shared memory available).
- **Cluster Module:** Spawns multiple identical Node.js child processes to share the same server port (1 process per CPU core).
- **Rule of Thumb:** Use `worker_threads` for CPU math/processing; use `cluster` (or PM2/Docker) to scale web request handling.

---

## 2. Why & When to Use

- **Why:** Keeps the main Event Loop responsive to incoming HTTP requests while computing heavy tasks.
- **When:** Use Worker Threads for video compression, AI models, cryptography, or big data parsing.

---

## 3. Minimal Example

### Worker Threads (`node:worker_threads`)

Main thread file (`main.js`):

```javascript
import { Worker } from 'node:worker_threads';

function runHeavyMath(number) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData: number });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  });
}

console.log('Calculating in background...');
const result = await runHeavyMath(45);
console.log('Result from worker thread:', result);
```

Worker file (`worker.js`):

```javascript
import { parentPort, workerData } from 'node:worker_threads';

// Heavy calculation (Fibonacci)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const answer = fibonacci(workerData);
parentPort.postMessage(answer);
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Using Worker Threads for database queries or file I/O.
  - _Fix:_ Node's asynchronous I/O already handles database and disk operations efficiently without threads. Use threads only for **CPU-bound** work.
- **Tip:** In modern production (Docker/Kubernetes), apps scale by running multiple container replicas rather than manual Node clustering.

---

## 5. Quick Reference

| Approach | Technology | Best For | Memory Model |
| :--- | :--- | :--- | :--- |
| **Main Event Loop** | Single Thread | Web APIs, I/O, database reads | Single shared heap |
| **Worker Threads** | `node:worker_threads` | CPU-heavy calculation, encryption | Separate heaps + SharedArrayBuffer |
| **Cluster Module** | `node:cluster` | Multi-core HTTP servers | Isolated process memory |
| **Child Process** | `node:child_process` | Running shell commands / external binaries | Completely separate OS process |
