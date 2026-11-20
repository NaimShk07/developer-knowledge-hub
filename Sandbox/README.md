# Sandbox Experiments Catalog

Self-contained code spikes, runnable prototypes, and technology tests.

---

## The Purpose: "Test Before You Build"

The `Sandbox/` folder is where you verify concepts from `Learning/` using small, throwaway or testable code without committing to a full `Projects/` repository.

---

## Active Experiments

| Folder | What It Tests | Deep-Dive Concept | Status |
| :--- | :--- | :--- | :--- |
| [dsa-sliding-window/](dsa-sliding-window/README.md) | Tests Sliding Window (fixed size K, longest unique substring, min sum) | [Learning/DSA/02-sliding-window.md](../Learning/DSA/02-sliding-window.md) | ✅ Ready to Run |
| [dsa-two-pointers/](dsa-two-pointers/README.md) | Tests Two Pointers algorithms (Two Sum II, 3Sum, Palindrome) on edge cases | [Learning/DSA/01-two-pointers.md](../Learning/DSA/01-two-pointers.md) | ✅ Ready to Run |
| [nodejs-event-loop-demo/](nodejs-event-loop-demo/README.md) | Tests Event Loop phase priority (nextTick, Promises, setTimeout, setImmediate) | [Learning/Nodejs/02-event-loop-and-architecture.md](../Learning/Nodejs/02-event-loop-and-architecture.md) | ✅ Ready to Run |
| [docker-nginx-volume/](docker-nginx-volume/README.md) | Tests live file changes with bind mounts and port mapping | [Learning/Docker/04-volumes.md](../Learning/Docker/04-volumes.md) | ✅ Ready to Run |
| [redis-cache-demo/](redis-cache-demo/README.md) | Tests Redis key expiration and Cache-Aside pattern via bash/redis-cli | [Learning/Redis/03-caching-and-ttl.md](../Learning/Redis/03-caching-and-ttl.md) | ✅ Ready to Run |

---

## Folder Organization

```text
Sandbox/
├── AGENTS.md                  # Sandbox rules & hygiene
├── README.md                  # This catalog
├── dsa-sliding-window/        # Runnable Sliding Window test probes
├── dsa-two-pointers/          # Runnable Two Pointers test probes
├── nodejs-event-loop-demo/    # Minimal event loop phase test script
├── docker-nginx-volume/       # Minimal Nginx + HTML bind-mount experiment
└── redis-cache-demo/          # Minimal caching test script
```
