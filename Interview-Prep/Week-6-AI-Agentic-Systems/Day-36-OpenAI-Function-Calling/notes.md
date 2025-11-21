# Day 36: OpenAI Function Calling Basics

## 📚 Table of Contents
1. Introduction to OpenAI API
2. Chat Completions API
3. Function Calling Fundamentals
4. Tool Definitions
5. Structured Outputs
6. Streaming Responses
7. Best Practices

---

## 1. Introduction to OpenAI API

**OpenAI API** provides access to powerful language models like GPT-4, GPT-3.5, and embeddings models.

### Key Models

| Model                      | Purpose         | Cost | Use Case                            |
| -------------------------- | --------------- | ---- | ----------------------------------- |
| **gpt-4-turbo**            | Most capable    | $$$$ | Complex reasoning, function calling |
| **gpt-4o**                 | Optimized GPT-4 | $$$  | Balance of speed and capability     |
| **gpt-3.5-turbo**          | Fast and cheap  | $    | Simple tasks, high volume           |
| **text-embedding-3-large** | Embeddings      | $    | RAG, semantic search                |

### Setup

```bash
npm install openai
```

```typescript
// lib/openai.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

```bash
# .env
OPENAI_API_KEY=sk-...
```

---

## 2. Chat Completions API

The **Chat Completions API** generates responses based on conversation history.

### Basic Chat

```typescript
import { openai } from './lib/openai';

async function basicChat() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'What is the capital of France?'
      }
    ],
    temperature: 0.7,
    max_tokens: 150
  });

  console.log(response.choices[0].message.content);
  // Output: "The capital of France is Paris."
}
```

### Message Roles

**System** - Sets behavior/context for the assistant
```typescript
{
  role: 'system',
  content: 'You are a expert JavaScript developer who explains concepts simply.'
}
```

**User** - User input/questions
```typescript
{
  role: 'user',
  content: 'Explain async/await'
}
```

**Assistant** - AI responses (for conversation history)
```typescript
{
  role: 'assistant',
  content: 'Async/await is syntactic sugar for Promises...'
}
```

### Conversation History

```typescript
async function conversationExample() {
  const messages = [
    { role: 'system', content: 'You are a helpful math tutor.' },
    { role: 'user', content: 'What is 2 + 2?' },
    { role: 'assistant', content: '2 + 2 equals 4.' },
    { role: 'user', content: 'What about 5 + 3?' }
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages
  });

  console.log(response.choices[0].message.content);
  // Output: "5 + 3 equals 8."
}
```

### Parameters

```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  
  // Randomness (0 = deterministic, 2 = very random)
  temperature: 0.7,
  
  // Max response length
  max_tokens: 500,
  
  // Penalize repetition
  frequency_penalty: 0.5,
  presence_penalty: 0.5,
  
  // Stop sequences
  stop: ['\n\n', 'END'],
  
  // Multiple responses
  n: 1
});
```

---

## 3. Function Calling Fundamentals

**Function calling** lets the model call external functions to get information or perform actions.

### Why Function Calling?

- **Get real-time data** (weather, stock prices, database queries)
- **Perform actions** (send emails, book appointments, update records)
- **Structured outputs** (JSON parsing, data extraction)
- **Tool use** (calculator, search, API calls)

### How It Works

```
User: "What's the weather in Paris?"
  ↓
GPT-4 decides: Need to call get_weather function
  ↓
Returns: { name: "get_weather", arguments: { location: "Paris" } }
  ↓
Your code: Calls actual weather API
  ↓
Return result to GPT-4
  ↓
GPT-4: "The weather in Paris is sunny, 22°C"
```

### Basic Function Calling

```typescript
import { openai } from './lib/openai';

// 1. Define the function
async function getCurrentWeather(location: string) {
  // In real app, call weather API
  return {
    location,
    temperature: 22,
    condition: 'Sunny'
  };
}

// 2. Define the tool
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_current_weather',
      description: 'Get the current weather in a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city name, e.g., Paris'
          }
        },
        required: ['location']
      }
    }
  }
];

