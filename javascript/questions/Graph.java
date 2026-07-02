package javascript.questions;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Stack;
import java.util.LinkedList;
import java.util.List;

class AdjacencyMatrix {

    private int[][] adjacencyMatrix;
    private int numVertex;

    // Inilizing the graph with the fixed number of vertexies.
    public AdjacencyMatrix(int numVertex) {
        this.numVertex = numVertex;

        // Create the square matrix with 0;
        this.adjacencyMatrix = new int[numVertex][numVertex];
    }

    // ? Adding Edges;
    public void addEdge(int source, int destination) {
        // Mark both cell mappings because the path goes both ways
        adjacencyMatrix[source][destination] = 1;
        adjacencyMatrix[destination][source] = 1;
    }

    // ? Remove Edges;
    public void removeEdge(int source, int destination) {
        // Reset cell values back to 0
        adjacencyMatrix[source][destination] = 0;
        adjacencyMatrix[destination][source] = 0;
    }

    // ? Adding a Vertex dynamically [00:11:07]
    // ! Since arrays are static in Java, we must allocate a larger matrix and copy
    // elements
    public void addVertex() {
        int newNumVertex = numVertex + 1;
        int[][] newMatrix = new int[newNumVertex][newNumVertex];

        // Copy elements from the old matrix to the new matrix
        for (int i = 0; i < numVertex; i++) {
            for (int j = 0; j < numVertex; j++) {
                newMatrix[i][j] = adjacencyMatrix[i][j];
            }
        }

        this.adjacencyMatrix = newMatrix;
        this.numVertex = newNumVertex;
    }

    // ? Removing a Vertex dynamically
    // ! Requires allocating a smaller matrix and skipping the target row and column
    public void removeVertex(int vertexToRemove) {
        if (vertexToRemove >= numVertex || vertexToRemove <= 0) {
            System.out.println("Vertex not found");
        }
        int newNumVertex = numVertex - 1;
        int[][] newMatrix = new int[newNumVertex][newNumVertex];

        int newRow = 0;
        for (int i = 0; i < numVertex; i++) {
            if (i == vertexToRemove) {
                continue;
            }
            int newCol = 0;
            for (int j = 0; j < numVertex; j++) {
                if (j == vertexToRemove) {
                    continue;
                }
            }

            newMatrix[newRow][newCol] = adjacencyMatrix[i][j];
            newCol++;
        }
        newRow++;

        this.adjacencyMatrix = newMatrix;
        this.numVertex = newNumVertex;
    }

    // ? Displaying the Adjacency Matrix
    public void display() {
        for (int i = 0; i < numVertex; i++) {
            for (int j = 0; j < numVertex; j++) {
                System.out.print(adjacencyMatrix[i][j] + " ");
            }
            System.out.println();
        }
    }
}

class AdjacencyList {

    private Map<Integer, LinkedList<Integer>> adjacencyList;

    public AdjacencyList() {
        this.adjacencyList = new HashMap<>();
    }

    // ! Adding a vertex to the graph
    public void addVertex(int vertex) {
        adjacencyList.put(vertex, new LinkedList<>());
    }

    // ! Adding edges to the graph
    public void addEdges(int source, int destination) {
        // ?Ensure both vertices exist in our map
        addVertex(source);
        addVertex(destination);

        // ?Add edge from source to destination
        adjacencyList.get(source).add(destination);
        adjacencyList.get(destination).add(source);
    }

    // ! Removing edges from the graph
    public void removeEdges(int source, int destination) {
        if (adjacencyList.containsKey((source))) {
            adjacencyList.get(source).remove((Integer) destination);
        }
        if (adjacencyList.containsKey(destination)) {
            adjacencyList.get(destination).remove((Integer) source);
        }
    }

    // ! Removing a vertex from the graph
    public void removeVertex(int vertex) {
        // ?Remove the vertex's own row/list from the map
        adjacencyList.remove(vertex);

        // ?Iterate through all remaining lists and remove references to this vertex
        for (Integer key : adjacencyList.keySet()) {
            adjacencyList.get(key).remove((Integer) vertex);
        }
    }

    // public void printGraph() {
    // for (Map.Entry<Integer, LinkedList<Integer>> entry :
    // adjacencyList.entrySet()) {
    // System.out.println("Vertex " + entry.getKey() + " is connected to: " +
    // entry.getValue());
    // }
    // }
    // ! Displaying the Adjacency List
    public void printGraph() {
        for (Map.Entry<Integer, LinkedList<Integer>> entry : adjacencyList.entrySet()) {
            System.out.print(entry.getKey() + " -> ");
            for (Integer neighbor : entry.getValue()) {
                System.out.print(neighbor + " ");
            }
            System.out.println();
        }
    }
}

