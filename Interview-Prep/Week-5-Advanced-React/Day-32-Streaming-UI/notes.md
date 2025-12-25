# Day 32: Streaming UI & Suspense

## 📚 Table of Contents
1. Introduction to Streaming
2. React Suspense Basics
3. Streaming in Next.js
4. Loading States with loading.js
5. Error Boundaries with error.js
6. Parallel Data Fetching
7. Best Practices

---

## 1. Introduction to Streaming

**Streaming** sends HTML to the browser in **chunks** as it's generated, instead of waiting for the entire page.

### Traditional vs Streaming

**Traditional (No Streaming):**
```
Server: Fetch data (3s) → Render HTML → Send complete HTML
Browser: Wait... → Receive HTML → Display
User sees: Blank screen for 3s → Full page
```

**With Streaming:**
```
Server: Send shell → Fetch data (3s) → Stream components as ready
Browser: Display shell immediately → Display components as they arrive
User sees: Layout immediately → Content loads progressively
```

### Benefits

✅ **Faster First Contentful Paint (FCP)**  
✅ **Better perceived performance**  
✅ **No waterfalls** (parallel data fetching)  
✅ **Progressive enhancement**  

---

## 2. React Suspense Basics

**Suspense** lets components "wait" for async operations and show fallback UI.

### Basic Suspense

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
      
      <FastComponent />
    </div>
  );
}

async function SlowComponent() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  const data = await fetchData();
  return <div>{data}</div>;
}

function Skeleton() {
  return <div className="animate-pulse bg-gray-200 h-20" />;
}
```

**Render Flow:**
```
1. Page shell renders immediately
2. <Skeleton /> shows where SlowComponent will be
3. SlowComponent fetches data in background
4. When ready, Skeleton replaced with SlowComponent
```

### Multiple Suspense Boundaries

```tsx
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Each boundary streams independently */}
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile /> {/* 1s */}
      </Suspense>
      
      <Suspense fallback={<PostsSkeleton />}>
        <RecentPosts /> {/* 2s */}
      </Suspense>
      
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics /> {/* 3s */}
      </Suspense>
    </div>
  );
}
```

**Timeline:**
```
t=0s:  Shell + all skeletons visible
t=1s:  UserProfile appears (replacing UserSkeleton)
t=2s:  RecentPosts appears (replacing PostsSkeleton)
t=3s:  Analytics appears (replacing AnalyticsSkeleton)
```

### Nested Suspense

```tsx
function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Layout>
        <Suspense fallback={<NavSkeleton />}>
          <Nav />
        </Suspense>
        
        <Suspense fallback={<ContentSkeleton />}>
          <Content />
        </Suspense>
      </Layout>
    </Suspense>
  );
}
```

---

## 3. Streaming in Next.js

Next.js automatically streams Server Components wrapped in Suspense.

### Automatic Streaming

```tsx
// app/page.tsx
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div>
      <Header /> {/* Renders immediately */}
      
      <Suspense fallback={<LoadingPosts />}>
        <Posts /> {/* Streams when ready */}
      </Suspense>
    </div>
  );
}

async function Posts() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Streaming with Parallel Fetches

```tsx
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* All fetch in parallel, stream as ready */}
      <div className="grid grid-cols-3 gap-4">
        <Suspense fallback={<CardSkeleton />}>
          <UserCard />
        </Suspense>
        
        <Suspense fallback={<CardSkeleton />}>
          <StatsCard />
        </Suspense>
        
        <Suspense fallback={<CardSkeleton />}>
          <ActivityCard />
        </Suspense>
      </div>
    </div>
  );
}

async function UserCard() {
  const user = await fetchUser(); // 1s
  return <div>{user.name}</div>;
}

async function StatsCard() {
  const stats = await fetchStats(); // 2s
  return <div>{stats.total}</div>;
}

async function ActivityCard() {
  const activity = await fetchActivity(); // 1.5s
  return <div>{activity.count} activities</div>;
}
```

