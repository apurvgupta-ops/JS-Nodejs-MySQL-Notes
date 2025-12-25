# Day 40: LangGraph - Agent Orchestration

## 📚 Table of Contents
1. Introduction to LangGraph
2. Core Concepts
3. Building State Machines
4. Agent Nodes
5. Conditional Edges
6. Building a Simple Agent
7. Complete Agent System

---

## 1. Introduction to LangGraph

**LangGraph** is a library for building stateful, multi-actor applications with LLMs.

### Why LangGraph?

✅ **State Management** - Track agent state across steps  
✅ **Cyclic Graphs** - Agents can loop and retry  
✅ **Human-in-the-Loop** - Pause for human input  
✅ **Multi-Agent** - Coordinate multiple agents  
✅ **Persistence** - Save/resume agent state  

### Installation

```bash
npm install @langchain/langgraph @langchain/core @langchain/openai
```

### Basic Concepts

```
Traditional Chain:  Input → Step 1 → Step 2 → Output
LangGraph:         Input → Node 1 ⇄ Node 2 ⇄ Node 3 → Output
                          (with state, conditions, loops)
```

---

## 2. Core Concepts

### State

**State** is shared data that nodes read and update.

```typescript
import { Annotation } from '@langchain/langgraph';

// Define state schema
const StateAnnotation = Annotation.Root({
  messages: Annotation<string[]>({
    reducer: (current, update) => [...current, ...update],
    default: () => []
  }),
  userInput: Annotation<string>(),
  agentResponse: Annotation<string>()
});

type State = typeof StateAnnotation.State;
```

### Nodes

**Nodes** are functions that process state.

```typescript
async function nodeFunction(state: State): Promise<Partial<State>> {
  console.log('Current state:', state);
  
  // Process and return updates
  return {
    messages: ['Node executed'],
    agentResponse: 'Processed input'
  };
}
```

### Edges

**Edges** connect nodes and define flow.

```typescript
import { StateGraph } from '@langchain/langgraph';

const workflow = new StateGraph(StateAnnotation);

// Add nodes
workflow.addNode('step1', nodeFunction1);
workflow.addNode('step2', nodeFunction2);

// Add edges
workflow.addEdge('step1', 'step2'); // Always go to step2
workflow.addEdge('step2', END); // End after step2
```

### Conditional Edges

**Conditional edges** route based on state.

```typescript
function router(state: State): string {
  if (state.userInput.includes('search')) {
    return 'search_node';
  } else if (state.userInput.includes('calculate')) {
    return 'calculator_node';
  } else {
    return 'default_node';
  }
}

workflow.addConditionalEdges('start', router, {
  search_node: 'search',
  calculator_node: 'calculator',
  default_node: 'chat'
});
```

---

## 3. Building State Machines

### Simple Linear Workflow

```typescript
import { StateGraph, END } from '@langchain/langgraph';
import { Annotation } from '@langchain/langgraph';

// Define state
const StateAnnotation = Annotation.Root({
  input: Annotation<string>(),
  step1Result: Annotation<string>(),
  step2Result: Annotation<string>(),
  finalOutput: Annotation<string>()
});

// Node functions
async function step1(state: typeof StateAnnotation.State) {
  return {
    step1Result: `Processed: ${state.input}`
  };
}

async function step2(state: typeof StateAnnotation.State) {
  return {
    step2Result: `Enhanced: ${state.step1Result}`
  };
}

async function step3(state: typeof StateAnnotation.State) {
  return {
    finalOutput: `Final: ${state.step2Result}`
  };
}

// Build graph
const workflow = new StateGraph(StateAnnotation)
  .addNode('step1', step1)
  .addNode('step2', step2)
  .addNode('step3', step3)
  .addEdge('__start__', 'step1')
  .addEdge('step1', 'step2')
  .addEdge('step2', 'step3')
  .addEdge('step3', END);

const app = workflow.compile();

// Execute
const result = await app.invoke({
  input: 'Hello World'
});

console.log(result.finalOutput);
```

### Workflow with Loops

