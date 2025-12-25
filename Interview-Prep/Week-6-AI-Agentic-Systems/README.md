# Week 6: AI + Agentic Systems (Days 36-42)

## 🎯 Overview

Master modern AI integration and agentic systems by learning OpenAI APIs, RAG architecture, vector databases, LangChain, and LangGraph. Build production-ready AI applications with Next.js.

**Total Duration:** ~35 hours  
**Level:** Advanced  
**Prerequisites:** Node.js, TypeScript, async/await, REST APIs, Week 5 (Next.js)

---

## 📅 Week Schedule

| Day     | Topic                   | Duration | Key Focus                         |
| ------- | ----------------------- | -------- | --------------------------------- |
| **MON** | OpenAI Function Calling | 4-6h     | Tool use, structured outputs      |
| **TUE** | RAG Architecture        | 4-6h     | Vector databases, embeddings      |
| **WED** | Pinecone/Qdrant         | 4-6h     | Vector storage, similarity search |
| **THU** | LangChain Basics        | 4-6h     | Chains, prompts, memory           |
| **FRI** | LangGraph               | 4-6h     | Agent orchestration, workflows    |
| **SAT** | AI Project              | 6-8h     | Full RAG system with Next.js      |
| **SUN** | Revision & Mock         | 6-8h     | 10 AI questions, interview prep   |

---

## 🎓 Learning Outcomes

### Core Concepts
- OpenAI API integration (chat completions, function calling)
- RAG (Retrieval-Augmented Generation) architecture
- Vector embeddings and similarity search
- Agentic systems and tool orchestration
- LangChain for AI workflows
- LangGraph for multi-agent systems

### Technical Skills
- Implement OpenAI function calling with tools
- Build RAG pipelines from scratch
- Use Pinecone/Qdrant for vector storage
- Create LangChain chains and agents
- Design LangGraph workflows
- Build production AI applications
- Handle streaming responses
- Implement semantic search

### Interview Preparation
- Explain RAG architecture
- Compare vector databases
- Design AI agent systems
- Discuss prompt engineering
- Answer 10+ AI system design questions
- Build AI projects in interviews

---

## 📚 Daily Breakdown

### Day 36: OpenAI Function Calling Basics
**Topics:**
- OpenAI Chat Completions API
- Function calling fundamentals
- Tool definitions and parameters
- Structured outputs
- Streaming responses
- Error handling

**Deliverables:**
- 6+ code examples (basic chat, function calling, tools, streaming)
- Weather assistant with function calling
- Calculator tool implementation
- Task: Build a booking assistant with tools

### Day 37: RAG Architecture
**Topics:**
- What is RAG and why use it?
- RAG pipeline components
- Document chunking strategies
- Embedding generation
- Vector similarity search
- Context injection
- RAG vs Fine-tuning

**Deliverables:**
- RAG architecture diagrams
- Document chunking examples
- Embedding generation code
- Simple RAG implementation
- Task: Build a document Q&A system

### Day 38: Pinecone/Qdrant Basics
**Topics:**
- Vector database fundamentals
- Pinecone setup and operations
- Qdrant setup and operations
- Indexing strategies
- Metadata filtering
- Similarity search algorithms
- Hybrid search

**Deliverables:**
- Pinecone integration examples
- Qdrant integration examples
- Vector CRUD operations
- Semantic search implementation
- Task: Build a semantic search engine

### Day 39: LangChain Basics
**Topics:**
- LangChain architecture
- Chains (LLMChain, SequentialChain)
- Prompt templates
- Output parsers
- Memory types
- Document loaders
- Retrievers
- Agents and tools

**Deliverables:**
- Basic chain examples
- Prompt template patterns
- Memory implementations
- RAG with LangChain
- Task: Build a conversational AI

### Day 40: LangGraph (Agent Orchestration)
**Topics:**
- LangGraph fundamentals
- State graphs and nodes
- Agent routing
- Multi-agent systems
- Tool calling in graphs
- Conditional edges
- Human-in-the-loop

**Deliverables:**
- Simple agent workflow
- Multi-agent collaboration
- Tool orchestration
- State management
- Task: Build a research assistant agent

### Day 41: Build AI Project
**Project:** AI Course Generator with RAG + Next.js

**Features:**
- Upload PDF course materials
- Generate course outline with AI
- Semantic search through content
- Generate quizzes automatically
- Chat with course content (RAG)
- Next.js 15 frontend with streaming
- Vector database integration

**Tech Stack:**
- Next.js 15 (App Router)
- OpenAI API (GPT-4, embeddings)
- Pinecone or Qdrant
- LangChain
- TypeScript
- Tailwind CSS

### Day 42: Revision & Mock Interview
**Content:**
- Quick revision of all Week 6 concepts
- 10 AI system design questions
- RAG architecture deep dive
- Vector database comparison
- Agent design patterns
- Mock interview scenarios

---

## 📁 Folder Structure

