# Redis Pub/Sub & Messaging

> Pub/Sub allows publishers to broadcast messages to multiple listening subscribers in real time.

---

## 1. Key Takeaways (TL;DR)

- **Publishers:** Send messages to a named channel without knowing who is listening.
- **Subscribers:** Listen to a channel and instantly receive all incoming messages.
- Messages are fire-and-forget: Redis does not save Pub/Sub messages for offline subscribers.
- Great for real-time notifications, chat rooms, and microservice events.

---

## 2. Why & When to Use

- **Why:** Avoids polling the database repeatedly for updates.
- **When:** Use Pub/Sub for live chat messages, WebSocket server broadcasts, or cache-invalidation events across servers.

---

## 3. Minimal Example

Open two separate terminal windows with `redis-cli`:

### Terminal 1 (Subscriber):

```redis
# Listen to the 'alerts' channel
SUBSCRIBE alerts
# The client now waits and listens for new messages...
```

### Terminal 2 (Publisher):

```redis
# Broadcast a message to the 'alerts' channel
PUBLISH alerts "Server disk space is 85%"
# Output: (integer) 1  <-- number of active subscribers who received it
```

Terminal 1 immediately prints:

```text
1) "message"
2) "alerts"
3) "Server disk space is 85%"
```

---

## 4. Common Mistakes & Tips

- **Mistake:** Assuming a subscriber can read missed messages after reconnecting.
  - _Fix:_ Pub/Sub has no history. If you need message history or guaranteed delivery, use **Redis Streams** (`XADD` / `XREAD`) or a full message broker like RabbitMQ.
- **Tip:** Use `PSUBSCRIBE news:*` to subscribe to multiple channels matching a wildcard pattern.

---

## 5. Quick Reference

| Command                   | What It Does                                                |
| :------------------------ | :---------------------------------------------------------- |
| `SUBSCRIBE <channel>`     | Listens to a channel for new messages                       |
| `PUBLISH <channel> <msg>` | Sends a message to all active channel subscribers           |
| `UNSUBSCRIBE <channel>`   | Stops listening to a channel                                |
| `PSUBSCRIBE <pattern>`    | Listens to all channels matching a pattern (e.g., `user:*`) |
| `PUBSUB CHANNELS`         | Lists currently active channels with subscribers            |
