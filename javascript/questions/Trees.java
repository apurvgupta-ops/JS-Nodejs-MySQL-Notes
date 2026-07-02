package javascript.questions;

public class Trees {

    private static class TreeNode {

        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int val) {
            this.val = val;
        }

        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }

    // !104. Max Depth Binary Tree
    //? Standard approach to find the maximum depth of a binary tree using recursion
    // public int maxDepth(TreeNode root) {
    //     if (root == null) {
    //         return 0;
    //     }
    //     int leftDepth = maxDepth(root.left);
    //     int rightDepth = maxDepth(root.right);
    //     return Math.max(leftDepth, rightDepth) + 1;
    // }
    //? Iterative approach to find the maximum depth of a binary tree using DFS with a stacks
//? Iterative approach to find the maximum depth of a binary tree using BFS with a queue
// !226. Invert Binary Tree
    public static void main(String[] args) {
        Trees tree = new Trees();
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);

        int depth = tree.maxDepth(root);
        System.out.println("Max Depth of the Binary Tree: " + depth); // Output: 3
    }

}
