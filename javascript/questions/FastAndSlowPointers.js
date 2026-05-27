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
// function ListNode(val) {
//   this.val = val;
//   this.next = null;
// }

// /**
//  * @param {ListNode} head
//  * @return {boolean}
//  */

// var hasCycle = function (head = [3, 2, 0, -4]) {
//   if (!head || !head.next) {
//     return false;
//   }

//   let slow = head;
//   let fast = head;

//   console.log({ fast, slow, next: fast.next });

//   while (fast !== null && fast.next !== null) {
//     slow = slow.next;
//     fast = fast.next.next;

//     if (slow === fast) {
//       return true;
//     }
//   }

//   return false;
// };
// console.log(hasCycle());

// !287. Find the Duplicate Number
// var findDuplicate = function (nums = [1, 3, 4, 2, 2]) {
//   let slow = nums[0];
//   let fast = nums[0];

//   do {
//     slow = nums[slow];
//     fast = nums[nums[fast]];
//   } while (slow !== fast);

//   fast = nums[0];
//   while (slow !== fast) {
//     slow = nums[slow];
//     fast = nums[fast];
//   }

//   return slow;
// };
// console.log(findDuplicate());

// !142. Linked List Cycle II

// class Node {
//   constructor(data) {
//     this.data = data;
//     this.next = null;
//   }
// }
// class Solution {
//   detectCycle(head) {
//     if (!head || !head.next) {
//       return null;
//     }

//     let slow = head;
//     let fast = head;
//     let hasCycle = false;

//     while (fast !== null && fast.next !== null) {
//       slow = slow.next;
//       fast = fast.next.next;

//       if (slow === fast) {
//         hasCycle = true;
//         break;
//       }
//     }
//     if (!hasCycle) return null;

//     fast = head;
//     while (fast !== slow) {
//       slow = slow.next;
//       fast = fast.next;
//     }
//     return slow;
//   }
// }

// let head = new Node(3);
// let node2 = new Node(2);
// let node3 = new Node(0);
// let node4 = new Node(-1);
// let node5 = new Node(-4);

// head.next = node2;
// node2.next = node3;
// node3.next = node4;
// node4.next = node5;
// node5.next = node4;

// let solution = new Solution();
// let result = solution.detectCycle(head);
// if (result !== null) {
//   console.log("Cycle starts at node with value: " + result.data);
// } else {
//   console.log("No cycle detected.");
// }

// !876. Middle of the Linked List
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}
class Solution {
  middleNode(head) {
    if (!head || !head.next) {
      return head;
    }

    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
      slow = slow.next;
      fast = fast.next.next;
    }

    return slow;
  }
}

let head = new Node(3);
let node2 = new Node(2);
let node3 = new Node(1);
let node4 = new Node(4);

head.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = null;

let result = new Solution().middleNode(head);
console.log({ result: result.data });
