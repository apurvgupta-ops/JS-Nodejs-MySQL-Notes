# Day 33: Performance Optimization in React & Next.js

## 📚 Table of Contents
1. React.memo - Component Memoization
2. useCallback - Function Memoization
3. useMemo - Value Memoization
4. Code Splitting with React.lazy
5. Bundle Analysis
6. Image & Font Optimization
7. Production Best Practices

---

## 1. React.memo - Component Memoization

**React.memo** prevents re-renders when props haven't changed.

### Basic Usage

```tsx
import { memo } from 'react';

// ❌ Without memo: Re-renders on every parent render
function ExpensiveComponent({ data }: { data: string }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
}

// ✅ With memo: Only re-renders when data changes
const ExpensiveComponent = memo(function ExpensiveComponent({ 
  data 
}: { 
  data: string 
}) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
});
```

### Example: Preventing Unnecessary Re-renders

```tsx
'use client';

import { useState, memo } from 'react';

export default function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      
      <input value={text} onChange={e => setText(e.target.value)} />
      
      {/* Re-renders only when count changes, NOT when text changes */}
      <ExpensiveChild count={count} />
    </div>
  );
}

const ExpensiveChild = memo(({ count }: { count: number }) => {
  console.log('ExpensiveChild rendered');
  
  // Simulate expensive computation
  const expensiveValue = Array(1000).fill(0).reduce((acc, _, i) => acc + i, 0);
  
  return <div>Count: {count}, Computed: {expensiveValue}</div>;
});
```

### Custom Comparison

```tsx
const UserCard = memo(
  ({ user }: { user: User }) => {
    return (
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    );
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.user.id === nextProps.user.id &&
           prevProps.user.name === nextProps.user.name;
  }
);
```

### When to Use React.memo

✅ **Use when:**
- Component is expensive to render
- Component re-renders often with same props
- Component is in a list
- Props are primitive values or stable objects

❌ **Don't use when:**
- Component is cheap to render
- Props change frequently
- Premature optimization (measure first!)

---

## 2. useCallback - Function Memoization

**useCallback** memoizes functions to prevent re-creating them on every render.

### Basic Usage

```tsx
'use client';

import { useState, useCallback } from 'react';

export default function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ Without useCallback: New function every render
  // const handleClick = () => {
  //   console.log('Clicked with count:', count);
  // };

  // ✅ With useCallback: Same function reference until count changes
  const handleClick = useCallback(() => {
    console.log('Clicked with count:', count);
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <input value={text} onChange={e => setText(e.target.value)} />
      
      {/* ExpensiveChild won't re-render when text changes */}
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}

const ExpensiveChild = memo(({ onClick }: { onClick: () => void }) => {
  console.log('ExpensiveChild rendered');
  return <button onClick={onClick}>Click Me</button>;
});
```

### Common Patterns

#### 1. Event Handlers

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleDelete = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []); // No dependencies

  const handleToggle = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      ))}
    </ul>
  );
}

const TodoItem = memo(({ todo, onDelete, onToggle }: TodoItemProps) => {
  return (
    <li>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
});
```

#### 2. API Calls

```tsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchAPI = useCallback(async (searchQuery: string) => {
    const res = await fetch(`/api/search?q=${searchQuery}`);
    const data = await res.json();
    setResults(data);
  }, []);

  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={() => searchAPI(query)}>Search</button>
      <SearchResults results={results} onSearch={searchAPI} />
    </div>
  );
}
```

### Common Mistakes

**❌ Wrong: Missing dependencies**
```tsx
const handleClick = useCallback(() => {
  console.log('Count:', count); // count from closure
}, []); // Missing [count]
```

**✅ Correct: Include dependencies**
```tsx
const handleClick = useCallback(() => {
  console.log('Count:', count);
}, [count]);
```

---

## 3. useMemo - Value Memoization

**useMemo** memoizes expensive computations.

### Basic Usage

```tsx
'use client';

import { useState, useMemo } from 'react';

