# Redis Data Structures

> Beyond plain strings, Redis provides built-in Hashes, Lists, Sets, and Sorted Sets for complex data.

---

## 1. Key Takeaways (TL;DR)

- **Hash:** Key-value object (like a Python dictionary or JSON object).
- **List:** Ordered array of strings (ideal for queues and recent activity).
- **Set:** Unordered collection of unique items (no duplicates).
- **Sorted Set (ZSet):** Unique items ordered by a numerical score (ideal for leaderboards).

---

## 2. Why & When to Use

- **Hashes:** Use when storing structured objects like a user profile (`name`, `age`, `email`).
- **Lists:** Use when building message queues or showing the latest 10 notifications.
- **Sets:** Use when tagging articles or finding mutual friends.
- **Sorted Sets:** Use when building gaming leaderboards or rate limiters.

---

## 3. Minimal Example

### A. Hashes (Objects)

```redis
# Save user fields
HSET user:1 name "Sarah" role "developer" age "28"

# Get one field or all fields
HGET user:1 name
HGETALL user:1
```

### B. Lists (Queues)

```redis
# Push tasks to a queue
LPUSH task:queue "send-email" "resize-image"

# Pop the next task from the end
RPOP task:queue
# Output: "send-email"
```

### C. Sets (Unique Items)

```redis
# Add tags to a post
SADD post:10:tags "docker" "redis" "backend" "redis"

# Get all unique tags (duplicates are ignored)
SMEMBERS post:10:tags
```

### D. Sorted Sets (Leaderboards)

```redis
# ZADD <key> <score> <member>
ZADD game:leaderboard 150 "PlayerOne"
ZADD game:leaderboard 320 "PlayerTwo"

# Get top players (highest to lowest score)
ZREVRANGE game:leaderboard 0 -1 WITHSCORES
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Storing a serialized JSON string when you frequently read or edit single fields.
  - _Fix:_ Use a Redis Hash (`HSET` / `HGET`). It lets you read or update one field without downloading the entire object.
- **Tip:** Use `LLEN <key>` to check queue length without downloading all elements.

---

## 5. Quick Reference

| Data Type      | Add Command                   | Read Command             | Common Use Case           |
| :------------- | :---------------------------- | :----------------------- | :------------------------ |
| **Hash**       | `HSET <key> <field> <val>`    | `HGET` / `HGETALL`       | User profiles, settings   |
| **List**       | `LPUSH` / `RPUSH <key> <val>` | `LPOP` / `LRANGE`        | Background job queues     |
| **Set**        | `SADD <key> <member>`         | `SMEMBERS` / `SISMEMBER` | Tags, unique visitors     |
| **Sorted Set** | `ZADD <key> <score> <member>` | `ZRANGE` / `ZREVRANGE`   | Leaderboards, rate limits |
