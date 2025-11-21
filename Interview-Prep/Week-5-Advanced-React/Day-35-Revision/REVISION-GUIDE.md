# Day 35: Revision & Mock Interview

## 📚 Quick Revision

### Week 5 Recap: Advanced React & Next.js

#### Day 29: React Server Components (RSC)
- **Server Components**: Run only on server, direct DB access, no JS to client
- **Client Components**: Interactive with `'use client'`, state/effects/events
- **Key Pattern**: Pass Server Components as `children` to Client Components
- **When to Use**: Server for data fetching, Client for interactivity

#### Day 30: Server Actions
- **Definition**: Functions with `'use server'` for mutations
- **Benefits**: No API routes needed, progressive enhancement, type-safe
- **Form Handling**: `<form action={serverAction}>`
- **Revalidation**: `revalidatePath()`, `revalidateTag()`, `redirect()`
- **Hooks**: `useFormStatus`, `useFormState`, `useOptimistic`

#### Day 31: Dynamic Rendering & Caching
- **SSG (Static)**: Build time, fastest, use `generateStaticParams()`
- **ISR (Incremental Static)**: SSG + revalidation, `revalidate: 60`
- **SSR (Server-Side)**: Every request, `dynamic = 'force-dynamic'`
- **Caching Layers**: Request memoization, Data cache, Full route cache, Router cache
- **Revalidation**: Time-based (`revalidate: 60`) or on-demand (`revalidatePath()`)

#### Day 32: Streaming UI & Suspense
- **Suspense**: `<Suspense fallback={<Loading />}><AsyncComponent /></Suspense>`
- **loading.js**: Automatic loading UI for route segments
- **error.js**: Error boundaries for route segments (must be `'use client'`)
- **Parallel Data Fetching**: Multiple Suspense boundaries load independently
- **Benefits**: Faster FCP, progressive loading, better UX

#### Day 33: Performance Optimization
- **React.memo**: Prevent re-renders when props unchanged
- **useCallback**: Memoize functions, `useCallback(fn, [deps])`
- **useMemo**: Memoize expensive calculations, `useMemo(() => compute(), [deps])`
- **React.lazy**: Code splitting, `lazy(() => import('./Component'))`
- **next/image**: Automatic optimization, lazy loading, blur placeholders
- **next/font**: Font optimization, prevent layout shift

#### Day 34: Next.js 15 Project
- **Auth**: NextAuth.js v5 with credentials provider
- **Protected Routes**: Check session in layout, redirect to login
- **Server Actions**: CRUD operations with Prisma
- **Optimistic UI**: `useOptimistic` for instant feedback
- **API Routes**: Public REST API in `/app/api`

---

## 🎯 20 React Interview Questions

### 1. What are React Server Components and how do they differ from Client Components?

**Answer:**

**React Server Components (RSC)** run only on the server and don't send JavaScript to the client. They can:
- Access backend resources directly (databases, file system)
- Keep sensitive data on server (API keys, tokens)
- Use server-only dependencies without increasing bundle size

**Client Components** use `'use client'` directive and run in the browser. They can:
- Use state and effects (`useState`, `useEffect`)
- Handle user interactions (onClick, onChange)
- Use browser APIs (localStorage, window)

**Key Difference:**
- Server Components → Zero JS to client, async, direct backend access
- Client Components → Bundle sent to browser, interactive, no async

**Example:**
```tsx
// Server Component (default)
async function ProductList() {
  const products = await db.product.findMany(); // Direct DB access
  return <ul>{products.map(p => <li>{p.name}</li>)}</ul>;
}

// Client Component
'use client';
function Counter() {
  const [count, setCount] = useState(0); // Needs state
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

### 2. How do Server Actions work in Next.js 15?

**Answer:**

**Server Actions** are asynchronous functions that run on the server, marked with `'use server'`. They enable mutations without creating API routes.

**Key Features:**
- Direct form handling: `<form action={serverAction}>`
- Progressive enhancement (works without JS)
- Automatic serialization and type safety
- Built-in revalidation with `revalidatePath()`

**Example:**
```tsx
// actions.ts
'use server';
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  
  await db.post.create({ data: { title } });
  
  revalidatePath('/posts'); // Clear cache
  redirect('/posts'); // Navigate
}