class DFSGraphIterative {

    private Map<Integer, List<Integer>> adjList;

    public DFSGraphIterative() {
        this.adjList = new HashMap<>();
    }

    public void addEdgesAndVertexs(int source, int destination) {
        // ?Adding Vertex
        adjList.putIfAbsent(source, new ArrayList<>());
        adjList.putIfAbsent(destination, new ArrayList<>());

        // ?Adding Edges
        adjList.get(source).add(destination);
        adjList.get(destination).add(source);
    }

    // !Iterative Approach
    public void DFSIterative(int rootVertex) {
        Set<Integer> visited = new HashSet<>();
        Stack<Integer> stack = new Stack<>();

        // ?Initialize by pushing the starting vertex
        stack.push(rootVertex);

        while (!stack.isEmpty()) {
            int currentElement = stack.pop();

            if (!visited.contains(currentElement)) {
                // !PRINT the element here as it's being traversed
                System.out.print(currentElement + " ");
                visited.add(currentElement);

                // Add all unvisited neighbors to the stack
                List<Integer> unVisitedNodes = adjList.getOrDefault(currentElement, new ArrayList<>());
                System.out.println("Unvisited Nodes for " + currentElement + ": " + unVisitedNodes);
                for (int unVisited : unVisitedNodes) {
                    if (!visited.contains(unVisited)) {
                        stack.push(unVisited);
                    }
                }
            }

        }
        System.out.println();

    }

}

class DFSGraphRecursive {

    private Map<Integer, List<Integer>> adjList;

    public DFSGraphRecursive() {
        this.adjList = new HashMap<>();
    }

    public void addEdgesAndVertexs(int source, int destination) {
        // ?Adding Vertex
        adjList.putIfAbsent(source, new ArrayList<>());
        adjList.putIfAbsent(destination, new ArrayList<>());

        // ?Adding Edges
        adjList.get(source).add(destination);
        adjList.get(destination).add(source);
    }

    // !Recursive Approach
    public void DFSRecursive(int rootVertex) {
        Set<Integer> visited = new HashSet<>();
        DFSUtil(rootVertex, visited);
        System.out.println();
    }

    private void DFSUtil(int currentVertex, Set<Integer> visited) {
        // Mark the current vertex as visited and print it
        visited.add(currentVertex);
        System.out.print(currentVertex + " ");

        // Recur for all the vertices adjacent to this vertex
        for (int neighbor : adjList.getOrDefault(currentVertex, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                DFSUtil(neighbor, visited);
            }
        }
    }
}

class BFSGraphIterative {

    private Map<Integer, List<Integer>> adjList;

    public BFSGraphIterative() {
        this.adjList = new HashMap<>();
    }

    public void addEdgesAndVertexs(int source, int destination) {
        // ?Adding Vertex
        adjList.putIfAbsent(source, new ArrayList<>());
        adjList.putIfAbsent(destination, new ArrayList<>());

        // ?Adding Edges
        adjList.get(source).add(destination);
        adjList.get(destination).add(source);
    }

