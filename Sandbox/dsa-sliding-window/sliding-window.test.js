// Runnable Edge-Case Probes for Sliding Window Pattern
import assert from 'node:assert/strict';

// 1. Fixed Window: Maximum Sum Subarray of Size K
function maxSubArrayOfSizeK(nums, k) {
  if (nums.length < k || k <= 0) return 0;

  let windowSum = 0;
  let maxSum = -Infinity;

  for (let i = 0; i < nums.length; i++) {
    windowSum += nums[i];

    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= nums[i - (k - 1)];
    }
  }

  return maxSum;
}

// 2. Dynamic Window: Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (lastSeen.has(char) && lastSeen.get(char) >= left) {
      left = lastSeen.get(char) + 1;
    }

    lastSeen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// 3. Dynamic Shrinking Window: Minimum Size Subarray Sum >= target
function minSubArrayLen(target, nums) {
  let left = 0;
  let currentSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];

    while (currentSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}

// --- TEST SUITES ---

console.log('--- Test Suite 1: Fixed Window (Max Sum Size K) ---');
assert.equal(maxSubArrayOfSizeK([2, 1, 5, 1, 3, 2], 3), 9, 'Standard array with positive integers');
assert.equal(maxSubArrayOfSizeK([2, 3, 4, 1, 5], 2), 7, 'Window size 2');
assert.equal(maxSubArrayOfSizeK([1, 2], 3), 0, 'Array smaller than k returns 0');
assert.equal(maxSubArrayOfSizeK([-1, -2, -3, -4], 2), -3, 'All negative numbers');
console.log('✅ Fixed window passed all assertions');

console.log('\n--- Test Suite 2: Dynamic Window (Longest Substring Without Repeats) ---');
assert.equal(lengthOfLongestSubstring('abcabcbb'), 3, 'Standard case "abc"');
assert.equal(lengthOfLongestSubstring('bbbbb'), 1, 'All identical characters "b"');
assert.equal(lengthOfLongestSubstring('pwwkew'), 3, 'Repeats in middle "wke"');
assert.equal(lengthOfLongestSubstring(''), 0, 'Empty string');
assert.equal(lengthOfLongestSubstring('a'), 1, 'Single character');
assert.equal(lengthOfLongestSubstring('abba'), 2, 'Duplicate jump trap (jumping left backward)');
console.log('✅ Dynamic window passed all assertions');

console.log('\n--- Test Suite 3: Dynamic Shrinking Window (Min Subarray Sum) ---');
assert.equal(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]), 2, 'Subarray [4, 3] satisfies sum >= 7');
assert.equal(minSubArrayLen(4, [1, 4, 4]), 1, 'Single element satisfies');
assert.equal(minSubArrayLen(11, [1, 1, 1, 1, 1, 1]), 0, 'No subarray possible returns 0');
console.log('✅ Min subarray sum passed all assertions');

console.log('\n🎉 ALL SLIDING WINDOW PROBES PASSED SUCCESSFULLY!');