```typescript
const StateAnnotation = Annotation.Root({
  count: Annotation<number>({
    default: () => 0
  }),
  maxIterations: Annotation<number>({
    default: () => 5
  }),
  result: Annotation<string>()
});

async function incrementNode(state: typeof StateAnnotation.State) {
  return {
    count: state.count + 1
  };
}

function shouldContinue(state: typeof StateAnnotation.State): string {
  if (state.count >= state.maxIterations) {
    return 'end';
  }
  return 'continue';
}

const workflow = new StateGraph(StateAnnotation)
  .addNode('increment', incrementNode)
  .addEdge('__start__', 'increment')
  .addConditionalEdges('increment', shouldContinue, {
    continue: 'increment', // Loop back
    end: END
  });

const app = workflow.compile();
const result = await app.invoke({});
console.log('Final count:', result.count); // 5
```

---

## 4. Agent Nodes

### LLM Agent Node

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const StateAnnotation = Annotation.Root({
  messages: Annotation<string[]>({
    reducer: (current, update) => [...current, ...update],
    default: () => []
  }),
  userQuery: Annotation<string>(),
  agentThought: Annotation<string>(),
  agentAction: Annotation<string>()
});

const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.7
});

async function agentNode(state: typeof StateAnnotation.State) {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a helpful assistant. Analyze the query and decide what to do.'],
    ['human', '{query}']
  ]);

  const chain = prompt.pipe(model);
  const response = await chain.invoke({ query: state.userQuery });

  return {
    messages: [`Agent: ${response.content}`],
    agentThought: response.content
  };
}
```

### Tool-Using Agent

```typescript
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// Define tools
const calculatorTool = new DynamicStructuredTool({
  name: 'calculator',
  description: 'Perform mathematical calculations',
  schema: z.object({
    expression: z.string().describe('Math expression to evaluate')
  }),
  func: async ({ expression }) => {
    try {
      const result = eval(expression);
      return `Result: ${result}`;
    } catch (error) {
      return 'Invalid expression';
    }
  }
});

const searchTool = new DynamicStructuredTool({
  name: 'search',
  description: 'Search for information',
  schema: z.object({
    query: z.string().describe('Search query')
  }),
  func: async ({ query }) => {
    // Simulate search
    return `Search results for: ${query}`;
  }
});

const tools = [calculatorTool, searchTool];

// Agent node with tools
async function agentWithTools(state: typeof StateAnnotation.State) {
  const modelWithTools = model.bind({
    tools: tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.schema
      }
    }))
  });

  const response = await modelWithTools.invoke(state.messages);

  // Check if agent wants to use a tool
  if (response.tool_calls && response.tool_calls.length > 0) {
    return {
      messages: [`Agent wants to use: ${response.tool_calls[0].name}`],
      agentAction: 'use_tool',
      toolName: response.tool_calls[0].name,
      toolInput: response.tool_calls[0].args
    };
  }

  return {
    messages: [`Agent: ${response.content}`],
    agentAction: 'respond'
  };
}
```

---

## 5. Conditional Edges

### Router Node

```typescript
const StateAnnotation = Annotation.Root({
  userQuery: Annotation<string>(),
  intent: Annotation<string>(),
  result: Annotation<string>()
});

// Classify intent
async function classifyIntent(state: typeof StateAnnotation.State) {
  const query = state.userQuery.toLowerCase();
  
  let intent = 'chat';
  if (query.includes('calculate') || query.includes('math')) {
    intent = 'calculator';
  } else if (query.includes('search') || query.includes('find')) {
    intent = 'search';
  } else if (query.includes('code') || query.includes('program')) {
    intent = 'code';
  }

  return { intent };
}

// Router function
function routeByIntent(state: typeof StateAnnotation.State): string {
  return state.intent;
}

// Tool nodes
async function calculatorNode(state: typeof StateAnnotation.State) {
  return { result: 'Calculator result...' };
}

async function searchNode(state: typeof StateAnnotation.State) {
  return { result: 'Search results...' };
}

async function codeNode(state: typeof StateAnnotation.State) {
  return { result: 'Code generated...' };
}

async function chatNode(state: typeof StateAnnotation.State) {
  return { result: 'Chat response...' };
}

