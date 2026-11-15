# Redis Learning Notes

A beginner-friendly guide to core Redis concepts, written in simple and short English.

---

## What is Redis?

> Redis is an ultra-fast, in-memory data store used as a cache, database, and message broker.

### The Problem Redis Solves
- **Traditional Databases (PostgreSQL, MySQL):** Read and write data to disk (slower, 5–50ms).
- **Redis:** Keeps all data directly in RAM (lightning fast, under 1ms).

---

## Core Topics

| # | Topic | File | What You Learn |
| :- | :--- | :--- | :--- |
| 1 | **Strings & Keys** | [01-strings-and-keys.md](file:///Users/nayemuddinshaikh/Developer/Learning/Redis/01-strings-and-keys.md) | Basic Key-Value pairs, expiration, and key management. |
| 2 | **Data Structures** | [02-data-structures.md](file:///Users/nayemuddinshaikh/Developer/Learning/Redis/02-data-structures.md) | Lists, Hashes, Sets, and Sorted Sets. |
| 3 | **Caching & TTL** | [03-caching-and-ttl.md](file:///Users/nayemuddinshaikh/Developer/Learning/Redis/03-caching-and-ttl.md) | Cache-aside pattern and automatic key expiration. |
| 4 | **Persistence (RDB & AOF)** | [04-persistence.md](file:///Users/nayemuddinshaikh/Developer/Learning/Redis/04-persistence.md) | How Redis saves in-memory data to disk safely. |
| 5 | **Pub/Sub & Messaging** | [05-pub-sub-and-messaging.md](file:///Users/nayemuddinshaikh/Developer/Learning/Redis/05-pub-sub-and-messaging.md) | Sending live messages between services. |

---

## Essential Commands Cheat Sheet

| Command | What It Does |
| :--- | :--- |
| `redis-cli` | Open interactive Redis terminal |
| `SET user:1 "John"` | Save a key-value pair |
| `GET user:1` | Retrieve the value of a key |
| `SETEX token 60 "abc"` | Set a key that auto-deletes in 60 seconds |
| `DEL user:1` | Delete a key |
| `EXISTS user:1` | Check if a key exists (returns 1 or 0) |
| `FLUSHALL` | Delete all keys across all databases (use with caution) |
