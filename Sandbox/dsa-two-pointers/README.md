# Experiment: Two Pointers Pattern & Edge-Case Probes

> **Concept Tested:** [Learning/DSA/01-two-pointers.md](file:///Users/nayemuddinshaikh/Developer/Learning/DSA/01-two-pointers.md)

## Objective
Verify the correctness and edge-case behavior of the Two Pointers pattern across:
1. Standard inputs (positive and negative values)
2. Duplicates handling (e.g. 3Sum with multiple zeros or repeated triplets)
3. Edge cases: Empty array, less than required elements, no solution found
4. In-place palindrome verification

## How to Run

```bash
# Run tests with Node.js
node two-pointers.test.js
```

## What to Observe
- All test suites pass.
- Verification that `nums.sort((a, b) => a - b)` is strictly required in JavaScript to prevent lexicographical sorting bugs.
- Confirms zero auxiliary heap allocations ($O(1)$ space).
