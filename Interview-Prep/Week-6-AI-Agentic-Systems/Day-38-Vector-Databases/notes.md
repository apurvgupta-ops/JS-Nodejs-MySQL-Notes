# Day 38: Vector Databases - Pinecone & Qdrant

## 📚 Table of Contents
1. Introduction to Vector Databases
2. Understanding Embeddings
3. Pinecone Basics
4. Qdrant Basics
5. Similarity Search
6. Building Vector Embeddings
7. Best Practices

---

## 1. Introduction to Vector Databases

**Vector databases** store and query high-dimensional vectors (embeddings) efficiently.

### Why Vector Databases?

Traditional databases store structured data (rows, columns). Vector databases store **semantic meaning** as numbers.

**Example:**
```
"dog" → [0.2, 0.8, 0.1, 0.9, ...]  (768 dimensions)
"cat" → [0.3, 0.7, 0.2, 0.8, ...]  (similar to dog!)
"car" → [0.9, 0.1, 0.8, 0.2, ...]  (very different)
```

### Use Cases

✅ **Semantic Search** - Find similar documents by meaning  
✅ **RAG (Retrieval Augmented Generation)** - Fetch relevant context for LLMs  
✅ **Recommendation Systems** - Find similar products/content  
✅ **Image Search** - Find visually similar images  
✅ **Anomaly Detection** - Find outliers in data  

### Vector Database vs Traditional Database

| Feature       | Traditional DB    | Vector DB                      |
| ------------- | ----------------- | ------------------------------ |
| Data Type     | Structured (rows) | Vectors (embeddings)           |
| Search Method | Exact match, SQL  | Similarity (cosine, euclidean) |
| Query         | `WHERE age > 25`  | `FIND SIMILAR TO vector`       |
| Use Case      | CRUD operations   | Semantic search                |

---

## 2. Understanding Embeddings

**Embeddings** convert text/images into numerical vectors that capture semantic meaning.

### How Embeddings Work

```
Input: "The cat sat on the mat"
↓
OpenAI text-embedding-3-small
↓
Output: [0.021, -0.034, 0.112, ..., 0.089]  (1536 dimensions)
```

**Key Concepts:**
- **Dimensions**: Number of numbers in vector (768, 1536, 3072)
- **Similar meaning = Similar vectors**
- **Distance metrics**: Measure similarity between vectors

### Distance Metrics

**1. Cosine Similarity** (Most common)
```
Measures angle between vectors
Range: -1 (opposite) to 1 (identical)
```

**2. Euclidean Distance**
```
Straight-line distance between points
Range: 0 (identical) to ∞
```

**3. Dot Product**
```
Combines magnitude and direction
Higher = more similar
```

### Generating Embeddings with OpenAI

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // 1536 dimensions
    input: text
  });
  
  return response.data[0].embedding;
}

// Example
const embedding = await generateEmbedding('What is machine learning?');
console.log(embedding.length); // 1536
console.log(embedding.slice(0, 5)); // [0.021, -0.034, 0.112, 0.089, -0.067]
```

### Embedding Models

| Model                  | Dimensions | Cost            | Use Case        |
| ---------------------- | ---------- | --------------- | --------------- |
| text-embedding-3-small | 1536       | $0.02/1M tokens | General purpose |
| text-embedding-3-large | 3072       | $0.13/1M tokens | High accuracy   |
| text-embedding-ada-002 | 1536       | $0.10/1M tokens | Legacy          |

---

## 3. Pinecone Basics

**Pinecone** is a managed vector database (no infrastructure management).

### Setup Pinecone

```bash
npm install @pinecone-database/pinecone
```

```typescript
// lib/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

export const index = pinecone.index('my-index');
```

### Create Index

```typescript
// Create index (do once)
await pinecone.createIndex({
  name: 'my-index',
  dimension: 1536, // Must match embedding model
  metric: 'cosine', // cosine, euclidean, dotproduct
  spec: {
    serverless: {
      cloud: 'aws',
      region: 'us-east-1'
    }
  }
});
```

### Upsert Vectors

```typescript
import { index } from './lib/pinecone';
import { generateEmbedding } from './lib/openai';

