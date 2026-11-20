# Pattern 02: Sliding Window

> The Sliding Window pattern maintains a contiguous subset (window) of elements in an array or string that expands or shrinks to find optimal ranges, reducing $O(N^2)$ brute force loops to $O(N)$ linear time.

---

## 1. Key Takeaways (TL;DR)

- **Contiguous Elements Only:** This pattern applies **only** to subarrays or substrings (elements next to each other). If the problem allows non-contiguous elements, use Dynamic Programming or Two Pointers instead.
- **Two Window Types:**
  1. **Fixed Window:** The window size $K$ is fixed (e.g. "find maximum sum of any subarray of size $K$").
  2. **Dynamic Window:** The window expands with a `right` pointer until a condition is violated, then shrinks with a `left` pointer to restore validity (e.g. "longest substring without repeating characters").
- **Time Complexity is $O(N)$:** Even though there is a `while` loop inside a `for` loop, each pointer (`left` and `right`) visits each index at most once ($2N$ operations total).

---

## 2. Recognition Triggers (When to Use)

Look for these high-frequency keywords:
- *"Contiguous subarray"* or *"continuous substring"*
- *"Maximum / minimum sum or length of size $K$"* $\rightarrow$ **Fixed Window**
- *"Longest / shortest substring meeting condition $X$"* $\rightarrow$ **Dynamic Window**
- *"At most $K$ distinct characters"*
- Comparison: *Brute force uses two nested loops generating all $\frac{N(N+1)}{2}$ subarrays ($O(N^2)$).*

---

## 3. Visual Mechanisms

### A. Fixed Window (Size $K = 3$)
Instead of re-summing 3 elements every time, subtract the element leaving the window and add the element entering:

```text
Array: [ 2,  1,  5,  1,  3,  2 ],  K = 3

Window 1: [ 2,  1,  5 ]        Sum = 8
               -2    +1
Window 2:    [ 1,  5,  1 ]     Sum = 8 - 2 + 1 = 7
                  -1    +3
Window 3:       [ 5,  1,  3 ]  Sum = 7 - 1 + 3 = 9 (Max!)
```

### B. Dynamic Window (Longest with condition)
```text
Expand 'right' to include new characters.
If duplicate found -> shrink 'left' until window is valid again.

String: "a  b  c  a  b  c  b  b"
        [a  b  c] a           -> Duplicate 'a'!
           [b  c  a] b        -> Valid again! Window size = 3
```

---

## 4. Reusable JavaScript / TypeScript Templates

### Template 1: Fixed Window of Size $K$
```typescript
function fixedSlidingWindow(nums: number[], k: number): number {
  let windowSum = 0;
  let maxSum = -Infinity;

  for (let i = 0; i < nums.length; i++) {
    windowSum += nums[i]; // Add current element to window

    // When we reach size k, calculate max and slide left edge
    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= nums[i - (k - 1)]; // Remove element going out of window
    }
  }

  return maxSum;
}
```

### Template 2: Dynamic Window (Variable Size)
```typescript
function dynamicSlidingWindow(s: string): number {
  let left = 0;
  let maxLength = 0;
  const state = new Map<string, number>(); // Track characters or frequencies

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    // 1. Expand: update window state with s[right]
    state.set(char, (state.get(char) || 0) + 1);

    // 2. Shrink: while window violates condition, advance left
    while (/* window is invalid, e.g. state.get(char) > 1 */ false) {
      const leftChar = s[left];
      state.set(leftChar, state.get(leftChar)! - 1);
      left++;
    }

    // 3. Update result (window is now valid)
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

---

## 5. Canonical Problem: Longest Substring Without Repeating Characters

Given a string `s`, find the length of the longest substring without repeating characters.

### Optimized $O(N)$ Solution using Map of Indices:
```typescript
function lengthOfLongestSubstring(s: string): number {
  const lastSeenIndex = new Map<string, number>();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // If character was seen inside the current window, jump left past it
    if (lastSeenIndex.has(char) && lastSeenIndex.get(char)! >= left) {
      left = lastSeenIndex.get(char)! + 1;
    }

    lastSeenIndex.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

---

## 6. JavaScript Specific Gotchas in Sliding Window

- **Window Length Formula:**
  - The length of a window bounded by indices `left` and `right` is **always `right - left + 1`** (inclusive bounds).
- **Map vs Object Performance:**
  - For standard ASCII strings, `new Map()` or a fixed array `new Array(128).fill(-1)` is faster and avoids prototype lookups compared to `{}`.
- **`lastSeenIndex.get(char) >= left` Check:**
  - When storing character indices in a map, do not just check `map.has(char)`. You must also verify that the previous occurrence is **inside the current window** (`>= left`), otherwise you will incorrectly jump backwards!

---

## 7. Complexity Analysis

| Metric | Complexity | Why |
| :--- | :--- | :--- |
| **Time Complexity** | $O(N)$ | The `right` pointer traverses $N$ times, and the `left` pointer moves at most $N$ times total. |
| **Space Complexity** | $O(\min(N, M))$ | $M$ is the character alphabet size (e.g., $O(1)$ for 26 English letters, max 128 for ASCII). |

---

## Related Hubs
- **Previous Pattern:** [01-two-pointers.md](01-two-pointers.md)
- **Cheatsheet:** [Notes/Cheatsheets/dsa.md](../../Notes/Cheatsheets/dsa.md)
- **Hands-on Experiment:** [Sandbox/dsa-sliding-window/](../../Sandbox/dsa-sliding-window/README.md)
- **Interview Q&A:** [Interview-Prep/DSA/sliding-window-interview-qa.md](../../Interview-Prep/DSA/sliding-window-interview-qa.md)