// Build graph
const workflow = new StateGraph(StateAnnotation)
  .addNode('classify', classifyIntent)
  .addNode('calculator', calculatorNode)
  .addNode('search', searchNode)
  .addNode('code', codeNode)
  .addNode('chat', chatNode)
  .addEdge('__start__', 'classify')
  .addConditionalEdges('classify', routeByIntent, {
    calculator: 'calculator',
    search: 'search',
    code: 'code',
    chat: 'chat'
  })
  .addEdge('calculator', END)
  .addEdge('search', END)
  .addEdge('code', END)
  .addEdge('chat', END);

const app = workflow.compile();
```

---

## 6. Building a Simple Agent

### ReAct Agent (Reasoning + Acting)

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { StateGraph, END } from '@langchain/langgraph';
import { Annotation } from '@langchain/langgraph';

const StateAnnotation = Annotation.Root({
  input: Annotation<string>(),
  agentScratchpad: Annotation<string[]>({
    reducer: (current, update) => [...current, ...update],
    default: () => []
  }),
  iterations: Annotation<number>({
    default: () => 0
  }),
  finalAnswer: Annotation<string>()
});

const model = new ChatOpenAI({ modelName: 'gpt-4' });

// Agent reasoning node
async function agentThink(state: typeof StateAnnotation.State) {
  const prompt = `
You are a helpful assistant. Answer the user's question step by step.

Question: ${state.input}

Scratchpad:
${state.agentScratchpad.join('\n')}

What should you do next? (Options: search, calculate, answer)
  `.trim();

  const response = await model.invoke(prompt);
  const thought = response.content as string;

  return {
    agentScratchpad: [`Thought ${state.iterations + 1}: ${thought}`],
    iterations: state.iterations + 1
  };
}

// Tool execution node
async function executeTool(state: typeof StateAnnotation.State) {
  const lastThought = state.agentScratchpad[state.agentScratchpad.length - 1];
  
  let observation = '';
  if (lastThought.includes('search')) {
    observation = 'Search result: [relevant information]';
  } else if (lastThought.includes('calculate')) {
    observation = 'Calculation result: 42';
  }

  return {
    agentScratchpad: [`Observation ${state.iterations}: ${observation}`]
  };
}

// Final answer node
async function generateAnswer(state: typeof StateAnnotation.State) {
  const prompt = `
Based on the following reasoning, provide a final answer:

${state.agentScratchpad.join('\n')}

Question: ${state.input}
Final Answer:
  `.trim();

  const response = await model.invoke(prompt);

  return {
    finalAnswer: response.content as string
  };
}

// Router
function shouldContinue(state: typeof StateAnnotation.State): string {
  if (state.iterations >= 3) {
    return 'answer';
  }
  
  const lastThought = state.agentScratchpad[state.agentScratchpad.length - 1];
  if (lastThought.includes('answer')) {
    return 'answer';
  }
  
  return 'continue';
}

// Build agent graph
const workflow = new StateGraph(StateAnnotation)
  .addNode('think', agentThink)
  .addNode('act', executeTool)
  .addNode('answer', generateAnswer)
  .addEdge('__start__', 'think')
  .addConditionalEdges('think', shouldContinue, {
    continue: 'act',
    answer: 'answer'
  })
  .addEdge('act', 'think')
  .addEdge('answer', END);

const agent = workflow.compile();

// Use agent
const result = await agent.invoke({
  input: 'What is 25 * 4 + 10?'
});

console.log(result.finalAnswer);
```

---

## 7. Complete Agent System

### Multi-Tool Agent

