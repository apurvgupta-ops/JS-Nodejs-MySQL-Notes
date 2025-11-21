# Day 31: Dynamic Rendering & Caching

## 📚 Table of Contents
1. Next.js Rendering Strategies Overview
2. Static Site Generation (SSG)
3. Server-Side Rendering (SSR)
4. Incremental Static Regeneration (ISR)
5. Dynamic Rendering
6. Caching Strategies
7. Route Segment Config

---

## 1. Next.js Rendering Strategies Overview

Next.js 15 offers multiple rendering strategies for optimal performance.

### Rendering Strategy Comparison

| Strategy    | When Rendered      | Use Case                   | Performance |
| ----------- | ------------------ | -------------------------- | ----------- |
| **SSG**     | Build time         | Static content, blogs      | ⚡⚡⚡ Fastest |
| **ISR**     | Build + revalidate | Semi-static, product pages | ⚡⚡ Fast     |
| **SSR**     | Every request      | Dynamic, personalized      | ⚡ Good      |
| **Dynamic** | Every request      | Real-time, auth-dependent  | ⚡ Good      |

### Decision Tree

```
Does data change frequently?
├─ No → SSG (Static Site Generation)
│   └─ Example: Blog posts, documentation
│
├─ Rarely → ISR (Incremental Static Regeneration)
│   └─ Example: Product catalog, news articles
│
└─ Yes → SSR or Dynamic
    ├─ Per user? → Dynamic Rendering
    │   └─ Example: Dashboard, user profile
    │
    └─ Same for all? → SSR
        └─ Example: Search results, real-time data
```

---

## 2. Static Site Generation (SSG)

**SSG** generates HTML at **build time**. Pages are pre-rendered and served as static files.

### Basic SSG

```tsx
// app/posts/page.tsx
export default async function PostsPage() {
  // Fetched at build time
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return (
    <div>
      <h1>All Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

**Output:** Static HTML file generated at `next build`

### Dynamic Params with SSG

```tsx
// app/posts/[slug]/page.tsx

// Generate all possible paths at build time
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return posts.map((post) => ({
    slug: post.slug
  }));
}

// Generate page for each slug
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(r => r.json());
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

**Build Output:**
```
/posts/first-post → static HTML
/posts/second-post → static HTML
/posts/third-post → static HTML
```

### Benefits of SSG
✅ Blazing fast (served from CDN)  
✅ No server computation per request  
✅ Perfect for SEO  
✅ Low hosting costs  

### When to Use SSG
- Blog posts
- Documentation
- Marketing pages
- Content that changes infrequently

---

## 3. Server-Side Rendering (SSR)

**SSR** generates HTML on **every request**. Fresh data for each visitor.

### Force SSR

```tsx
// app/dashboard/page.tsx

// Force dynamic rendering (no caching)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetched on every request
  const userData = await fetch('https://api.example.com/user', {
    cache: 'no-store' // Don't cache
  }).then(r => r.json());
  
  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      <p>Last login: {new Date().toLocaleString()}</p>
    </div>
  );
}
```

### SSR with Cookies/Headers

```tsx
import { cookies, headers } from 'next/headers';

export default async function ProfilePage() {
  // Accessing cookies makes page dynamic
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token');
  
  // Accessing headers makes page dynamic
  const headersList = headers();
  const userAgent = headersList.get('user-agent');
  
  return <div>Profile Page</div>;
}
```

### Benefits of SSR
✅ Always fresh data  
✅ Personalized content  
✅ SEO-friendly (pre-rendered HTML)  

### When to Use SSR
- User dashboards
- Personalized pages
- Real-time data
- Authentication-dependent pages

---

## 4. Incremental Static Regeneration (ISR)

**ISR** generates static pages at build time, then **regenerates in background** on-demand or at intervals.

### Time-based Revalidation

```tsx
// app/products/[id]/page.tsx

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Revalidate every 60 seconds
  const product = await fetch(`https://api.example.com/products/${params.id}`, {
    next: { revalidate: 60 }
  }).then(r => r.json());
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
}
```

**How it works:**
```
Request 1 (t=0s)  → Serve stale page (generated at build)
Request 2 (t=61s) → Serve stale page + trigger regeneration
Request 3 (t=62s) → Serve fresh page
```

### On-Demand Revalidation

**actions.ts:**
```ts
'use server';

import { revalidatePath } from 'next/cache';

export async function updateProduct(productId: string, data: any) {
  await db.product.update({
    where: { id: productId },
    data
  });
  
  // Immediately revalidate this page
  revalidatePath(`/products/${productId}`);
}
```

**Admin Panel:**
```tsx
'use client';

import { updateProduct } from '@/app/actions';

