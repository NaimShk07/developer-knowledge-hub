# Sliding Window Interview Questions & Verbal Strategy

High-frequency FAANG interview questions using the Sliding Window pattern, structured with the **4-Step Verbal Framework** for live coding rounds.

---

### Q1: Longest Substring Without Repeating Characters
`[Level: Mid]` `[Frequency: Top Tier (Meta, Amazon, Google, Apple)]`

- **Related Learning Note:** [02-sliding-window.md](../../Learning/DSA/02-sliding-window.md)
- **Hands-on Experiment:** [Sandbox/dsa-sliding-window/](../../Sandbox/dsa-sliding-window/README.md)

#### 1. Clarifying Questions to Ask
- *"What character set is supported? ASCII, lowercase English only, or full Unicode/emojis?"* (Determines map vs array optimization).
- *"Can the input string be empty?"* (Yes, return 0).
- *"Is the answer case-sensitive? (e.g. Is 'A' different from 'a'?)"* (Usually yes).

#### 2. Brute Force (30-Second Explanation)
> "The brute force approach checks all possible substrings using two nested loops and uses a Set to verify uniqueness. For a string of length $N$, there are $O(N^2)$ substrings, and checking uniqueness takes $O(N)$, resulting in an overall $O(N^3)$ time complexity."

#### 3. Optimized Strategy & Spoken Explanation
> "We can optimize to $O(N)$ linear time using a dynamic Sliding Window with a Hash Map storing the most recent index of each character. We expand a `right` pointer one character at a time. If we encounter a character already seen inside our current window (`>= left`), we immediately jump `left` to `previousIndex + 1`. At every step, the window length is `right - left + 1`, and we update our maximum."

#### 4. Minimal Code Solution (TypeScript)
```typescript
function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // Jump left pointer forward past the duplicate
    if (lastSeen.has(char) && lastSeen.get(char)! >= left) {
      left = lastSeen.get(char)! + 1;
    }

    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

#### Common Follow-Up Questions
- *"Why do we need the condition `lastSeen.get(char) >= left`?"* → If a character was seen at index 0, and our window has already moved to index 5, checking only `.has(char)` would incorrectly jump the `left` pointer backwards!
- *"How to optimize space for standard ASCII?"* → Replace the `Map` with a fixed-size integer array `new Int32Array(128).fill(-1)` to achieve true $O(1)$ space and eliminate hash collisions.

---

### Q2: Minimum Size Subarray Sum ($\ge \text{Target}$)
`[Level: Mid]` `[Frequency: High (Amazon, Microsoft)]`

- **Related Learning Note:** [02-sliding-window.md](../../Learning/DSA/02-sliding-window.md)
- **Hands-on Experiment:** [Sandbox/dsa-sliding-window/](../../Sandbox/dsa-sliding-window/README.md)

#### 1. Clarifying Questions to Ask
- *"Are all numbers strictly positive?"* (Crucial: Sliding window only works if all numbers are positive; if negative numbers exist, we must use Prefix Sum + Hash Map!).
- *"What should we return if no subarray sums to target?"* (Return 0).

#### 2. Brute Force (30-Second Explanation)
> "The brute force approach computes sums of all subarrays starting from every index $i$ to index $j$, which takes $O(N^2)$ time."

#### 3. Optimized Strategy & Spoken Explanation
> "Because all numbers are positive, adding elements strictly increases the sum and removing elements strictly decreases it. We expand the `right` pointer until `currentSum >= target`. Once valid, we record the window size and shrink from the `left` in a while loop to find the minimal valid subarray, before expanding `right` again. Time complexity is $O(N)$ and space is $O(1)$."

#### 4. Minimal Code Solution (TypeScript)
```typescript
function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let currentSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];

    // Shrink window as small as possible while still valid
    while (currentSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}
```

#### Common Follow-Up Questions
- *"Why is the while loop inside the for loop still $O(N)$ and not $O(N^2)$?"* → Each element is added to `currentSum` at most once by `right`, and subtracted at most once by `left`. Total pointer operations across the whole execution are $2N$, which is $O(N)$ amortized.

---

### Q3: Permutation in String (Anagram Substring)
`[Level: Mid]` `[Frequency: High (Meta, Google)]`

- **Related Learning Note:** [02-sliding-window.md](../../Learning/DSA/02-sliding-window.md)

#### 1. 30-Second Spoken Answer
> "This is a fixed-size sliding window problem where the window size is always `s1.length`. We maintain a frequency count of characters in `s1` and compare it against the frequency count of the current window in `s2`. We slide the window across `s2`, adding the incoming character and removing the outgoing character in $O(1)$ time, checking for a frequency match."

#### 2. Minimal Code Solution (TypeScript)
```typescript
function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) return false;

  const count = new Array(26).fill(0);
  const aCode = 'a'.charCodeAt(0);

  // Initialize frequency map for s1 and the first window of s2
  for (let i = 0; i < s1.length; i++) {
    count[s1.charCodeAt(i) - aCode]++;
    count[s2.charCodeAt(i) - aCode]--;
  }

  const isMatch = () => count.every((c) => c === 0);
  if (isMatch()) return true;

  // Slide fixed window across s2
  for (let i = s1.length; i < s2.length; i++) {
    count[s2.charCodeAt(i) - aCode]--; // Add new character
    count[s2.charCodeAt(i - s1.length) - aCode]++; // Remove old character

    if (isMatch()) return true;
  }

  return false;
}
```
