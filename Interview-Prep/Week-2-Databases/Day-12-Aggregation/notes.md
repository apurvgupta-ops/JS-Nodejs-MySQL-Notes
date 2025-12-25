# Day 12: MongoDB Aggregation Pipeline

## 📚 Table of Contents
1. What is Aggregation Pipeline?
2. Pipeline Stages
3. $match - Filtering
4. $group - Grouping & Aggregation
5. $project - Shaping Output
6. $sort, $limit, $skip - Sorting & Pagination
7. $lookup - Joins
8. $unwind - Array Deconstruction
9. Complex Analytics Queries
10. Performance Optimization

---

## 1. What is Aggregation Pipeline?

The **aggregation pipeline** processes documents through multiple stages, transforming data step by step.

```javascript
db.collection.aggregate([
    { $match: { ... } },     // Stage 1: Filter
    { $group: { ... } },     // Stage 2: Group
    { $sort: { ... } }       // Stage 3: Sort
])
```

**Analogy:** Like a factory assembly line - each stage transforms the data.

---

## 2. Pipeline Stages Overview

| Stage          | Purpose               | SQL Equivalent |
| -------------- | --------------------- | -------------- |
| **$match**     | Filter documents      | WHERE          |
| **$group**     | Group and aggregate   | GROUP BY       |
| **$project**   | Select/reshape fields | SELECT         |
| **$sort**      | Sort documents        | ORDER BY       |
| **$limit**     | Limit results         | LIMIT          |
| **$skip**      | Skip documents        | OFFSET         |
| **$lookup**    | Join collections      | JOIN           |
| **$unwind**    | Deconstruct arrays    | -              |
| **$count**     | Count documents       | COUNT          |
| **$addFields** | Add computed fields   | -              |

---

## 3. $match - Filtering

Filter documents (like WHERE clause).

```javascript
// Basic match
db.orders.aggregate([
    { $match: { status: "completed" } }
])

// Multiple conditions
db.orders.aggregate([
    { $match: {
        status: "completed",
        total: { $gt: 100 },
        createdAt: { $gte: ISODate("2024-01-01") }
    }}
])

// Match with $or
db.orders.aggregate([
    { $match: {
        $or: [
            { status: "completed" },
            { status: "shipped" }
        ]
    }}
])
```

**Best Practice:** Put $match early to reduce documents processed.

---

## 4. $group - Grouping & Aggregation

Group documents and compute aggregates.

### Basic Grouping

```javascript
// Count orders per user
db.orders.aggregate([
    { $group: {
        _id: "$userId",  // Group by userId
        orderCount: { $sum: 1 }
    }}
])

// Result:
// { _id: ObjectId("user1"), orderCount: 15 }
// { _id: ObjectId("user2"), orderCount: 8 }
```

### Aggregation Operators

```javascript
db.orders.aggregate([
    { $group: {
        _id: "$userId",
        totalSpent: { $sum: "$total" },        // Sum of totals
        avgOrderValue: { $avg: "$total" },     // Average
        maxOrder: { $max: "$total" },          // Maximum
        minOrder: { $min: "$total" },          // Minimum
        orderCount: { $sum: 1 }                // Count
    }}
])
```

### Group by Multiple Fields

```javascript
// Sales by category and month
db.orders.aggregate([
    { $group: {
        _id: {
            category: "$category",
            month: { $month: "$createdAt" }
        },
        totalSales: { $sum: "$total" },
        orderCount: { $sum: 1 }
    }}
])

// Result:
// { _id: { category: "Electronics", month: 1 }, totalSales: 5000, orderCount: 50 }
```

### Group All Documents

```javascript
// Overall statistics
db.orders.aggregate([
    { $group: {
        _id: null,  // Group all documents
        totalRevenue: { $sum: "$total" },
        avgOrderValue: { $avg: "$total" },
        totalOrders: { $sum: 1 }
    }}
])
```

---

## 5. $project - Shaping Output

Select, rename, or compute fields.

### Select Specific Fields

```javascript
db.users.aggregate([
    { $project: {
        name: 1,        // Include
        email: 1,       // Include
        _id: 0          // Exclude
    }}
])
```

### Rename Fields

```javascript
db.users.aggregate([
    { $project: {
        fullName: "$name",
        emailAddress: "$email"
    }}
])
```

### Computed Fields

```javascript
db.orders.aggregate([
    { $project: {
        orderId: "$_id",
        total: 1,
        tax: { $multiply: ["$total", 0.1] },
        totalWithTax: { $multiply: ["$total", 1.1] }
    }}
])
```

### String Operations

```javascript
db.users.aggregate([
    { $project: {
        firstName: { $arrayElemAt: [{ $split: ["$name", " "] }, 0] },
        lastName: { $arrayElemAt: [{ $split: ["$name", " "] }, 1] },
        emailDomain: { $arrayElemAt: [{ $split: ["$email", "@"] }, 1] }
    }}
])
```

---

## 6. $sort, $limit, $skip

### $sort

```javascript
// Sort by single field
db.products.aggregate([
    { $sort: { price: -1 } }  // -1 = descending, 1 = ascending
])

// Sort by multiple fields
db.products.aggregate([
    { $sort: { category: 1, price: -1 } }
])
```

### $limit

```javascript
// Top 10 products
db.products.aggregate([
    { $sort: { sales: -1 } },
    { $limit: 10 }
])
```

### $skip (Pagination)

```javascript
// Page 2 (skip 10, take 10)
db.products.aggregate([
    { $sort: { _id: 1 } },
    { $skip: 10 },
    { $limit: 10 }
])
```