    // !BFS Implementation
    public void BFS(int rootVertex) {
        Set<Integer> visited = new HashSet<>();
        LinkedList<Integer> queue = new LinkedList<>();

        // ?Initialize by adding the starting vertex to the queue
        queue.add(rootVertex);
        visited.add(rootVertex);

        while (!queue.isEmpty()) {
            int currentElement = queue.poll(); // Dequeue the front element
            System.out.print(currentElement + " ");

            // Add all unvisited neighbors to the queue
            for (int neighbor : adjList.getOrDefault(currentElement, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        System.out.println();
    }
}

class BFSGraphRecursive {

    private Map<Integer, List<Integer>> adjList;

    public BFSGraphRecursive() {
        this.adjList = new HashMap<>();
    }

    public void addEdgesAndVertexs(int source, int destination) {
        // ?Adding Vertex
        adjList.putIfAbsent(source, new ArrayList<>());
        adjList.putIfAbsent(destination, new ArrayList<>());

        // ?Adding Edges
        adjList.get(source).add(destination);
        adjList.get(destination).add(source);
    }

    // !BFS Implementation
    public void BFS(int rootVertex) {
        Set<Integer> visited = new HashSet<>();
        LinkedList<Integer> queue = new LinkedList<>();

        // ?Initialize by adding the starting vertex to the queue
        queue.add(rootVertex);
        visited.add(rootVertex);

        BFSUtil(queue, visited);
    }

    private void BFSUtil(LinkedList<Integer> queue, Set<Integer> visited) {
        if (queue.isEmpty()) {
            return;
        }

        int currentElement = queue.poll(); // Dequeue the front element
        System.out.print(currentElement + " ");

        // Add all unvisited neighbors to the queue
        for (int neighbor : adjList.getOrDefault(currentElement, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
        // Recursive call for the next element in the queue
        BFSUtil(queue, visited);
    }

}

// Graphs via Adjacency Matrix
public class Graph {

    // !Ajacency Matrix Implementation
    public static void main2(String[] args) {
        AdjacencyMatrix graphs = new AdjacencyMatrix(4);
        // Adding edges to the graph
        System.out.println("Adding edges to the graph:");
        graphs.addEdge(0, 1);
        graphs.addEdge(0, 2);
        graphs.addEdge(1, 2);
        graphs.addEdge(2, 3);
        graphs.display();

        // Adding a vertex to the graph
        System.out.println("\nAdding a vertex to the graph:");
        graphs.addVertex();
        // graphs.display();

        graphs.addEdge(4, 2);

        // Removing an edge from the graph
        System.out.println("\nRemoving an edge from the graph:");
        graphs.removeEdge(0, 1);
        graphs.display();
    }

    // !Adjacency List Implementation
    public static void main1(String[] args) {
        AdjacencyList graph = new AdjacencyList();

        // Adding edges to the graph
        System.out.println("Adding edges to the graph: Adjacency List");
        graph.addEdges(0, 1);
        graph.addEdges(0, 2);
        graph.addEdges(1, 2);
        graph.addEdges(2, 3);
        graph.printGraph();

        // Removing an edge from the graph
        System.out.println("\nRemoving an edge from the graph: Adjacency List");
        graph.removeEdges(0, 1);
        graph.printGraph();

        // Removing a vertex from the graph
        System.out.println("\nRemoving a vertex from the graph: Adjacency List");
        graph.removeVertex(2);
        graph.printGraph();
    }

    // !DFS Graph Iterative Implementation
    public static void main(String[] args) {
        DFSGraphIterative graph = new DFSGraphIterative();

        // Adding edges and vertices to the graph
        System.out.println("Adding edges and vertices to the graph: DFS Graph");
        graph.addEdgesAndVertexs(0, 1);
        graph.addEdgesAndVertexs(0, 2);
        graph.addEdgesAndVertexs(1, 2);
        graph.addEdgesAndVertexs(2, 3);

        // Performing DFS traversal starting from vertex 0
        System.out.println("\nDFS Traversal starting from vertex 0:");
        graph.DFSIterative(0);

    }

    // !DFS Graph Recursive Implementation
    public static void mainw(String[] args) {
        DFSGraphRecursive graph = new DFSGraphRecursive();

        // Adding edges and vertices to the graph
        System.out.println("Adding edges and vertices to the graph: DFS Graph Recursive");
        graph.addEdgesAndVertexs(0, 1);
        graph.addEdgesAndVertexs(0, 2);
        graph.addEdgesAndVertexs(1, 2);
        graph.addEdgesAndVertexs(2, 3);

        // Performing DFS traversal starting from vertex 0
        System.out.println("\nDFS Traversal starting from vertex 0:");
        graph.DFSRecursive(0);

    }

    // !BFS Graph Iterative Implementation
    public static void main5(String[] args) {
        BFSGraphIterative graph = new BFSGraphIterative();

        // Adding edges and vertices to the graph
        System.out.println("Adding edges and vertices to the graph: BFS Graph");
        graph.addEdgesAndVertexs(0, 1);
        graph.addEdgesAndVertexs(0, 2);
        graph.addEdgesAndVertexs(1, 2);
        graph.addEdgesAndVertexs(2, 3);

        // Performing BFS traversal starting from vertex 0
        System.out.println("\nBFS Traversal starting from vertex 0:");
        graph.BFS(0);

    }

    // !BFS Graph Recursive Implementation
    public static void main6(String[] args) {
        BFSGraphRecursive graph = new BFSGraphRecursive();

        // Adding edges and vertices to the graph
        System.out.println("Adding edges and vertices to the graph: BFS Graph Recursive");
        graph.addEdgesAndVertexs(0, 1);
        graph.addEdgesAndVertexs(0, 2);
        graph.addEdgesAndVertexs(1, 2);
        graph.addEdgesAndVertexs(2, 3);

        // Performing BFS traversal starting from vertex 0
        System.out.println("\nBFS Traversal starting from vertex 0:");
        graph.BFS(0);

    }
}
