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
    // ? Standard approach to find the maximum depth of a binary tree using
    // recursion
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);

        return Math.max(leftDepth, rightDepth) + 1;
    }

    // ! Iterative approach to find the maximum depth of a binary tree using DFS
    // with a stacks
    // ! Iterative approach to find the maximum depth of a binary tree using BFS
    // with a queue
    // !226. Invert Binary Tree
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;

        invertTree(root.left);
        invertTree(root.right);

        return root;
    }

    // !112. Path Sum
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null)
            return false;

        if (root.left == null && root.right == null) {
            return targetSum == root.val;
        }

        boolean leftSum = hasPathSum(root.left, targetSum - root.val);
        boolean rightSum = hasPathSum(root.right, targetSum - root.val);
        return leftSum || rightSum;
    }

    // !100. Same Tree
    public boolean isSameTree(TreeNode p, TreeNode q) {

        if (p == null && q == null)
            return true;

        if (p == null || q == null)
            return false;

        if ((p.val != q.val)) {
            return false;
        }
        System.out.println(isSameTree(p.left, q.left));

        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }

    // !Display funtion to print the tree in a structured format
    public void display(TreeNode root) {
        if (root == null) {
            return;
        }
        System.out.print(root.val + " ");
        display(root.left);
        display(root.right);
    }

    public static void main(String[] args) {
        Trees tree = new Trees();
        // Trees tree2 = new Trees();
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        // root.left.left = new TreeNode(4);
        // root.left.right = new TreeNode(5);

        TreeNode root2 = new TreeNode(1);
        root2.left = new TreeNode(2);
        root2.right = new TreeNode(4);

        // System.out.println("Max Depth of the Binary Tree: "); // Output: 3
        // int depth = tree.maxDepth(root);
        // System.out.println("Max Depth of the Binary Tree: " + depth); // Output: 3

        // System.out.println("Inverted Binary Tree: ");
        // TreeNode invertedRoot = tree.invertTree(root);
        // tree.display(invertedRoot); // Output: 1 3 2 5 4

        // System.out.println("Path Sum Problem: ");
        // System.out.println("\nPath Sum (targetSum = 22): " + tree.hasPathSum(root,
        // 22)); // Output: false
        // System.out.println("\nPath Sum (targetSum = 7): " + tree.hasPathSum(root,
        // 7)); // Output: true

        System.out.println("is Same Tree Problem: ");
        System.out.println(tree.isSameTree(root, root2));
    }

}
