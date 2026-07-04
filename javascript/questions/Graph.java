package javascript.questions;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;
import java.util.Stack;
import java.util.LinkedList;
import java.util.List;

class GraphEdge {
    int source;
    int destination;
    int weight;

    public GraphEdge(int source, int destination, int weight) {
        this.source = source;
        this.destination = destination;
        this.weight = weight;
    }

    // Getter;
    public int getSrc() {
        return source;
    }

    public int getDest() {
        return destination;
    }

    public int weight() {
        return weight;
    }

    // @Override
    // public String String() {
    // return source + " -> " + destination + " (Weight: " + weight + ")";
    // }
}

// !Adjacency Matrix Implementation
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

// !Adjacency List Implementation
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

// !DFS Graph Iterative Implementation
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

// !DFS Graph Recursive Implementation
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

// !BFS Graph Iterative Implementation
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

// !BFS Graph Recursive Implementation
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

// !Weighted And Directed Graph Implementation
class WeightedDirectedGraph {
    private int vertices;
    private List<List<GraphEdge>> adjList;

    public WeightedDirectedGraph(int vertices) {
        this.vertices = vertices;
        this.adjList = new ArrayList<>(vertices);

        // Initialize an empty array list for each vertex to hold its edge objects

        for (int i = 0; i < vertices; i++) {
            adjList.add(new ArrayList<>());
        }
    }

    // ?Method to add a ONE-WAY Directed Edge
    public void addDirectedEdge(int source, int destination, int weight) {
        GraphEdge edge = new GraphEdge(source, destination, weight);
        adjList.get(source).add(edge);
    }

    // ?Method to add a MUTUAL Undirected Edge
    public void addUnDirectedEdge(int source, int destination, int weight) {
        // Forward edge (src -> dest)
        GraphEdge edge1 = new GraphEdge(source, destination, weight);
        adjList.get(source).add(edge1);
        // Reverse edge (dest -> src)
        GraphEdge edge2 = new GraphEdge(source, destination, weight);
        adjList.get(destination).add(edge2);

    }

    // Utility method to print the complete graph visualization
    public void printGraph() {
        for (int i = 0; i < vertices; i++) {
            System.out.println("Vertex " + i + " connections:");
            for (GraphEdge edge : adjList.get(i)) {
                System.out.println("  " + edge);
            }
        }
    }

}

// !Prim's Algorithm for Minimum Spanning Tree (MST)

class PrimMST {
    public List<GraphEdge> findPrimMST(int vertices, List<List<GraphEdge>> adjList) {
        List<GraphEdge> mstEdges = new ArrayList<>();
        boolean[] visited = new boolean[vertices];
        // Priority Queue sorted in ascending order by edge weight (Greedy Framework)
        PriorityQueue<GraphEdge> pq = new PriorityQueue<>(Comparator.comparingInt(e -> e.weight));

        // Start arbitrarily from vertex 0

        int startvertex = 0;
        visited[startvertex] = true;

        // Push all initial edges from the starting vertex into the Priority Queue
        for (GraphEdge edge : adjList.get(startvertex)) {
            pq.add(edge);
        }

        // Loop until all reachable paths/edges are evaluated
        while (!pq.isEmpty()) {
            GraphEdge currentEdge = pq.poll();
            int destination = currentEdge.destination;
            // If the destination node is already in the MST, skip to avoid cycles
            if (visited[destination]) {
                continue;
            }

            // Secure the edge into the Minimum Spanning Tree
            visited[destination] = true;
            mstEdges.add(currentEdge);

            // Add all edges from the newly covered destination vertex into the priority
            // queue

            for (GraphEdge nextEdge : adjList.get(destination)) {
                if (!visited[nextEdge.destination]) {
                    pq.add(nextEdge);
                }
            }
        }

        return mstEdges;
    }

    public void addEdgeToAdjList(List<List<GraphEdge>> adjList, int source, int destination, int weight) {
        GraphEdge edge = new GraphEdge(source, destination, weight);
        adjList.get(source).add(edge);
    }

    public void printMST(List<GraphEdge> mstEdges) {
        System.out.println("Minimum Spanning Tree edges:");
        for (GraphEdge edge : mstEdges) {
            System.out.println(edge.source + " -> " + edge.destination + " (Weight: " + edge.weight + ")");
        }
    }

}

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
    public static void main12(String[] args) {
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
    public static void main11(String[] args) {
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

    // !Weighted Directed And Undirected Graph
    public static void main1q(String[] args) {
        WeightedDirectedGraph weightedGraph = new WeightedDirectedGraph(5);
        // Adding an Undirected Edge (e.g., between 1 and 2 with weight 4)
        weightedGraph.addUnDirectedEdge(1, 2, 4);

        // Adding a Directed Edge (e.g., from 4 to 2 with weight 7)
        weightedGraph.addDirectedEdge(4, 2, 7);

        // Print representation
        weightedGraph.printGraph();
    }

    // !Prim's Algorithm for Minimum Spanning Tree (MST)
    public static void main(String[] args) {
        int vertices = 5;
        List<List<GraphEdge>> adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) {
            adjList.add(new ArrayList<>());
        }

        PrimMST primMST = new PrimMST();
        primMST.addEdgeToAdjList(adjList, 0, 1, 2);
        primMST.addEdgeToAdjList(adjList, 0, 3, 6);
        primMST.addEdgeToAdjList(adjList, 1, 2, 3);
        primMST.addEdgeToAdjList(adjList, 1, 3, 8);
        primMST.addEdgeToAdjList(adjList, 1, 4, 5);
        primMST.addEdgeToAdjList(adjList, 2, 4, 7);

        List<GraphEdge> mstEdges = primMST.findPrimMST(vertices, adjList);
        primMST.printMST(mstEdges);

    }
}