package javascript.questions;

import java.security.Policy;
import java.util.Queue;

class TreeNode {

    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {

    // !700. Search in a Binary Search Tree
    public TreeNode searchBST(TreeNode root, int val) {
        TreeNode current = root;

        while (current != null && current.val != val) {
            if (val < current.val) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return current;
    }

    // !701. Insert into a Binary Search Tree => BFS
    public TreeNode insertIntoBST(TreeNode root, int val) {
        TreeNode newNode = new TreeNode(val, null, null);
        if (root == null)
            return newNode;

        TreeNode current = root;
        TreeNode parent = null;

        while (current != null) {
            parent = current;

            if (val < current.val) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        if (val < parent.val) {
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }

        return root;
    }

    // !98. Validate Binary Search Tree
    int prev = Integer.MIN_VALUE;

    public boolean isValidBST(TreeNode root) {
        if (root == null)
            return true;

        boolean left = isValidBST(root.left);

        if (!left) {
            return false;
        }
        if (root.val <= prev) {
            return false;
        }
        prev = root.val;

        return isValidBST(root.right);
    }

    // !783. Minimum Distance Between BST Nodes
    private int minDiff = Integer.MAX_VALUE;
    private Integer prev2 = null;

    public int minDiffInBST(TreeNode root) {
        inOrder(root);
        return minDiff;
    }

    private void inOrder(TreeNode node) {
        if (node == null)
            return;

        inOrder(node.left);
        if (prev2 != null) {
            minDiff = Math.min(minDiff, node.val - prev2);
        }

        prev2 = node.val;
        inOrder(node.right);
    }

    // !GFG. Sum of k smallest in BST
    private int sum = 0;
    private int count = 0;

    public int kthSum(TreeNode root, int k) {
        count = 0;
        sum = 0;
        inOrderforKth(root, k);
        return sum;

    }

    private void inOrderforKth(TreeNode node, int k) {
        if (node == null || count >= k) {
            return;
        }

        inOrderforKth(node.left, k);

        if (count < k) {
            count++;
            sum += node.val;
        }
        if (count < k) {
            inOrderforKth(node.right, k);
        }
    }

    // !230. Kth Smallest Element in a BST
    // !GFG. Sum of k smallest in BST
    // !GFG. Kth largest element in BST
    int count1 = 0;
    int result = -1;

    public int kthLargest(TreeNode root, int k) {
        count1 = 0;
        result = -1;

        reverseInOrder(root, k);
        return result;
    }

    private void reverseInOrder(TreeNode node, int k) {
        if (node == null || count1 >= k) {
            return;
        }

        reverseInOrder(node.right, k);

        count1++;
        if (count1 == k) {
            result = node.val;
            return;
        }

        reverseInOrder(node.left, k);
    }

    // !Display the BST
    public void displayLevelOrder(TreeNode root) {
        if (root == null) {
            return;
        }
        Queue<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                System.out.print(node.val + " ");
                if (node.left != null) {
                    queue.add(node.left);
                }
                if (node.right != null) {
                    queue.add(node.right);
                }
            }
            System.out.println();
        }
    }
}

public class BSTOperations {

    public static void main(String[] args) {
        Solution solution = new Solution();
        TreeNode root = new TreeNode(4,
                new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null)),
                new TreeNode(7, null, null));

        solution.displayLevelOrder(root);

        TreeNode result = solution.searchBST(root, 2);
        System.out.println("Found: " + (result != null ? result.val : "null"));

        TreeNode newRoot = solution.insertIntoBST(root, 5);
        solution.displayLevelOrder(newRoot);

        System.out.println("98. Validate the BST");
        System.out.println("Is Valid BST: " + solution.isValidBST(newRoot));

        System.out.println("783. Minimum Distance Between BST Nodes");
        System.out.println("Min Diff is: " + solution.minDiffInBST(root));

        System.out.println("GFG. Sum of k smallest in BST");
        Solution solution2 = new Solution();
        int k = 3;
        System.out.println("Sum of " + k + " smallest elements: " + solution2.kthSum(root, k));

        System.out.println("GFG. Kth largest element in BST");
        System.out.println("Kth largest element: " + solution2.kthLargest(root, k));

    }
}
