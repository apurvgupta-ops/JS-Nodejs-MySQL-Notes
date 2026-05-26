// !202. Happy Number

// ?With fast and slow pointer
// function getNextNumber(n) {
//   let totalsum = 0;
//   while (n > 0) {
//     let digit = n % 10;
//     totalsum += digit * digit;
//     n = Math.floor(n / 10);
//   }
//   return totalsum;
// }

// function isHappy(n) {
//   let slow = n;
//   let fast = getNextNumber(n);
//   console.log({ fast });
//   while (fast !== slow && fast !== 1) {
//     slow = getNextNumber(slow);
//     fast = getNextNumber(getNextNumber(fast));
//   }

//   return fast === 1;
// }

// ?With Hashset
// function isHappy(n) {
//   let seen = new Set();
//   while (n !== 1 && !seen.has(n)) {
//     seen.add(n);
//     n = getNextNumber(n);
//   }

//   return n === 1;
// }

// console.log(isHappy(19));
// !141. Linked List Cycle => JS
function ListNode(val) {
  this.val = val;
  this.next = null;
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */

var hasCycle = function (head = [3, 2, 0, -4]) {
  if (!head || !head.next) {
    return false;
  }

  let slow = head;
  let fast = head;

  console.log({ fast, slow, next: fast.next });

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
};
console.log(hasCycle());
