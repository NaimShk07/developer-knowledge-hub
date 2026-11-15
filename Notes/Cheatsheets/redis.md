# Redis Cheatsheet

> Quick reference for everyday Redis CLI commands and data structure operations.  
> **Deep Dive:** [Learning/Redis/](file:///Users/nayemuddinshaikh/Developer/Learning/Redis/README.md) | **Interview Q&A:** [Redis Interview Q&A](file:///Users/nayemuddinshaikh/Developer/Interview-Prep/Redis/redis-interview-qa.md)

---

## 1. Top 10 Most Used Commands

| Command | What It Does |
| :--- | :--- |
| `redis-cli` | Open interactive Redis shell |
| `SET <key> <val>` | Save a string key-value pair |
| `GET <key>` | Read a string value |
| `SET <k> <v> EX <sec>` | Save key with an expiration timer |
| `TTL <key>` | Check remaining seconds before expiration |
| `EXISTS <key>` | Check if a key exists (returns 1 or 0) |
| `DEL <key>` | Delete a key |
| `INCR <key>` | Increment a number by 1 atomically |
| `DBSIZE` | Return total number of keys in current database |
| `FLUSHDB` | Delete all keys in current database (use with caution) |

---

## 2. Data Structure Syntax

### Hashes (Objects)
| Command | What It Does | Example |
| :--- | :--- | :--- |
| `HSET` | Set one or more fields | `HSET user:1 name "Sarah" age 28` |
| `HGET` | Get single field | `HGET user:1 name` |
| `HGETALL` | Get all fields and values | `HGETALL user:1` |
| `HDEL` | Delete specific field | `HDEL user:1 age` |

### Lists (Queues)
| Command | What It Does | Example |
| :--- | :--- | :--- |
| `LPUSH` / `RPUSH` | Push item to left or right | `LPUSH jobs "send-email"` |
| `LPOP` / `RPOP` | Pop item from left or right | `RPOP jobs` |
| `LRANGE` | Get range of elements | `LRANGE jobs 0 -1` (get all) |
| `LLEN` | Get length of list | `LLEN jobs` |

### Sets & Sorted Sets
| Command | What It Does | Example |
| :--- | :--- | :--- |
| `SADD` / `SMEMBERS` | Add / read unique set items | `SADD tags "docker" "redis"` |
| `SISMEMBER` | Check if member exists in set | `SISMEMBER tags "redis"` |
| `ZADD` | Add member with numerical score | `ZADD scores 100 "Alice"` |
| `ZREVRANGE` | Get members by highest score | `ZREVRANGE scores 0 9 WITHSCORES` |

---

## 3. Pub/Sub Commands

| Command | What It Does |
| :--- | :--- |
| `SUBSCRIBE <channel>` | Listen for messages on a channel |
| `PUBLISH <channel> <msg>` | Broadcast message to all active channel listeners |
| `PSUBSCRIBE <pattern>` | Subscribe to channels matching wildcard (e.g. `events:*`) |
