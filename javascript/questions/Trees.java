package javascript.questions;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import LLDDesigns.OnlineFoodOrderingSystem.models.Order;

public class Trees {

    private static class TreeNode {

        int val;
        TreeNode left;
        TreeNode right;
        TreeNode next;

        TreeNode(int val) {
            this.val = val;
        }

        TreeNode(int val, TreeNode left, TreeNode right, TreeNode next) {
            this.val = val;
            this.left = left;
            this.right = right;
            this.next = next;
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
        if (root == null) {
            return false;
        }

        if (root.left == null && root.right == null) {
            return targetSum == root.val;
        }

        boolean leftSum = hasPathSum(root.left, targetSum - root.val);
        boolean rightSum = hasPathSum(root.right, targetSum - root.val);

        return leftSum || rightSum;
    }

    // !100. Same Tree
    public boolean isSameTree(TreeNode p, TreeNode q) {

        if (p == null && q == null) {
            return true;
        }

        if (p == null || q == null) {
            return false;
        }

        if ((p.val != q.val)) {
            return false;
        }

        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
    // root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
    // Output: [[5,4,11,2],[5,8,4,5]]

    // !113. Path Sum II
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();

        findPathSum(root, targetSum, current, result);

        return result;

    }

    public void findPathSum(TreeNode root, int targetSum, List<Integer> current, List<List<Integer>> result) {
        if (root == null) {
            return;

        }
        current.add(root.val);
        if (root.left == null && root.right == null && root.val == targetSum) {
            result.add(new ArrayList<>(current));
        } else {
            findPathSum(root.left, targetSum - root.val, current, result);
            findPathSum(root.right, targetSum - root.val, current, result);
        }
        current.remove(current.size() - 1);
    }

    // !437. Path Sum III
    public int pathSum3(TreeNode root, int targetSum) {
        HashMap<Long, Integer> prefixSum = new HashMap<>();

        prefixSum.put(0L, 1);

        return dfs(root, 0L, targetSum, prefixSum);
    }

    public int dfs(TreeNode node, Long currSum, int targetSum, HashMap<Long, Integer> prefixSum) {
        if (node == null) {
            return 0;
        }

        currSum += node.val;

        int count = prefixSum.getOrDefault(currSum - targetSum, 0);
        prefixSum.put(currSum, prefixSum.getOrDefault(currSum, 0) + 1);
        count += dfs(node.left, currSum, targetSum, prefixSum);
        count += dfs(node.right, currSum, targetSum, prefixSum);

        prefixSum.put(currSum, prefixSum.get(currSum) - 1);

        return count;

    }

    // !543. Diameter of Tree
    public int maxDiameter = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        calculateHeight(root);
        return maxDiameter;
    }

    private int calculateHeight(TreeNode node) {
        if (node == null) {
            return 0;
        }

        int leftHeight = calculateHeight(node.left);
        int rightHeight = calculateHeight(node.right);

        // Update global max diameter tracker
        maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight);

