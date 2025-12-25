# Week 5: Advanced React / Next.js (Days 29-35)

## 🎯 Overview

Week 5 focuses on **modern React patterns** and **Next.js 15** for building production-ready full-stack applications. You'll master React Server Components, Server Actions, and advanced rendering strategies.

---

## 📅 Schedule

| Day              | Topic                       | Duration | Key Focus                                         |
| ---------------- | --------------------------- | -------- | ------------------------------------------------- |
| **MON (Day 29)** | React Server Components     | 4-6h     | Client vs Server Components, RSC architecture     |
| **TUE (Day 30)** | Server Actions              | 4-6h     | Form handling, mutations, progressive enhancement |
| **WED (Day 31)** | Dynamic Rendering & Caching | 4-6h     | ISR, SSR, SSG, revalidation strategies            |
| **THU (Day 32)** | Streaming UI & Suspense     | 4-6h     | Streaming responses, Suspense boundaries          |
| **FRI (Day 33)** | Performance Optimization    | 4-6h     | memo, useCallback, useMemo, lazy loading          |
| **SAT (Day 34)** | Next.js 15 Project          | 6-8h     | Full-stack app with auth, dashboard, API routes   |
| **SUN (Day 35)** | Revision & Mock             | 6-8h     | 20 React questions, mock interview                |

**Total:** ~35 hours

---

## 🎓 Learning Outcomes

By the end of Week 5, you will:

### Core Concepts
✅ Understand React Server Components vs Client Components  
✅ Implement Server Actions for mutations  
✅ Master Next.js rendering strategies (SSG, SSR, ISR)  
✅ Implement streaming UI with Suspense  
✅ Optimize React performance  
✅ Build production-ready Next.js applications  

### Technical Skills
✅ Design component boundaries (server vs client)  
✅ Handle forms with Server Actions  
✅ Implement data caching and revalidation  
✅ Stream large datasets progressively  
✅ Optimize bundle size and render performance  
✅ Build authenticated Next.js apps  
✅ Create API routes in Next.js 15  

### Interview Preparation
✅ Explain RSC architecture  
✅ Compare rendering strategies  
✅ Discuss performance optimization techniques  
✅ Answer 20+ React interview questions  
✅ Build full-stack Next.js project  

---

## 📚 Daily Breakdown

### Day 29: React Server Components (RSC)
**Duration:** 4-6 hours

**Topics:**
- What are Server Components?
- Client vs Server Components
- RSC architecture and data flow
- When to use each type
- Component composition patterns
- Passing props between server and client

**Deliverables:**
- Comprehensive notes on RSC
- 5+ code examples
- 3 hands-on tasks
- 5 interview questions

---

### Day 30: Server Actions
**Duration:** 4-6 hours

**Topics:**
- Introduction to Server Actions
- Form handling without API routes
- Progressive enhancement
- Mutations and revalidation
- Error handling
- Loading states
- Optimistic updates

**Deliverables:**
- Complete Server Actions guide
- Form submission examples
- CRUD operations with Server Actions
- 5 interview questions

---

### Day 31: Dynamic Rendering & Caching
**Duration:** 4-6 hours

**Topics:**
- Static Site Generation (SSG)
- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)
- Dynamic rendering
- Caching strategies
- Revalidation (time-based, on-demand)
- Route segment config

**Deliverables:**
- Rendering strategies comparison
- Caching implementation examples
- Revalidation patterns
- 5 interview questions

---

### Day 32: Streaming UI & Suspense
**Duration:** 4-6 hours

**Topics:**
- React Suspense fundamentals
- Streaming responses
- Suspense boundaries
- Loading.js and error.js conventions
- Parallel data fetching
- Waterfall prevention
- Instant loading states

**Deliverables:**
- Streaming UI examples
- Suspense boundary patterns
- Loading state implementations
- 5 interview questions

---

### Day 33: Performance Optimization
**Duration:** 4-6 hours

**Topics:**
- React.memo for component memoization
- useCallback for function memoization
- useMemo for expensive calculations
- Code splitting with React.lazy
- Dynamic imports
- Bundle analysis
- Image optimization
- Font optimization

**Deliverables:**
- Performance optimization guide
- Before/after optimization examples
- Bundle size analysis
- 5 interview questions

---

### Day 34: Next.js 15 Project
**Duration:** 6-8 hours

**Project Requirements:**
- Authentication (sign up, login, logout)
- Dashboard with multiple pages
- CRUD operations with Server Actions
- API routes for external consumption
- Server and Client Components
- Suspense boundaries
- Error handling
- Loading states

**Tech Stack:**
- Next.js 15
- React 19
- TypeScript
- Prisma or Drizzle ORM
- PostgreSQL or MongoDB
- NextAuth.js or Clerk
- Tailwind CSS

---

### Day 35: Revision & Mock Interview
**Duration:** 6-8 hours

**Activities:**
- Quick revision of all Week 5 concepts
- 20 React interview questions with answers
- Mock interview scenarios
- System design: Build a React dashboard
- Performance optimization discussion
- Best practices review

---

## 📂 Folder Structure

```
Week-5-Advanced-React/
├── README.md (this file)
├── Day-29-React-Server-Components/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-30-Server-Actions/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-31-Dynamic-Rendering/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-32-Streaming-UI/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-33-Performance-Optimization/
│   ├── notes.md
│   ├── examples/
│   └── tasks/
├── Day-34-Nextjs-Project/
│   ├── README.md
│   ├── requirements.md
│   └── starter-template/
└── Day-35-Revision/
    └── REVISION-GUIDE.md
```

---

## 🔧 Prerequisites

Before starting Week 5, ensure you have:

- ✅ Solid React fundamentals (hooks, component lifecycle)
- ✅ JavaScript ES6+ knowledge
- ✅ Basic Next.js understanding
- ✅ Node.js installed (v18+)
- ✅ TypeScript basics
- ✅ Git installed

**Install Next.js 15:**
```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

---

## 💡 Study Tips

1. **Run Every Example:** Don't just read, build and experiment
2. **Use TypeScript:** Type safety helps catch errors early
3. **Check React DevTools:** Understand component rendering
4. **Use Next.js DevTools:** Analyze bundle size and performance
5. **Read Official Docs:** React and Next.js documentation are excellent
6. **Build Small Projects:** Apply concepts immediately

---

## 🎯 Success Criteria

### Knowledge
- [ ] Explain RSC architecture without notes
- [ ] Describe all rendering strategies (SSG, SSR, ISR)
- [ ] Understand when to use Server vs Client Components
- [ ] Know performance optimization techniques

### Skills
- [ ] Built complete Next.js 15 application
- [ ] Implemented Server Actions for mutations
- [ ] Created Suspense boundaries for streaming
- [ ] Optimized bundle size and render performance
- [ ] Handled authentication and protected routes

### Interview Readiness
- [ ] Can answer 20 React questions confidently
- [ ] Completed mock interview
- [ ] Designed a React dashboard system
- [ ] Discussed performance trade-offs

---

## 🔗 Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Next.js DevTools](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 🚀 Let's Begin!

Start with **Day 29: React Server Components** and work through each day systematically. By Day 35, you'll be confident building modern React applications!

**Next:** [Day 29 - React Server Components](./Day-29-React-Server-Components/notes.md)
