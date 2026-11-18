# Data Structures & Algorithms (DSA) Cheatsheet

> Rapid pattern matching, Big-O complexity tables, and JavaScript/TypeScript gotchas.
> **Deep Dive:** [Learning/DSA/](../../Learning/DSA/README.md) | **Interview Q&A:** [Interview-Prep/DSA/](../../Interview-Prep/DSA/two-pointers-interview-qa.md)

---

## 1. Pattern Identification Matrix

Scan the problem description for these keyword signals:

| Problem Signal / Keywords | High-Probability Pattern | Data Structure |
| :--- | :--- | :--- |
| Sorted array + Find a pair or triplet summing to $K$ | **Two Pointers (Converging)** | Array |
| Palindrome validation or reverse in-place | **Two Pointers (Converging)** | String, Array |
| Subarray with contiguous elements + max/min/length condition | **Sliding Window** | Array, String, Map |
| Count subarrays with sum equal to $K$ | **Prefix Sum + Hash Map** | Array, Map |
| Find cycle in linked list or sequence | **Fast & Slow Pointers (Floyd's)** | Linked List |
| Search in sorted / rotated sorted array in $O(\log N)$ | **Modified Binary Search** | Array |
| Next greater / smaller element in array | **Monotonic Stack** | Stack |
| Top $K$ frequent / largest / smallest elements | **Min/Max Heap** | Priority Queue |
| Level by level exploration or shortest path in unweighted graph | **BFS** | Queue |
| Explore all combinations, permutations, or paths | **Backtracking** | Recursion |
| Overlapping subproblems + optimal substructure | **Dynamic Programming** | Array, Table |
| Intervals with start/end times overlapping | **Interval Merging** | Array + Sort |

---

## 2. Big-O Complexity Quick Reference

### Data Structure Operations

| Data Structure | Access | Search | Insertion | Deletion | Space |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array** | $O(1)$ | $O(N)$ | $O(N)$ (at head/middle), $O(1)$ (push) | $O(N)$ | $O(N)$ |
| **Hash Map / Set** | — | $O(1)$ avg | $O(1)$ avg | $O(1)$ avg | $O(N)$ |
| **Binary Search Tree** | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(N)$ |
| **Heap (Priority Queue)** | $O(1)$ (peek) | $O(N)$ | $O(\log N)$ | $O(\log N)$ (pop) | $O(N)$ |

### Common Array Sorting Algorithms
- `Array.prototype.sort()` (V8 Timsort): **$O(N \log N)$ Time**, **$O(N)$ Space**.

---

## 3. JavaScript / TypeScript Specific Gotchas

### A. Number Sorting Quirk
```javascript
// BUG: Lexicographical sort!
[10, 5, 40, 25].sort(); // [10, 25, 40, 5]

// FIX: Always provide numerical comparator
[10, 5, 40, 25].sort((a, b) => a - b); // [5, 10, 25, 40]
```

### B. Integer Division
JavaScript numbers are floating point. In Binary Search or pointer math, division produces decimals:
```javascript
// BUG: Produces 2.5
const mid = (left + right) / 2;

// FIX: Always truncate
const mid = Math.floor(left + (right - left) / 2);
```

### C. 2D Array Matrix Initialization
```javascript
// BUG: All rows reference the same memory array!
const grid = new Array(3).fill(new Array(3).fill(0));

// FIX: Map distinct array instances
const grid = Array.from({ length: 3 }, () => new Array(3).fill(0));
```

### D. Map vs Plain Object
- Use `new Map()` when keys are non-strings or when frequently inserting/deleting keys.
- `Map.prototype.get()`, `set()`, `has()`, and `delete()` maintain insertion order and avoid prototype pollution.
