# Day 29: React Server Components (RSC)

## 📚 Table of Contents
1. Introduction to React Server Components
2. Client vs Server Components
3. RSC Architecture
4. When to Use Each Type
5. Component Composition Patterns
6. Data Fetching in Server Components
7. Best Practices

---

## 1. Introduction to React Server Components

**React Server Components (RSC)** are components that render **on the server only** and never ship JavaScript to the client.

### Traditional React vs RSC

**Traditional React (Client-Side):**
```
1. Server sends HTML shell
2. Browser downloads entire JavaScript bundle
3. React hydrates and renders on client
4. All components run in browser
```

**With RSC:**
```
1. Server renders Server Components → HTML
2. Only Client Components bundled as JavaScript
3. Browser receives pre-rendered HTML + minimal JS
4. Interactive components hydrate
```

### Benefits of RSC

| Benefit                      | Description                             |
| ---------------------------- | --------------------------------------- |
| **Smaller Bundle Size**      | Server Components don't ship to client  |
| **Direct Backend Access**    | Access databases, file systems directly |
| **Better Performance**       | Less JavaScript to parse and execute    |
| **Automatic Code Splitting** | Client Components auto-split by default |
| **Zero Waterfalls**          | Fetch data in parallel on server        |
| **SEO-Friendly**             | Fully rendered HTML sent to browser     |

### Example: Bundle Size Comparison

**Without RSC:**
```tsx
// All this code ships to browser
import React from 'react';
import marked from 'marked'; // 50KB library
import hljs from 'highlight.js'; // 100KB library

export default function BlogPost({ content }) {
  const html = marked(content);
  const highlighted = hljs.highlightAuto(html);
  return <div dangerouslySetInnerHTML={{ __html: highlighted.value }} />;
}

// Bundle: ~150KB + React
```

**With RSC:**
```tsx
// This runs on server only
import marked from 'marked'; // NOT sent to browser
import hljs from 'highlight.js'; // NOT sent to browser

export default async function BlogPost({ slug }) {
  const content = await fetchBlogPost(slug); // Direct DB access
  const html = marked(content);
  const highlighted = hljs.highlightAuto(html);
  return <div dangerouslySetInnerHTML={{ __html: highlighted.value }} />;
}

// Bundle: 0KB (pure HTML sent to client)
```

---

## 2. Client vs Server Components

### Server Components (Default in Next.js 15)

**Characteristics:**
- ✅ Render on server only
- ✅ Can be async
- ✅ Access backend resources directly
- ✅ Don't ship JavaScript to client
- ❌ Cannot use browser APIs
- ❌ Cannot use state/effects
- ❌ Cannot use event handlers

**Example:**
```tsx
// app/posts/page.tsx (Server Component)
import { prisma } from '@/lib/db';

export default async function PostsPage() {
  // Direct database access
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Client Components

**Characteristics:**
- ✅ Render on client (hydration)
- ✅ Can use state and effects
- ✅ Can use browser APIs
- ✅ Can use event handlers
- ❌ Cannot be async
- ❌ Increase bundle size

**Example:**
```tsx
// components/LikeButton.tsx (Client Component)
'use client'; // Required directive

import { useState } from 'react';

export default function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    
    await fetch(`/api/posts/${postId}/like`, {
      method: 'POST'
    });
  };

  return (
    <button onClick={handleLike} className={isLiked ? 'liked' : ''}>
      ❤️ {likes}
    </button>
  );
}
```

### Comparison Table

| Feature              | Server Component | Client Component |
| -------------------- | ---------------- | ---------------- |
| **Directive**        | None (default)   | `'use client'`   |
| **Async**            | ✅ Yes            | ❌ No             |
| **State/Effects**    | ❌ No             | ✅ Yes            |
| **Event Handlers**   | ❌ No             | ✅ Yes            |
| **Browser APIs**     | ❌ No             | ✅ Yes            |
| **Direct DB Access** | ✅ Yes            | ❌ No             |
| **Bundle Impact**    | None             | Increases        |

---

## 3. RSC Architecture

### Request Flow

```
Client Request
  ↓
Next.js Server
  ↓
