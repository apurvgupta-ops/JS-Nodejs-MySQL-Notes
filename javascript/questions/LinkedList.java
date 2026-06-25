package javascript.questions;

public class LinkedList {

    // Pointer to track the beginning of the list
    private ListNode head;

    // 1. Define the building block: The ListNode class
    private static class ListNode {

        int data;
        ListNode next;

        // Constructor to initialize a listnode with data
        ListNode(int data) {
            this.data = data;
            this.next = null; // New listnodes initially point to nothing
        }
    }

    // 2. Insert a listnode at the beginning (Head) of the list
    // Time Complexity: O(1)
    public void insertAtHead(int data) {
        ListNode newListNode = new ListNode(data);
        newListNode.next = head; // Point new listnode's next to the current head
        head = newListNode; // Move head pointer to the new listnode
    }

    // 3. Insert a listnode at the end (Tail) of the list
    // Time Complexity: O(n)
    public void insertAtTail(int data) {
        ListNode newListNode = new ListNode(data);

        // If the list is empty, the new listnode becomes the head
        if (head == null) {
            head = newListNode;
            return;
        }

        // Traverse to the last listnode
        ListNode current = head;
        while (current.next != null) {
            current = current.next;
        }

        // Link the last listnode to the new listnode
        current.next = newListNode;
    }

    // 4. Delete the first occurrence of a specific value
    // Time Complexity: O(n)
    public void deleteValue(int key) {
        // Case A: List is empty
        if (head == null) {
            return;
        }

        // Case B: The head listnode itself holds the value to be deleted
        if (head.data == key) {
            head = head.next; // Bypass the old head
            return;
        }

        // Case C: Search for the listnode to delete while tracking its previous
        // listnode
        ListNode current = head;
        ListNode prev = null;

        while (current != null && current.data != key) {
            prev = current;
            current = current.next;
        }

        // If the value wasn't found in the list
        if (current == null) {
            return;
        }

        // Unlink the listnode from the sequence
        prev.next = current.next;
    }

    // Delete First element of the list
    // Time Complexity: O(1)
    public void deleteHead() {
        if (head != null) {
            head = head.next; // Move head pointer to the next listnode
        }
    }

    public void deleteTail() {
        if (head == null) {
            return; // List is empty
        }

        if (head.next == null) {
            head = null; // Only one listnode in the list
            return;
        }

        ListNode current = head;
        while (current.next.next != null) {
            current = current.next; // Traverse to the second last listnode
        }

        current.next = null; // Unlink the last listnode
    }

    // Insert a listnode at a specific position (0-based index)
    // Time Complexity: O(n)
    public void insertAtPosition(int data, int position) {
        ListNode newListNode = new ListNode(data);

        // Inserting at the head (position 0)
        if (position == 0) {
            newListNode.next = head;
            head = newListNode;
            return;
        }

        ListNode current = head;
        int index = 0;

        // Traverse to the listnode just before the desired position
        while (current != null && index < position - 1) {
            current = current.next;
            index++;
        }

        // If the position is out of bounds, do not insert
        if (current == null) {
            return;
        }

        // Insert the new listnode at the desired position
        newListNode.next = current.next;
        current.next = newListNode;
    }