// page.tsx
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
```

**Benefits:**
- No `/api/posts` route needed
- Form works even if JavaScript fails to load
- Type-safe between client and server

---

### 3. Explain the difference between SSG, ISR, and SSR in Next.js.

**Answer:**

| Strategy | When Rendered      | Use Case                     | Code                        |
| -------- | ------------------ | ---------------------------- | --------------------------- |
| **SSG**  | Build time         | Static content (blogs, docs) | `generateStaticParams()`    |
| **ISR**  | Build + Revalidate | Semi-static (products, news) | `revalidate: 60`            |
| **SSR**  | Every request      | Dynamic/personalized         | `dynamic = 'force-dynamic'` |

**SSG (Static Site Generation):**
```tsx
// Generated at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}
```

**ISR (Incremental Static Regeneration):**
```tsx
// Revalidate every 60 seconds
const posts = await fetch('https://api.example.com/posts', {
  next: { revalidate: 60 }
});
```

**SSR (Server-Side Rendering):**
```tsx
// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getCurrentUser(); // Every request
  return <Dashboard user={user} />;
}
```

**Decision Tree:**
- Data never changes? → **SSG**
- Data changes occasionally? → **ISR**
- Data is user-specific? → **SSR**
- Real-time updates? → **Dynamic**

---

### 4. What are the 4 caching layers in Next.js and how do they work?

**Answer:**

**1. Request Memoization** (Single render)
- Same `fetch()` URL in one render tree → deduplicated
- Automatic, no configuration needed

```tsx
// Both fetch same URL, only 1 network request
async function Header() {
  const user = await fetch('/api/user');
}
async function Sidebar() {
  const user = await fetch('/api/user'); // Memoized
}
```

**2. Data Cache** (Across requests)
- `fetch()` results cached indefinitely by default
- Control with `cache` and `revalidate` options

```tsx
// Cached forever
fetch('https://api.example.com/data');

// Cache for 60 seconds
fetch('https://api.example.com/data', { next: { revalidate: 60 } });

// Never cache
fetch('https://api.example.com/data', { cache: 'no-store' });
```

**3. Full Route Cache** (Static HTML/RSC payload)
- Static routes cached at build time
- Revalidated when data cache invalidated

```tsx
// Cached at build
export default async function Page() {
  const posts = await fetch('...'); // Default cached
}

// Not cached (dynamic)
export const dynamic = 'force-dynamic';
```

**4. Router Cache** (Client-side navigation)
- RSC payload cached in browser for 30 seconds (dynamic) or 5 minutes (static)
- Prefetched routes cached

```tsx
// Prefetching happens automatically
<Link href="/about" prefetch={true}>About</Link>
```

**Clear Cache:**
```tsx
revalidatePath('/posts'); // Clear specific path
revalidateTag('posts'); // Clear tagged fetches
```

---

### 5. How does React Suspense work for streaming?

**Answer:**

**Suspense** lets components "wait" for async operations and show fallback UI while loading.

**How it Works:**
1. Component starts rendering
2. Encounters async operation (data fetch)
3. Suspense boundary catches "suspend"
4. Shows `fallback` UI
5. When data ready, shows component

**Example:**
```tsx
export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile /> {/* Async component */}
      </Suspense>
      
      <Suspense fallback={<PostsSkeleton />}>
        <RecentPosts /> {/* Async component */}
      </Suspense>
    </div>
  );
}

async function UserProfile() {
  const user = await fetchUser(); // 1s
  return <div>{user.name}</div>;
}

async function RecentPosts() {
  const posts = await fetchPosts(); // 2s
  return <ul>{posts.map(p => <li>{p.title}</li>)}</ul>;
}
```

**Timeline:**
```
t=0s:  <UserSkeleton /> and <PostsSkeleton /> shown
t=1s:  <UserProfile /> streams in, <PostsSkeleton /> still showing
t=2s:  <RecentPosts /> streams in
```

**Benefits:**
- Parallel data fetching (no waterfalls)
- Faster First Contentful Paint (FCP)
- Progressive loading (show content as ready)
- Better perceived performance

**Next.js Convention:**
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />; // Automatic Suspense wrapper
}
```

---

### 6. When should you use React.memo, useCallback, and useMemo?

**Answer:**

**React.memo** - Memoize entire component
```tsx
const ExpensiveComponent = memo(({ data }: Props) => {
  // Only re-renders when data changes
  return <div>{data}</div>;
});
```
**Use when:**
- Component is expensive to render
- Props don't change often
- Component is in a list

---

**useCallback** - Memoize functions
```tsx
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []); // Function reference stays same
```
**Use when:**
- Passing function to memoized child component
- Function is in dependency array of other hooks

