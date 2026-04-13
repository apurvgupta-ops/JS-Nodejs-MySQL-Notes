// 560. Subarray Sum Equals K
function subarraySum(nums = [1, 2, 3], k = 3) {
  let count = 0;
  let prefixSum = 0;
  let map = new Map([[0, 1]]);

  for (const i of nums) {
    prefixSum += i;

    if (map.has(prefixSum - k)) {
      count += map.get(prefixSum - k);
    }
    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
  }
  return count;
}

const res = subarraySum();
console.log(res);
