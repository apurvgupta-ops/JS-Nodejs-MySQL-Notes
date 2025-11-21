# Day 34: Build a Next.js 15 Full-Stack Project

## 🎯 Project Overview

Build a complete **Task Management System** using Next.js 15 with:
- ✅ Authentication (Sign up, Login, Logout)
- ✅ Dashboard with multiple pages
- ✅ CRUD operations with Server Actions
- ✅ API routes for external access
- ✅ Mix of Server & Client Components
- ✅ Suspense boundaries & error handling
- ✅ TypeScript throughout

**Time Estimate:** 6-8 hours

---

## 📋 Features Checklist

### Authentication
- [ ] Sign up page with email/password
- [ ] Login page with session management
- [ ] Logout functionality
- [ ] Protected routes (redirect to login)
- [ ] User profile page

### Dashboard
- [ ] Overview page (stats cards)
- [ ] Tasks list page (all tasks)
- [ ] Create task page
- [ ] Edit task page
- [ ] Settings page

### CRUD Operations
- [ ] Create task (Server Action)
- [ ] Read tasks (Server Component)
- [ ] Update task (Server Action)
- [ ] Delete task (Server Action)
- [ ] Toggle task completion (Optimistic UI)

### Advanced Features
- [ ] Search & filter tasks
- [ ] Real-time task count
- [ ] Loading states (loading.js)
- [ ] Error handling (error.js)
- [ ] API routes for external access

---

## 🛠️ Tech Stack

```
Framework:     Next.js 15 (App Router)
Language:      TypeScript
Database:      PostgreSQL with Prisma
Auth:          NextAuth.js v5
Styling:       Tailwind CSS
Validation:    Zod
UI Components: Shadcn/ui (optional)
```

---

## 📁 Project Structure

```
task-manager/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Protected layout
│   │   ├── page.tsx            ← Overview
│   │   ├── tasks/
│   │   │   ├── page.tsx        ← All tasks
│   │   │   ├── new/
│   │   │   │   └── page.tsx    ← Create task
│   │   │   └── [id]/
│   │   │       ├── page.tsx    ← Task detail
│   │   │       └── edit/
│   │   │           └── page.tsx ← Edit task
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts    ← NextAuth config
│   │   └── tasks/
│   │       └── route.ts        ← Public API
│   ├── layout.tsx              ← Root layout
│   ├── page.tsx                ← Landing page
│   ├── loading.tsx
│   └── error.tsx
├── components/
│   ├── ui/                     ← Reusable UI components
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   ├── StatsCard.tsx
│   └── Navbar.tsx
├── lib/
│   ├── actions/
│   │   ├── auth.ts             ← Auth actions
│   │   └── tasks.ts            ← Task actions
│   ├── db.ts                   ← Prisma client
│   ├── auth.ts                 ← NextAuth config
│   └── validations.ts          ← Zod schemas
├── prisma/
│   └── schema.prisma
├── .env
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Setup Project (30 mins)

```bash
# Create Next.js project
npx create-next-app@latest task-manager --typescript --tailwind --app

cd task-manager

# Install dependencies
npm install prisma @prisma/client
npm install next-auth@beta
npm install zod
npm install bcryptjs
npm install @types/bcryptjs -D

# Initialize Prisma
npx prisma init
```

### Step 2: Database Schema (15 mins)

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
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  priority    Priority @default(MEDIUM)
  dueDate     DateTime?
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

**Setup database:**
```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Run migration
npx prisma migrate dev --name init
npx prisma generate
```

### Step 3: Prisma Client Setup (5 mins)

```ts
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

### Step 4: NextAuth Configuration (30 mins)

```ts
// lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});
```

```ts
// app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST } from '@/lib/auth';
```

### Step 5: Auth Actions (30 mins)

```ts
// lib/actions/auth.ts
'use server';

import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { signIn, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function signup(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };

  const result = signupSchema.safeParse(data);
  
  if (!result.success) {
    return { error: 'Invalid input' };
  }

  const existing = await db.user.findUnique({
    where: { email: data.email }
  });

  if (existing) {
    return { error: 'User already exists' };
  }

  const hashedPassword = await hash(data.password, 10);

  await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword
    }
  });

  redirect('/login');
}

export async function login(formData: FormData) {
  await signIn('credentials', {
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: false
  });

  redirect('/dashboard');
}

export async function logout() {
  await signOut({ redirect: false });
  redirect('/login');
}
```

### Step 6: Auth Pages (30 mins)

```tsx
// app/(auth)/signup/page.tsx
import { signup } from '@/lib/actions/auth';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form action={signup} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
```

```tsx
// app/(auth)/login/page.tsx
import { login } from '@/lib/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form action={login} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
```

### Step 7: Protected Layout (15 mins)

```tsx
// app/(dashboard)/layout.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions/auth';
import Link from 'next/link';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-6">
            <Link href="/dashboard" className="font-bold">
              Task Manager
            </Link>
            <Link href="/dashboard/tasks">Tasks</Link>
            <Link href="/dashboard/profile">Profile</Link>
            <Link href="/dashboard/settings">Settings</Link>
          </div>

          <form action={logout}>
            <button className="text-red-500">Logout</button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

### Step 8: Task Actions (45 mins)

```ts
// lib/actions/tasks.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional()
});

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    priority: formData.get('priority') as 'LOW' | 'MEDIUM' | 'HIGH',
    dueDate: formData.get('dueDate') as string
  };

  const result = taskSchema.safeParse(data);
  if (!result.success) {
    return { error: 'Invalid input' };
  }

  await db.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId: session.user.id
    }
  });

  revalidatePath('/dashboard/tasks');
  redirect('/dashboard/tasks');
}