---

**useMemo** - Memoize expensive calculations
```tsx
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]); // Only re-sorts when data changes
```
**Use when:**
- Expensive computation (sorting, filtering large arrays)
- Creating objects/arrays used as props to memoized components

---

**Example Together:**
```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  // useMemo for expensive computation
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => a.title.localeCompare(b.title));
  }, [todos]);

  // useCallback for stable function reference
  const handleDelete = useCallback((id: string) => {
    deleteTodo(id);
  }, []);

  return (
    <ul>
      {sortedTodos.map(todo => (
        // React.memo prevents re-render if props unchanged
        <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} />
      ))}
    </ul>
  );
}

const TodoItem = memo(({ todo, onDelete }: TodoItemProps) => {
  return (
    <li>
      {todo.title}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});
```

**⚠️ Don't Overuse:**
- Memo has overhead (comparison cost)
- Measure performance before optimizing
- Premature optimization = ❌

---

### 7. How do you implement optimistic UI updates in Next.js?

**Answer:**

**Optimistic UI** updates the interface immediately before the server responds, improving perceived performance.

**Using useOptimistic Hook:**
```tsx
'use client';

import { useOptimistic } from 'react';
import { toggleTodo } from './actions';

export function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, updatedTodo: Todo) => {
      return state.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
    }
  );

  async function handleToggle(todo: Todo) {
    // Update UI immediately
    addOptimistic({ ...todo, completed: !todo.completed });
    
    // Then send to server
    await toggleTodo(todo.id);
  }

  return (
    <ul>
      {optimisticTodos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo)}
          />
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
```

**Server Action:**
```tsx
'use server';

export async function toggleTodo(todoId: string) {
  await db.todo.update({
    where: { id: todoId },
    data: { completed: { set: !completed } }
  });
  
  revalidatePath('/todos');
}
```

**How it Works:**
1. User clicks checkbox
2. UI updates immediately (optimistic)
3. Server Action runs in background
4. If success, UI already correct
5. If error, UI reverts (handle in error boundary)

**Benefits:**
- Instant feedback (no loading spinners)
- Better UX for slow networks
- Feels faster

---

### 8. What's the difference between loading.js and Suspense?

**Answer:**

**loading.js** - File-based convention
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <Skeleton />;
}
```
- Automatic Suspense boundary for entire route
- Shows while page component loads
- Works for route navigation

**Suspense** - Component-level control
```tsx
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```
- Granular control over what's loading
- Multiple Suspense boundaries in one page
- Better for parallel data fetching

**Comparison:**

| Feature            | loading.js   | Suspense           |
| ------------------ | ------------ | ------------------ |
| Scope              | Entire route | Specific component |
| Granularity        | Coarse       | Fine               |
| Multiple on page   | No           | Yes                |
| Navigation loading | Yes          | No                 |

**Best Practice - Use Both:**
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <PageSkeleton />; // Route-level loading
}

// app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div>
      <Header /> {/* Static */}
      
      {/* Component-level loading */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <Charts />
      </Suspense>
    </div>
  );
}
```

---

### 9. How does error handling work in Next.js App Router?

**Answer:**

**error.js** - File-based error boundaries
```tsx
// app/dashboard/error.tsx
'use client'; // Must be Client Component

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**Error Hierarchy:**
```
app/
├── global-error.tsx    ← Catches root layout errors
├── layout.tsx
├── error.tsx           ← Catches page errors
├── page.tsx
└── dashboard/
    ├── error.tsx       ← Catches dashboard errors (takes precedence)
    └── page.tsx
```

**Throwing Errors:**
```tsx
// Server Component
export default async function Page() {
  const data = await fetchData();
  
  if (!data) {
    throw new Error('Data not found');
  }
  
  return <Dashboard data={data} />;
}
```

**Custom Errors:**
```tsx
class NotFoundError extends Error {
  constructor() {
    super('Resource not found');
    this.name = 'NotFoundError';
  }
}

// error.tsx
export default function Error({ error }: { error: Error }) {
  if (error instanceof NotFoundError) {
    return <NotFoundPage />;
  }
  
  return <GenericErrorPage error={error} />;
}
```

**not-found.js** - Special case for 404
```tsx
// app/not-found.tsx
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