**Without Suspense (waterfall):**
```
fetchUser (1s) → fetchStats (2s) → fetchActivity (1.5s) = 4.5s total
```

**With Suspense (parallel):**
```
fetchUser (1s) ┐
fetchStats (2s) ├─ All parallel = 2s total (max of all)
fetchActivity (1.5s) ┘
```

---

## 4. Loading States with loading.js

Next.js provides a **loading.js** convention for automatic loading states.

### Basic loading.js

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}
```

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchDashboardData();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardContent data={data} />
    </div>
  );
}
```

**Automatic Suspense Wrapping:**
```tsx
// Next.js automatically does this:
<Suspense fallback={<Loading />}>
  <DashboardPage />
</Suspense>
```

### Nested Loading States

```
app/
├── dashboard/
│   ├── loading.tsx      ← Loading for /dashboard
│   ├── page.tsx
│   └── analytics/
│       ├── loading.tsx  ← Loading for /dashboard/analytics
│       └── page.tsx
```

### Instant Loading UI

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Instant layout */}
      <header className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      </header>
      
      {/* Grid skeletons */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      
      {/* Table skeleton */}
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Error Boundaries with error.js

Handle errors in async components with **error.js**.

### Basic error.js

```tsx
// app/dashboard/error.tsx
'use client'; // Error boundaries must be Client Components

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // If this throws, error.tsx catches it
  const data = await fetchDashboardData();
  
  if (!data) {
    throw new Error('Failed to load dashboard data');
  }
  
  return <Dashboard data={data} />;
}
```

### Global Error Handler

```tsx
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Application Error!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

### Error Boundary Hierarchy

```
app/
├── global-error.tsx    ← Catches root layout errors
├── layout.tsx
├── error.tsx           ← Catches root page errors
├── page.tsx
└── dashboard/
    ├── error.tsx       ← Catches dashboard errors
    ├── loading.tsx
    └── page.tsx
```

---

## 6. Parallel Data Fetching

Avoid waterfalls by fetching data in parallel.

### ❌ Waterfall (Sequential)

```tsx
async function Page() {
  const user = await fetchUser();         // 1s
  const posts = await fetchPosts();       // 2s  ← waits for user
  const comments = await fetchComments(); // 1s  ← waits for posts
  // Total: 4s
}
```

### ✅ Parallel Fetching

```tsx
async function Page() {
  // All fetch simultaneously
  const [user, posts, comments] = await Promise.all([
    fetchUser(),      // 1s
    fetchPosts(),     // 2s
    fetchComments()   // 1s
  ]);
  // Total: 2s (max of all)
}
```

### Parallel with Suspense

```tsx
function Page() {
  return (
    <div>
      {/* All load in parallel, stream as ready */}
      <Suspense fallback={<UserSkeleton />}>
        <User />
      </Suspense>
      
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
      
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>
    </div>
  );
}

async function User() {
  const user = await fetchUser();
  return <div>{user.name}</div>;
}

async function Posts() {
  const posts = await fetchPosts();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}

async function Comments() {
  const comments = await fetchComments();
  return <div>{comments.length} comments</div>;
}
```

### Preventing Waterfalls

**❌ Bad (Waterfall):**
```tsx
async function Page() {
  const user = await fetchUser();
  const posts = await fetchUserPosts(user.id); // Waits for user
  return <Dashboard user={user} posts={posts} />;
}
```

**✅ Good (Parallel Start):**
```tsx
// Start both fetches immediately
function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  // Both start immediately, even though Posts needs user.id
  const userPromise = fetchUser();
  const user = await userPromise;
  const posts = await fetchUserPosts(user.id);
  
  return <div>{user.name} - {posts.length} posts</div>;
}

