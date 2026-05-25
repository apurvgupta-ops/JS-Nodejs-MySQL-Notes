// !202. Happy Number

// ?With fast and slow pointer
function getNextNumber(n) {
  let totalsum = 0;
  while (n > 0) {
    let digit = n % 10;
    totalsum += digit * digit;
    n = Math.floor(n / 10);
  }
  return totalsum;
}

function isHappy(n) {
  let slow = n;
  let fast = getNextNumber(n);
  console.log({ fast });
  while (fast !== slow && fast !== 1) {
    slow = getNextNumber(slow);
    fast = getNextNumber(getNextNumber(fast));
  }

  return fast === 1;
}

// ?With Hashset
// function isHappy(n) {
//   let seen = new Set();
//   while (n !== 1 && !seen.has(n)) {
//     seen.add(n);
//     n = getNextNumber(n);
//   }

//   return n === 1;
// }

console.log(isHappy(19));
