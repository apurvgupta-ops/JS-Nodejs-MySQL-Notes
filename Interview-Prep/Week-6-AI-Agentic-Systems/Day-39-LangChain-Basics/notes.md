# Day 39: LangChain Basics - AI Workflows

## 📚 Table of Contents
1. Introduction to LangChain
2. Core Concepts
3. Chains
4. Prompt Templates
5. Memory
6. Retrieval (RAG)
7. Complete AI Workflow

---

## 1. Introduction to LangChain

**LangChain** is a framework for building applications with Large Language Models (LLMs).

### Why LangChain?

✅ **Abstracts LLM complexity** - Works with OpenAI, Anthropic, etc.  
✅ **Built-in patterns** - Chains, agents, memory, retrieval  
✅ **Production-ready** - Error handling, logging, monitoring  
✅ **Composable** - Build complex workflows from simple components  

### Installation

```bash
npm install langchain @langchain/openai @langchain/core
```

### Basic Setup

```typescript
// lib/langchain.ts
import { ChatOpenAI } from '@langchain/openai';

export const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY
});
```

---

## 2. Core Concepts

### Models

**Chat Models** - Conversational AI (GPT-4, Claude)
```typescript
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.7
});

const response = await model.invoke('What is TypeScript?');
console.log(response.content);
```

**LLMs** - Text completion models
```typescript
import { OpenAI } from '@langchain/openai';

const llm = new OpenAI({
  modelName: 'gpt-3.5-turbo-instruct',
  temperature: 0.7
});

const response = await llm.invoke('Complete this: TypeScript is');
```

### Messages

```typescript
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';

const messages = [
  new SystemMessage('You are a helpful coding assistant.'),
  new HumanMessage('How do I use async/await?'),
  new AIMessage('Async/await is syntactic sugar for promises...'),
  new HumanMessage('Can you show an example?')
];

const response = await model.invoke(messages);
```

---

## 3. Chains

**Chains** combine multiple LLM calls or operations.

### Simple Chain

```typescript
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

// Create prompt template
const prompt = PromptTemplate.fromTemplate(
  'Explain {concept} in simple terms for a beginner.'
);

// Create chain
const chain = new LLMChain({
  llm: model,
  prompt
});

// Run chain
const result = await chain.call({ concept: 'recursion' });
console.log(result.text);
```

### Sequential Chain

```typescript
import { SimpleSequentialChain } from 'langchain/chains';

// Chain 1: Generate idea
const ideaPrompt = PromptTemplate.fromTemplate(
  'Generate a creative app idea for {topic}.'
);
const ideaChain = new LLMChain({ llm: model, prompt: ideaPrompt });

// Chain 2: Analyze idea
const analysisPrompt = PromptTemplate.fromTemplate(
  'Analyze this app idea and list pros and cons:\n{idea}'
);
const analysisChain = new LLMChain({ llm: model, prompt: analysisPrompt });

// Combine chains
const sequentialChain = new SimpleSequentialChain({
  chains: [ideaChain, analysisChain],
  verbose: true
});

const result = await sequentialChain.call({ input: 'productivity' });
console.log(result.output);
```

### LCEL (LangChain Expression Language)

**Modern approach** - More flexible and composable:

```typescript
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const promptTemplate = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful coding assistant.'],
  ['human', '{question}']
]);

// Chain with pipe operator
const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

// Invoke
const result = await chain.invoke({
  question: 'What is the difference between let and const?'
});
console.log(result);
```

### Parallel Chain

```typescript
import { RunnableParallel } from '@langchain/core/runnables';

const chain1 = promptTemplate1.pipe(model);
const chain2 = promptTemplate2.pipe(model);

const parallelChain = RunnableParallel({
  summary: chain1,
  analysis: chain2
});

const result = await parallelChain.invoke({ text: 'Long document...' });
// { summary: '...', analysis: '...' }
```

---

## 4. Prompt Templates

### Basic Template

```typescript
import { PromptTemplate } from '@langchain/core/prompts';

const template = PromptTemplate.fromTemplate(`
You are a {role}.
User question: {question}
Provide a detailed answer.
`);

const formatted = await template.format({
  role: 'senior software engineer',
  question: 'How do I optimize React performance?'
});
```

### Chat Prompt Template

