# Day 41: AI Course Generator Project

## 🎯 Project Overview

Build a **complete AI Course Generator** that:
- ✅ Generates course outlines from topics
- ✅ Creates detailed lessons with RAG
- ✅ Stores courses in vector database
- ✅ Next.js frontend with streaming
- ✅ User authentication
- ✅ Course export (PDF, Markdown)

**Time Estimate:** 6-8 hours

---

## 📋 Features

### Core Features
- [ ] Course outline generation
- [ ] Lesson content creation with RAG
- [ ] Knowledge base integration
- [ ] Streaming responses
- [ ] Course management (CRUD)

### Advanced Features
- [ ] User authentication
- [ ] Course progress tracking
- [ ] Export to PDF/Markdown
- [ ] Course search by topic
- [ ] Related courses recommendation

---

## 🛠️ Tech Stack

```
Framework:     Next.js 15 (App Router)
Language:      TypeScript
AI:            OpenAI GPT-4 + Function Calling
Vector DB:     Pinecone
Chains:        LangChain
Database:      PostgreSQL with Prisma
Auth:          NextAuth.js v5
Styling:       Tailwind CSS
PDF Export:    jsPDF
```

---

## 📁 Project Structure

```
ai-course-generator/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← Dashboard
│   │   ├── courses/
│   │   │   ├── page.tsx          ← All courses
│   │   │   ├── new/page.tsx      ← Generate course
│   │   │   └── [id]/
│   │   │       ├── page.tsx      ← View course
│   │   │       └── lesson/[lessonId]/page.tsx
│   │   └── knowledge-base/
│   │       └── page.tsx          ← Upload documents
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── generate-outline/route.ts
│   │   ├── generate-lesson/route.ts
│   │   ├── ingest/route.ts
│   │   └── search/route.ts
│   ├── layout.tsx
│   └── page.tsx                  ← Landing page
├── components/
│   ├── CourseCard.tsx
│   ├── CourseOutline.tsx
│   ├── LessonContent.tsx
│   ├── StreamingResponse.tsx
│   └── KnowledgeBaseUpload.tsx
├── lib/
│   ├── agents/
│   │   ├── course-generator.ts
│   │   └── lesson-creator.ts
│   ├── ai/
│   │   ├── openai.ts
│   │   ├── pinecone.ts
│   │   └── rag.ts
│   ├── db.ts
│   └── auth.ts
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Database Schema (15 mins)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  courses   Course[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Course {
  id          String   @id @default(cuid())
  title       String
  description String?
  topic       String
  difficulty  String   @default("intermediate")
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessons     Lesson[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

model Lesson {
  id        String   @id @default(cuid())
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title     String
  content   String   @db.Text
  order     Int
  duration  Int?     // minutes
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([courseId])
  @@unique([courseId, order])
}

model Document {
  id         String   @id @default(cuid())
  title      String
  content    String   @db.Text
  embedding  String?  @db.Text // JSON array
  metadata   Json?
  createdAt  DateTime @default(now())
}
```

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 2: AI Setup (30 mins)

```typescript
// lib/ai/openai.ts
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return response.data[0].embedding;
}
```

```typescript
// lib/ai/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

export const courseIndex = pinecone.index('course-content');
```

```typescript
// lib/ai/rag.ts
import { openai, generateEmbedding } from './openai';
import { courseIndex } from './pinecone';

export async function retrieveRelevantContext(
  query: string,
  topK: number = 3
): Promise<string[]> {
  const queryEmbedding = await generateEmbedding(query);

  const results = await courseIndex.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true
  });

  return results.matches.map(match => match.metadata?.text as string);
}

export async function generateWithContext(
  prompt: string,
  context: string[]
): Promise<string> {
  const contextText = context.join('\n\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert course creator. Use the provided context to enhance your answers.

Context:
${contextText}`
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content!;
}
```

### Step 3: Course Generator Agent (45 mins)

```typescript
// lib/agents/course-generator.ts
import { openai } from '../ai/openai';
import { retrieveRelevantContext, generateWithContext } from '../ai/rag';

export interface CourseOutline {
  title: string;
  description: string;
  lessons: {
    title: string;
    description: string;
    duration: number;
  }[];
}

export async function generateCourseOutline(
  topic: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Promise<CourseOutline> {
  // Retrieve relevant context from knowledge base
  const context = await retrieveRelevantContext(
    `Course material about ${topic}`,
    5
  );

  const tools = [
    {
      type: 'function',
      function: {
        name: 'create_course_outline',
        description: 'Generate a structured course outline',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Course title'
            },
            description: {
              type: 'string',
              description: 'Course description'
            },
            lessons: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  duration: { type: 'number', description: 'Duration in minutes' }
                },
                required: ['title', 'description', 'duration']
              },
              description: '5-8 lessons'
            }
          },
          required: ['title', 'description', 'lessons']
        }
      }
    }
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert course designer. Create comprehensive course outlines.

Context from knowledge base:
${context.join('\n\n')}

Create ${difficulty}-level courses with clear learning objectives.`
      },
      {
        role: 'user',
        content: `Create a ${difficulty} course about: ${topic}`
      }
    ],
    tools,
    tool_choice: { type: 'function', function: { name: 'create_course_outline' } }
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  if (!toolCall) {
    throw new Error('Failed to generate outline');
  }

  return JSON.parse(toolCall.function.arguments);
}
```

