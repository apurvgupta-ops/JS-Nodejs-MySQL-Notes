
class Node {

    int data;
    Node next;

    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

public class Solution {

    public boolean hasCycle(Node head) {
        // Edge case check
        if (head == null || head.next == null) {
            return false;
        }
        Node slow = head;
        Node fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next; // 1 step
            fast = fast.next.next; // 2 steps

            // Reference equality check
            if (slow == fast) {
                return true;
            }
        }

        return false;
    }

    // Detect cycle and return index of the node where the cycle begins

    public Node detectCycle(Node head) {
        // Phase 1: Handle edge cases safely
        if (head == null || head.next == null) {
            return null;
        }

        Node slow = head;
        Node fast = head; // Using descriptive naming
        boolean hasCycle = false;

        // Strict safety check to prevent NullPointerException
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                hasCycle = true;
                break;
            }
        }

        if (!hasCycle) {
            return null;
        }

        // Phase 2: Find the entry node of the cycle
        Node pointer1 = head;
        Node pointer2 = slow;

        while (pointer1 != pointer2) {
            pointer1 = pointer1.next;
            pointer2 = pointer2.next;
        }

        return pointer1; // Collision point is the cycle start node
    }

    public static void main(String[] args) {
        Node head = new Node(3);
        Node node2 = new Node(2);
        Node node3 = new Node(0);
        Node node4 = new Node(-4);

        head.next = node2;
        node2.next = node3;
        node3.next = node4;
        node4.next = node2; // Creates a cycle

        Solution solution = new Solution();
        boolean result = solution.hasCycle(head);
        System.out.println("Does the linked list have a cycle? " + result);

        Node cycleStartNode = solution.detectCycle(head);
        if (cycleStartNode != null) {
            System.out.println("Cycle starts at node with value: " + cycleStartNode.data);
        } else {
            System.out.println("No cycle detected.");
        }
    }
}
