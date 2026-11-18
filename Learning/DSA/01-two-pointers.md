# Pattern 01: Two Pointers

> Two pointers move towards each other (or in the same direction) to process elements in a linear structure, reducing an $O(N^2)$ brute force to $O(N)$ time.

---

## 1. Key Takeaways (TL;DR)

- **Opposite Direction:** One pointer starts at index `0` (left), one at index `n - 1` (right). They converge toward the middle.
- **Sorted Array Requirement:** Opposite-direction Two Pointers almost always relies on the array being **sorted**.
- **Space Optimization:** Achieves $O(1)$ auxiliary space because it eliminates the need for hash tables or extra arrays.
- **Key Move:**
  - If current sum is too small $\rightarrow$ move `left++` (increase value).
  - If current sum is too big $\rightarrow$ move `right--` (decrease value).

---

## 2. Recognition Triggers (When to Use)

Look for these keywords and properties in problem statements:
- Input is **sorted** (or can be sorted in $O(N \log N)$ without violating constraints).
- Problem asks to find a **pair**, **triplet**, or **subarray** matching a target sum or condition.
- Problem involves reversing, palindrome checks, or partitioning elements in-place.
- Comparison: *Brute force uses nested loops ($O(N^2)$) comparing every element with every other element.*

---

## 3. Visual Mechanism

```text
Target: 9
Sorted Array: [ 2,   3,   5,   7,   11 ]
                ▲                   ▲
               left               right

Step 1: 2 + 11 = 13 (Too big! 13 > 9)
        Action: right--

Sorted Array: [ 2,   3,   5,   7,   11 ]
                ▲              ▲
               left          right

Step 2: 2 + 7 = 9   (Exact match found!)
        Return: [0, 3]
```

---

## 4. Reusable TypeScript / JavaScript Template

```typescript
function twoPointersTemplate(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const currentSum = nums[left] + nums[right];

    if (currentSum === target) {
      return [left, right]; // Found condition
    } else if (currentSum < target) {
      left++; // Need a bigger number
    } else {
      right--; // Need a smaller number
    }
  }

  return []; // Not found
}
```

---

## 5. Canonical Problem: 3Sum ($O(N^2)$ Time, $O(1)$ Space)

Find all unique triplets in an array that sum to `0`.

### Strategy:
1. Sort the array.
2. Fix the first element `nums[i]` with an outer loop.
3. Use Two Pointers (`left = i + 1`, `right = n - 1`) to find pairs that sum to `-nums[i]`.
4. Skip duplicate values for both `i`, `left`, and `right` to guarantee unique triplets.

```typescript
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    // Optimization: if smallest number > 0, three positive numbers cannot sum to 0
    if (nums[i] > 0) break;

    // Skip duplicate first element
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        // Skip duplicate left and right elements
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}
```

---

## 6. JavaScript / TypeScript Specific Gotchas

- **Array.prototype.sort() Bug:**
  - `[10, 2].sort()` produces `[10, 2]` because JS sorts alphabetically by default!
  - Always pass a comparator: `nums.sort((a, b) => a - b)`.
- **Duplicate Skipping Edge Cases:**
  - Always update pointers `left++` and `right--` *after* skipping duplicate while-loops, otherwise you can cause an infinite loop.
- **Integer Overflow:**
  - Unlike C++/Java, JS numbers are double-precision 64-bit floats (`Number.MAX_SAFE_INTEGER` is $2^{53} - 1$). Integer overflow on basic arithmetic is rare in LeetCode unless values exceed $9 \times 10^{15}$.

---

## 7. Complexity Analysis

| Metric | Complexity | Why |
| :--- | :--- | :--- |
| **Time Complexity** | $O(N)$ for Two Sum II, $O(N^2)$ for 3Sum | The pointers together visit each element at most once per outer loop iteration. |
| **Space Complexity** | $O(1)$ auxiliary space | Operates in-place with just two index pointer variables. |

---

## Related Hubs
- **Cheatsheet:** [Notes/Cheatsheets/dsa.md](../../Notes/Cheatsheets/dsa.md)
- **Hands-on Experiment:** [Sandbox/dsa-two-pointers/](../../Sandbox/dsa-two-pointers/README.md)
- **Interview Q&A:** [Interview-Prep/DSA/two-pointers-interview-qa.md](../../Interview-Prep/DSA/two-pointers-interview-qa.md)