```typescript
import { ChatPromptTemplate } from '@langchain/core/prompts';

const chatPrompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a {role} with {years} years of experience.'],
  ['human', 'Here is my problem: {problem}'],
  ['ai', 'I understand. Let me help you with that.'],
  ['human', '{followup}']
]);

const formatted = await chatPrompt.formatMessages({
  role: 'DevOps engineer',
  years: 10,
  problem: 'Docker container keeps crashing',
  followup: 'How do I debug this?'
});
```

### Few-Shot Prompting

```typescript
import { FewShotPromptTemplate } from '@langchain/core/prompts';

const examples = [
  {
    input: 'What is 2 + 2?',
    output: 'The answer is 4.'
  },
  {
    input: 'What is 10 - 5?',
    output: 'The answer is 5.'
  }
];

const examplePrompt = PromptTemplate.fromTemplate(
  'Input: {input}\nOutput: {output}'
);

const fewShotPrompt = new FewShotPromptTemplate({
  examples,
  examplePrompt,
  prefix: 'Answer the following math questions:',
  suffix: 'Input: {input}\nOutput:',
  inputVariables: ['input']
});

const formatted = await fewShotPrompt.format({ input: 'What is 7 + 3?' });
```

---

## 5. Memory

**Memory** allows chatbots to remember conversation history.

### Buffer Memory

```typescript
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

const memory = new BufferMemory();

const chain = new ConversationChain({
  llm: model,
  memory
});

// First message
await chain.call({ input: 'Hi, my name is Alice.' });

// Second message (remembers name)
const response = await chain.call({ input: 'What is my name?' });
console.log(response.response); // "Your name is Alice."
```

### Buffer Window Memory

```typescript
import { BufferWindowMemory } from 'langchain/memory';

// Keep only last 5 messages
const memory = new BufferWindowMemory({ k: 5 });

const chain = new ConversationChain({
  llm: model,
  memory
});
```

### Conversation Summary Memory

```typescript
import { ConversationSummaryMemory } from 'langchain/memory';

const memory = new ConversationSummaryMemory({
  llm: model,
  maxTokenLimit: 1000 // Summarize when history exceeds limit
});

const chain = new ConversationChain({
  llm: model,
  memory
});
```

### Chat Message History

```typescript
import { ChatMessageHistory } from 'langchain/memory';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

const history = new ChatMessageHistory();

await history.addMessage(new HumanMessage('Hello!'));
await history.addMessage(new AIMessage('Hi! How can I help?'));
await history.addMessage(new HumanMessage('What is TypeScript?'));

const messages = await history.getMessages();
```

---

## 6. Retrieval (RAG)

### Vector Store Setup

```typescript
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

const index = pinecone.index('my-index');

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-small'
});

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index
});
```

### Document Loading

```typescript
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Load document
const loader = new TextLoader('data/documentation.txt');
const docs = await loader.load();

// Split into chunks
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
});

const chunks = await splitter.splitDocuments(docs);

// Add to vector store
await vectorStore.addDocuments(chunks);
```

### Retrieval Chain

```typescript
import { RetrievalQAChain } from 'langchain/chains';

const chain = RetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever()
);

const response = await chain.call({
  query: 'What is the refund policy?'
});

console.log(response.text);
```

### ConversationalRetrievalQAChain

```typescript
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: 'chat_history',
      returnMessages: true
    })
  }
);

// First question
await chain.call({
  question: 'What is the return policy?'
});

// Follow-up (uses memory)
const response = await chain.call({
  question: 'How long does it take?' // "it" refers to returns
});
```

---

## 7. Complete AI Workflow

### Custom RAG Pipeline

```typescript
// lib/rag-pipeline.ts
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';

export class RAGPipeline {
  private model: ChatOpenAI;
  private vectorStore: PineconeStore;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.7
    });
  }

  async initialize(indexName: string) {
    const embeddings = new OpenAIEmbeddings({
      modelName: 'text-embedding-3-small'
    });

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });

    this.vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: pinecone.index(indexName)
    });
  }

  async query(question: string) {
    // 1. Retrieve relevant documents
    const retriever = this.vectorStore.asRetriever(3);

    // 2. Create prompt template
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', 'Answer based on the context provided. If you cannot answer from context, say so.'],
      ['human', `Context:\n{context}\n\nQuestion: {question}`]
    ]);

    // 3. Build chain
    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(docs => docs.map(d => d.pageContent).join('\n\n')),
        question: new RunnablePassthrough()
      },
      promptTemplate,
      this.model,
      new StringOutputParser()
    ]);

    // 4. Execute
    const answer = await chain.invoke(question);

    // 5. Get source documents
    const sourceDocs = await retriever.getRelevantDocuments(question);

    return {
      answer,
      sources: sourceDocs.map(doc => ({
        content: doc.pageContent,
        metadata: doc.metadata
      }))
    };
  }
}

// Usage
const rag = new RAGPipeline();
await rag.initialize('documentation');

const result = await rag.query('How do I reset my password?');
console.log(result.answer);
console.log('Sources:', result.sources);
```

