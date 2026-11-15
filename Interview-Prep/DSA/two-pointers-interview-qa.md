# Two Pointers Interview Questions & Verbal Strategy

High-frequency interview problems using the Two Pointers pattern, structured with the **4-Step Verbal Framework** for live coding rounds.

---

### Q1: Two Sum II - Input Array Is Sorted
`[Level: Junior]` `[Frequency: Very High]`

- **Related Learning Note:** [01-two-pointers.md](file:///Users/nayemuddinshaikh/Developer/Learning/DSA/01-two-pointers.md)
- **Hands-on Experiment:** [Sandbox/dsa-two-pointers/](file:///Users/nayemuddinshaikh/Developer/Sandbox/dsa-two-pointers/README.md)

#### 1. Clarifying Questions to Ask
- *"Is the array strictly sorted in ascending order?"* (Confirms Two Pointers works).
- *"Are there guaranteed to be exactly two numbers that sum to the target, or can there be zero/multiple answers?"*
- *"Can we use the same element twice?"* (No, indices must be distinct).
- *"Are indices 0-indexed or 1-indexed in the expected output?"*

#### 2. Brute Force (30-Second Explanation)
> "The brute force approach is to run two nested loops comparing every pair of numbers. For an array of size $N$, this takes $O(N^2)$ time and $O(1)$ space. But since the input array is already sorted, we can eliminate nested comparisons."

#### 3. Optimized Strategy & Spoken Explanation
> "We place one pointer at the start and one pointer at the end. Because the array is sorted, if their sum is too small, moving the left pointer to the right is guaranteed to increase the sum. If the sum is too big, moving the right pointer to the left is guaranteed to decrease the sum. This lets us find the target in a single pass of $O(N)$ time with $O(1)$ space."

#### 4. Minimal Code Solution (TypeScript)
```typescript
function twoSum(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}
```

#### Common Follow-Up Questions
- *"What if the array wasn't sorted?"* → Use a Hash Map (`target - num`) to get $O(N)$ time with $O(N)$ space.
- *"Why is Two Pointers preferred over a Hash Map when sorted?"* → Two Pointers takes $O(1)$ extra space, avoiding heap allocations.

---

### Q2: 3Sum - Finding Unique Triplets
`[Level: Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-two-pointers.md](file:///Users/nayemuddinshaikh/Developer/Learning/DSA/01-two-pointers.md)
- **Hands-on Experiment:** [Sandbox/dsa-two-pointers/](file:///Users/nayemuddinshaikh/Developer/Sandbox/dsa-two-pointers/README.md)

#### 1. Clarifying Questions to Ask
- *"Can the triplets contain duplicate values across different index combinations?"* (No, output must contain unique triplets).
- *"What should be returned if fewer than 3 elements exist?"* (Return empty array `[]`).

#### 2. Brute Force (30-Second Explanation)
> "The brute force approach uses 3 nested loops to check all triplets, taking $O(N^3)$ time, plus extra space or a set to filter out duplicate combinations."

#### 3. Optimized Strategy & Spoken Explanation
> "We first sort the array in $O(N \log N)$ time. Then we fix the first element `nums[i]` with an outer loop and reduce the remaining problem to Two Sum on `nums[i + 1]` through `nums[n - 1]`. By skipping adjacent identical elements for `i`, `left`, and `right`, we eliminate all duplicates without needing an extra set. Total time is $O(N^2)$ and auxiliary space is $O(1)$."

#### 4. Minimal Code Solution (TypeScript)
```typescript
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break; // Optimization
    if (i > 0 && nums[i] === nums[i - 1]) continue; // Skip duplicate first number

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
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

#### Common Follow-Up Questions
- *"Why does sorting not hurt our complexity?"* → Sorting is $O(N \log N)$, but the two nested loops take $O(N^2)$. Since $O(N^2) > O(N \log N)$, sorting is effectively free in Big-O terms.
- *"Why do we need the condition `nums[i] > 0 break`?"* → If the smallest element in a sorted triplet is already positive, three positive numbers can never sum to zero.

---

### Q3: Container With Most Water
`[Level: Mid]` `[Frequency: Very High]`

- **Related Learning Note:** [01-two-pointers.md](file:///Users/nayemuddinshaikh/Developer/Learning/DSA/01-two-pointers.md)

#### 1. 30-Second Spoken Answer
> "We place pointers at the leftmost and rightmost boundaries to maximize width. The water area is limited by the shorter line: `(right - left) * min(height[left], height[right])`. To find a larger area, we must always move the pointer pointing to the shorter line inward, because keeping the shorter line while decreasing width can never yield more water."

#### 2. Minimal Code Solution (TypeScript)
```typescript
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * currentHeight);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}
```