┌─────────────────────────────┐
│   Server Components Tree    │
│  ┌───────────────────────┐  │
│  │  Layout (Server)      │  │
│  │    ├─ Nav (Server)    │  │
│  │    └─ Page (Server)   │  │
│  │         ├─ Posts      │  │ ← Fetch data
│  │         └─ LikeButton │  │ ← Client Component
│  └───────────────────────┘  │
└─────────────────────────────┘
  ↓
Server renders to RSC Payload
  ↓
┌─────────────────────────────┐
│   RSC Payload (JSON-like)   │
│   {                         │
│     posts: [...],           │
│     clientComponents: [     │
│       { type: 'LikeButton', │
│         props: {...} }      │
│     ]                       │
│   }                         │
└─────────────────────────────┘
  ↓
Browser receives:
1. HTML (instant display)
2. RSC Payload (instructions)
3. Client Component bundles
  ↓
React hydrates Client Components
```

### Component Boundary

```tsx
// Server Component (default)
async function Page() {
  const data = await fetchData();
  
  return (
    <div>
      <ServerComponent data={data} />
      <ClientComponent initialData={data} /> {/* Boundary */}
    </div>
  );
}

// Server Component
function ServerComponent({ data }) {
  return <div>{data.title}</div>;
}

// Client Component
'use client';
function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  // Interactive logic...
}
```

---

## 4. When to Use Each Type

### Use Server Components For:

✅ **Data fetching**
```tsx
async function ProductList() {
  const products = await db.product.findMany();
  return <ul>{products.map(p => <li>{p.name}</li>)}</ul>;
}
```

✅ **Accessing backend resources**
```tsx
async function UserProfile({ userId }) {
  const user = await db.user.findUnique({ where: { id: userId } });
  const posts = await db.post.findMany({ where: { userId } });
  return <Profile user={user} posts={posts} />;
}
```

✅ **Heavy dependencies**
```tsx
import { marked } from 'marked'; // Won't ship to client
import fs from 'fs';

async function MarkdownPage({ slug }) {
  const content = fs.readFileSync(`./content/${slug}.md`, 'utf-8');
  const html = marked(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

✅ **Static content**
```tsx
function Footer() {
  return (
    <footer>
      <p>© 2024 My Company</p>
      <nav>{/* links */}</nav>
    </footer>
  );
}
```

### Use Client Components For:

✅ **Interactivity (state, events)**
```tsx
'use client';
function SearchBar() {
  const [query, setQuery] = useState('');
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

✅ **Browser APIs**
```tsx
'use client';
function GeolocationComponent() {
  const [location, setLocation] = useState(null);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);
  
  return <div>Location: {location?.lat}, {location?.lng}</div>;
}
```

✅ **Effects and lifecycle**
```tsx
'use client';
function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  
  return <div>Elapsed: {seconds}s</div>;
}
```

✅ **Third-party libraries requiring browser**
```tsx
'use client';
import { Chart } from 'react-chartjs-2';

function Analytics({ data }) {
  return <Chart data={data} />;
}
```

---

## 5. Component Composition Patterns

### Pattern 1: Wrapping Server Components in Client Components

**❌ Wrong (Imports server component into client):**
```tsx
'use client';
import ServerComponent from './ServerComponent'; // Error!

function ClientWrapper() {
  return <ServerComponent />; // Won't work
}
```

**✅ Correct (Pass as children):**
```tsx
// Server Component
function Page() {
  return (
    <ClientWrapper>
      <ServerComponent /> {/* Rendered on server */}
    </ClientWrapper>
  );
}

// Client Component
'use client';
function ClientWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return <div>{isOpen && children}</div>;
}
```

### Pattern 2: Shared Client/Server Components

```tsx
// Shared Component (used in both contexts)
function Button({ children, onClick, ...props }) {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
}

// Server Component uses it
function ServerPage() {
  return <Button href="/about">Learn More</Button>; // No onClick
}

// Client Component uses it
'use client';
function ClientForm() {
  return <Button onClick={() => alert('Hi')}>Click Me</Button>;
}
```

### Pattern 3: Layouts with Mixed Components

```tsx
// app/layout.tsx (Server Component)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header /> {/* Server Component */}
        <main>{children}</main>
        <Footer /> {/* Server Component */}
      </body>
    </html>
  );
}