// Better: Fetch in parallel components
function Page() {
  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserSection />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection />
      </Suspense>
    </div>
  );
}
```

---

## 7. Best Practices

### 1. Granular Suspense Boundaries

**❌ Bad (One big boundary):**
```tsx
function Page() {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <Header />
      <Sidebar />
      <Content />
      <Footer />
    </Suspense>
  );
}
// User waits for ALL components
```

**✅ Good (Multiple boundaries):**
```tsx
function Page() {
  return (
    <div>
      <Header /> {/* Static, renders immediately */}
      
      <div className="flex">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        
        <Suspense fallback={<ContentSkeleton />}>
          <Content />
        </Suspense>
      </div>
      
      <Footer /> {/* Static, renders immediately */}
    </div>
  );
}
```

### 2. Meaningful Loading States

**❌ Bad (Generic spinner):**
```tsx
function Loading() {
  return <div>Loading...</div>;
}
```

**✅ Good (Skeleton matching layout):**
```tsx
function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
```

### 3. Preload Data

```tsx
import { preload } from 'react-dom';

function Page() {
  // Start loading immediately
  preload(fetchData, { as: 'fetch' });
  
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const data = await fetchData(); // Already loading!
  return <div>{data}</div>;
}
```

### 4. Error Recovery

```tsx
'use client';

import { useState } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const [retries, setRetries] = useState(0);

  return (
    <div>
      <h2>Error: {error.message}</h2>
      <p>Retried {retries} times</p>
      <button
        onClick={() => {
          setRetries(r => r + 1);
          reset();
        }}
        disabled={retries >= 3}
      >
        {retries >= 3 ? 'Max retries reached' : 'Try again'}
      </button>
    </div>
  );
}
```

---

## 📝 Complete Example: Dashboard

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>
      
      {/* Stats cards - stream independently */}
      <div className="grid grid-cols-4 gap-4">
        <Suspense fallback={<StatsSkeleton />}>
          <TotalUsersCard />
        </Suspense>
        <Suspense fallback={<StatsSkeleton />}>
          <RevenueCard />
        </Suspense>
        <Suspense fallback={<StatsSkeleton />}>
          <OrdersCard />
        </Suspense>
        <Suspense fallback={<StatsSkeleton />}>
          <VisitorsCard />
        </Suspense>
      </div>
      
      {/* Charts - stream as ready */}
      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <OrdersChart />
        </Suspense>
      </div>
      
      {/* Recent orders table */}
      <Suspense fallback={<TableSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

// Components
async function TotalUsersCard() {
  const count = await db.user.count();
  return <StatsCard title="Total Users" value={count} />;
}

async function RevenueCard() {
  const revenue = await db.order.aggregate({ _sum: { total: true } });
  return <StatsCard title="Revenue" value={`$${revenue._sum.total}`} />;
}

// Skeletons
function StatsSkeleton() {
  return <div className="h-32 bg-gray-200 rounded animate-pulse" />;
}

function ChartSkeleton() {
  return <div className="h-64 bg-gray-200 rounded animate-pulse" />;
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
```

---

## 📝 Practice Tasks

### Task 1: Streaming Dashboard

Build dashboard with:
- 4 stats cards (stream independently)
- 2 charts (parallel fetch)
- Recent activity list
- Proper loading skeletons

### Task 2: Blog with Comments

Create blog post page with:
- Post content (static)
- Comments section (Suspense)
- Related posts (Suspense)
- Author info (Suspense)

### Task 3: Error Handling

Implement:
- Global error boundary
- Page-level error boundary
- Component-level error recovery
- Retry mechanism

See `/tasks` folder for detailed requirements.

---

## 🔗 Quick Reference

| Pattern        | Code                                                    |
| -------------- | ------------------------------------------------------- |
| Basic Suspense | `<Suspense fallback={<Loading />}><Async /></Suspense>` |
| Loading file   | `app/page/loading.tsx`                                  |
| Error file     | `app/page/error.tsx` (must be 'use client')             |
| Parallel fetch | `Promise.all([fetch1(), fetch2()])`                     |
| Preload        | `preload(fn, { as: 'fetch' })`                          |

**Next:** Day 33 - Performance Optimization
