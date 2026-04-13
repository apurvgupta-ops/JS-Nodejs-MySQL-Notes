function twosum(height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = height[left];
  let rightMax = height[right];
  let totalUnit = 0;

  while (left <= right) {
    if (leftMax < rightMax) {
      leftMax = Math.max(leftMax, height[left]);
      totalUnit += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      totalUnit += rightMax - height[right];
      right--;
    }
  }
  return totalUnit;
}

const res = twosum();
console.log(res);