// app/page.tsx (Server Component)
export default async function Page() {
  const posts = await fetchPosts();
  
  return (
    <div>
      <PostList posts={posts} /> {/* Server */}
      <Newsletter /> {/* Client */}
    </div>
  );
}

// components/Newsletter.tsx (Client Component)
'use client';
export default function Newsletter() {
  const [email, setEmail] = useState('');
  // Interactive form...
}
```

---

## 6. Data Fetching in Server Components

### Direct Database Access

```tsx
// app/products/page.tsx
import { prisma } from '@/lib/db';

export default async function ProductsPage() {
  // Direct Prisma query
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Multiple Parallel Fetches

```tsx
async function Dashboard() {
  // All fetch in parallel
  const [user, posts, analytics] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchAnalytics()
  ]);

  return (
    <div>
      <UserProfile user={user} />
      <PostList posts={posts} />
      <AnalyticsChart data={analytics} />
    </div>
  );
}
```

### Streaming with Suspense

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />
      </Suspense>
      <FastComponent />
    </div>
  );
}

async function SlowComponent() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  const data = await fetchSlowData();
  return <div>{data}</div>;
}
```

---

## 7. Best Practices

### 1. Keep Client Components Small

**❌ Bad:**
```tsx
'use client';
function Page() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <Header /> {/* Entire Header now client */}
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Footer /> {/* Entire Footer now client */}
    </div>
  );
}
```

**✅ Good:**
```tsx
// Server Component
function Page() {
  return (
    <div>
      <Header /> {/* Server */}
      <Counter /> {/* Only this is client */}
      <Footer /> {/* Server */}
    </div>
  );
}

'use client';
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Move 'use client' Down the Tree

```tsx
// app/page.tsx (Server)
export default async function Page() {
  const posts = await fetchPosts();
  return <PostList posts={posts} />;
}

// components/PostList.tsx (Server)
function PostList({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <LikeButton postId={post.id} /> {/* Client */}
        </li>
      ))}
    </ul>
  );
}

// components/LikeButton.tsx (Client)
'use client';
function LikeButton({ postId }) {
  // Interactive logic
}
```

### 3. Serialize Props

**❌ Bad (non-serializable):**
```tsx
// Server Component
function Page() {
  const handleClick = () => {}; // Function
  return <ClientComponent onClick={handleClick} />; // Error!
}
```

**✅ Good (serializable only):**
```tsx
// Server Component
function Page() {
  return <ClientComponent postId={123} title="Hello" />; // ✅
}
```

### 4. Use Context Wisely

```tsx
// providers.tsx
'use client';
export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children} {/* Server Components can be children */}
      </AuthProvider>
    </ThemeProvider>
  );
}

// app/layout.tsx (Server)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children} {/* Still Server Components */}
        </Providers>
      </body>
    </html>
  );
}
```

---

## 📝 Practice Tasks

### Task 1: Build a Blog with RSC

Create a blog with:
- Server Component for listing posts (fetch from database)
- Client Component for search bar
- Client Component for like button
- Proper component boundaries

### Task 2: Dashboard with Mixed Components

Build a dashboard with:
- Server Component fetching analytics data
- Client Component for date range picker
- Client Component for charts
- Server Component for data tables

### Task 3: E-commerce Product Page

Create a product page with:
- Server Component for product details (fetch from DB)
- Client Component for add to cart button
- Client Component for image carousel
- Server Component for related products

See `/tasks` folder for detailed requirements.

---

## 🔗 Quick Reference

### Server Component Checklist
- [ ] No 'use client' directive
- [ ] Can be async
- [ ] Access backend directly
- [ ] No state/effects/events
- [ ] Reduces bundle size

### Client Component Checklist
- [ ] Has 'use client' directive
- [ ] Cannot be async
- [ ] Can use state/effects/events
- [ ] Can use browser APIs
- [ ] Increases bundle size

### When to Use What

| Need            | Use              |
| --------------- | ---------------- |
| Fetch data      | Server Component |
| Click handler   | Client Component |
| Database access | Server Component |
| useState        | Client Component |
| Heavy library   | Server Component |
| Browser API     | Client Component |

**Next:** Day 30 - Server Actions