export default function ExpensiveComputation() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Item[]>([]);

  // ❌ Without useMemo: Recalculates on every render
  // const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));

  // ✅ With useMemo: Recalculates only when items change
  const sortedItems = useMemo(() => {
    console.log('Sorting items...');
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count} {/* Changing count won't re-sort */}
      </button>
      
      <ul>
        {sortedItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Common Patterns

#### 1. Filtering & Sorting

```tsx
function ProductList({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  const filteredAndSortedProducts = useMemo(() => {
    console.log('Filtering and sorting...');
    
    // Filter
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.price - b.price;
      }
    });
    
    return result;
  }, [products, searchQuery, sortBy]);

  return (
    <div>
      <input 
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search products..."
      />
      
      <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
      </select>
      
      <ul>
        {filteredAndSortedProducts.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### 2. Complex Calculations

```tsx
function DataAnalysis({ data }: { data: number[] }) {
  const analysis = useMemo(() => {
    console.log('Analyzing data...');
    
    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);
    
    return { sum, avg, max, min };
  }, [data]);

  return (
    <div>
      <p>Sum: {analysis.sum}</p>
      <p>Average: {analysis.avg}</p>
      <p>Max: {analysis.max}</p>
      <p>Min: {analysis.min}</p>
    </div>
  );
}
```

#### 3. Derived State

```tsx
function ShoppingCart({ items }: { items: CartItem[] }) {
  const cartSummary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  }, [items]);

  return (
    <div>
      <p>Subtotal: ${cartSummary.subtotal}</p>
      <p>Tax: ${cartSummary.tax}</p>
      <p>Total: ${cartSummary.total}</p>
    </div>
  );
}
```

---

## 4. Code Splitting with React.lazy

**React.lazy** loads components only when needed.

### Basic Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

// ❌ Without lazy: Bundled with main code
// import HeavyComponent from './HeavyComponent';

// ✅ With lazy: Loaded only when used
const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      
      <Suspense fallback={<div>Loading component...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

### Route-Based Code Splitting

```tsx
// app/page.tsx
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./components/HomePage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <div>
      <nav>
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('about')}>About</button>
        <button onClick={() => setPage('contact')}>Contact</button>
      </nav>
      
      <Suspense fallback={<div>Loading page...</div>}>
        {page === 'home' && <HomePage />}
        {page === 'about' && <AboutPage />}
        {page === 'contact' && <ContactPage />}
      </Suspense>
    </div>
  );
}
```

### Dynamic Imports in Next.js

```tsx
import dynamic from 'next/dynamic';

// Client component with no SSR
const DynamicChart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>
});

// With named export
const DynamicHeader = dynamic(
  () => import('./Header').then(mod => mod.Header)
);

export default function Page() {
  return (
    <div>
      <DynamicHeader />
      <DynamicChart data={[1, 2, 3]} />
    </div>
  );
}
```

### Conditional Loading

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const HeavyModal = dynamic(() => import('./HeavyModal'));

export default function Page() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Open Modal
      </button>
      
      {/* Modal only loaded when showModal is true */}
      {showModal && <HeavyModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
```

---

## 5. Bundle Analysis

Analyze your bundle size to find optimization opportunities.

### Setup Bundle Analyzer

```bash
npm install @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
});
```

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

**Run analysis:**
```bash
npm run analyze
```

### Interpreting Results

Look for:
- **Large dependencies** (>100KB)
- **Duplicate packages**
- **Unused imports**
- **Heavy libraries** (moment.js, lodash)

### Optimization Strategies

**1. Replace heavy libraries:**
```tsx
// ❌ Heavy: moment.js (67KB)
import moment from 'moment';
const date = moment().format('YYYY-MM-DD');

// ✅ Light: date-fns (tree-shakeable)
import { format } from 'date-fns';
const date = format(new Date(), 'yyyy-MM-dd');
```

**2. Tree shaking:**
```tsx
// ❌ Imports entire library
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Import only what you need
import debounce from 'lodash/debounce';
debounce(fn, 300);
```

