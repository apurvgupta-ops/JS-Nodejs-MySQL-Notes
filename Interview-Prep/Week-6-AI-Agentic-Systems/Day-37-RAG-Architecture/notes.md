# Day 37: RAG Architecture

## 📚 Table of Contents
1. What is RAG?
2. RAG vs Fine-tuning
3. RAG Pipeline Components
4. Document Chunking Strategies
5. Generating Embeddings
6. Vector Similarity Search
7. Context Injection
8. Complete RAG Implementation

---

## 1. What is RAG?

**RAG (Retrieval-Augmented Generation)** combines information retrieval with LLM generation to provide accurate, up-to-date responses with sources.

### The Problem

**Without RAG:**
```
User: "What's our company's vacation policy?"
LLM: "I don't have access to your company's specific policies..."
```

**With RAG:**
```
User: "What's our company's vacation policy?"
  ↓
1. Convert question to embedding
2. Search company documents
3. Find: "Employees get 20 days PTO..."
4. Inject context into LLM prompt
  ↓
LLM: "According to your company policy, employees receive 20 days of PTO..."
```

### Benefits

✅ **Up-to-date information** - No retraining needed  
✅ **Source attribution** - "According to document X..."  
✅ **Domain-specific** - Works with your private data  
✅ **Cost-effective** - No expensive fine-tuning  
✅ **Transparent** - See what documents were used  

---

## 2. RAG vs Fine-tuning

| Aspect             | RAG                  | Fine-tuning            |
| ------------------ | -------------------- | ---------------------- |
| **Data freshness** | Real-time updates    | Static (training data) |
| **Cost**           | Low (API calls)      | High (GPU training)    |
| **Setup time**     | Minutes              | Hours/days             |
| **Use case**       | Q&A, search, support | Style, tone, behavior  |
| **Transparency**   | High (see sources)   | Low (black box)        |
| **Accuracy**       | Depends on retrieval | Depends on training    |

**Use RAG when:**
- Need current information
- Have changing data (docs, policies, products)
- Want source citations
- Limited budget

**Use Fine-tuning when:**
- Need specific writing style
- Have consistent behavior patterns
- Can afford retraining
- Don't need sources

---

## 3. RAG Pipeline Components

### Complete RAG Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. INDEXING (One-time setup)                            │
├─────────────────────────────────────────────────────────┤
│ Documents → Chunking → Embeddings → Vector DB          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 2. RETRIEVAL (Per query)                                │
├─────────────────────────────────────────────────────────┤
│ User Query → Embedding → Similarity Search → Top K docs│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 3. GENERATION (Per query)                               │
├─────────────────────────────────────────────────────────┤
│ Query + Retrieved Docs → LLM → Response with sources   │
└─────────────────────────────────────────────────────────┘
```

### Components

**1. Document Loader**
- Load PDFs, text files, websites
- Extract clean text

**2. Text Splitter**
- Chunk documents into smaller pieces
- Maintain context boundaries

**3. Embedding Model**
- Convert text to vectors
- OpenAI text-embedding-3-large

**4. Vector Database**
- Store embeddings
- Fast similarity search
- Pinecone, Qdrant, Weaviate

**5. Retriever**
- Query vector DB
- Get top K most relevant chunks

**6. LLM**
- Generate response
- Use retrieved context

---

## 4. Document Chunking Strategies

### Why Chunk?

- **Embedding limits** - Models have max token limits (8192 tokens)
- **Relevance** - Smaller chunks = better matching
- **Context window** - LLMs have context limits

### Strategy 1: Fixed Size

```typescript
function fixedSizeChunking(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap; // Overlap for context
  }

  return chunks;
}

// Usage
const text = "Long document...";
const chunks = fixedSizeChunking(text, 500, 50);
console.log(`Created ${chunks.length} chunks`);
```

**Pros:** Simple, consistent size  
**Cons:** May split sentences/paragraphs

### Strategy 2: Sentence-based

```typescript
function sentenceChunking(text: string, maxChunkSize: number = 500): string[] {
  // Split by sentences (simple regex)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
```

**Pros:** Maintains sentence boundaries  
**Cons:** Variable chunk sizes

### Strategy 3: Semantic (Best)

```typescript
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', ' ', ''] // Try in order
});

const chunks = await splitter.splitText(longText);
```

**Pros:** Smart splitting, maintains context  
**Cons:** More complex

### Strategy 4: Markdown-aware

```typescript
import { MarkdownTextSplitter } from 'langchain/text_splitter';

const splitter = new MarkdownTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
});

const chunks = await splitter.splitDocuments(documents);
// Respects # headers, code blocks, lists
```

---

## 5. Generating Embeddings

**Embeddings** convert text into numerical vectors that capture semantic meaning.

### OpenAI Embeddings

```typescript
import { openai } from './lib/openai';

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
    encoding_format: 'float'
  });

  return response.data[0].embedding;
}