        // Return height of current node to its caller frame
        return 1 + Math.max(leftHeight, rightHeight);
    }

    // !236. LCA of BST
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        if (left != null && right != null) {
            return root;
        }

        return left != null ? left : right;
    }

    // !110 Balanced Binary Tree
    public boolean isBalanced(TreeNode root) {
        if (root == null) {
            return true;
        }
        int leftHeight = calculateHeight(root.left);
        int rightHeight = calculateHeight(root.right);
        return Math.abs(leftHeight - rightHeight) <= 1 && isBalanced(root.left) && isBalanced(root.right);
    }

    // !102 Binary Tree Level Order Traversal
    public List<List<Integer>> LevelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) {
            return result;
        }

        Queue<TreeNode> queue = new LinkedList<>();

        queue.add(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            List<Integer> currentList = new ArrayList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();
                currentList.add(currentNode.val);

                if (currentNode.left != null) {
                    queue.add(currentNode.left);
                }
                if (currentNode.right != null) {
                    queue.add(currentNode.right);
                }
            }

            result.add(currentList);
        }
        return result;
    }

    // !111. Minimum Depth of Binary Tree => BSF
    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);

        int minDepth = 1;

        while (!queue.isEmpty()) {
            int level = queue.size();

            for (int i = 0; i < level; i++) {
                TreeNode currentNode = queue.poll();

                if (currentNode.left == null && currentNode.right == null) {
                    return minDepth;
                }

                if (currentNode.left != null) {
                    queue.add(currentNode.left);
                }

                if (currentNode.right != null) {
                    queue.add(currentNode.right);
                }

            }
            minDepth++;
        }
        return minDepth;
    }

    // !111. Minimum Depth of Binary Tree => DSF => [1,2,3,4,5]
    public int minDepthDfs(TreeNode root) {
        if (root == null) {
            return 0;
        }

        if (root.left == null) {
            System.out.println("Left child is null, going right"); // Debugging line to check if left child is null
            return 1 + minDepthDfs(root.right);
        }

        if (root.right == null) {
            System.out.println("Right child is null, going left"); // Debugging line to check if right child is null
            return 1 + minDepthDfs(root.left);
        }

        int leftDepth = minDepthDfs(root.left);
        System.out.println("Left Depth: " + leftDepth); // Debugging line to check the left depth
        int rightDepth = minDepthDfs(root.right);

        System.out.println("Right Depth: " + rightDepth); // Debugging line to check the right depth
        return 1 + Math.min(leftDepth, rightDepth);
    }

    // !637. Average of Levels in Binary Tree
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> result = new ArrayList<>();
        if (root == null) {
            return result;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        System.out.println("Queue: " + queue); // Debugging line to check the queue contents

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            double sum = 0;
            System.out.println("Level Size: " + levelSize); // Debugging line to check the level size
            System.out.println("Current Queue: " + queue); // Debugging line to check the current queue before
                                                           // processing the level

            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();
                System.out.println("Current Node: " + currentNode + " Value: " + currentNode.val); // Debugging line to
                                                                                                   // check the
                // current node
                // being
                // processed
                sum += currentNode.val;
                System.out.println("Current Sum: " + sum); // Debugging line to check the current sum

                if (currentNode.left != null) {
                    queue.add(currentNode.left);
                    System.out.println("Added to Queue: " + currentNode.left.val); // Debugging line
                }
                if (currentNode.right != null) {
                    queue.add(currentNode.right);
                    System.out.println("Added to Queue: " + currentNode.right.val); // Debugging line
                }
            }

            double average = sum / levelSize;
            System.out.println("Average of Level: " + average); // Debugging line to check the average of the level
            result.add(average);
        }

        return result;
    }

    // !103. Binary Tree Zigzag Level Order Traversal
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) {
            return result;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int level = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            // Use LinkedList here to enable O(1) insertion at both ends
            LinkedList<Integer> currentList = new LinkedList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();

                if (level % 2 == 0) {
                    currentList.addLast(currentNode.val);
                } else {
                    currentList.addFirst(currentNode.val);
                }
                if (currentNode.left != null) {
                    queue.add(currentNode.left);
                }
                if (currentNode.right != null) {
                    queue.add(currentNode.right);
                }

            }
            result.add(currentList);
            level++;
        }
        return result;
    }

    // !199. Binary Tree Right Side View
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null)
            return res;

        Queue<TreeNode> queue = new LinkedList<>();

        queue.offer(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();
                if (i == levelSize - 1) {
                    res.add(currentNode.val);
                }

                if (currentNode.left != null) {
                    queue.offer(currentNode.left);
                }

                if (currentNode.right != null) {
                    queue.offer(currentNode.right);
                }
            }
        }
        return res;

    }

    // !116. Populating Next Right Pointers in Each Node
    public TreeNode connect(TreeNode root) {
        if (root == null)
            return null;

        Queue<TreeNode> queue = new LinkedList<>();

        queue.add(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();

                if (i < levelSize - 1) {
                    currentNode.next = queue.peek();
                }

                if (currentNode.left != null) {
                    queue.add(currentNode.left);
                }
                if (currentNode.right != null) {
                    queue.add(currentNode.right);
                }

            }
        }
        return root;
    }

    // !515. Find Largest Value in Each Tree Row
    public List<Integer> largestValues(TreeNode root) {
        List<Integer> res = new ArrayList<>();

        if (root == null)
            return res;

        Queue<TreeNode> queue = new LinkedList<>();

        queue.add(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            int max = Integer.MIN_VALUE;
            for (int i = 0; i < levelSize; i++) {
                TreeNode currNode = queue.poll();

                if (max < currNode.val) {
                    max = currNode.val;
                }

                if (currNode.left != null)
                    queue.add(currNode.left);
                if (currNode.right != null)
                    queue.add(currNode.right);
            }

            res.add(max);
        }
        return res;
    }

    // !1161. Maximum Level Sum of a Binary Tree
    public int maxLevelSum(TreeNode root) {
        if (root == null)
            return 0;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int maxSum = Integer.MIN_VALUE;
        int levelWithMaxSum = 1;
        int currentLevel = 1;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            int currentLevelSum = 0;

            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();
                currentLevelSum += currentNode.val;

                if (currentNode.left != null) {
                    queue.add(currentNode.left);
                }
                if (currentNode.right != null) {
                    queue.add(currentNode.right);
                }
            }

            if (currentLevelSum > maxSum) {
                maxSum = currentLevelSum;
                levelWithMaxSum = currentLevel;
            }

            currentLevel++;
        }

        return levelWithMaxSum;
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
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        root.right.left = new TreeNode(6);
        root.right.right = new TreeNode(7);

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

        // System.out.println("is Same Tree Problem: ");
        // System.out.println(tree.isSameTree(root, root2));

        // System.out.println("Path Sum II Problem: ");
        // List<List<Integer>> paths = tree.pathSum(root, 4);
        // System.out.println("Paths with target sum: " + paths); // Output:

        // System.out.println("Path Sum III Problem: ");
        // System.out.println("Number of paths with target sum: " + tree.pathSum3(root,
        // 7)); // Output: 2

        // System.out.println("Diameter of Binary Tree Problem: ");
        // System.out.println("Diameter of Binary Tree: " +
        // tree.diameterOfBinaryTree(root)); // Output: 2

        // System.out.println("Lowest Common Ancestor Problem: ");
        // TreeNode lca = tree.lowestCommonAncestor(root, root.left, root.right);
        // System.out.println("Lowest Common Ancestor: " + (lca != null ? lca.val :
        // "null")); // Output: 1

        // System.out.println("Balanced Binary Tree Problem: ");
        // System.out.println("Is Balanced Binary Tree: " + tree.isBalanced(root)); //
        // Output: true

        // System.out.println("Level Order Traversal Problem: ");
        // List<List<Integer>> levelOrder = tree.LevelOrder(root);
        // System.out.println("Level Order Traversal: " + levelOrder); // Output: [[1],
        // [2, 3]]

        // System.out.println("Minimum Depth of Binary Tree Problem: ");
        // System.out.println("Minimum Depth of Binary Tree: " + tree.minDepth(root));
        // // Output: 2
        // System.out.println("Minimum Depth of Binary Tree (DFS): " +
        // tree.minDepthDfs(root)); // Output: 2

        // System.out.println("Average of Levels in Binary Tree Problem: ");
        // List<Double> averages = tree.averageOfLevels(root);
        // System.out.println("Average of Levels in Binary Tree: " + averages); //
        // Output: [1.0, 2.5]

        // System.out.println("Zigzag Level Order Traversal Problem: ");
        // List<List<Integer>> zigzagOrder = tree.zigzagLevelOrder(root);
        // System.out.println("Zigzag Level Order Traversal: " + zigzagOrder); //
        // Output: [[1], [3, 2]]

        System.out.println(" Binary Tree Right Side View Problem: ");
        List<Integer> rightSideView = tree.rightSideView(root);
        System.out.println("Binary Tree Right Side View Problem: " + rightSideView);

        System.out.println("Populating Next Right Pointers in Each Node Problem: ");
        TreeNode connectedRoot = tree.connect(root);
        System.out.println("Populating Next Right Pointers in Each Node Problem: ");
        tree.display(connectedRoot);

        System.out.println("Find Largest Value in Each Tree Row Problem: ");
        List<Integer> largestValues = tree.largestValues(root);
        System.out.println("Largest Values in Each Tree Row: " + largestValues);
    }

}
