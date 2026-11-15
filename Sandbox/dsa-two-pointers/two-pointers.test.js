// Runnable Edge Case Probes for Two Pointers Pattern
import assert from 'node:assert/strict';

// 1. Two Sum II - Input array is sorted (1-indexed LeetCode return format)
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}

// 2. 3Sum - Unique triplets summing to 0
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;

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

// 3. Valid Palindrome
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;

  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

// --- TEST SUITES ---

console.log('--- Test Suite 1: Two Sum II ---');
assert.deepEqual(twoSumSorted([2, 7, 11, 15], 9), [1, 2], 'Standard positive array');
assert.deepEqual(twoSumSorted([2, 3, 4], 6), [1, 3], 'Small array');
assert.deepEqual(twoSumSorted([-1, 0], -1), [1, 2], 'Negative numbers');
assert.deepEqual(twoSumSorted([1, 2, 3], 100), [], 'No solution edge case');
console.log('✅ Two Sum II passed all assertions');

console.log('\n--- Test Suite 2: 3Sum ---');
assert.deepEqual(
  threeSum([-1, 0, 1, 2, -1, -4]),
  [[-1, -1, 2], [-1, 0, 1]],
  'Standard case with duplicate triplets eliminated'
);
assert.deepEqual(threeSum([0, 0, 0, 0]), [[0, 0, 0]], 'All zeros handling');
assert.deepEqual(threeSum([1, 2, 3]), [], 'No triplet sums to 0');
assert.deepEqual(threeSum([0]), [], 'Array length < 3');
assert.deepEqual(threeSum([]), [], 'Empty array');
console.log('✅ 3Sum passed all assertions');

console.log('\n--- Test Suite 3: Valid Palindrome ---');
assert.equal(isPalindrome('A man, a plan, a canal: Panama'), true, 'Standard alphanumeric palindrome');
assert.equal(isPalindrome('race a car'), false, 'Non-palindrome');
assert.equal(isPalindrome(' '), true, 'Empty / whitespace only string');
assert.equal(isPalindrome('a'), true, 'Single character');
console.log('✅ Valid Palindrome passed all assertions');

console.log('\n🎉 ALL EDGE-CASE PROBES PASSED SUCCESSFULLY!');
