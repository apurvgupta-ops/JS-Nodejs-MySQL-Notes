package javascript.questions;

public class LinkedList {

    // Pointer to track the beginning of the list
    private Node head;

    // 1. Define the building block: The Node class
    private static class Node {

        int data;
        Node next;

        // Constructor to initialize a node with data
        Node(int data) {
            this.data = data;
            this.next = null; // New nodes initially point to nothing
        }
    }

    // 2. Insert a node at the beginning (Head) of the list
    // Time Complexity: O(1)
    public void insertAtHead(int data) {
        Node newNode = new Node(data);
        newNode.next = head; // Point new node's next to the current head
        head = newNode;      // Move head pointer to the new node
    }

    // 3. Insert a node at the end (Tail) of the list
    // Time Complexity: O(n)
    public void insertAtTail(int data) {
        Node newNode = new Node(data);

        // If the list is empty, the new node becomes the head
        if (head == null) {
            head = newNode;
            return;
        }

        // Traverse to the last node
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }

        // Link the last node to the new node
        current.next = newNode;
    }

    // 4. Delete the first occurrence of a specific value
    // Time Complexity: O(n)
    public void deleteValue(int key) {
        // Case A: List is empty
        if (head == null) {
            return;
        }

        // Case B: The head node itself holds the value to be deleted
        if (head.data == key) {
            head = head.next; // Bypass the old head
            return;
        }

        // Case C: Search for the node to delete while tracking its previous node
        Node current = head;
        Node prev = null;

        while (current != null && current.data != key) {
            prev = current;
            current = current.next;
        }

        // If the value wasn't found in the list
        if (current == null) {
            return;
        }

        // Unlink the node from the sequence
        prev.next = current.next;
    }

    // 5. Display the elements of the Linked List
    // Time Complexity: O(n)
    public void printList() {
        if (head == null) {
            System.out.println("List is empty.");
            return;
        }

        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }

    // Main method to demonstrate functionality
    public static void main(String[] args) {
        LinkedList list = new LinkedList();

        System.out.println("--- Inserting Elements ---");
        list.insertAtTail(10);
        list.insertAtTail(20);
        list.insertAtTail(30);
        list.printList(); // Output: 10 -> 20 -> 30 -> null

        System.out.println("\n--- Inserting at Head (40) ---");
        list.insertAtHead(40);
        list.printList(); // Output: 40 -> 10 -> 20 -> 30 -> null

        System.out.println("\n--- Deleting Element 20 ---");
        list.deleteValue(20);
        list.printList(); // Output: 40 -> 10 -> 30 -> null

        System.out.println("\n--- Deleting Head (40) ---");
        list.deleteValue(40);
        list.printList(); // Output: 10 -> 30 -> null
    }
}