**3. Dynamic imports:**
```tsx
// Only load when needed
const loadMarkdown = async () => {
  const { marked } = await import('marked');
  return marked(text);
};
```

---

## 6. Image & Font Optimization

### Image Optimization with next/image

```tsx
import Image from 'next/image';

export default function Page() {
  return (
    <div>
      {/* ✅ Automatic optimization */}
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={800}
        height={400}
        priority // Load immediately (above fold)
        placeholder="blur" // Show blur while loading
        blurDataURL="data:image/jpeg;base64,..." // Low-res placeholder
      />
      
      {/* ✅ Lazy load images below fold */}
      <Image
        src="/product.jpg"
        alt="Product"
        width={400}
        height={300}
        loading="lazy" // Default behavior
      />
      
      {/* ✅ Responsive images */}
      <Image
        src="/banner.jpg"
        alt="Banner"
        fill // Fill parent container
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
```

### Font Optimization with next/font

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent layout shift
  variable: '--font-inter'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

**Custom fonts:**
```tsx
import localFont from 'next/font/local';

const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
  variable: '--font-custom'
});
```

---

## 7. Production Best Practices

### 1. Remove Console Logs

```js
// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};
```

### 2. Enable Compression

```js
// next.config.js
module.exports = {
  compress: true // Enabled by default
};
```

### 3. Optimize Dependencies

```json
// package.json
{
  "dependencies": {
    "lodash": "^4.17.21" // ❌ Full library
  }
}
```

```json
{
  "dependencies": {
    "lodash-es": "^4.17.21" // ✅ ES modules (tree-shakeable)
  }
}
```

### 4. Use Production Build

```bash
# Development (slow, with debugging)
npm run dev

# Production (optimized)
npm run build
npm run start
```

### 5. Monitor Performance

**Web Vitals:**
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Custom reporting:**
```tsx
// app/web-vitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric);
    // Send to analytics
  });
}
```

---

## 📝 Complete Example: Optimized Product List

```tsx
'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ProductModal = dynamic(() => import('./ProductModal'));

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductList({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Memoize filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      return sortBy === 'name'
        ? a.name.localeCompare(b.name)
        : a.price - b.price;
    });

    return result;
  }, [products, searchQuery, sortBy]);

  // Memoize event handler
  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="border p-2 rounded"
        />
        
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>

      {/* Modal lazy loaded only when needed */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

// Memoized card component
const ProductCard = memo(({ 
  product, 
  onClick 
}: { 
  product: Product; 
  onClick: (product: Product) => void;
}) => {
  return (
    <div
      onClick={() => onClick(product)}
      className="border rounded p-4 cursor-pointer hover:shadow-lg"
    >
      <Image
        src={product.image}
        alt={product.name}
        width={200}
        height={200}
        className="rounded"
        loading="lazy"
      />
      <h3 className="font-bold mt-2">{product.name}</h3>
      <p className="text-green-600">${product.price}</p>
    </div>
  );
});
```

---

## 📝 Practice Tasks

### Task 1: Optimize Todo App
- Add React.memo to TodoItem
- Use useCallback for handlers
- Implement search with useMemo

### Task 2: Lazy Load Dashboard
- Split dashboard widgets into separate chunks
- Add loading states
- Analyze bundle size before/after

### Task 3: Image Gallery
- Use next/image with lazy loading
- Add blur placeholders
- Implement responsive sizing

See `/tasks` folder for detailed requirements.

---

## 🔗 Quick Reference

| Technique       | When to Use                             |
| --------------- | --------------------------------------- |
| `React.memo`    | Expensive components with stable props  |
| `useCallback`   | Functions passed to memoized children   |
| `useMemo`       | Expensive calculations                  |
| `React.lazy`    | Large components not needed immediately |
| `next/image`    | All images (automatic optimization)     |
| `next/font`     | All fonts (prevent layout shift)        |
| Bundle analysis | Before production deployment            |

**Next:** Day 34 - Build Next.js 15 Project