```typescript
// lib/agents/lesson-creator.ts
import { openai } from '../ai/openai';
import { retrieveRelevantContext, generateWithContext } from '../ai/rag';

export async function generateLessonContent(
  lessonTitle: string,
  lessonDescription: string,
  courseContext: string
): Promise<string> {
  // Retrieve relevant context
  const context = await retrieveRelevantContext(
    `${lessonTitle}: ${lessonDescription}`,
    3
  );

  const prompt = `
Create detailed lesson content for:

Title: ${lessonTitle}
Description: ${lessonDescription}
Course Context: ${courseContext}

Include:
1. Introduction (1-2 paragraphs)
2. Main concepts (3-5 sections with explanations)
3. Code examples (if applicable)
4. Practice exercises (2-3 exercises)
5. Summary (key takeaways)

Format as Markdown.
  `.trim();

  return await generateWithContext(prompt, context);
}

export async function* streamLessonContent(
  lessonTitle: string,
  lessonDescription: string,
  courseContext: string
): AsyncGenerator<string> {
  const context = await retrieveRelevantContext(
    `${lessonTitle}: ${lessonDescription}`,
    3
  );

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert course creator. Use the context to create comprehensive lessons.

Context:
${context.join('\n\n')}`
      },
      {
        role: 'user',
        content: `Create lesson content for:
Title: ${lessonTitle}
Description: ${lessonDescription}
Course: ${courseContext}`
      }
    ],
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
```

### Step 4: API Routes (45 mins)

```typescript
// app/api/generate-outline/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateCourseOutline } from '@/lib/agents/course-generator';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, difficulty } = await req.json();

    // Generate outline
    const outline = await generateCourseOutline(topic, difficulty);

    // Save to database
    const course = await db.course.create({
      data: {
        title: outline.title,
        description: outline.description,
        topic,
        difficulty,
        userId: session.user.id,
        lessons: {
          create: outline.lessons.map((lesson, index) => ({
            title: lesson.title,
            content: lesson.description, // Placeholder
            order: index + 1,
            duration: lesson.duration
          }))
        }
      },
      include: {
        lessons: true
      }
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Generate outline error:', error);
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/generate-lesson/route.ts
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { streamLessonContent } from '@/lib/agents/lesson-creator';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { lessonId } = await req.json();

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true
      }
    });

    if (!lesson) {
      return new Response('Lesson not found', { status: 404 });
    }

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullContent = '';

          for await (const chunk of streamLessonContent(
            lesson.title,
            lesson.content,
            lesson.course.title
          )) {
            fullContent += chunk;
            controller.enqueue(encoder.encode(chunk));
          }

          // Save completed content
          await db.lesson.update({
            where: { id: lessonId },
            data: { content: fullContent }
          });

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked'
      }
    });
  } catch (error) {
    console.error('Generate lesson error:', error);
    return new Response('Failed to generate lesson', { status: 500 });
  }
}
```

```typescript
// app/api/ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/ai/openai';
import { courseIndex } from '@/lib/ai/pinecone';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    // Chunk content
    const chunks = chunkText(content, 1000, 200);

    // Generate embeddings
    const embeddings = await Promise.all(
      chunks.map(chunk => generateEmbedding(chunk))
    );

    // Store in Pinecone
    const vectors = chunks.map((chunk, i) => ({
      id: `doc-${Date.now()}-${i}`,
      values: embeddings[i],
      metadata: {
        title,
        text: chunk
      }
    }));

    await courseIndex.upsert(vectors);

    // Store in database
    await db.document.create({
      data: {
        title,
        content,
        metadata: { chunks: chunks.length }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      { error: 'Failed to ingest document' },
      { status: 500 }
    );
  }
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}
```

### Step 5: Frontend Components (60 mins)

```tsx
// app/(dashboard)/courses/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCoursePage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });

      const { course } = await response.json();
      router.push(`/courses/${course.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to generate course');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Generate New Course</h1>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Course Topic</label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g., Machine Learning Basics"
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Difficulty Level</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="w-full border p-3 rounded"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!topic || loading}
          className="w-full bg-blue-500 text-white p-3 rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Course'}
        </button>
      </div>
    </div>
  );
}
```

```tsx
// components/StreamingResponse.tsx
'use client';

import { useState, useEffect } from 'react';

export function StreamingResponse({ lessonId }: { lessonId: string }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateContent() {
    setLoading(true);
    setContent('');

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setContent(prev => prev + chunk);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={generateContent}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Generating...' : 'Generate Lesson Content'}
      </button>

      {content && (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Testing Checklist

- [ ] User can sign up and login
- [ ] Generate course outline from topic
- [ ] View course with all lessons
- [ ] Generate lesson content with streaming
- [ ] Upload documents to knowledge base
- [ ] RAG retrieves relevant context
- [ ] Export course to PDF
- [ ] Search courses by topic

---

## 📝 Extension Ideas

1. **Multi-language support** - Generate courses in different languages
2. **Quiz generation** - Auto-generate quizzes for lessons
3. **Code playground** - Interactive code editor for coding lessons
4. **Progress tracking** - Track which lessons completed
5. **Course sharing** - Share courses with other users
6. **AI tutor** - Chat with AI about lesson content

---

**Next:** Day 42 - Revision & Mock Interview