async function upsertDocuments(documents: { id: string; text: string; metadata?: any }[]) {
  const vectors = await Promise.all(
    documents.map(async (doc) => ({
      id: doc.id,
      values: await generateEmbedding(doc.text),
      metadata: {
        text: doc.text,
        ...doc.metadata
      }
    }))
  );

  await index.upsert(vectors);
}

// Example
await upsertDocuments([
  { id: '1', text: 'What is machine learning?', metadata: { category: 'AI' } },
  { id: '2', text: 'How does neural network work?', metadata: { category: 'AI' } },
  { id: '3', text: 'Best pasta recipe', metadata: { category: 'Food' } }
]);
```

### Query Vectors

```typescript
async function semanticSearch(query: string, topK: number = 5) {
  // Convert query to embedding
  const queryEmbedding = await generateEmbedding(query);

  // Search similar vectors
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true
  });

  return results.matches.map(match => ({
    id: match.id,
    score: match.score, // Similarity score (0-1)
    text: match.metadata?.text,
    metadata: match.metadata
  }));
}

// Example
const results = await semanticSearch('Tell me about AI', 3);
console.log(results);
// [
//   { id: '1', score: 0.92, text: 'What is machine learning?', ... },
//   { id: '2', score: 0.87, text: 'How does neural network work?', ... }
// ]
```

### Filtering with Metadata

```typescript
const results = await index.query({
  vector: queryEmbedding,
  topK: 5,
  filter: {
    category: { $eq: 'AI' } // Only return AI category
  },
  includeMetadata: true
});
```

### Delete Vectors

```typescript
// Delete by ID
await index.deleteOne('1');

// Delete multiple
await index.deleteMany(['1', '2', '3']);

// Delete by filter
await index.deleteMany({ category: 'Food' });

// Delete all
await index.deleteAll();
```

---

## 4. Qdrant Basics

**Qdrant** is an open-source vector database (self-hosted or cloud).

### Setup Qdrant

```bash
npm install @qdrant/js-client-rest
```

**Local with Docker:**
```bash
docker run -p 6333:6333 qdrant/qdrant
```

**Connect:**
```typescript
// lib/qdrant.ts
import { QdrantClient } from '@qdrant/js-client-rest';

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
  apiKey: process.env.QDRANT_API_KEY // Optional for cloud
});
```

### Create Collection

```typescript
await qdrant.createCollection('my_collection', {
  vectors: {
    size: 1536, // Embedding dimension
    distance: 'Cosine' // Cosine, Euclid, Dot
  }
});
```

### Upsert Vectors

```typescript
import { v4 as uuidv4 } from 'uuid';

async function upsertDocuments(
  collection: string,
  documents: { text: string; metadata?: any }[]
) {
  const points = await Promise.all(
    documents.map(async (doc) => ({
      id: uuidv4(),
      vector: await generateEmbedding(doc.text),
      payload: {
        text: doc.text,
        ...doc.metadata
      }
    }))
  );

  await qdrant.upsert(collection, {
    wait: true,
    points
  });
}

// Example
await upsertDocuments('my_collection', [
  { text: 'What is machine learning?', metadata: { category: 'AI' } },
  { text: 'How does neural network work?', metadata: { category: 'AI' } },
  { text: 'Best pasta recipe', metadata: { category: 'Food' } }
]);
```

### Query Vectors

```typescript
async function semanticSearch(
  collection: string,
  query: string,
  limit: number = 5
) {
  const queryEmbedding = await generateEmbedding(query);

  const results = await qdrant.search(collection, {
    vector: queryEmbedding,
    limit,
    with_payload: true
  });

  return results.map(result => ({
    id: result.id,
    score: result.score,
    text: result.payload?.text,
    metadata: result.payload
  }));
}