### Chatbot with Memory

```typescript
// lib/chatbot.ts
import { ChatOpenAI } from '@langchain/openai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export class Chatbot {
  private chain: ConversationChain;
  private memory: BufferMemory;

  constructor(systemPrompt: string = 'You are a helpful assistant.') {
    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.7
    });

    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history'
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['placeholder', '{history}'],
      ['human', '{input}']
    ]);

    this.chain = new ConversationChain({
      llm: model,
      memory: this.memory,
      prompt
    });
  }

  async chat(message: string): Promise<string> {
    const response = await this.chain.call({ input: message });
    return response.response;
  }

  async getHistory() {
    return await this.memory.chatHistory.getMessages();
  }

  async clearHistory() {
    await this.memory.clear();
  }
}

// Usage
const bot = new Chatbot('You are a coding mentor.');

await bot.chat('Hi, I want to learn TypeScript.');
// "Great! TypeScript is a superset of JavaScript..."

await bot.chat('Where should I start?');
// "Based on your interest in TypeScript, I recommend..."
```

### Document Q&A API

```typescript
// app/api/ask/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RAGPipeline } from '@/lib/rag-pipeline';

const rag = new RAGPipeline();
await rag.initialize('knowledge-base');

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question required' },
        { status: 400 }
      );
    }

    const result = await rag.query(question);

    return NextResponse.json({
      answer: result.answer,
      sources: result.sources
    });
  } catch (error) {
    console.error('Q&A error:', error);
    return NextResponse.json(
      { error: 'Failed to answer question' },
      { status: 500 }
    );
  }
}
```

---

## 📝 Best Practices

### 1. Error Handling

```typescript
import { RunnableSequence } from '@langchain/core/runnables';

const chain = RunnableSequence.from([
  promptTemplate,
  model,
  new StringOutputParser()
]);

try {
  const result = await chain.invoke({ question: 'What is AI?' });
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Handle rate limiting
    await sleep(1000);
    // Retry
  } else {
    console.error('Chain error:', error);
  }
}
```

### 2. Streaming Responses

```typescript
const stream = await chain.stream({ question: 'Explain AI' });

for await (const chunk of stream) {
  process.stdout.write(chunk);
}
```

### 3. Caching

```typescript
import { InMemoryCache } from '@langchain/core/caches';

const model = new ChatOpenAI({
  cache: new InMemoryCache()
});

// First call - hits API
await model.invoke('What is AI?');

// Second call - uses cache
await model.invoke('What is AI?'); // Instant!
```

### 4. Prompt Versioning

```typescript
const prompts = {
  v1: 'Answer in one sentence: {question}',
  v2: 'Answer in detail: {question}',
  v3: 'Answer like a teacher: {question}'
};

const version = 'v3';
const template = PromptTemplate.fromTemplate(prompts[version]);
```

---

## 📝 Practice Tasks

### Task 1: Build Chatbot
- Create conversational bot with memory
- Add system prompt customization
- Implement chat history API

### Task 2: Document Q&A
- Load documents into vector store
- Implement RAG pipeline
- Add source citations

### Task 3: Multi-step Chain
- Create sequential workflow
- Generate blog post (outline → draft → polish)
- Add validation between steps

See `/tasks` folder for detailed requirements.

---

## 🔗 Quick Reference

| Component     | Purpose              | Example                          |
| ------------- | -------------------- | -------------------------------- |
| **Model**     | LLM interface        | `ChatOpenAI()`                   |
| **Chain**     | Multi-step workflow  | `LLMChain`, `RetrievalQAChain`   |
| **Memory**    | Conversation history | `BufferMemory`                   |
| **Retriever** | Document search      | `vectorStore.asRetriever()`      |
| **Splitter**  | Chunk documents      | `RecursiveCharacterTextSplitter` |
| **LCEL**      | Modern chaining      | `.pipe()` operator               |

**Next:** Day 40 - LangGraph (Agent Orchestration)
