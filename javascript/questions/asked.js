function deepEqual(a, b) {
  // 1. Handle +0 and -0
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  }

  // 2. Handle NaN
  if (Number.isNaN(a) && Number.isNaN(b)) return true;

  // 3. If either is null or not an object
  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  // 4. Arrays vs Objects mismatch
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // 5. Get keys
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  // 6. Different number of keys
  if (keysA.length !== keysB.length) return false;

  // 7. Compare keys & values recursively
  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

// Test cases:
console.log(deepEqual(1, 1)); // true
console.log(deepEqual("hello", "hello")); // true
console.log(deepEqual({ a: 1 }, { a: 1 })); // true
console.log(deepEqual({ a: { b: 2 } }, { a: { b: 2 } })); // true
console.log(deepEqual([1, 2, 3], [1, 2, 3])); // true
console.log(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })); // true (order doesn't matter)
console.log(deepEqual([1, [2, 3]], [1, [2, 3]])); // true
console.log(deepEqual(null, null)); // true
console.log(deepEqual(undefined, undefined)); // true
console.log(deepEqual(NaN, NaN)); // true

console.log(deepEqual({ a: 1 }, { a: 2 })); // false
console.log(deepEqual([1, 2], [1, 2, 3])); // false
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 })); // false
console.log(deepEqual(null, undefined)); // false
console.log(deepEqual(0, -0)); // false