// Usage
const embedding = await generateEmbedding("What is Node.js?");
console.log(embedding.length); // 3072 dimensions
console.log(embedding.slice(0, 5)); // [0.023, -0.015, 0.041, ...]
```

### Batch Embeddings

```typescript
async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  // OpenAI allows up to 2048 inputs per request
  const BATCH_SIZE = 2048;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: batch
    });

    const embeddings = response.data.map(d => d.embedding);
    allEmbeddings.push(...embeddings);
  }

  return allEmbeddings;
}

// Usage
const chunks = ["chunk1", "chunk2", "chunk3"];
const embeddings = await generateBatchEmbeddings(chunks);
```

### Embedding Models Comparison

| Model                  | Dimensions | Cost | Use Case           |
| ---------------------- | ---------- | ---- | ------------------ |
| text-embedding-3-small | 1536       | $    | Fast, cheap        |
| text-embedding-3-large | 3072       | $$   | Better accuracy    |
| text-embedding-ada-002 | 1536       | $    | Legacy, still good |

---

## 6. Vector Similarity Search

### Cosine Similarity

```typescript
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  return dotProduct / (magnitudeA * magnitudeB);
}

// Usage
const queryEmbedding = await generateEmbedding("What is React?");
const doc1Embedding = await generateEmbedding("React is a JavaScript library");
const doc2Embedding = await generateEmbedding("Python is a programming language");

const similarity1 = cosineSimilarity(queryEmbedding, doc1Embedding);
const similarity2 = cosineSimilarity(queryEmbedding, doc2Embedding);

console.log(similarity1); // 0.85 (high similarity)
console.log(similarity2); // 0.42 (low similarity)
```

### Simple In-Memory Vector Search

```typescript
interface Document {
  id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

class SimpleVectorStore {
  private documents: Document[] = [];

  async addDocument(content: string, metadata?: Record<string, any>) {
    const embedding = await generateEmbedding(content);
    
    this.documents.push({
      id: `doc-${Date.now()}`,
      content,
      embedding,
      metadata
    });
  }

  async search(query: string, topK: number = 3): Promise<Document[]> {
    const queryEmbedding = await generateEmbedding(query);

    // Calculate similarities
    const results = this.documents.map(doc => ({
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    // Sort by similarity and return top K
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}

// Usage
const store = new SimpleVectorStore();

await store.addDocument("React is a JavaScript library for building UIs");
await store.addDocument("Node.js is a JavaScript runtime");
await store.addDocument("Python is great for data science");

const results = await store.search("Tell me about React", 2);
console.log(results[0].content); // "React is a JavaScript library..."
```

---

## 7. Context Injection

### Basic RAG Prompt

```typescript
function createRAGPrompt(query: string, context: string[]): string {
  return `Answer the question based on the context below. If you cannot answer based on the context, say "I don't have enough information."

Context:
${context.map((c, i) => `[${i + 1}] ${c}`).join('\n\n')}

Question: ${query}

Answer:`;
}

// Usage
const relevantDocs = [
  "Our company offers 20 days of PTO per year.",
  "Employees must request PTO at least 2 weeks in advance."
];

const prompt = createRAGPrompt("How many vacation days do I get?", relevantDocs);
```

### Advanced RAG Prompt with Sources

```typescript
async function ragWithSources(query: string, vectorStore: SimpleVectorStore) {
  // 1. Retrieve relevant documents
  const results = await vectorStore.search(query, 3);

  // 2. Extract content and sources
  const context = results.map((r, i) => ({
    content: r.content,
    source: r.metadata?.source || `Document ${i + 1}`,
    similarity: r.similarity
  }));

  // 3. Create prompt
  const prompt = `You are a helpful assistant. Answer based on the provided context.
  
Context:
${context.map((c, i) => `[Source ${i + 1}: ${c.source}]
${c.content}`).join('\n\n')}

Question: ${query}

Instructions:
- Answer based solely on the provided context
- Cite sources using [Source N] format
- If unsure, say "I don't have enough information"
- Be concise and accurate

Answer:`;

  // 4. Get LLM response
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3 // Lower = more factual
  });

  return {
    answer: response.choices[0].message.content,
    sources: context.map(c => c.source)
  };
}
```

---

## 8. Complete RAG Implementation

```typescript
import { openai } from './lib/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs/promises';

class RAGSystem {
  private documents: Array<{
    id: string;
    content: string;
    embedding: number[];
    metadata: any;
  }> = [];

  // 1. Index documents
  async indexDocument(filePath: string) {
    console.log(`Indexing ${filePath}...`);

    // Load document
    const content = await fs.readFile(filePath, 'utf-8');

    // Chunk document
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });
    const chunks = await splitter.splitText(content);

    console.log(`Created ${chunks.length} chunks`);

    // Generate embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: chunk
      });