export default function ProductEditor({ productId }) {
  async function handleSave(formData: FormData) {
    await updateProduct(productId, {
      name: formData.get('name'),
      price: Number(formData.get('price'))
    });
    // Page /products/[id] is now fresh!
  }

  return <form action={handleSave}>...</form>;
}
```

### Benefits of ISR
✅ Static speed + dynamic freshness  
✅ Handle high traffic  
✅ Update content without rebuild  

### When to Use ISR
- E-commerce product pages
- News articles
- Blog posts with comments
- Content that updates occasionally

---

## 5. Dynamic Rendering

Next.js automatically switches to **dynamic rendering** when:
- Using `cookies()` or `headers()`
- Using `searchParams`
- Fetching with `cache: 'no-store'`
- Using `dynamic = 'force-dynamic'`

### Auto Dynamic (Search Params)

```tsx
// app/search/page.tsx

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q: string }
}) {
  // Page is automatically dynamic because of searchParams
  const results = await fetch(
    `https://api.example.com/search?q=${searchParams.q}`
  ).then(r => r.json());
  
  return (
    <div>
      <h1>Search Results for "{searchParams.q}"</h1>
      {results.map(item => <div key={item.id}>{item.title}</div>)}
    </div>
  );
}
```

### Force Dynamic

```tsx
// app/api/route.ts

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await fetchLatestData();
  return Response.json(data);
}
```

---

## 6. Caching Strategies

Next.js has multiple cache layers.

### Cache Layers

```
┌────────────────────────────────────┐
│   1. Request Memoization          │  ← Same fetch in one render
├────────────────────────────────────┤
│   2. Data Cache                   │  ← Persistent across requests
├────────────────────────────────────┤
│   3. Full Route Cache             │  ← Static HTML/RSC payload
├────────────────────────────────────┤
│   4. Router Cache (Client-side)   │  ← Client navigation cache
└────────────────────────────────────┘
```

### Fetch Cache Options

**Option 1: Cache (Default)**
```tsx
// Cached indefinitely
const data = await fetch('https://api.example.com/data');
```

**Option 2: Revalidate**
```tsx
// Cache for 60 seconds
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 }
});
```

**Option 3: No Cache**
```tsx
// Never cache
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});
```

**Option 4: Tag-based Revalidation**
```tsx
// Cache with tag
const data = await fetch('https://api.example.com/data', {
  next: { tags: ['products'] }
});

// Revalidate by tag
import { revalidateTag } from 'next/cache';
revalidateTag('products');
```

### Database Queries (Caching)

```tsx
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

// Wrap DB query in cache
const getCachedPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany();
  },
  ['posts'], // Cache key
  { revalidate: 60, tags: ['posts'] }
);

export default async function PostsPage() {
  const posts = await getCachedPosts();
  return <div>...</div>;
}
```

---

## 7. Route Segment Config

Configure caching behavior per route.

### All Config Options

```tsx
// app/page.tsx

// Rendering strategy
export const dynamic = 'auto' | 'force-dynamic' | 'error' | 'force-static';

// Revalidation interval (seconds)
export const revalidate = false | 0 | number;

// Fetch caching
export const fetchCache = 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store';

// Runtime
export const runtime = 'nodejs' | 'edge';

// Preferred region
export const preferredRegion = 'auto' | 'global' | 'home' | string[];

// Maximum duration (seconds)
export const maxDuration = number;
```

### Common Configurations

**Fully Static:**
```tsx
export const dynamic = 'force-static';
export const revalidate = false;

export default async function Page() {
  // Generated once at build time
}
```

**ISR (Revalidate every hour):**
```tsx
export const revalidate = 3600; // 1 hour

export default async function Page() {
  // Regenerated hourly in background
}
```

**Fully Dynamic:**
```tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  // Generated on every request
}
```

**Edge Runtime:**
```tsx
export const runtime = 'edge';
export const preferredRegion = 'iad1'; // US East

export default async function Page() {
  // Runs on Edge (low latency)
}
```

---

## 📝 Real-World Examples

### Example 1: E-commerce Product Page

```tsx
// app/products/[id]/page.tsx

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { id: true }
  });
  
  return products.map(p => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { reviews: true }
  });
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>{product.stock} in stock</p>
      <Reviews reviews={product.reviews} />
    </div>
  );
}
```

### Example 2: User Dashboard (SSR)

```tsx
// app/dashboard/page.tsx

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const session = cookies().get('session');
  
  const [user, orders, analytics] = await Promise.all([
    fetchUser(session.value),
    fetchOrders(session.value),
    fetchAnalytics(session.value)
  ]);
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <OrderList orders={orders} />
      <AnalyticsChart data={analytics} />
    </div>
  );
}
```

### Example 3: Blog Post (SSG + On-Demand Revalidation)

```tsx
// app/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  });
  
  return posts.map(p => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  });
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

**Admin: Revalidate on publish**
```tsx
'use server';

import { revalidatePath } from 'next/cache';

export async function publishPost(slug: string) {
  await prisma.post.update({
    where: { slug },
    data: { published: true }
  });
  
  // Immediately update static page
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/blog'); // Also update list page
}
```

---

## 📝 Practice Tasks

### Task 1: Build ISR Product Catalog

Create product catalog with:
- Static generation at build time
- Revalidate every 5 minutes
- On-demand revalidation when product updated
- generateStaticParams for top 100 products

### Task 2: Dynamic Search Page

Build search page with:
- SSR for search results
- Query params (?q=keyword)
- Pagination
- No caching

### Task 3: Hybrid Blog

Create blog with:
- SSG for published posts
- ISR with 1-hour revalidation
- On-demand revalidation on edit
- Dynamic preview mode for drafts

See `/tasks` folder for detailed requirements.

---

## 🔗 Quick Reference

| Need                  | Config                      |
| --------------------- | --------------------------- |
| Static (build time)   | `dynamic = 'force-static'`  |
| ISR (revalidate)      | `revalidate = 60`           |
| SSR (every request)   | `dynamic = 'force-dynamic'` |
| No cache fetch        | `cache: 'no-store'`         |
| Cache with revalidate | `next: { revalidate: 60 }`  |
| Tag-based cache       | `next: { tags: ['tag'] }`   |
| Revalidate path       | `revalidatePath('/path')`   |
| Revalidate tag        | `revalidateTag('tag')`      |

**Next:** Day 32 - Streaming UI & Suspense
