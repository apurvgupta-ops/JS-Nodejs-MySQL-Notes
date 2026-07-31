package javascript.questions;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

class TreeNode {

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

class ListNode {

    int val;
    ListNode next;

    ListNode(int val) {
        this.val = val;
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
        if (root == null) {
            return newNode;
        }

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
        if (root == null) {
            return true;
        }

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
        if (node == null) {
            return;
        }

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

    // !108. Convert Sorted Array to Binary Search Tree
    // ?=> this is array based solution
    // public TreeNode sortedArrayToBST(int[] nums) {
    // List<Integer> preOrder = new ArrayList<>();
    // builtPreOrder(0, nums.length - 1);
    // return preOrder;
    // }
    // private void builtPreOrder(int start, int end) {
    // if (start > end) {
    // return;
    // }
    // }
    // ?=> this is making tree based solution
    public TreeNode sortedArrayToBST(int[] nums) {
        if (nums.length == 0 || nums == null) {
            return null;
        }
        return builtPreOrder(nums, 0, nums.length - 1);

    }

    private TreeNode builtPreOrder(int[] nums, int start, int end) {
        if (start > end) {
            return null;
        }

        int mid = start + ((end - start) / 2);

        TreeNode newNode = new TreeNode(nums[mid], null, null);

        newNode.left = builtPreOrder(nums, start, mid - 1);
        newNode.right = builtPreOrder(nums, mid + 1, end);
        return newNode;
    }

// !1008. Construct Binary Search Tree from Preorder Traversal
    private int index = 0;

    public TreeNode bstFromPreorder(int[] preorder) {
        index = 0;
        return constructBST(preorder, Integer.MAX_VALUE);
    }

    private TreeNode constructBST(int[] preorder, int upper) {
        if (index == preorder.length || preorder[index] > upper) {
            return null;
        }

        TreeNode newNode = new TreeNode(preorder[index++]);

        newNode.left = constructBST(preorder, newNode.val);
        newNode.right = constructBST(preorder, upper);

        return newNode;

    }

    // !235. Lowest Common Ancestor BST
    // root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null) {
            return null;
        }

        if (root.val > p.val && root.val > q.val) {
            return lowestCommonAncestor(root.left, p, q);
        } else if (root.val < p.val && root.val < q.val) {
            return lowestCommonAncestor(root.right, p, q);
        } else {
            return root;
        }
    }

    // !GFG. Print BST element in the given range
    List<Integer> results = new ArrayList<>();

    public List<Integer> printInRange(TreeNode root, int low, int high) {
        if (root == null) {
            return results;
        }
        if (root.val > low && root.val > high) {
            return printInRange(root.left, low, high);
        } else if (root.val < low && root.val < high) {
            return printInRange(root.right, low, high);
        } else {
            printInRange(root.left, low, high);
            results.add(root.val);
            printInRange(root.right, low, high);
        }

        return results;
    }

    // !109. Convert Sorted List to Binary Search Tree
    public TreeNode sortedListToBST(ListNode head) {
        if (head == null) {
            return null;
        }

        List<Integer> values = new ArrayList<>();
        while (head != null) {
            values.add(head.val);
            head = head.next;
        }

        return buildBSTFromList(values, 0, values.size() - 1);
    }

    private TreeNode buildBSTFromList(List<Integer> values, int start, int end) {
        if (start > end) {
            return null;
        }

        int mid = start + (end - start) / 2;
        TreeNode node = new TreeNode(values.get(mid));

        node.left = buildBSTFromList(values, start, mid - 1);
        node.right = buildBSTFromList(values, mid + 1, end);

        return node;
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

        System.out.println("108. Convert Sorted Array to Binary Search Tree");
        int[] nums = {-10, -3, 0, 5, 9};
        TreeNode bstRoot = solution2.sortedArrayToBST(nums);
        solution2.displayLevelOrder(bstRoot);

        System.out.println("1008. Construct Binary Search Tree from Preorder Traversal");
        int[] preorder = {8, 5, 1, 7, 10, 12};
        TreeNode bstFromPreorder = solution2.bstFromPreorder(preorder);
        solution2.displayLevelOrder(bstFromPreorder);

        System.err.println("235. Lowest Common Ancestor BST");
        TreeNode p = new TreeNode(5);
        TreeNode q = new TreeNode(1);
        TreeNode lca = solution2.lowestCommonAncestor(bstFromPreorder, p, q);
        System.out.println("LCA of " + p.val + " and " + q.val + " is: " + (lca != null ? lca.val : "null"));

        System.out.println("GFG. Print BST element in the given range");
        int low = 5;
        int high = 10;
        List<Integer> elementsInRange = solution2.printInRange(bstFromPreorder, low, high);
        System.out.println("Elements in range [" + low + ", " + high + "]: " + elementsInRange);

        System.out.println("109. Convert Sorted List to Binary Search Tree");
        ListNode head = new ListNode(-10);
        head.next = new ListNode(-3);
        head.next.next = new ListNode(0);
        head.next.next.next = new ListNode(5);
        head.next.next.next.next = new ListNode(9);
        TreeNode bstFromList = solution2.sortedListToBST(head);
        solution2.displayLevelOrder(bstFromList);

    }
}
