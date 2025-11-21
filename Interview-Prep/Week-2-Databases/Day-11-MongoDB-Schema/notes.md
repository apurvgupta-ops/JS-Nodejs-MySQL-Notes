# Day 11: MongoDB Schema Design

## 📚 Table of Contents
1. Embedding vs Referencing
2. One-to-One Relationships
3. One-to-Many Relationships
4. Many-to-Many Relationships
5. Schema Design Patterns
6. Denormalization
7. Best Practices

---

## 1. Embedding vs Referencing

### Embedding (Denormalized)

Store related data within the same document.

```javascript
// User with embedded address
{
    _id: ObjectId("..."),
    name: "John Doe",
    email: "john@example.com",
    address: {  // Embedded document
        street: "123 Main St",
        city: "New York",
        zip: "10001"
    }
}
```

**When to Embed:**
- ✅ Data accessed together
- ✅ 1-to-1 or 1-to-few relationships
- ✅ Data doesn't change often
- ✅ Read performance critical

**Example: Blog Post with Comments (few comments)**
```javascript
{
    _id: ObjectId("..."),
    title: "MongoDB Schema Design",
    content: "...",
    comments: [  // Embed if < 100 comments
        { author: "Alice", text: "Great post!", date: ISODate("...") },
        { author: "Bob", text: "Thanks!", date: ISODate("...") }
    ]
}
```

### Referencing (Normalized)

Store reference (foreign key) to another collection.

```javascript
// User document
{
    _id: ObjectId("user1"),
    name: "John Doe",
    email: "john@example.com"
}

// Orders collection (referenced)
{
    _id: ObjectId("order1"),
    userId: ObjectId("user1"),  // Reference to user
    total: 99.99,
    items: [...]
}
```

**When to Reference:**
- ✅ Data accessed independently
- ✅ 1-to-many or many-to-many with large "many"
- ✅ Data changes frequently
- ✅ Document size would exceed 16MB

**Example: Blog Post with Many Comments**
```javascript
// Post document
{
    _id: ObjectId("post1"),
    title: "MongoDB Schema Design",
    author: ObjectId("user1"),  // Reference
    content: "..."
}

// Comments collection (separate)
{
    _id: ObjectId("comment1"),
    postId: ObjectId("post1"),  // Reference to post
    author: "Alice",
    text: "Great post!"
}
```

---

## 2. One-to-One Relationships

### Pattern 1: Embedding (Preferred)

```javascript
// User with profile
{
    _id: ObjectId("..."),
    username: "johndoe",
    email: "john@example.com",
    profile: {  // 1-to-1 embedded
        firstName: "John",
        lastName: "Doe",
        bio: "Software developer",
        avatar: "https://..."
    }
}
```

### Pattern 2: Referencing (for large or rarely accessed data)

```javascript
// User
{
    _id: ObjectId("user1"),
    username: "johndoe",
    email: "john@example.com",
    resumeId: ObjectId("resume1")  // Reference
}

// Resume (large document, rarely accessed)
{
    _id: ObjectId("resume1"),
    userId: ObjectId("user1"),
    fullResume: "... 100KB of data ..."
}
```

---

## 3. One-to-Many Relationships

### Pattern 1: Embedding (1-to-Few)

**When "many" is small (< 100 items)**

```javascript
// Blog post with comments (< 100)
{
    _id: ObjectId("..."),
    title: "My Post",
    comments: [
        { author: "Alice", text: "Great!" },
        { author: "Bob", text: "Thanks!" }
    ]
}
```

### Pattern 2: Referencing (1-to-Many)

**When "many" is large or unbounded**

```javascript
// Product
{
    _id: ObjectId("product1"),
    name: "Laptop",
    price: 999
}

// Reviews (separate collection)
{
    _id: ObjectId("review1"),
    productId: ObjectId("product1"),  // Reference
    rating: 5,
    text: "Excellent!"
}
// ... thousands of reviews

// Query
db.reviews.find({ productId: ObjectId("product1") })
```

### Pattern 3: Array of References (1-to-Many)

**Store references in parent document**

```javascript
// User
{
    _id: ObjectId("user1"),
    name: "John",
    orderIds: [  // Array of references
        ObjectId("order1"),
        ObjectId("order2"),
        ObjectId("order3")
    ]
}

// Orders
{
    _id: ObjectId("order1"),
    total: 99.99,
    items: [...]
}
```

**When to use:**
- ✅ Need to query from parent
- ✅ "Many" side is bounded (< 1000)
- ❌ Avoid if "many" is unbounded (use child references instead)

---

## 4. Many-to-Many Relationships

### Pattern 1: Array of References (Both Sides)

```javascript
// Student
{
    _id: ObjectId("student1"),
    name: "Alice",
    courseIds: [  // References to courses
        ObjectId("course1"),
        ObjectId("course2")
    ]
}

// Course
{
    _id: ObjectId("course1"),
    name: "MongoDB Basics",
    studentIds: [  // References to students
        ObjectId("student1"),
        ObjectId("student2")
    ]
}
```

**When to use:**
- ✅ Query from both sides frequently
- ✅ Bounded relationships (< 1000 each side)

### Pattern 2: Junction Collection (Normalized)