// 3. Call OpenAI with tools
async function weatherAssistant(userMessage: string) {
  const messages = [
    { role: 'user' as const, content: userMessage }
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools,
    tool_choice: 'auto' // Let model decide
  });

  const message = response.choices[0].message;

  // 4. Check if model wants to call a function
  if (message.tool_calls) {
    const toolCall = message.tool_calls[0];
    const functionName = toolCall.function.name;
    const functionArgs = JSON.parse(toolCall.function.arguments);

    console.log(`Calling: ${functionName}(${JSON.stringify(functionArgs)})`);

    // 5. Call the actual function
    let functionResponse;
    if (functionName === 'get_current_weather') {
      functionResponse = await getCurrentWeather(functionArgs.location);
    }

    // 6. Send function result back to model
    messages.push(message); // Add assistant's tool call
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(functionResponse)
    });

    const finalResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages
    });

    return finalResponse.choices[0].message.content;
  }

  return message.content;
}

// Usage
const answer = await weatherAssistant("What's the weather like in Paris?");
console.log(answer);
// Output: "The weather in Paris is sunny with a temperature of 22°C."
```

---

## 4. Tool Definitions

### Multiple Tools

```typescript
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'City name' },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature unit'
          }
        },
        required: ['location']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'search_web',
      description: 'Search the web for information',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'calculate',
      description: 'Perform mathematical calculations',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Math expression, e.g., "2 + 2"'
          }
        },
        required: ['expression']
      }
    }
  }
];
```

### Calculator Tool Example

```typescript
// Tool definition
const calculatorTool = {
  type: 'function' as const,
  function: {
    name: 'calculate',
    description: 'Evaluate a mathematical expression',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Math expression like "2 + 2" or "sqrt(16)"'
        }
      },
      required: ['expression']
    }
  }
};

// Implementation
function calculate(expression: string): number {
  // WARNING: eval is unsafe! Use a proper math parser in production
  // Consider using: mathjs library
  try {
    return eval(expression);
  } catch (error) {
    throw new Error(`Invalid expression: ${expression}`);
  }
}

// Usage with OpenAI
async function calculatorAssistant(query: string) {
  const messages = [{ role: 'user' as const, content: query }];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools: [calculatorTool]
  });

  const message = response.choices[0].message;

  if (message.tool_calls) {
    const toolCall = message.tool_calls[0];
    const args = JSON.parse(toolCall.function.arguments);
    
    const result = calculate(args.expression);

    messages.push(message);
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: String(result)
    });

    const finalResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages
    });

    return finalResponse.choices[0].message.content;
  }

  return message.content;
}

// Test
await calculatorAssistant("What is 15% of 200?");
// GPT-4: calls calculate("200 * 0.15")
// Returns: "15% of 200 is 30."
```

---

## 5. Structured Outputs

Force the model to return structured JSON data.

### Using JSON Mode

```typescript
async function extractUserInfo(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Extract user information as JSON with keys: name, email, age'
      },
      {
        role: 'user',
        content: text
      }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

// Usage
const info = await extractUserInfo(
  "Hi, I'm John Doe, my email is john@example.com and I'm 30 years old"
);

console.log(info);
// Output: { name: "John Doe", email: "john@example.com", age: 30 }
```

### Function Calling for Structured Output

```typescript
// More reliable than json_mode
const extractionTool = {
  type: 'function' as const,
  function: {
    name: 'extract_info',
    description: 'Extract structured information from text',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Full name' },
        email: { type: 'string', description: 'Email address' },
        age: { type: 'number', description: 'Age in years' },
        location: { type: 'string', description: 'City or country' }
      },
      required: ['name']
    }
  }
};

async function extractStructured(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Extract information and call extract_info' },
      { role: 'user', content: text }
    ],
    tools: [extractionTool],
    tool_choice: { type: 'function', function: { name: 'extract_info' } }
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  if (toolCall) {
    return JSON.parse(toolCall.function.arguments);
  }

  return null;
}

