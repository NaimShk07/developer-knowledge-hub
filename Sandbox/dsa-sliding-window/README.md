# Experiment: Sliding Window Pattern & Edge-Case Probes

> **Concept Tested:** [Learning/DSA/02-sliding-window.md](../../Learning/DSA/02-sliding-window.md)

## Objective
Verify the correctness, window shrinking behavior, and edge cases of the Sliding Window pattern across:
1. **Fixed Window:** Maximum Sum Subarray of Size $K$
2. **Dynamic Window:** Longest Substring Without Repeating Characters
3. **Dynamic Shrinking:** Minimum Size Subarray Sum (Target $\ge S$)
4. **Edge Cases:** Empty inputs, string with all duplicate characters, array smaller than $K$.

## How to Run

```bash
# Run tests directly with Node.js
node sliding-window.test.js
```

## What to Observe
- All assertion suites pass cleanly.
- Confirms strictly linear $O(N)$ runtime without nested quadratic scans.
