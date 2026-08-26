package javascript.questions;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

class TopoSolution {

    // !207. Course Schedule => numCourses = 2, prerequisites = [[1,0]]
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // ? Making Adj List for directed Graph
        List<List<Integer>> adj = new ArrayList();
        for (int i = 0; i < numCourses; i++) {
            adj.add(new ArrayList<>());
        }

        for (int[] req : prerequisites) {
            adj.get(req[1]).add(req[0]);
        }

        boolean[] visited = new boolean[numCourses];
        boolean[] pathVisited = new boolean[numCourses];

        for (int i = 0; i < numCourses; i++) {
            if (!visited[i]) {
                if (DFSCheckCycle(i, adj, visited, pathVisited)) {
                    return false;
                }
            }
        }

        return true;

    }

    private boolean DFSCheckCycle(int node, List<List<Integer>> adj, boolean[] visited, boolean[] pathVisited) {
        visited[node] = true;
        pathVisited[node] = true;

        for (int neighbour : adj.get(node)) {
            if (!visited[neighbour]) {
                if (DFSCheckCycle(neighbour, adj, visited, pathVisited)) {
                    return true;
                }
            } else if (pathVisited[neighbour]) {
                return true; // Back-edge / Cycle found
            }
        }
        pathVisited[node] = false;
        return false;
    }

    // !210. Course Schedule II =>  numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            adj.add(new ArrayList<>());
        }
        for (int[] pre : prerequisites) {
            adj.get(pre[1]).add(pre[0]);
        }

        boolean[] visited = new boolean[numCourses];
        boolean[] pathVisited = new boolean[numCourses];
        Stack<Integer> stack = new Stack<>();

        for (int i = 0; i < numCourses; i++) {
            if (!visited[i]) {
                if (dfs(i, adj, visited, pathVisited, stack)) {
                    return new int[0]; // cycle -> impossible, per LeetCode contract
                }
            }
        }

        int[] res = new int[numCourses];
        int index = 0;
        while (!stack.isEmpty()) {
            res[index++] = stack.pop();
        }
        return res;
    }

    // returns true if a cycle is detected
    private boolean dfs(int node, List<List<Integer>> adj, boolean[] visited,
            boolean[] pathVisited, Stack<Integer> stack) {
        visited[node] = true;
        pathVisited[node] = true;

        for (int neighbour : adj.get(node)) {
            if (pathVisited[neighbour]) {
                return true; // back edge -> cycle

            }
            if (!visited[neighbour]) {
                if (dfs(neighbour, adj, visited, pathVisited, stack)) {
                    return true;
                }
            }
        }

        pathVisited[node] = false; // backtrack: leaving this path
        stack.add(node);
        return false;

    }

}

public class TopoSortQues {

    public static void main(String[] args) {
        TopoSolution solution = new TopoSolution();
        int numCourses = 2;
        int[][] prerequisites = {{1, 0}};
        boolean canFinish = solution.canFinish(numCourses, prerequisites);
        System.out.println("Can finish courses: " + canFinish);

        System.out.println("Course order for completion:");
        int numCourses2 = 4;
        int[][] prerequisites2 = {{1, 0}, {2, 0}, {3, 1}, {3, 2}};
        int[] order = solution.findOrder(numCourses2, prerequisites2);
        for (int course : order) {
            System.out.print(course + " ");
        }
    }
}