// Usage
const data = await extractStructured(
  "My name is Sarah Johnson, email sarah@test.com, I'm 28 and live in London"
);

console.log(data);
// {
//   name: "Sarah Johnson",
//   email: "sarah@test.com",
//   age: 28,
//   location: "London"
// }
```

---

## 6. Streaming Responses

Stream responses word-by-word for better UX.

### Basic Streaming

```typescript
async function streamChat(message: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: message }],
    stream: true // Enable streaming
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content); // Print as it arrives
  }
}

// Usage
await streamChat("Write a short poem about coding");
// Output streams: "In realms of logic, code takes flight..."
```

### Streaming with Function Calling

```typescript
async function streamWithTools(message: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: message }],
    tools: [calculatorTool],
    stream: true
  });

  let functionCallName = '';
  let functionCallArgs = '';

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;

    // Regular content
    if (delta?.content) {
      process.stdout.write(delta.content);
    }

    // Function call
    if (delta?.tool_calls) {
      const toolCall = delta.tool_calls[0];
      
      if (toolCall.function?.name) {
        functionCallName = toolCall.function.name;
      }
      
      if (toolCall.function?.arguments) {
        functionCallArgs += toolCall.function.arguments;
      }
    }
  }

  // Execute function if called
  if (functionCallName) {
    console.log(`\n[Calling ${functionCallName}]`);
    const args = JSON.parse(functionCallArgs);
    
    if (functionCallName === 'calculate') {
      const result = calculate(args.expression);
      console.log(`Result: ${result}`);
    }
  }
}
```

### Streaming in Next.js

```typescript
// app/api/chat/route.ts
import { openai } from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true
  });

  const stream = OpenAIStream(response);
  
  return new StreamingTextResponse(stream);
}
```

```typescript
// Client component
'use client';

import { useChat } from 'ai/react';

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
```

---

## 7. Best Practices

### 1. Clear Function Descriptions

**❌ Bad:**
```typescript
{
  name: 'get_data',
  description: 'Gets data',
  parameters: {
    type: 'object',
    properties: {
      id: { type: 'string' }
    }
  }
}
```

**✅ Good:**
```typescript
{
  name: 'get_user_profile',
  description: 'Retrieve user profile information from the database including name, email, and preferences',
  parameters: {
    type: 'object',
    properties: {
      user_id: {
        type: 'string',
        description: 'The unique identifier for the user (UUID format)'
      }
    },
    required: ['user_id']
  }
}
```

### 2. Error Handling

```typescript
async function safeAPICall(userMessage: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: userMessage }],
      tools,
      timeout: 30000 // 30 second timeout
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    if (error.code === 'insufficient_quota') {
      console.error('OpenAI quota exceeded');
      return 'Service temporarily unavailable';
    }
    
    if (error.code === 'rate_limit_exceeded') {
      console.error('Rate limit hit, retry after delay');
      // Implement exponential backoff
    }

    console.error('OpenAI API error:', error);
    return 'An error occurred';
  }
}
```

### 3. Token Management

```typescript
import { encoding_for_model } from 'tiktoken';

function countTokens(text: string, model: string = 'gpt-4o'): number {
  const encoding = encoding_for_model(model as any);
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
}

// Check before API call
const messageTokens = countTokens(userMessage);
if (messageTokens > 4000) {
  console.warn('Message too long, truncating...');
  // Truncate or chunk the message
}
```

### 4. Cost Optimization

```typescript
// Use cheaper model for simple tasks
async function smartModelSelection(task: string) {
  const simplePatterns = ['hello', 'hi', 'thanks', 'bye'];
  const isSimple = simplePatterns.some(p => task.toLowerCase().includes(p));

  const model = isSimple ? 'gpt-3.5-turbo' : 'gpt-4o';
  
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: task }],
    max_tokens: isSimple ? 50 : 500 // Limit tokens for simple tasks
  });

  return response.choices[0].message.content;
}
```

### 5. System Prompts

```typescript
const SYSTEM_PROMPTS = {
  assistant: 'You are a helpful assistant. Be concise and accurate.',
  
  coder: `You are an expert programmer. When asked:
- Provide working code examples
- Explain key concepts
- Suggest best practices
- Keep responses under 500 words unless asked for more`,
  
  json_extractor: `Extract information and return ONLY valid JSON.
Format: { "field1": "value1", "field2": "value2" }
Do not include markdown, explanations, or extra text.`
};

