
package javascript.questions;

import java.util.LinkedList;

public class LinkedListWithCollectionFramework {
    public static void main(String[] args) {
        // Create a LinkedList using Java's Collection Framework
        LinkedList<Integer> list = new LinkedList<>();

        // Insert elements at the end (Tail) of the list
        list.add(10); // List: 10
        list.add(20); // List: 10 -> 20
        list.add(30); // List: 10 -> 20 -> 30

        // Insert an element at the beginning (Head) of the list
        list.addFirst(5); // List: 5 -> 10 -> 20 -> 30

        // Display the elements of the Linked List
        System.out.println("Linked List: " + list); // Output: [5, 10, 20, 30]

        // Delete the first occurrence of a specific value (e.g., 20)
        list.remove(Integer.valueOf(20)); // List: 5 -> 10 -> 30

        System.out.println("\nAfter deleting value 20:");
        System.out.println("Linked List: " + list); // Output: [5, 10, 30]
    }
}
