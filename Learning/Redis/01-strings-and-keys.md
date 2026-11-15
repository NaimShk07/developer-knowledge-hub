# Redis Strings & Keys

> Strings are the most basic and common data type in Redis, storing text, numbers, or serialized JSON.

---

## 1. Key Takeaways (TL;DR)

- A Redis string can hold any text, number, or raw binary data up to 512MB.
- Keys are case-sensitive and typically structured with colons (e.g., `user:100:email`).
- You can store numbers and atomically increment them with `INCR`.
- You can set keys to delete themselves automatically using `EXPIRE`.

---

## 2. Why & When to Use

- **Why:** Instant lookup by key without database joins or complex queries.
- **When:** Use strings for session tokens, user profiles, view counters, and simple cached responses.

### Simple Analogy

- A key is the label on a storage locker.
- A string is the item placed inside that locker.

---

## 3. Minimal Example

Open your terminal with `redis-cli`:

```redis
# 1. Store a user name
SET user:101:name "Alice"

# 2. Read the value back
GET user:101:name
# Output: "Alice"

# 3. Create a counter and increase it
SET page:views 0
INCR page:views
# Output: (integer) 1

# 4. Set a key that expires in 10 seconds
SETEX session:token 10 "secret-xyz"

# 5. Check remaining time to live (seconds)
TTL session:token
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Using flat keys like `alice101` instead of structured keys.
  - _Fix:_ Use colon namespacing like `user:101:profile`. This keeps keys organized and readable.
- **Tip:** Run `KEYS *` only in local testing. Never run `KEYS *` in production because it freezes Redis on big databases.

---

## 5. Quick Reference

| Command              | What It Does                                 |
| :------------------- | :------------------------------------------- |
| `SET <key> <val>`    | Stores a key and value                       |
| `GET <key>`          | Retrieves the value of a key                 |
| `INCR <key>`         | Increases a numeric value by 1               |
| `DECR <key>`         | Decreases a numeric value by 1               |
| `EXPIRE <key> <sec>` | Sets an expiration timer on an existing key  |
| `TTL <key>`          | Returns remaining seconds before key expires |
| `DEL <key>`          | Deletes the specified key                    |