```
Week-6-AI-Agentic-Systems/
├── README.md (this file)
├── Day-36-OpenAI-Function-Calling/
│   ├── notes.md
│   ├── examples/
│   │   ├── 01-basic-chat.ts
│   │   ├── 02-function-calling.ts
│   │   ├── 03-weather-assistant.ts
│   │   ├── 04-streaming.ts
│   │   └── 05-structured-outputs.ts
│   └── tasks/
│       └── booking-assistant.md
├── Day-37-RAG-Architecture/
│   ├── notes.md
│   ├── examples/
│   │   ├── 01-document-chunking.ts
│   │   ├── 02-embeddings.ts
│   │   ├── 03-simple-rag.ts
│   │   └── 04-advanced-rag.ts
│   └── tasks/
│       └── document-qa.md
├── Day-38-Pinecone-Qdrant/
│   ├── notes.md
│   ├── examples/
│   │   ├── 01-pinecone-setup.ts
│   │   ├── 02-qdrant-setup.ts
│   │   ├── 03-vector-crud.ts
│   │   └── 04-semantic-search.ts
│   └── tasks/
│       └── search-engine.md
├── Day-39-LangChain-Basics/
│   ├── notes.md
│   ├── examples/
│   │   ├── 01-basic-chain.ts
│   │   ├── 02-prompt-templates.ts
│   │   ├── 03-memory.ts
│   │   ├── 04-rag-chain.ts
│   │   └── 05-agents.ts
│   └── tasks/
│       └── conversational-ai.md
├── Day-40-LangGraph/
│   ├── notes.md
│   ├── examples/
│   │   ├── 01-simple-graph.ts
│   │   ├── 02-multi-agent.ts
│   │   ├── 03-tool-orchestration.ts
│   │   └── 04-state-management.ts
│   └── tasks/
│       └── research-assistant.md
├── Day-41-AI-Project/
│   ├── PROJECT-GUIDE.md
│   ├── project-structure.md
│   └── implementation-steps.md
└── Day-42-Revision/
    └── REVISION-GUIDE.md
```

---

## 🛠️ Prerequisites

### Required Knowledge
- Node.js and TypeScript fundamentals
- Async/await and Promises
- REST API concepts
- Next.js App Router (Week 5)
- Basic understanding of AI/ML concepts

### Tools & Accounts
- Node.js 18+ installed
- OpenAI API key ([Get here](https://platform.openai.com/api-keys))
- Pinecone account ([Sign up](https://www.pinecone.io/))
- Or Qdrant account ([Sign up](https://qdrant.tech/))
- Git and VS Code

### Install Dependencies
```bash
npm install openai
npm install @langchain/openai @langchain/core langchain
npm install @pinecone-database/pinecone
npm install @qdrant/js-client-rest
npm install pdf-parse
npm install tiktoken
```

---

## 📖 Study Tips

1. **Understand concepts first** - Don't rush to code, understand RAG architecture
2. **Experiment with prompts** - Prompt engineering is critical
3. **Test with real data** - Use actual documents for RAG testing
4. **Monitor API costs** - OpenAI APIs cost money, use small datasets
5. **Compare approaches** - Try different vector databases and chunking strategies

---

## ✅ Success Criteria

By the end of Week 6, you should be able to:

- [ ] Implement OpenAI function calling with multiple tools
- [ ] Explain RAG architecture and its components
- [ ] Build a complete RAG pipeline from scratch
- [ ] Use Pinecone or Qdrant for vector storage
- [ ] Create LangChain chains and agents
- [ ] Design LangGraph workflows
- [ ] Build a production AI application
- [ ] Handle streaming AI responses
- [ ] Implement semantic search
- [ ] Answer 10+ AI system design questions
- [ ] Pass an AI systems mock interview

---

## 🔗 Resources

### Official Documentation
- [OpenAI API Docs](https://platform.openai.com/docs)
- [LangChain Docs](https://js.langchain.com/docs)
- [LangGraph Docs](https://langchain-ai.github.io/langgraphjs/)
- [Pinecone Docs](https://docs.pinecone.io/)
- [Qdrant Docs](https://qdrant.tech/documentation/)

### Learning Resources
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [RAG Papers](https://arxiv.org/abs/2005.11401)
- [Vector Database Comparison](https://www.pinecone.io/learn/vector-database/)

### Video Tutorials
- [LangChain Crash Course](https://www.youtube.com/results?search_query=langchain+tutorial)
- [RAG Explained](https://www.youtube.com/results?search_query=rag+architecture)

---

## 🚀 Getting Started

1. **Day 36:** Start with OpenAI basics
2. **Clone examples:** Run all provided code samples
3. **Complete tasks:** Build the hands-on projects
4. **Read notes:** Comprehensive theory for each topic
5. **Day 42:** Review everything and do mock interview

**Let's build intelligent AI systems! 🤖**

**Previous Week:** [Week 5 - Advanced React & Next.js](../Week-5-Advanced-React/)  
**Next:** Day 36 - OpenAI Function Calling Basics
