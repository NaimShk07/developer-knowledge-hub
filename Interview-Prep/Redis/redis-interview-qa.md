# Redis Interview Questions & Answers

High-frequency Redis interview questions with crisp 30-second spoken answers and direct links to deep-dive notes in the `Learning/` folder.

---

### Q1: Why is Redis so fast compared to traditional databases?
`[Level: Junior-Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-strings-and-keys.md](../../Learning/Redis/01-strings-and-keys.md)

#### 30-Second Spoken Answer
> "Redis is exceptionally fast because it stores all its primary dataset in RAM, avoiding disk I/O bottlenecks. Additionally, its core execution engine is single-threaded using non-blocking I/O multiplexing (epoll), which completely eliminates thread switching and locking overhead."

#### Key Points to Mention
1. **In-Memory Operations:** RAM latency is measured in nanoseconds, whereas disk SSD latency is measured in microseconds or milliseconds.
2. **Single-Threaded Event Loop:** Eliminates race conditions, mutex locks, and context switching for command processing.
3. **Efficient Data Structures:** Core types are implemented in pure C with memory-optimized structures (e.g., ziplists, skiplists, and hash tables).

#### Common Follow-Up Questions
- *"If it's single-threaded, how does it handle multiple clients?"* → It uses an event-driven I/O multiplexer to process thousands of network connections concurrently.

---

### Q2: What is the Cache-Aside Pattern and how do you prevent stale data?
`[Level: Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [03-caching-and-ttl.md](../../Learning/Redis/03-caching-and-ttl.md)

#### 30-Second Spoken Answer
> "In the Cache-Aside pattern, the application first checks Redis for the requested data. On a cache hit, it returns the cached data immediately; on a cache miss, it queries the database, writes the result to Redis with a TTL, and then returns it. Stale data is prevented by invalidating (deleting) the cache key whenever the database is updated, backed by a safety TTL."

#### Key Points to Mention
1. **Flow:** Read Cache → (Miss) → Read DB → Write Cache with TTL.
2. **Invalidation:** Always update the primary database first, then delete the Redis key (`DEL key`) rather than updating it, avoiding race conditions.
3. **Safety Net:** Always set an appropriate TTL so even un-invalidated keys expire automatically.

#### Minimal Code Demonstration
```javascript
// Check cache
let data = await redis.get(key);
if (!data) {
  data = await db.query(...);
  await redis.set(key, JSON.stringify(data), 'EX', 300); // 5 min TTL
}
return data;
```

---

### Q3: How does Redis achieve data persistence? Compare RDB vs AOF.
`[Level: Mid-Senior]` `[Frequency: Very High]`

- **Related Learning Note:** [04-persistence.md](../../Learning/Redis/04-persistence.md)

#### 30-Second Spoken Answer
> "Redis offers two persistence options: RDB and AOF. RDB takes periodic, point-in-time binary snapshots of the dataset, which is great for fast restarts and backups but risks losing minutes of data on a crash. AOF logs every write command sequentially, providing high durability with at most 1 second of data loss, but results in larger files and slightly slower write throughput."

#### Key Points to Mention
1. **RDB Pros/Cons:** Fast server restart, compact single `.rdb` file; downside is potential data loss between snapshot intervals.
2. **AOF Pros/Cons:** Maximum durability (`appendfsync everysec`); downside is larger file sizes and background rewrite overhead (`BGREWRITEAOF`).
3. **Production Recommendation:** Enable both: use AOF for durability on recovery, and RDB for regular cold backups to S3.

---

### Q4: When would you use a Redis Hash instead of a JSON String?
`[Level: Mid]` `[Frequency: High]`

- **Related Learning Note:** [02-data-structures.md](../../Learning/Redis/02-data-structures.md)

#### 30-Second Spoken Answer
> "Use a Redis Hash when you have structured objects and need to read or update individual fields without fetching or serializing the entire object. Use a JSON String when you always read and write the object as an atomic whole, or when the data structure is deeply nested."

#### Key Points to Mention
1. **Granular Updates:** With Hashes, `HSET user:1 age 29` only modifies the `age` field without transmitting the full profile over the network.
2. **Memory Efficiency:** Small Hashes are stored as memory-optimized `ziplists`, saving significant RAM.
3. **Limitation:** Redis Hashes are flat key-value maps and do not natively support nested sub-objects (unless using RedisJSON module).

---

### Q5: What is the difference between Redis Pub/Sub and Redis Streams?
`[Level: Senior]` `[Frequency: High]`

- **Related Learning Note:** [05-pub-sub-and-messaging.md](../../Learning/Redis/05-pub-sub-and-messaging.md)

#### 30-Second Spoken Answer
> "Redis Pub/Sub is a lightweight, fire-and-forget broadcasting system where messages are not persisted and offline subscribers miss messages completely. Redis Streams is an append-only log data structure that persists messages, supports consumer groups, message acknowledgments (ACK), and allows clients to read historical data."

#### Key Points to Mention
1. **Persistence:** Pub/Sub has zero message storage; Streams persist data to memory/disk like an in-memory Kafka.
2. **Consumer Groups:** Streams allow multiple worker instances to divide workload using consumer groups (`XREADGROUP`), whereas Pub/Sub sends every message to every subscriber.
3. **Use Cases:** Pub/Sub for ephemeral notifications/chat; Streams for reliable event-driven task queues and audit logs.
