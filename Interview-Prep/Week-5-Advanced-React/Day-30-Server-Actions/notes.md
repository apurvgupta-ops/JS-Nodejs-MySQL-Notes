# Day 30: Server Actions

## 📚 Table of Contents
1. Introduction to Server Actions
2. Basic Server Action Implementation
3. Form Handling with Server Actions
4. Progressive Enhancement
5. Mutations and Revalidation
6. Error Handling
7. Loading States & Optimistic Updates

---

## 1. Introduction to Server Actions

**Server Actions** allow you to run server-side code directly from client components **without creating API routes**.

### Traditional vs Server Actions

**Traditional (API Routes):**
```tsx
// app/api/posts/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  await db.post.create({ data });
  return Response.json({ success: true });
}

// components/CreatePostForm.tsx
'use client';
function CreatePostForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**With Server Actions:**
```tsx
// app/actions.ts
'use server';
export async function createPost(data: FormData) {
  await db.post.create({
    data: {
      title: data.get('title'),
      content: data.get('content')
    }
  });
}

// components/CreatePostForm.tsx
import { createPost } from '@/app/actions';

function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" />
      <textarea name="content" />
      <button type="submit">Create</button>
    </form>
  );
}
```

### Benefits

| Benefit                     | Description                    |
| --------------------------- | ------------------------------ |
| **No API Routes**           | Call server code directly      |
| **Progressive Enhancement** | Works without JavaScript       |
| **Type Safety**             | End-to-end TypeScript          |
| **Automatic Serialization** | FormData handled automatically |
| **Revalidation**            | Easy cache invalidation        |

---

## 2. Basic Server Action Implementation

### Defining Server Actions

**Method 1: Separate File (Recommended)**
```ts
// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  await db.user.create({
    data: { name, email }
  });
  
  return { success: true };
}
```

**Method 2: Inline in Server Component**
```tsx
// app/page.tsx
export default function Page() {
  async function createUser(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    await db.user.create({ data: { name } });
  }

  return (
    <form action={createUser}>
      <input name="name" />
      <button>Submit</button>
    </form>
  );
}
```

### Using Server Actions

**In Forms (Recommended):**
```tsx
import { createPost } from '@/app/actions';

function Form() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

**With Event Handlers:**
```tsx
'use client';
import { deletePost } from '@/app/actions';

function DeleteButton({ postId }: { postId: string }) {
  return (
    <button
      onClick={async () => {
        await deletePost(postId);
      }}
    >
      Delete
    </button>
  );
}
```

---

## 3. Form Handling with Server Actions

### Complete CRUD Example

**actions.ts:**
```ts
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Create
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  if (!title || !content) {
    return { error: 'Title and content required' };
  }

  await prisma.post.create({
    data: { title, content, published: false }
  });

  revalidatePath('/posts');
  redirect('/posts');
}

// Read (in Server Component)
export async function getPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

// Update
export async function updatePost(postId: string, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await prisma.post.update({
    where: { id: postId },
    data: { title, content }
  });

  revalidatePath(`/posts/${postId}`);
  return { success: true };
}

// Delete
export async function deletePost(postId: string) {
  await prisma.post.delete({
    where: { id: postId }
  });

  revalidatePath('/posts');
}

// Toggle Published
export async function togglePublished(postId: string, published: boolean) {
  await prisma.post.update({
    where: { id: postId },
    data: { published }
  });

  revalidatePath('/posts');
}
```

### Create Form

```tsx
// app/posts/new/page.tsx
import { createPost } from '@/app/actions';

export default function NewPostPage() {
  return (
    <div>
      <h1>Create New Post</h1>
      <form action={createPost} className="space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full border p-2"
          />
        </div>
        
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={10}
            required
            className="w-full border p-2"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
```

### Edit Form

```tsx
// app/posts/[id]/edit/page.tsx
import { prisma } from '@/lib/db';
import { updatePost } from '@/app/actions';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id }
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <div>
      <h1>Edit Post</h1>
      <form action={updatePostWithId} className="space-y-4">
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={post.title}
            required
          />
        </div>
        
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={10}
            defaultValue={post.content}
            required
          />
        </div>
        
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}
```

### Delete Button (Client Component)

```tsx
// components/DeleteButton.tsx
'use client';

import { deletePost } from '@/app/actions';
import { useTransition } from 'react';

export default function DeleteButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm('Are you sure?')) {
          startTransition(async () => {
            await deletePost(postId);
          });
        }
      }}
      disabled={isPending}
      className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## 4. Progressive Enhancement

Server Actions work **without JavaScript** enabled!

### Form with Progressive Enhancement

```tsx
// app/posts/new/page.tsx
import { createPost } from '@/app/actions';
import SubmitButton from '@/components/SubmitButton';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <textarea name="content" required />
      
      {/* Works without JS */}
      <button type="submit">Create (No JS)</button>
      
      {/* Enhanced with JS */}
      <SubmitButton />
    </form>
  );
}
```

**components/SubmitButton.tsx:**
```tsx
'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}
```

**How it works:**
1. **Without JS:** Form submits, page refreshes, action runs
2. **With JS:** React intercepts, runs action, updates UI without refresh

---

## 5. Mutations and Revalidation

### Revalidating Cached Data

**Option 1: Revalidate Path**
```ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  await db.post.create({ data: {...} });
  
  // Revalidate specific path
  revalidatePath('/posts');
  
  // Revalidate layout
  revalidatePath('/posts', 'layout');
  
  // Revalidate all
  revalidatePath('/', 'layout');
}
```

**Option 2: Revalidate Tag**
```ts
'use server';

