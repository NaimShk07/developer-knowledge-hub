#!/bin/bash
set -e

echo "=== 1. Writing key with 3-second expiration (TTL) ==="
docker exec sandbox-redis redis-cli SET "user:101:profile" '{"name":"Alice","role":"Engineer"}' EX 3

echo ""
echo "=== 2. Immediate Read (Cache Hit) ==="
VAL=$(docker exec sandbox-redis redis-cli GET "user:101:profile")
echo "Value found in cache: $VAL"

echo ""
echo "=== 3. Checking remaining TTL ==="
TTL=$(docker exec sandbox-redis redis-cli TTL "user:101:profile")
echo "Seconds left: $TTL"

echo ""
echo "=== 4. Waiting 4 seconds for key to expire... ==="
sleep 4

echo ""
echo "=== 5. Read after expiration (Cache Miss) ==="
EXPIRED_VAL=$(docker exec sandbox-redis redis-cli GET "user:101:profile")
if [ -z "$EXPIRED_VAL" ] || [ "$EXPIRED_VAL" = "(nil)" ]; then
  echo "Key expired successfully! Returned nil (Cache Miss). Database would now be queried."
else
  echo "Value: $EXPIRED_VAL"
fi
