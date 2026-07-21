package javascript.questions;

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
            if (val < current.val)
                current = current.left;
            else
                current = current.right;
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

    // !Display the BST
    public void displayLevelOrder(TreeNode root) {
        if (root == null)
            return;
        Queue<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                System.out.print(node.val + " ");
                if (node.left != null)
                    queue.add(node.left);
                if (node.right != null)
                    queue.add(node.right);
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
    }
}