import { revalidateTag } from 'next/cache';

export async function createPost(formData: FormData) {
  await db.post.create({ data: {...} });
  
  // Revalidate by tag
  revalidateTag('posts');
}

// Fetch with tag
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  });
  return res.json();
}
```

### Redirect After Mutation

```ts
'use server';

import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const post = await db.post.create({ data: {...} });
  
  // Redirect to new post
  redirect(`/posts/${post.id}`);
}
```

---

## 6. Error Handling

### Returning Errors

```ts
// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string;

  // Validation
  if (!email.includes('@')) {
    return { error: 'Invalid email' };
  }

  // Check duplicate
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Email already exists' };
  }

  try {
    await db.user.create({ data: { email } });
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create user' };
  }
}
```

### Displaying Errors

```tsx
// components/SignupForm.tsx
'use client';

import { useState } from 'react';
import { createUser } from '@/app/actions';

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createUser(formData);
    
    if (result.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">
          {error}
        </div>
      )}
      
      <input name="email" type="email" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

### Using useFormState (React 19)

```tsx
'use client';

import { useFormState } from 'react-dom';
import { createUser } from '@/app/actions';

const initialState = {
  message: '',
  errors: {}
};

export default function SignupForm() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction}>
      {state.message && (
        <div className={state.message.includes('Success') ? 'text-green-600' : 'text-red-600'}>
          {state.message}
        </div>
      )}
      
      <input name="email" />
      {state.errors?.email && <p className="text-red-500">{state.errors.email}</p>}
      
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

**Updated Action:**
```ts
'use server';

export async function createUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  if (!email.includes('@')) {
    return {
      message: 'Validation failed',
      errors: { email: 'Invalid email format' }
    };
  }

  try {
    await db.user.create({ data: { email } });
    return { message: 'Success! User created.' };
  } catch (error) {
    return { message: 'Failed to create user' };
  }
}
```

---

## 7. Loading States & Optimistic Updates

### Loading States with useFormStatus

```tsx
'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
    >
      {pending ? (
        <>
          <span className="spinner" />
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </button>
  );
}
```

### Optimistic Updates with useOptimistic

```tsx
'use client';

import { useOptimistic } from 'react';
import { toggleLike } from '@/app/actions';

export default function LikeButton({ postId, initialLikes, initialLiked }) {
  const [optimisticState, addOptimistic] = useOptimistic(
    { likes: initialLikes, liked: initialLiked },
    (state, newLiked: boolean) => ({
      likes: newLiked ? state.likes + 1 : state.likes - 1,
      liked: newLiked
    })
  );

  async function handleLike() {
    // Update UI optimistically
    addOptimistic(!optimisticState.liked);
    
    // Server action (may fail)
    await toggleLike(postId);
  }

  return (
    <button
      onClick={handleLike}
      className={optimisticState.liked ? 'text-red-500' : 'text-gray-500'}
    >
      ❤️ {optimisticState.likes}
    </button>
  );
}
```

### Complete Example: Todo List

**actions.ts:**
```ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';

export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string;
  
  await prisma.todo.create({
    data: { title, completed: false }
  });
  
  revalidatePath('/todos');
}

export async function toggleTodo(id: string, completed: boolean) {
  await prisma.todo.update({
    where: { id },
    data: { completed }
  });
  
  revalidatePath('/todos');
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({ where: { id } });
  revalidatePath('/todos');
}
```

**TodoList.tsx:**
```tsx
'use client';

import { toggleTodo, deleteTodo } from '@/app/actions';
import { useOptimistic, useTransition } from 'react';

export default function TodoList({ todos }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, { id, completed }) => 
      state.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      )
  );
  
  const [isPending, startTransition] = useTransition();

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              startTransition(() => {
                addOptimistic({ id: todo.id, completed: !todo.completed });
                toggleTodo(todo.id, !todo.completed);
              });
            }}
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.title}
          </span>
          <button
            onClick={() => startTransition(() => deleteTodo(todo.id))}
            className="text-red-500"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 📝 Practice Tasks

### Task 1: Blog Post Manager

Create a blog management system with:
- Create post form (Server Action)
- Edit post form (Server Action with bound ID)
- Delete button (Client Component with confirmation)
- Publish/Unpublish toggle
- Proper revalidation

### Task 2: Contact Form

Build a contact form with:
- Server Action for submission
- Email validation
- Success/error messages
- Loading state during submission
- Works without JavaScript

### Task 3: Todo App with Optimistic UI

Create a todo application with:
- Add todo (Server Action)
- Toggle completed (optimistic update)
- Delete todo (with transition)
- Proper error handling

See `/tasks` folder for detailed requirements.

---

## 🔗 Quick Reference

### Server Action Syntax
```ts
'use server';
export async function myAction(formData: FormData) {
  // Server-side code
}
```

### Form Usage
```tsx
<form action={myAction}>
  <input name="field" />
  <button type="submit">Submit</button>
</form>
```

### Revalidation
```ts
revalidatePath('/path');
revalidateTag('tag');
redirect('/new-path');
```

### Error Handling
```ts
return { error: 'Message' };
return { success: true, data: {...} };
```

### Loading States
```tsx
const { pending } = useFormStatus();
const [isPending, startTransition] = useTransition();
```

### Optimistic Updates
```tsx
const [optimisticData, addOptimistic] = useOptimistic(initialData, updater);
```

**Next:** Day 31 - Dynamic Rendering & Caching