// Usage
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: SYSTEM_PROMPTS.coder },
    { role: 'user', content: 'Explain async/await' }
  ]
});
```

---

## 📝 Complete Example: Booking Assistant

```typescript
import { openai } from './lib/openai';

// Simulated database
const bookings: any[] = [];

// Tool definitions
const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'check_availability',
      description: 'Check if a time slot is available for booking',
      parameters: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
          time: { type: 'string', description: 'Time in HH:MM format (24h)' }
        },
        required: ['date', 'time']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_booking',
      description: 'Create a new booking after availability is confirmed',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Customer name' },
          date: { type: 'string', description: 'Booking date YYYY-MM-DD' },
          time: { type: 'string', description: 'Booking time HH:MM' },
          service: { type: 'string', description: 'Type of service' }
        },
        required: ['name', 'date', 'time', 'service']
      }
    }
  }
];

// Function implementations
function checkAvailability(date: string, time: string): boolean {
  return !bookings.some(b => b.date === date && b.time === time);
}

function createBooking(params: any): string {
  const id = `BOOK-${Date.now()}`;
  bookings.push({ id, ...params });
  return id;
}

// Assistant function
async function bookingAssistant(userMessage: string, conversationHistory: any[] = []) {
  const messages = [
    {
      role: 'system' as const,
      content: `You are a friendly booking assistant. Help users:
1. Check availability
2. Make bookings
3. Answer questions

Always confirm details before creating a booking.`
    },
    ...conversationHistory,
    { role: 'user' as const, content: userMessage }
  ];

  let response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools
  });

  let message = response.choices[0].message;

  // Handle tool calls
  while (message.tool_calls) {
    messages.push(message);

    for (const toolCall of message.tool_calls) {
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      let result;
      if (functionName === 'check_availability') {
        const available = checkAvailability(args.date, args.time);
        result = { available, date: args.date, time: args.time };
      } else if (functionName === 'create_booking') {
        const bookingId = createBooking(args);
        result = { success: true, booking_id: bookingId, ...args };
      }

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }

    response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools
    });

    message = response.choices[0].message;
  }

  return {
    response: message.content,
    conversationHistory: messages
  };
}

// Usage
let history: any[] = [];

const msg1 = await bookingAssistant(
  "I'd like to book a haircut for tomorrow at 2pm"
);
console.log(msg1.response);
history = msg1.conversationHistory;

const msg2 = await bookingAssistant(
  "Yes, my name is John Doe",
  history
);
console.log(msg2.response);
```

---

## 📝 Practice Tasks

### Task 1: Weather Assistant
Build a weather assistant that:
- Gets weather for any city
- Converts between Celsius/Fahrenheit
- Provides 5-day forecasts
- Handles multiple locations

### Task 2: Database Query Tool
Create tools that:
- Search users by name/email
- Get user statistics
- Update user preferences
- List recent activities

### Task 3: Multi-Tool Calculator
Implement calculator with:
- Basic math (add, subtract, multiply, divide)
- Advanced functions (sqrt, power, log)
- Unit conversions (currency, temperature, distance)
- History of calculations

---

## 🔗 Quick Reference

| Concept          | Code                                                         |
| ---------------- | ------------------------------------------------------------ |
| Basic chat       | `openai.chat.completions.create({ messages })`               |
| Function calling | `tools: [{ type: 'function', function: {...} }]`             |
| Streaming        | `stream: true`                                               |
| JSON mode        | `response_format: { type: 'json_object' }`                   |
| Force tool       | `tool_choice: { type: 'function', function: { name: 'x' } }` |

**Next:** Day 37 - RAG Architecture
