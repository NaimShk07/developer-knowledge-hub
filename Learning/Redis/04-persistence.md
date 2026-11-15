# Redis Persistence (RDB & AOF)

> Persistence mechanisms save in-memory Redis data to hard disk so nothing is lost if the server restarts.

---

## 1. Key Takeaways (TL;DR)

- Pure in-memory data disappears when the power turns off.
- Redis solves this with two persistence options: **RDB** and **AOF**.
- **RDB (Snapshot):** Takes periodic point-in-time snapshots of the database (e.g., every 5 minutes).
- **AOF (Append Only File):** Logs every single write command immediately to a file.
- In production, you can enable both together for maximum safety.

---

## 2. Why & When to Use

- **Why:** If Redis crashes or restarts, it reloads the saved data from disk into RAM.
- **When:**
  - Use **RDB** for backups and disaster recovery (compact single file).
  - Use **AOF** when data loss of even a few minutes is unacceptable.
  - Disable both if Redis is used purely as a disposable cache.

---

## 3. Minimal Example

Configuration settings inside `redis.conf`:

```conf
# 1. RDB Snapshot: Save after 60 seconds if at least 1000 keys changed
save 60 1000

# 2. AOF Configuration: Turn on write log
appendonly yes

# 3. How often AOF syncs to disk (everysec is recommended)
appendfsync everysec
```

Triggering snapshots manually via `redis-cli`:

```redis
# Asynchronously save snapshot to disk in background
BGSAVE
# Output: "Background saving started"

# Check last successful save timestamp (Unix time)
LASTSAVE
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Using `SAVE` instead of `BGSAVE`.
  - _Fix:_ `SAVE` blocks all clients until writing finishes. Always use `BGSAVE` so Redis continues serving requests.
- **Tip:** For a pure cache where missing data can simply be re-fetched from SQL, turn off persistence to maximize speed.

---

## 5. Quick Reference

| Feature            | RDB (Snapshots)                    | AOF (Append Only File)                |
| :----------------- | :--------------------------------- | :------------------------------------ |
| **Speed**          | Very fast restarts                 | Slightly slower write operations      |
| **File Size**      | Small, compressed binary file      | Larger text log file                  |
| **Data Safety**    | Can lose data between snapshots    | Loses at most 1 second of data        |
| **Best For**       | Cold backups and disaster recovery | High durability and minimal data loss |
| **Manual Trigger** | `BGSAVE`                           | `BGREWRITEAOF`                        |
