# Redis Caching & TTL

> Caching temporarily stores slow database query results in fast memory with an expiration timer (TTL).

---

## 1. Key Takeaways (TL;DR)

- **Cache Hit:** The requested data is in Redis (fast response, <1ms).
- **Cache Miss:** The data is not in Redis; fetch from database and write to Redis.
- **TTL (Time to Live):** The number of seconds before Redis deletes the cached key.
- Setting a TTL prevents memory leaks and stale data.

---

## 2. Why & When to Use

- **Why:** Protects your primary SQL or MongoDB database from getting overloaded by identical queries.
- **When:** Use for frequently viewed pages, user profiles, product catalogs, and API responses.

---

## 3. Minimal Example

### The Cache-Aside Pattern (JavaScript / Pseudocode)

```javascript
async function getUserProfile(userId) {
  const cacheKey = `user:${userId}:profile`;

  // 1. Try reading from Redis first (Cache Hit check)
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData); // Instant response!
  }

  // 2. Cache Miss: Fetch from slow SQL database
  const user = await db.users.findById(userId);

  // 3. Save to Redis with a 600-second (10 min) TTL
  await redis.set(cacheKey, JSON.stringify(user), 'EX', 600);

  return user;
}
```

Redis command line equivalent:

```redis
# Set key with 600 second expiration
SET user:42:profile '{"name":"John"}' EX 600

# Check remaining seconds
TTL user:42:profile
# Output: (integer) 589
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Caching without a TTL.
  - _Fix:_ Always set an expiration time on cached data so old data cleans itself up.
- **Mistake:** Forgetting to invalidate cache on updates.
  - _Fix:_ When a user edits their profile, run `DEL user:42:profile` immediately.
- **Tip:** Return `EXISTS <key>` before fetching large objects to save bandwidth.

---

## 5. Quick Reference

| Command / Option | What It Does |
| :--- | :--- |
| `SET <k> <v> EX <sec>` | Sets key and expiration in one atomic step |
| `EXPIRE <k> <sec>` | Adds expiration time to an existing key |
| `TTL <key>` | Shows remaining seconds (-1 = no expiration, -2 = key gone) |
| `PERSIST <key>` | Removes expiration and makes the key permanent |
| `DEL <key>` | Manually removes cached key (cache invalidation) |
