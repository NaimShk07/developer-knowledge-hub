# Concurrent Requests in Node.js

> Node.js handles thousands of concurrent client connections on a single thread using an event-driven, non-blocking I/O model instead of spawning a new operating system thread per request.

---

## 1. Key Takeaways (TL;DR)

- **Traditional Servers (Thread-per-request):** Systems like Apache or traditional Java allocate 1 OS thread per client connection. 10,000 users = 10,000 threads (Gigabytes of RAM and massive CPU context switching).
- **Node.js (Event-driven):** Runs on a single thread. It registers network sockets with the OS kernel and sleeps until the kernel signals that data has arrived. 10,000 open connections = minimal RAM usage.
- **I/O Multiplexing:** Under the hood, Libuv uses native operating system mechanisms:
  - `epoll` on Linux
  - `kqueue` on macOS / BSD
  - `IOCP` (I/O Completion Ports) on Windows
- Node.js is unmatched for **high-concurrency, I/O-heavy workloads** (chat apps, streaming, API gateways, microservices).
- It is vulnerable to **CPU-bound tasks**: one heavy request can stall all other concurrent requests.

---

## 2. Thread-Per-Request vs Event-Driven Single Thread

```text
[ TRADITIONAL SERVER (Multi-Threaded: Apache / Java) ]
Request 1 ──────> [ Thread 1 ] ──> Waits for DB (Idle thread consumes 2MB RAM)
Request 2 ──────> [ Thread 2 ] ──> Waits for DB (Idle thread consumes 2MB RAM)
Request 3 ──────> [ Thread 3 ] ──> Waits for DB (Idle thread consumes 2MB RAM)
...
Request 10,000 ─> Out of Memory / Server Crashes!

[ NODE.JS (Single-Threaded Event Loop) ]
Request 1 ──┐
Request 2 ──┼───> [ 1 Main Thread ] ───> Delegates DB queries to OS / DB drivers
Request 3 ──┘           ▲
                        │ (Event Loop notified when queries finish)
                 [ Poll Phase / Epoll ]
Total Memory: ~30-50MB for thousands of connections!
```

---

## 3. How Node.js Handles 10,000 Concurrent HTTP Requests

When 1,000 users hit your Express or Fastify API at the exact same second:

1. **Connection Arrival:** The OS kernel accepts the TCP connections and assigns file descriptors (sockets).
2. **Registration:** Node.js registers interest in those sockets with the OS event demultiplexer (`epoll` or `kqueue`).
3. **Execution:** The single thread runs the request handler code (e.g., parsing headers, route matching).
4. **Delegation:** If the request queries a database (`db.users.find()`), Node initiates the query over the network and **immediately yields the thread**.
5. **Handling Next User:** The thread is now 100% free to start processing User 2's request while User 1's database query is still traveling across the network.
6. **Notification:** When User 1's database responds, the OS notifies the Event Loop in the **Poll Phase**.
7. **Response:** Node resumes User 1's callback, formats the JSON, sends the HTTP response, and moves to the next user.

---

## 4. Minimal Code Demonstration: Demonstrating Concurrency

This server simulates 3 concurrent users making requests with different response times:

```javascript
import http from 'node:http';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const user = url.searchParams.get('user') || 'anonymous';
  const delay = Number(url.searchParams.get('delay')) || 1000;

  console.log(`[START] Processing request for ${user}`);

  // Simulating asynchronous non-blocking database query
  await new Promise((resolve) => setTimeout(resolve, delay));

  console.log(`[FINISH] Sending response for ${user}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ user, status: 'completed' }));
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
```

### What happens when 2 requests arrive simultaneously?
- User A requests `/api?user=Alice&delay=3000` (takes 3s)
- User B requests `/api?user=Bob&delay=500` (takes 0.5s)

**Terminal Log:**
```text
[START] Processing request for Alice
[START] Processing request for Bob
[FINISH] Sending response for Bob (Finishes in 0.5s! Doesn't wait for Alice!)
[FINISH] Sending response for Alice (Finishes in 3.0s)
```
Bob was **not blocked** by Alice, even though both ran on the exact same single thread!

---

## 5. Scaling Beyond the Single Thread in Production

While a single Node.js thread can handle tens of thousands of I/O connections, it only uses **1 CPU core**. To use all cores of a modern server:

1. **Container Scaling (Docker & Kubernetes):**
   - Run multiple single-threaded Node.js container replicas and place an Nginx or AWS ALB load balancer in front.
2. **Node.js Cluster Module (`node:cluster`):**
   - Fork the master process into multiple worker child processes that share the same port (1 worker per CPU core).
3. **Process Managers (PM2):**
   - `pm2 start app.js -i max` (runs 1 instance per CPU core with auto-restart on crashes).

---

## 6. Quick Reference

| Feature | Node.js Architecture | Thread-Per-Request Server |
| :--- | :--- | :--- |
| **Concurrency Model** | Single thread + Event Loop (I/O multiplexing) | 1 thread per client socket |
| **RAM per Connection** | Kilobytes | Megabytes (1MB-2MB stack per thread) |
| **Thread Context Switching** | Near Zero | Very High under 10k connections |
| **Ideal Workload** | I/O-bound (APIs, WebSockets, streaming) | CPU-bound computation |
| **Scaling Mechanism** | Multi-process (Docker, Cluster, PM2) | Thread pool size adjustment |

---

## Related Hubs
- **Previous Topic:** [04-synchronous-vs-asynchronous.md](04-synchronous-vs-asynchronous.md)
- **First Topic:** [01-nodejs-architecture.md](01-nodejs-architecture.md)
- **Cheatsheet:** [Notes/Cheatsheets/nodejs.md](../../Notes/Cheatsheets/nodejs.md)
- **Interview Q&A:** [Interview-Prep/Nodejs/nodejs-interview-qa.md](../../Interview-Prep/Nodejs/nodejs-interview-qa.md)