export async function updateTask(taskId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    priority: formData.get('priority') as 'LOW' | 'MEDIUM' | 'HIGH',
    dueDate: formData.get('dueDate') as string
  };

  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    }
  });

  revalidatePath('/dashboard/tasks');
  redirect('/dashboard/tasks');
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await db.task.delete({
    where: { id: taskId, userId: session.user.id }
  });

  revalidatePath('/dashboard/tasks');
}

export async function toggleTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const task = await db.task.findUnique({
    where: { id: taskId }
  });

  await db.task.update({
    where: { id: taskId, userId: session.user.id },
    data: { completed: !task?.completed }
  });

  revalidatePath('/dashboard/tasks');
}
```

### Step 9: Dashboard Pages (60 mins)

```tsx
// app/(dashboard)/page.tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-4 gap-4">
        <Suspense fallback={<StatsSkeleton />}>
          <TotalTasksCard />
        </Suspense>
        <Suspense fallback={<StatsSkeleton />}>
          <CompletedTasksCard />
        </Suspense>
        <Suspense fallback={<StatsSkeleton />}>
          <PendingTasksCard />
        </Suspense>
        <Suspense fallback={<StatsSkeleton />}>
          <HighPriorityCard />
        </Suspense>
      </div>

      <div className="mt-8">
        <Suspense fallback={<div>Loading recent tasks...</div>}>
          <RecentTasks />
        </Suspense>
      </div>
    </div>
  );
}

async function TotalTasksCard() {
  const session = await auth();
  const count = await db.task.count({
    where: { userId: session!.user!.id }
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500 text-sm">Total Tasks</h3>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
}

async function CompletedTasksCard() {
  const session = await auth();
  const count = await db.task.count({
    where: { userId: session!.user!.id, completed: true }
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500 text-sm">Completed</h3>
      <p className="text-3xl font-bold text-green-500">{count}</p>
    </div>
  );
}

async function PendingTasksCard() {
  const session = await auth();
  const count = await db.task.count({
    where: { userId: session!.user!.id, completed: false }
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500 text-sm">Pending</h3>
      <p className="text-3xl font-bold text-orange-500">{count}</p>
    </div>
  );
}

async function HighPriorityCard() {
  const session = await auth();
  const count = await db.task.count({
    where: { userId: session!.user!.id, priority: 'HIGH', completed: false }
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500 text-sm">High Priority</h3>
      <p className="text-3xl font-bold text-red-500">{count}</p>
    </div>
  );
}

async function RecentTasks() {
  const session = await auth();
  const tasks = await db.task.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex justify-between">
            <span>{task.title}</span>
            <span className={task.completed ? 'text-green-500' : 'text-gray-500'}>
              {task.completed ? '✓ Done' : 'Pending'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsSkeleton() {
  return <div className="bg-gray-200 h-32 rounded animate-pulse" />;
}
```

```tsx
// app/(dashboard)/tasks/page.tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import Link from 'next/link';
import { TaskCard } from '@/components/TaskCard';

export default async function TasksPage() {
  const session = await auth();
  
  const tasks = await db.task.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Tasks</h1>
        <Link
          href="/dashboard/tasks/new"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + New Task
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
```

```tsx
// components/TaskCard.tsx
'use client';

import { toggleTask, deleteTask } from '@/lib/actions/tasks';
import { useTransition } from 'react';
import Link from 'next/link';

export function TaskCard({ task }: { task: any }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${
          task.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {task.priority}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{task.description}</p>

      <div className="flex gap-2">
        <button
          onClick={() => startTransition(() => toggleTask(task.id))}
          disabled={isPending}
          className={`flex-1 py-1 rounded ${
            task.completed
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {task.completed ? '✓ Completed' : 'Mark Done'}
        </button>

        <Link
          href={`/dashboard/tasks/${task.id}/edit`}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded"
        >
          Edit
        </Link>

        <button
          onClick={() => {
            if (confirm('Delete this task?')) {
              startTransition(() => deleteTask(task.id));
            }
          }}
          className="px-3 py-1 bg-red-100 text-red-600 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
```

### Step 10: API Routes (30 mins)

```ts
// app/api/tasks/route.ts
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await db.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const task = await db.task.create({
    data: {
      title: body.title,
      description: body.description,
      priority: body.priority || 'MEDIUM',
      userId: session.user.id
    }
  });

  return NextResponse.json({ task }, { status: 201 });
}
```

---

## ✅ Testing Checklist

- [ ] Sign up creates new user
- [ ] Login redirects to dashboard
- [ ] Dashboard shows correct stats
- [ ] Create task works
- [ ] Edit task updates data
- [ ] Delete task removes from DB
- [ ] Toggle task shows optimistic UI
- [ ] Loading states appear
- [ ] Error boundaries catch errors
- [ ] API routes work with curl/Postman
- [ ] Logout clears session

---

## 🚀 Deployment

```bash
# Build for production
npm run build

# Test production build
npm run start

# Deploy to Vercel
npx vercel

# Environment variables to set:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
```

---

## 📝 Extension Ideas

1. **Add categories/tags** to tasks
2. **Task due dates** with reminders
3. **Collaboration** (share tasks with others)
4. **File attachments** to tasks
5. **Dark mode** toggle
6. **Email notifications** for overdue tasks
7. **Analytics dashboard** with charts
8. **Mobile responsive** design improvements

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js v5](https://authjs.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

**Next:** Day 35 - Revision & Mock Interview
