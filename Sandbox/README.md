# Sandbox Experiments Catalog

Self-contained code spikes, runnable prototypes, and technology tests.

---

## The Purpose: "Test Before You Build"

The `Sandbox/` folder is where you verify concepts from `Learning/` using small, throwaway or testable code without committing to a full `Projects/` repository.

---

## Active Experiments

| Folder | What It Tests | Deep-Dive Concept | Status |
| :--- | :--- | :--- | :--- |
| [dsa-two-pointers/](file:///Users/nayemuddinshaikh/Developer/Sandbox/dsa-two-pointers/README.md) | Tests Two Pointers algorithms (Two Sum II, 3Sum, Palindrome) on edge cases | [Learning/DSA/01-two-pointers.md](file:///Users/nayemuddinshaikh/Developer/Learning/DSA/01-two-pointers.md) | ✅ Ready to Run |
| [nodejs-event-loop-demo/](file:///Users/nayemuddinshaikh/Developer/Sandbox/nodejs-event-loop-demo/README.md) | Tests Event Loop phase priority (nextTick, Promises, setTimeout, setImmediate) | [Learning/Nodejs/01-event-loop-and-architecture.md](file:///Users/nayemuddinshaikh/Developer/Learning/Nodejs/01-event-loop-and-architecture.md) | ✅ Ready to Run |
| [docker-nginx-volume/](file:///Users/nayemuddinshaikh/Developer/Sandbox/docker-nginx-volume/README.md) | Tests live file changes with bind mounts and port mapping | [Learning/Docker/04-volumes.md](file:///Users/nayemuddinshaikh/Developer/Learning/Docker/04-volumes.md) | ✅ Ready to Run |
| [redis-cache-demo/](file:///Users/nayemuddinshaikh/Developer/Sandbox/redis-cache-demo/README.md) | Tests Redis key expiration and Cache-Aside pattern via bash/redis-cli | [Learning/Redis/03-caching-and-ttl.md](file:///Users/nayemuddinshaikh/Developer/Learning/Redis/03-caching-and-ttl.md) | ✅ Ready to Run |

---

## Folder Organization

```text
Sandbox/
├── AGENTS.md                  # Sandbox rules & hygiene
├── README.md                  # This catalog
├── dsa-two-pointers/          # Runnable Two Pointers test probes
├── nodejs-event-loop-demo/    # Minimal event loop phase test script
├── docker-nginx-volume/       # Minimal Nginx + HTML bind-mount experiment
└── redis-cache-demo/          # Minimal caching test script
```