    // !206 Reverse linked List
    public void reverse() {
        ListNode prev = null;
        ListNode next = null;
        ListNode curr = head;

        while (curr != null) {
            next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        head = prev;
    }

    // !21. Merge Two Sorted Lists
    public static LinkedList mergeLinkedList(LinkedList list1, LinkedList list2) {
        LinkedList mergedList = new LinkedList();
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        ListNode curr1 = list1.head;
        ListNode curr2 = list2.head;

        while (curr1 != null && curr2 != null) {
            if (curr1.data <= curr2.data) {
                tail.next = curr1;
                curr1 = curr1.next;
            } else {
                tail.next = curr2;
                curr2 = curr2.next;
            }

            tail = tail.next;
        }
        tail.next = (curr1 != null) ? curr1 : curr2;

        mergedList.head = dummy.next;
        return mergedList;
    }

    // 1->2->3->4->5->6->null
    // left =2, right =5
    // 1->|2->3->4->5|->6->null
    // so left is on 2nd node and right is on 5th node.
    // so new linked list is => 1->5->4->3->2->6->null
    // !92. Reverse Sublist (Reverse Linked List II)
    public static LinkedList reverseLinkedList2(LinkedList list, int left, int right) {

        // Edge case check: list is empty or no structural swap needed
        if (list == null || list.head == null || left == right) {
            return list;
        }
        ListNode dummy = new ListNode(0);
        dummy.next = list.head;

        ListNode prevNode = dummy;

        for (int i = 0; i < left - 1; i++) {
            prevNode = prevNode.next;
        }

        // current Node is pointing to the absolute start of the sublist
        ListNode currNode = prevNode.next; // Now current Node is pointing to prevNode next node which is 2 in our case;

        for (int i = 0; i < right - left; i++) {
            ListNode nextNode = currNode.next;
            currNode.next = nextNode.next;
            nextNode.next = prevNode.next;
            prevNode.next = nextNode;
        }

        list.head = dummy.next;
        return list;

    }

    // 1->2->3->4->5->6->null
    // out => 2 -> 1 -> 4 -> 3 -> 6 -> 5 -> null
    // !24. Swap Nodes in Pairs
    public ListNode swapParLinkedList(ListNode head) {
        // ? Recursive approach to swap nodes in pairs
        // Base case: If the list is empty or has only one node, return the head
        // if (head == null || head.next == null) {
        // return head;
        // }

        // // Initialize pointers for the first two nodes
        // ListNode firstNode = head;
        // ListNode secondNode = head.next;

        // // Swap the first two nodes
        // firstNode.next = swapParLinkedList(secondNode.next);
        // secondNode.next = firstNode;

        // // Return the new head of the swapped pair
        // return secondNode;

        // ? Iterative approach to swap nodes in pairs
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode current = dummy;

        while (current.next != null && current.next.next != null) {
            ListNode firstNode = current.next;
            ListNode secondNode = current.next.next;

            // Swapping the nodes
            firstNode.next = secondNode.next;
            secondNode.next = firstNode;
            current.next = secondNode;

            // Move to the next pair
            current = firstNode;
        }
        return dummy.next;
    }

    // dummy/prev->1->2->3->4->5->null, k=2
    // prev->2->1->3->4->5->null
    // out => 0-> 2->1->4->3->5->NULL
    // !25 Reverse Nodes in k-Group
    public ListNode reversekGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // Count total nodes
        ListNode curr = dummy;
        int count = 0;
        while (curr.next != null) {
            curr = curr.next;
            count++; // 5
        }

        ListNode prev = dummy;
        while (count >= k) {
            curr = prev.next;
            ListNode nextNode = curr.next;

            for (int i = 1; i < k; i++) {
                curr.next = nextNode.next;
                nextNode.next = prev.next;
                prev.next = nextNode;
                nextNode = curr.next;
            }
            prev = curr;
            count -= k;
        }
        return dummy.next;
    }

    // !328. Odd Even Linked List
    // !141. Linked List Cycle
    // !83. Remove Duplicates from Sorted List
    // !19. Remove Nth Node From End of List

    // !5. Display the elements of the Linked List
    // Time Complexity: O(n)
    public void printList() {
        if (head == null) {
            System.out.println("List is empty.");
            return;
        }

        ListNode current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }

    // Main method to demonstrate functionality
    public static void main(String[] args) {
        LinkedList list = new LinkedList();
        LinkedList list2 = new LinkedList();

        System.out.println("--- Inserting Elements ---");
        list.insertAtTail(10);
        list.insertAtTail(20);
        list.insertAtTail(30);
        list.insertAtTail(40);
        list.insertAtTail(50);
        list.insertAtTail(60);
        // list.printList(); // Output: 10 -> 20 -> 30 -> null

        // System.out.println("\n--- Inserting at Head (40) ---");
        // list.insertAtHead(40);
        // list.printList(); // Output: 40 -> 10 -> 20 -> 30 -> null
        // System.out.println("\n--- Deleting Element 20 ---");
        // list.deleteValue(20);
        // list.printList(); // Output: 40 -> 10 -> 30 -> null
        // System.out.println("\n--- Deleting Head (40) ---");
        // list.deleteHead();
        // list.printList(); // Output: 10 -> 30 -> null
        // System.out.println("\n--- Deleting Tail (30) ---");
        // list.deleteTail();
        // list.printList(); // Output: 10 -> null
        // System.out.println("\n--- Inserting at Position 1 (50) ---");
        // list.insertAtPosition(50, 1);
        // list.printList(); // Output: 10 -> 50 -> null
        // System.out.println("\n Reverse the linked list");
        // list.reverse();
        // list.printList(); // Output: 50 -> 10 -> null
        // System.out.println("\n Merge 2 sorted linked list");
        // list.mergeLinkedList(list, list2);
        // list.printList();

        // System.out.println("\n Reverse the linked list from position 2 to 5");
        // list.reverseLinkedList2(list, 2, 5);
        // list.printList();

        System.out.println("\n Swap the linked list in pairs");
        list.head = list.swapParLinkedList(list.head);
        list.printList();

        System.out.println("\n Reverse the linked list in k group");
        list.head = list.reversekGroup(list.head, 2);
        list.printList();
    }
}