// Trigger with notFound()
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const data = await getData(params.id);
  
  if (!data) {
    notFound(); // Shows not-found.tsx
  }
  
  return <div>{data}</div>;
}
```

---

### 10. How do you prevent data fetching waterfalls in Next.js?

**Answer:**

**Waterfall** = Sequential fetches where one waits for another.

**❌ Bad - Waterfall:**
```tsx
async function Page() {
  const user = await fetchUser();         // 1s
  const posts = await fetchUserPosts(user.id); // 2s ← waits!
  // Total: 3s
}
```

**✅ Solution 1: Parallel Promise.all**
```tsx
async function Page() {
  const [user, posts] = await Promise.all([
    fetchUser(),    // 1s ┐
    fetchPosts()    // 2s ├─ Parallel
  ]);               //     ┘
  // Total: 2s (max of both)
}
```

**✅ Solution 2: Multiple Suspense Boundaries**
```tsx
function Page() {
  return (
    <div>
      {/* Both load in parallel */}
      <Suspense fallback={<UserSkeleton />}>
        <UserSection />  {/* Fetches user independently */}
      </Suspense>
      
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection />  {/* Fetches posts independently */}
      </Suspense>
    </div>
  );
}

async function UserSection() {
  const user = await fetchUser();
  return <div>{user.name}</div>;
}

async function PostsSection() {
  const posts = await fetchPosts();
  return <ul>{posts.map(p => <li>{p.title}</li>)}</ul>;
}
```

**✅ Solution 3: Preload Pattern**
```tsx
import { preload } from 'react-dom';

function Page() {
  // Start loading immediately
  preload(fetchUser, { as: 'fetch' });
  preload(fetchPosts, { as: 'fetch' });
  
  return (
    <Suspense>
      <Content /> {/* Data already loading */}
    </Suspense>
  );
}
```

**Best Practice:**
```tsx
// ❌ Don't do this
async function Page() {
  const user = await fetchUser();
  const posts = await fetchUserPosts(user.id); // Depends on user
}

// ✅ Do this instead
function Page() {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <DataComponent />
      </Suspense>
    </>
  );
}

async function DataComponent() {
  // Both start immediately
  const userPromise = fetchUser();
  const user = await userPromise;
  const posts = await fetchUserPosts(user.id); // Still sequential but started earlier
}
```

---

### 11-20: Quick Fire Questions

**11. What's the purpose of generateStaticParams()?**
```tsx
// Pre-render dynamic routes at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}
// Generates: /posts/first, /posts/second, etc.
```

---

**12. How do you revalidate ISR pages on-demand?**
```tsx
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function updatePost(id: string) {
  await db.post.update({ where: { id }, data: {...} });
  
  revalidatePath(`/posts/${id}`); // Specific page
  // OR
  revalidateTag('posts'); // All fetches with tag
}
```

---

**13. What's the difference between redirect() and router.push()?**
- `redirect()`: Server-side, use in Server Actions/Components
- `router.push()`: Client-side, use in Client Components
```tsx
// Server Action
'use server';
export async function create() {
  await db.create();
  redirect('/success'); // Server redirect
}

// Client Component
'use client';
function Button() {
  const router = useRouter();
  router.push('/success'); // Client navigation
}
```

---

**14. How do you handle form validation in Server Actions?**
```tsx
'use server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function signup(formData: FormData) {
  const result = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });
  
  if (!result.success) {
    return { error: result.error.flatten() };
  }
  
  // Proceed with valid data
}
```

---

**15. What's useFormStatus used for?**
```tsx
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus(); // Tracks form submission
  
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// Must be child of <form>
<form action={serverAction}>
  <input name="title" />
  <SubmitButton /> {/* Knows when form is submitting */}
</form>
```

---

**16. How do you implement middleware in Next.js?**
```ts
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'] // Protected routes
};
```

---

**17. What's the difference between layouts and templates?**
- **Layouts**: Persist across navigations, state preserved
- **Templates**: Re-render on navigation, state reset
```tsx
// layout.tsx - State persists
export default function Layout({ children }) {
  const [count, setCount] = useState(0); // Persists
  return <div>{children}</div>;
}

// template.tsx - State resets
export default function Template({ children }) {
  const [count, setCount] = useState(0); // Resets on navigation
  return <div>{children}</div>;
}
```

---

**18. How do you optimize images in Next.js?**
```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={400}
  priority          // Above fold (load immediately)
  placeholder="blur" // Blur while loading
  sizes="(max-width: 768px) 100vw, 50vw" // Responsive
  quality={90}       // Compression (default 75)