      this.documents.push({
        id: `${filePath}-chunk-${i}`,
        content: chunk,
        embedding: response.data[0].embedding,
        metadata: { source: filePath, chunkIndex: i }
      });

      console.log(`Embedded chunk ${i + 1}/${chunks.length}`);
    }

    console.log(`✓ Indexed ${filePath}`);
  }

  // 2. Search
  private async search(query: string, topK: number = 3) {
    const queryResponse = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: query
    });

    const queryEmbedding = queryResponse.data[0].embedding;

    const results = this.documents.map(doc => ({
      ...doc,
      similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
  }

  // 3. Query with RAG
  async query(question: string) {
    console.log(`\nQuery: ${question}`);

    // Retrieve relevant chunks
    const relevantDocs = await this.search(question, 3);

    console.log('\nRelevant documents:');
    relevantDocs.forEach((doc, i) => {
      console.log(`[${i + 1}] (${(doc.similarity * 100).toFixed(1)}% match)`);
      console.log(doc.content.slice(0, 100) + '...\n');
    });

    // Build prompt
    const context = relevantDocs.map(d => d.content).join('\n\n');
    const prompt = `Answer the question based on the context below.

Context:
${context}

Question: ${question}

Answer:`;

    // Get LLM response
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const answer = response.choices[0].message.content;

    console.log('\nAnswer:');
    console.log(answer);

    return {
      answer,
      sources: relevantDocs.map(d => d.metadata)
    };
  }
}

// Usage
async function main() {
  const rag = new RAGSystem();

  // Index documents
  await rag.indexDocument('./docs/company-handbook.txt');
  await rag.indexDocument('./docs/vacation-policy.txt');

  // Query
  await rag.query("How many vacation days do employees get?");
  await rag.query("What is the remote work policy?");
}

main();
```

---

## 📝 Advanced RAG Techniques

### 1. Hybrid Search (Keyword + Vector)

```typescript
async function hybridSearch(query: string, topK: number = 5) {
  // Vector search
  const vectorResults = await vectorSearch(query, topK * 2);
  
  // Keyword search (BM25)
  const keywordResults = keywordSearch(query, topK * 2);
  
  // Combine and re-rank
  const combined = [...vectorResults, ...keywordResults];
  const unique = deduplicateById(combined);
  
  return unique
    .sort((a, b) => (b.vectorScore + b.keywordScore) - (a.vectorScore + a.keywordScore))
    .slice(0, topK);
}
```

### 2. Query Expansion

```typescript
async function expandQuery(originalQuery: string): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Generate 3 alternative phrasings of this question:
"${originalQuery}"

Return as JSON array: ["alternative1", "alternative2", "alternative3"]`
    }],
    response_format: { type: 'json_object' }
  });

  const alternatives = JSON.parse(response.choices[0].message.content || '{}');
  return [originalQuery, ...alternatives.alternatives];
}

// Use expanded queries for better retrieval
const queries = await expandQuery("How do I reset my password?");
const allResults = await Promise.all(queries.map(q => vectorStore.search(q, 2)));
const uniqueResults = deduplicateResults(allResults.flat());
```

### 3. Re-ranking

```typescript
async function rerankResults(query: string, results: Document[]) {
  // Use LLM to re-rank based on relevance
  const prompt = `Rank these documents by relevance to the query.

Query: ${query}

Documents:
${results.map((r, i) => `${i + 1}. ${r.content}`).join('\n\n')}

Return only the numbers in order, comma-separated (e.g., "3,1,2"):`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  const ranking = response.choices[0].message.content?.split(',').map(Number) || [];
  return ranking.map(i => results[i - 1]);
}
```

---

## 📝 Practice Tasks

### Task 1: Document Q&A System
Build RAG system that:
- Indexes multiple PDF documents
- Answers questions with sources
- Handles "I don't know" gracefully
- Shows confidence scores

### Task 2: Code Search
Create RAG for code:
- Index GitHub repositories
- Search by functionality ("function that sorts arrays")
- Return relevant code snippets
- Explain what code does

### Task 3: Customer Support Bot
Build support bot with:
- Company knowledge base
- Product documentation
- FAQs
- Ticket history search

---

## 🔗 Quick Reference

| Component  | Purpose            | Tool                           |
| ---------- | ------------------ | ------------------------------ |
| Chunking   | Split documents    | RecursiveCharacterTextSplitter |
| Embeddings | Convert to vectors | OpenAI text-embedding-3-large  |
| Storage    | Vector database    | Pinecone, Qdrant               |
| Retrieval  | Find similar docs  | Cosine similarity              |
| Generation | Create answer      | GPT-4 with context             |

**Next:** Day 38 - Pinecone/Qdrant Basics