```javascript
// Student
{
    _id: ObjectId("student1"),
    name: "Alice"
}

// Course
{
    _id: ObjectId("course1"),
    name: "MongoDB Basics"
}

// Enrollments (junction collection)
{
    _id: ObjectId("..."),
    studentId: ObjectId("student1"),
    courseId: ObjectId("course1"),
    enrolledDate: ISODate("..."),
    grade: "A"
}
```

**When to use:**
- ✅ Need to store relationship attributes (enrolledDate, grade)
- ✅ Unbounded relationships
- ✅ Complex queries on relationships

---

## 5. Schema Design Patterns

### Pattern 1: Subset Pattern

**Problem:** Document has large arrays but you usually need only few recent items.

```javascript
// User with ALL orders embedded (bad for performance)
{
    _id: ObjectId("user1"),
    name: "John",
    orders: [  // 10,000 orders!
        { orderId: 1, total: 50 },
        // ... 9,999 more
    ]
}

// Solution: Store subset in user, full data in separate collection
{
    _id: ObjectId("user1"),
    name: "John",
    recentOrders: [  // Only last 10 orders
        { orderId: 9999, total: 100 },
        { orderId: 9998, total: 75 }
    ]
}

// All orders in separate collection
{
    _id: ObjectId("..."),
    userId: ObjectId("user1"),
    orderId: 1,
    total: 50
}
```

### Pattern 2: Computed Pattern

**Problem:** Expensive computations on every read.

```javascript
// Store pre-computed values
{
    _id: ObjectId("movie1"),
    title: "Inception",
    ratings: [4, 5, 5, 3, 4, 5, 4],  // Raw ratings
    // Computed fields (updated on write)
    averageRating: 4.3,
    ratingCount: 7,
    last30DaysAverage: 4.5
}
```

### Pattern 3: Bucket Pattern

**Problem:** Too many time-series documents.

```javascript
// Without bucket: 1 document per measurement
{ sensorId: "sensor1", temp: 20, time: "2024-01-01 00:00" }
{ sensorId: "sensor1", temp: 21, time: "2024-01-01 00:01" }
// ... 1,440 documents per day!

// With bucket: Group measurements
{
    _id: ObjectId("..."),
    sensorId: "sensor1",
    date: "2024-01-01",
    hour: 0,
    measurements: [
        { minute: 0, temp: 20 },
        { minute: 1, temp: 21 },
        // ... up to 60 measurements
    ]
}
// Only 24 documents per day!
```

### Pattern 4: Extended Reference Pattern

**Problem:** Need some fields from referenced document on every query.

```javascript
// Without extended reference
{
    _id: ObjectId("order1"),
    userId: ObjectId("user1"),  // Only ID
    total: 99.99
}
// Need to join users to get name

// With extended reference (denormalization)
{
    _id: ObjectId("order1"),
    user: {  // Embed frequently accessed fields
        _id: ObjectId("user1"),
        name: "John Doe",
        email: "john@example.com"
    },
    total: 99.99
}
// No join needed for common queries!
```

---

## 6. Denormalization

### When to Denormalize

**Scenario: E-commerce Orders**

```javascript
// Orders need product name frequently
// Option 1: Normalized (requires join)
{
    _id: ObjectId("order1"),
    items: [
        { productId: ObjectId("prod1"), quantity: 2 }
    ]
}

// Option 2: Denormalized (duplicate product name)
{
    _id: ObjectId("order1"),
    items: [
        { 
            productId: ObjectId("prod1"),
            productName: "Laptop",  // Denormalized
            price: 999,             // Denormalized
            quantity: 2
        }
    ]
}
```

**Benefits:**
- ✅ Faster reads (no joins)
- ✅ Atomic operations
- ✅ Better for historical data

**Trade-offs:**
- ❌ Data duplication
- ❌ Update complexity (must update multiple places)
- ❌ Potential inconsistency

### Guidelines

**Denormalize when:**
- Read:Write ratio is high (90:10)
- Data doesn't change often (product names stable)
- Need atomic updates
- Performance is critical

**Keep normalized when:**
- Data changes frequently
- Need single source of truth
- Storage cost is important
- Strong consistency required

---

## 7. Best Practices

### ✅ Design for Your Queries

```javascript
// If you query "get user with recent orders"
// Embed recent orders in user document

// If you query "get all orders for product"
// Store productId in orders, not the reverse
```

### ✅ Keep Documents < 16MB

```javascript
// ❌ Bad: Unbounded array
{
    _id: ObjectId("user1"),
    logs: [  // Could grow to 16MB+
        { action: "login", time: "..." },
        // ... millions of logs
    ]
}

// ✅ Good: Separate collection
{
    _id: ObjectId("log1"),
    userId: ObjectId("user1"),
    action: "login",
    time: "..."
}
```

### ✅ Use Indexes

```javascript
// Create indexes for referenced fields
db.orders.createIndex({ userId: 1 })
db.comments.createIndex({ postId: 1 })

// Compound indexes for common queries
db.orders.createIndex({ userId: 1, status: 1, createdAt: -1 })
```

### ✅ Consider Update Patterns

```javascript
// Frequent updates: Reference
// User balance changes often → separate collection

// Rare updates: Embed
// User address rarely changes → embed in user
```

---

## Practice: Design These Schemas

1. **Social Media Platform**
   - Users, Posts, Comments, Likes, Followers

2. **E-commerce**
   - Products, Orders, Reviews, Cart, Users

3. **Learning Platform**
   - Courses, Lessons, Enrollments, Progress, Users

See `/tasks` folder for detailed requirements and solutions.
