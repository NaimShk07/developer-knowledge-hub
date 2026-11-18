# Experiment: Redis Caching & TTL Expiration

> **Concept Tested:** [Learning/Redis/03-caching-and-ttl.md](../../Learning/Redis/03-caching-and-ttl.md)

## Objective
Verify how keys automatically expire using `EX` (TTL) and see the Cache-Aside pattern in action.

## How to Run

```bash
# 1. Start Redis container
docker compose up -d

# 2. Run the test script
chmod +x test-cache.sh
./test-cache.sh
```

## How to Tear Down
```bash
docker compose down
```

## What to Observe
The script writes a key with a 3-second expiration. It reads the key immediately (Cache Hit), waits 4 seconds, and reads it again (Cache Miss / Nil).