---

## 7. $lookup - Joins

Join collections (like SQL JOIN).

### Basic Lookup

```javascript
// Join orders with users
db.orders.aggregate([
    { $lookup: {
        from: "users",           // Collection to join
        localField: "userId",    // Field in orders
        foreignField: "_id",     // Field in users
        as: "userDetails"        // Output array
    }}
])

// Result:
{
    _id: ObjectId("order1"),
    userId: ObjectId("user1"),
    total: 99.99,
    userDetails: [  // Joined user document
        { _id: ObjectId("user1"), name: "John", email: "john@ex.com" }
    ]
}
```

### Unwind Lookup Result

```javascript
db.orders.aggregate([
    { $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails"
    }},
    { $unwind: "$userDetails" },  // Convert array to object
    { $project: {
        orderId: "$_id",
        total: 1,
        userName: "$userDetails.name",
        userEmail: "$userDetails.email"
    }}
])

// Result:
{
    orderId: ObjectId("order1"),
    total: 99.99,
    userName: "John",
    userEmail: "john@ex.com"
}
```

### Multiple Lookups

```javascript
db.orders.aggregate([
    // Join users
    { $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
    }},
    { $unwind: "$user" },
    
    // Join products
    { $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product"
    }},
    { $unwind: "$product" }
])
```

---

## 8. $unwind - Array Deconstruction

Deconstruct array field into multiple documents.

### Without $unwind

```javascript
{
    _id: 1,
    name: "Order 1",
    items: [
        { product: "Laptop", qty: 1 },
        { product: "Mouse", qty: 2 }
    ]
}
```

### With $unwind

```javascript
db.orders.aggregate([
    { $unwind: "$items" }
])

// Result: 2 documents
{ _id: 1, name: "Order 1", items: { product: "Laptop", qty: 1 } }
{ _id: 1, name: "Order 1", items: { product: "Mouse", qty: 2 } }
```

### Practical Example

```javascript
// Calculate revenue per product
db.orders.aggregate([
    { $unwind: "$items" },  // One doc per item
    { $group: {
        _id: "$items.product",
        totalQuantity: { $sum: "$items.qty" },
        revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } }
    }},
    { $sort: { revenue: -1 } }
])
```

---

## 9. Complex Analytics Queries

### Query 1: Top 5 Customers

```javascript
db.orders.aggregate([
    { $match: { status: "completed" } },
    { $group: {
        _id: "$userId",
        totalSpent: { $sum: "$total" },
        orderCount: { $sum: 1 }
    }},
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    { $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails"
    }},
    { $unwind: "$userDetails" },
    { $project: {
        _id: 0,
        customerName: "$userDetails.name",
        email: "$userDetails.email",
        totalSpent: 1,
        orderCount: 1
    }}
])
```

### Query 2: Sales by Month

```javascript
db.orders.aggregate([
    { $match: {
        createdAt: { $gte: ISODate("2024-01-01") }
    }},
    { $group: {
        _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
        },
        revenue: { $sum: "$total" },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: "$total" }
    }},
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $project: {
        _id: 0,
        month: {
            $concat: [
                { $toString: "$_id.year" },
                "-",
                { $toString: "$_id.month" }
            ]
        },
        revenue: { $round: ["$revenue", 2] },
        orderCount: 1,
        avgOrderValue: { $round: ["$avgOrderValue", 2] }
    }}
])
```

### Query 3: Product Performance

```javascript
db.orders.aggregate([
    { $unwind: "$items" },
    { $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "product"
    }},
    { $unwind: "$product" },
    { $group: {
        _id: "$items.productId",
        productName: { $first: "$product.name" },
        category: { $first: "$product.category" },
        unitsSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        avgPrice: { $avg: "$items.price" }
    }},
    { $sort: { revenue: -1 } },
    { $limit: 10 }
])
```

---

## 10. Performance Optimization

### ✅ Use Indexes

```javascript
// Create indexes for $match and $sort
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ createdAt: -1 })

// Compound index
db.orders.createIndex({ status: 1, createdAt: -1 })
```

### ✅ $match Early

```javascript
// ✅ Good: Filter first
db.orders.aggregate([
    { $match: { status: "completed" } },  // Reduces documents
    { $group: { ... } }
])

// ❌ Bad: Group all, then filter
db.orders.aggregate([
    { $group: { ... } },
    { $match: { status: "completed" } }
])
```

### ✅ Use $project to Reduce Fields

```javascript
// Only project needed fields
db.orders.aggregate([
    { $project: { userId: 1, total: 1 } },  // Reduce data size
    { $group: { ... } }
])
```

### ✅ Use allowDiskUse for Large Datasets

```javascript
db.orders.aggregate([
    { $group: { ... } },
    { $sort: { ... } }
], { allowDiskUse: true })  // Allow temp files for large sorts
```

---

## Practice Tasks

Build these analytics queries (see `/tasks` folder):
1. Revenue by category
2. User activity dashboard
3. Product recommendations based on co-purchases
4. Churn analysis
5. Cohort analysis

---

## Quick Reference

```javascript
// Common pattern
db.collection.aggregate([
    { $match: { ... } },      // Filter early
    { $lookup: { ... } },     // Join if needed
    { $unwind: "$array" },    // Flatten arrays
    { $group: { ... } },      // Aggregate
    { $sort: { ... } },       // Sort
    { $limit: 10 },           // Paginate
    { $project: { ... } }     // Shape output
])
```