// Example
const results = await semanticSearch('my_collection', 'Tell me about AI', 3);
```

### Filtering

```typescript
const results = await qdrant.search('my_collection', {
  vector: queryEmbedding,
  limit: 5,
  filter: {
    must: [
      {
        key: 'category',
        match: { value: 'AI' }
      }
    ]
  }
});
```

### Update Payload

```typescript
await qdrant.setPayload('my_collection', {
  points: ['id1', 'id2'],
  payload: {
    updated_at: new Date().toISOString()
  }
});
```

### Delete Points

```typescript
// Delete by ID
await qdrant.delete('my_collection', {
  points: ['id1', 'id2']
});

// Delete by filter
await qdrant.delete('my_collection', {
  filter: {
    must: [{ key: 'category', match: { value: 'Food' } }]
  }
});
```

---

## 5. Similarity Search

### Semantic Search Example

```typescript
// lib/semantic-search.ts
import { index } from './pinecone';
import { generateEmbedding } from './openai';

export async function searchDocuments(
  query: string,
  options: {
    topK?: number;
    filter?: any;
    includeScores?: boolean;
  } = {}
) {
  const { topK = 5, filter, includeScores = true } = options;

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);

  // Search similar vectors
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    filter,
    includeMetadata: true
  });

  return results.matches.map(match => ({
    id: match.id,
    text: match.metadata?.text,
    ...(includeScores && { score: match.score }),
    metadata: match.metadata
  }));
}
```

### Hybrid Search (Keyword + Semantic)

```typescript
export async function hybridSearch(
  query: string,
  keywords: string[]
) {
  // Semantic search
  const semanticResults = await searchDocuments(query, { topK: 10 });

  // Filter by keywords
  const filteredResults = semanticResults.filter(result => {
    const text = result.text?.toLowerCase() || '';
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  });

  return filteredResults.slice(0, 5);
}
```

---

## 6. Building Vector Embeddings

### Batch Embedding Generation

```typescript
async function batchGenerateEmbeddings(
  texts: string[],
  batchSize: number = 100
) {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch
    });

    embeddings.push(...response.data.map(d => d.embedding));
  }

  return embeddings;
}
```

### Chunking Long Documents

```typescript
function chunkDocument(text: string, chunkSize: number = 1000, overlap: number = 200) {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

async function embedDocument(documentId: string, text: string) {
  const chunks = chunkDocument(text);
  
  const embeddings = await batchGenerateEmbeddings(chunks);

  const vectors = chunks.map((chunk, i) => ({
    id: `${documentId}-chunk-${i}`,
    values: embeddings[i],
    metadata: {
      documentId,
      chunkIndex: i,
      text: chunk
    }
  }));

  await index.upsert(vectors);
}
```

### Complete RAG Pipeline

```typescript
// 1. Ingest documents
async function ingestDocuments(documents: { id: string; content: string }[]) {
  for (const doc of documents) {
    // Chunk long documents
    const chunks = chunkDocument(doc.content);

    // Generate embeddings for chunks
    const embeddings = await batchGenerateEmbeddings(chunks);

    // Upsert to vector database
    const vectors = chunks.map((chunk, i) => ({
      id: `${doc.id}-chunk-${i}`,
      values: embeddings[i],
      metadata: {
        documentId: doc.id,
        chunkIndex: i,
        text: chunk
      }
    }));

    await index.upsert(vectors);
  }
}

// 2. Query with RAG
async function queryWithRAG(question: string) {
  // Retrieve relevant context
  const relevantChunks = await searchDocuments(question, { topK: 3 });

  // Build context
  const context = relevantChunks
    .map(chunk => chunk.text)
    .join('\n\n');

  // Generate answer with OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Answer based on the context provided. If you cannot answer from the context, say so.'
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${question}`
      }
    ]
  });

  return {
    answer: response.choices[0].message.content,
    sources: relevantChunks.map(c => c.id)
  };
}
```

---

## 7. Best Practices

### 1. Chunking Strategy

**Good Chunk Size:**
```typescript
// ✅ Good: 500-1000 characters with overlap
const chunks = chunkDocument(text, 800, 200);

// ❌ Bad: Too large (loses granularity)
const chunks = chunkDocument(text, 5000, 0);

// ❌ Bad: Too small (loses context)
const chunks = chunkDocument(text, 100, 0);
```

### 2. Metadata Design

```typescript
// ✅ Good: Rich metadata for filtering
{
  id: 'doc1-chunk-0',
  values: embedding,
  metadata: {
    documentId: 'doc1',
    title: 'Machine Learning Basics',
    author: 'John Doe',
    category: 'AI',
    date: '2024-01-01',
    chunkIndex: 0,
    text: 'Machine learning is...'
  }
}

// ❌ Bad: Minimal metadata
{
  id: 'doc1',
  values: embedding,
  metadata: { text: 'Machine learning is...' }
}
```

### 3. Indexing Strategy

```typescript
// Create separate indexes for different use cases
await pinecone.createIndex({ name: 'documents', ... });
await pinecone.createIndex({ name: 'code-snippets', ... });
await pinecone.createIndex({ name: 'images', ... });
```

### 4. Error Handling

```typescript
async function safeUpsert(vectors: any[]) {
  const BATCH_SIZE = 100;
  
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    
    try {
      await index.upsert(batch);
    } catch (error) {
      console.error(`Failed to upsert batch ${i}-${i + BATCH_SIZE}:`, error);
      // Retry or log for manual review
    }
  }
}
```

### 5. Cost Optimization

```typescript
// Cache embeddings to avoid regenerating
const embeddingCache = new Map<string, number[]>();

async function getCachedEmbedding(text: string): Promise<number[]> {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }

  const embedding = await generateEmbedding(text);
  embeddingCache.set(text, embedding);
  return embedding;
}
```

---

## 📝 Complete Example: Document Search API

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { index } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { query, topK = 5, filter } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // Search vector database
    const results = await index.query({
      vector: queryEmbedding,
      topK,
      filter,
      includeMetadata: true
    });

    // Format results
    const documents = results.matches.map(match => ({
      id: match.id,
      score: match.score,
      title: match.metadata?.title,
      text: match.metadata?.text,
      metadata: match.metadata
    }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

// app/api/ingest/route.ts
export async function POST(req: NextRequest) {
  try {
    const { documents } = await req.json();

    for (const doc of documents) {
      // Chunk document
      const chunks = chunkDocument(doc.content);

      // Generate embeddings
      const embeddings = await batchGenerateEmbeddings(chunks);

      // Upsert vectors
      const vectors = chunks.map((chunk, i) => ({
        id: `${doc.id}-chunk-${i}`,
        values: embeddings[i],
        metadata: {
          documentId: doc.id,
          title: doc.title,
          chunkIndex: i,
          text: chunk
        }
      }));

      await index.upsert(vectors);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      { error: 'Ingest failed' },
      { status: 500 }
    );
  }
}
```

---

## 📝 Practice Tasks

### Task 1: Build Semantic Search
- Set up Pinecone or Qdrant
- Ingest 50+ documents
- Implement search API
- Add filtering by metadata

### Task 2: Document Chunking
- Implement smart chunking (by paragraphs/sentences)
- Add overlap between chunks
- Test different chunk sizes
- Measure retrieval quality

### Task 3: RAG Pipeline
- Ingest knowledge base
- Implement retrieval
- Generate answers with GPT-4
- Add source citations

See `/tasks` folder for detailed requirements.

---

## 🔗 Quick Reference

| Operation    | Pinecone                 | Qdrant                    |
| ------------ | ------------------------ | ------------------------- |
| Create Index | `createIndex()`          | `createCollection()`      |
| Upsert       | `index.upsert()`         | `qdrant.upsert()`         |
| Query        | `index.query()`          | `qdrant.search()`         |
| Delete       | `index.deleteOne()`      | `qdrant.delete()`         |
| Filter       | `filter: { key: value }` | `filter: { must: [...] }` |

**Embedding Dimensions:**
- text-embedding-3-small: **1536**
- text-embedding-3-large: **3072**
- text-embedding-ada-002: **1536**

**Next:** Day 39 - LangChain Basics