```typescript
// lib/agent.ts
import { ChatOpenAI } from '@langchain/openai';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { StateGraph, END } from '@langchain/langgraph';
import { Annotation } from '@langchain/langgraph';
import { z } from 'zod';

// Define state
const AgentState = Annotation.Root({
  messages: Annotation<{ role: string; content: string }[]>({
    reducer: (current, update) => [...current, ...update],
    default: () => []
  }),
  userInput: Annotation<string>(),
  agentOutput: Annotation<string>(),
  toolCalls: Annotation<any[]>({
    default: () => []
  }),
  iterations: Annotation<number>({
    default: () => 0
  })
});

// Define tools
const tools = [
  new DynamicStructuredTool({
    name: 'calculator',
    description: 'Perform math calculations',
    schema: z.object({
      expression: z.string()
    }),
    func: async ({ expression }) => {
      try {
        return String(eval(expression));
      } catch {
        return 'Invalid expression';
      }
    }
  }),
  new DynamicStructuredTool({
    name: 'weather',
    description: 'Get weather information for a city',
    schema: z.object({
      city: z.string()
    }),
    func: async ({ city }) => {
      return `Weather in ${city}: Sunny, 72°F`;
    }
  }),
  new DynamicStructuredTool({
    name: 'search',
    description: 'Search for information on the web',
    schema: z.object({
      query: z.string()
    }),
    func: async ({ query }) => {
      return `Search results for "${query}": [Top 3 results...]`;
    }
  })
];

const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0
});

// Agent node - decides what to do
async function agentNode(state: typeof AgentState.State) {
  const modelWithTools = model.bind({
    tools: tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.schema
      }
    }))
  });

  const response = await modelWithTools.invoke([
    { role: 'system', content: 'You are a helpful assistant with access to tools.' },
    ...state.messages,
    { role: 'user', content: state.userInput }
  ]);

  const newMessage = {
    role: 'assistant',
    content: response.content || ''
  };

  if (response.tool_calls && response.tool_calls.length > 0) {
    return {
      messages: [newMessage],
      toolCalls: response.tool_calls,
      iterations: state.iterations + 1
    };
  }

  return {
    messages: [newMessage],
    agentOutput: response.content as string,
    iterations: state.iterations + 1
  };
}

// Tool execution node
async function toolNode(state: typeof AgentState.State) {
  const toolResults: any[] = [];

  for (const toolCall of state.toolCalls) {
    const tool = tools.find(t => t.name === toolCall.name);
    
    if (tool) {
      const result = await tool.func(toolCall.args);
      toolResults.push({
        role: 'tool',
        content: result,
        tool_call_id: toolCall.id
      });
    }
  }

  return {
    messages: toolResults,
    toolCalls: [] // Clear tool calls
  };
}

// Router
function shouldContinue(state: typeof AgentState.State): string {
  if (state.iterations >= 5) {
    return 'end';
  }

  if (state.toolCalls.length > 0) {
    return 'tools';
  }

  return 'end';
}

// Build agent
const workflow = new StateGraph(AgentState)
  .addNode('agent', agentNode)
  .addNode('tools', toolNode)
  .addEdge('__start__', 'agent')
  .addConditionalEdges('agent', shouldContinue, {
    tools: 'tools',
    end: END
  })
  .addEdge('tools', 'agent');

export const agent = workflow.compile();

// Usage
const result = await agent.invoke({
  userInput: 'What is 15 * 7, and what is the weather in Tokyo?'
});

console.log(result.agentOutput);
```

### Agent with Human-in-the-Loop

```typescript
import { interrupt } from '@langchain/langgraph';

async function humanApprovalNode(state: typeof AgentState.State) {
  const action = state.toolCalls[0];
  
  // Pause and wait for human approval
  const approved = await interrupt({
    message: `Agent wants to use ${action.name} with args: ${JSON.stringify(action.args)}`,
    options: ['approve', 'reject']
  });

  if (approved === 'reject') {
    return {
      messages: [{ role: 'system', content: 'Action rejected by user' }],
      toolCalls: []
    };
  }

  return {}; // Continue to tool execution
}

// Add to workflow
workflow
  .addNode('humanApproval', humanApprovalNode)
  .addConditionalEdges('agent', shouldContinue, {
    tools: 'humanApproval', // Go to approval first
    end: END
  })
  .addEdge('humanApproval', 'tools');
```

---

## 📝 Practice Tasks

### Task 1: Build Calculator Agent
- Create agent with calculator tool
- Support multi-step calculations
- Add memory of previous calculations

### Task 2: Research Agent
- Build agent with search capability
- Synthesize information from multiple sources
- Generate summary report

### Task 3: Multi-Agent System
- Create coordinator agent
- Add specialist agents (search, code, math)
- Route queries to appropriate agent

See `/tasks` folder for detailed requirements.

---

## 🔗 Quick Reference

| Component               | Purpose                |
| ----------------------- | ---------------------- |
| **StateGraph**          | Define agent workflow  |
| **addNode**             | Add processing step    |
| **addEdge**             | Connect nodes          |
| **addConditionalEdges** | Route based on state   |
| **Annotation**          | Define state schema    |
| **compile**             | Build executable graph |

**Next:** Day 41 - Build AI Course Generator Project