/>
```

---

**19. What's the purpose of Route Segment Config?**
```tsx
// Configure route behavior
export const dynamic = 'force-dynamic'; // SSR
export const revalidate = 60; // ISR every 60s
export const runtime = 'edge'; // Edge runtime
export const fetchCache = 'force-no-store'; // No caching

export default function Page() {
  // Route respects above configs
}
```

---

**20. How do you implement search params in Next.js?**
```tsx
// Server Component (auto dynamic)
export default function Page({
  searchParams
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  
  return <SearchResults query={query} page={page} />;
}

// Client Component
'use client';
import { useSearchParams, useRouter } from 'next/navigation';

function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  function handleSearch(query: string) {
    const params = new URLSearchParams(searchParams);
    params.set('q', query);
    router.push(`?${params.toString()}`);
  }
}
```

---

## 🎭 Mock Interview Scenarios

### Scenario 1: System Design - Build a React Dashboard

**Question:** "Design a real-time dashboard for an e-commerce platform showing orders, revenue, and user activity."

**Answer Structure:**
1. **Requirements Gathering:**
   - Real-time updates? → WebSockets or polling
   - Data volume? → Pagination, infinite scroll
   - User roles? → Admin, manager, viewer

2. **Architecture:**
   ```
   Next.js 15 App Router
   ├── Server Components: Static shell, initial data
   ├── Client Components: Charts, real-time updates
   ├── Server Actions: Mutations (refund, cancel order)
   ├── API Routes: WebSocket connections
   └── Database: PostgreSQL with Prisma
   ```

3. **Rendering Strategy:**
   - Dashboard shell: SSR (user-specific)
   - Stats cards: ISR (revalidate: 60)
   - Real-time feed: Client Component with WebSocket
   - Historical charts: SSG with on-demand revalidation

4. **Performance:**
   - React.memo for chart components
   - useMemo for expensive calculations
   - Code split charts with React.lazy
   - Optimize images with next/image

5. **Code Sample:**
   ```tsx
   export default function Dashboard() {
     return (
       <div>
         <Suspense fallback={<StatsSkeleton />}>
           <StatsCards /> {/* ISR */}
         </Suspense>
         
         <Suspense fallback={<ChartSkeleton />}>
           <RevenueChart /> {/* Lazy loaded */}
         </Suspense>
         
         <RealtimeFeed /> {/* Client Component with WebSocket */}
       </div>
     );
   }
   ```

---

### Scenario 2: Performance Problem

**Question:** "Your product list page is slow. Users see a blank screen for 3 seconds. How do you diagnose and fix it?"

**Answer:**
1. **Diagnose:**
   - Check Network tab: Slow API calls?
   - Check Performance tab: Long render time?
   - Check bundle size: Large JavaScript?

2. **Solutions:**
   ```tsx
   // ❌ Before: Waterfall
   async function Page() {
     const products = await fetchProducts(); // 3s
     return <ProductList products={products} />;
   }
   
   // ✅ After: Streaming with Suspense
   function Page() {
     return (
       <div>
         <Header /> {/* Shows immediately */}
         <Suspense fallback={<ProductSkeleton />}>
           <ProductList /> {/* Streams when ready */}
         </Suspense>
       </div>
     );
   }
   ```

3. **Additional Optimizations:**
   - Implement ISR: `revalidate: 300`
   - Add search with debounce: `useMemo` for filtering
   - Lazy load images: `<Image loading="lazy" />`
   - Pagination: Limit to 20 products per page

---

## ✅ Final Checklist

- [ ] Understand Server vs Client Components
- [ ] Know when to use SSG, ISR, SSR
- [ ] Implement Server Actions with forms
- [ ] Use Suspense for streaming
- [ ] Handle errors with error.js
- [ ] Optimize with memo, useCallback, useMemo
- [ ] Implement loading states
- [ ] Cache strategies (4 layers)
- [ ] Revalidation (time-based and on-demand)
- [ ] Build full-stack Next.js app

---

## 🚀 You're Ready!

You've completed **Week 5: Advanced React & Next.js**. You now know:
✅ React Server Components architecture  
✅ Server Actions for mutations  
✅ Rendering strategies (SSG, ISR, SSR)  
✅ Streaming UI with Suspense  
✅ Performance optimization techniques  
✅ Building production Next.js apps  

**Next Steps:**
1. Build your own Next.js project
2. Practice interview questions daily
3. Review Weeks 1-4 (Node.js, Databases, System Design, AWS)
4. Mock interviews with peers

**Good luck! 🎉**
