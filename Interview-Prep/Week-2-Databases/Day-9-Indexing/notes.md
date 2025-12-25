# Day 9: Indexing & Query Optimization

## 📚 Table of Contents
1. What are Indexes?
2. B-Tree Index
3. Types of Indexes
4. Covering Index
5. EXPLAIN ANALYZE
6. Index Strategies
7. When NOT to Use Indexes
8. Query Optimization Techniques

---

## 1. What are Indexes?

**Indexes** are data structures that improve the speed of data retrieval operations on a database table at the cost of additional storage and slower writes.

### Without Index
```
Full Table Scan: O(n)
MySQL reads every row sequentially
```

### With Index
```
Index Lookup: O(log n)
MySQL uses index structure to jump directly to matching rows
```

### Analogy
- **Without index**: Reading a book page by page to find a topic
- **With index**: Using the book's index to jump to the page

---

## 2. B-Tree Index (Default in MySQL)

MySQL uses **B-Tree (Balanced Tree)** as the default index structure.

### B-Tree Structure
```
              [50]
            /      \
        [25]        [75]
       /    \      /    \
    [10] [40]  [60]  [90]
```

### How B-Tree Works

1. **Sorted Structure**: Values stored in sorted order
2. **Balanced**: All leaf nodes at same depth
3. **Fast Lookup**: O(log n) search time
4. **Range Queries**: Efficient for `<`, `>`, `BETWEEN`

### Example
```sql
-- Create index on salary column
CREATE INDEX idx_salary ON employees(salary);

-- Query uses index for fast lookup
SELECT * FROM employees WHERE salary > 80000;
-- MySQL navigates B-Tree to find salary > 80000
```

### B-Tree Properties

| Property            | Description                           |
| ------------------- | ------------------------------------- |
| **Time Complexity** | O(log n) for search, insert, delete   |
| **Best For**        | Exact match, range queries            |
| **Storage**         | ~10-20% of table size                 |
| **Updates**         | Slower writes (index must be updated) |

---

## 3. Types of Indexes

### 3.1 Primary Key Index
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,  -- Automatically indexed
    name VARCHAR(100)
);
```
- Unique and NOT NULL
- Clustered index (data stored in index order)
- One per table

### 3.2 Unique Index
```sql
CREATE UNIQUE INDEX idx_email ON users(email);
-- Ensures no duplicate emails
```

### 3.3 Single Column Index
```sql
CREATE INDEX idx_last_name ON employees(last_name);
-- Fast lookup for single column
```

### 3.4 Composite Index (Multi-Column)
```sql
CREATE INDEX idx_name_dept ON employees(last_name, department_id);
-- Covers queries on: last_name or (last_name + department_id)
-- DOES NOT help queries on: department_id alone
```

**Leftmost Prefix Rule:**
```sql
-- ✅ Uses index
WHERE last_name = 'Smith'
WHERE last_name = 'Smith' AND department_id = 5

-- ❌ Does NOT use index
WHERE department_id = 5
```

### 3.5 Full-Text Index
```sql
CREATE FULLTEXT INDEX idx_description ON products(description);

-- Search for words
SELECT * FROM products 
WHERE MATCH(description) AGAINST('laptop computer');
```

### 3.6 Spatial Index (for GIS data)
```sql
CREATE SPATIAL INDEX idx_location ON stores(coordinates);
```

---

## 4. Covering Index

A **covering index** contains all columns needed by a query, so MySQL doesn't need to access the table.

### Example

**Without Covering Index:**
```sql
CREATE INDEX idx_dept ON employees(department_id);

SELECT name, salary FROM employees WHERE department_id = 1;
-- Steps:
-- 1. Use index to find matching rows
-- 2. Access table to get name and salary (extra I/O)
```

**With Covering Index:**
```sql
CREATE INDEX idx_dept_name_salary 
ON employees(department_id, name, salary);

SELECT name, salary FROM employees WHERE department_id = 1;
-- Steps:
-- 1. Use index to find matching rows
-- 2. Return data directly from index (no table access!)
-- EXPLAIN shows: "Using index"
```

### Benefits
- **Faster queries**: No table access needed
- **Reduced I/O**: All data in index
- **Better performance**: Especially on large tables

### Trade-offs
- **Larger indexes**: More storage required
- **Slower writes**: More columns to update

---

## 5. EXPLAIN ANALYZE

`EXPLAIN` shows the query execution plan. `EXPLAIN ANALYZE` also runs the query and shows actual execution stats.

### Basic EXPLAIN
```sql
EXPLAIN SELECT * FROM employees WHERE salary > 80000;
```

### Key Columns in EXPLAIN Output

| Column            | Description                | Good Values                                        |
| ----------------- | -------------------------- | -------------------------------------------------- |
| **id**            | Query identifier           | -                                                  |
| **select_type**   | Type of SELECT             | SIMPLE, SUBQUERY                                   |
| **table**         | Table being accessed       | -                                                  |
| **type**          | Join type                  | eq_ref, ref, range (GOOD)<br>ALL (BAD - full scan) |
| **possible_keys** | Indexes that could be used | Shows available indexes                            |
| **key**           | Index actually used        | Should show an index                               |
| **key_len**       | Length of index used       | Shorter is better                                  |
| **ref**           | Columns compared to index  | -                                                  |
| **rows**          | Estimated rows examined    | Lower is better                                    |
| **Extra**         | Additional info            | "Using index" (GOOD)<br>"Using filesort" (BAD)     |

### EXPLAIN Types (Best to Worst)

```
✅ const       - Single row lookup (PRIMARY KEY or UNIQUE)
✅ eq_ref      - One row per join (PRIMARY KEY/UNIQUE join)
✅ ref         - Multiple rows per index value
✅ range       - Index range scan (>, <, BETWEEN)
⚠️  index      - Full index scan
❌ ALL         - Full table scan (slowest)
```

### Example Analysis

```sql
EXPLAIN SELECT * FROM employees WHERE department_id = 1;

+----+-------------+-----------+------+---------------+-----------+---------+-------+------+-------+
| id | select_type | table     | type | possible_keys | key       | key_len | ref   | rows | Extra |
+----+-------------+-----------+------+---------------+-----------+---------+-------+------+-------+
|  1 | SIMPLE      | employees | ref  | idx_dept      | idx_dept  | 5       | const | 15   | NULL  |
+----+-------------+-----------+------+---------------+-----------+---------+-------+------+-------+

Analysis:
✅ type: ref (good - using index)
✅ key: idx_dept (index is used)
✅ rows: 15 (only 15 rows examined)
✅ No "Using filesort" or "Using temporary"
```

### EXPLAIN ANALYZE (MySQL 8.0+)

```sql
EXPLAIN ANALYZE 
SELECT * FROM employees WHERE salary > 80000;

-- Output includes:
-- - Actual execution time
-- - Actual rows examined
-- - Cost estimates
```

---

## 6. Index Strategies

### 6.1 Index High-Cardinality Columns

**Cardinality** = number of unique values

```sql
-- ✅ High cardinality - GOOD for indexing
email       (10,000 unique values in 10,000 rows)
user_id     (100,000 unique values)

-- ❌ Low cardinality - BAD for indexing
gender      (2 unique values: M/F)
is_active   (2 unique values: true/false)
```

### 6.2 Index Columns Used in WHERE, JOIN, ORDER BY

```sql
-- Index columns in WHERE
CREATE INDEX idx_status ON orders(status);
SELECT * FROM orders WHERE status = 'pending';

-- Index columns in JOIN
CREATE INDEX idx_user_id ON orders(user_id);
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id;

-- Index columns in ORDER BY
CREATE INDEX idx_created ON orders(created_at);
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;
```

### 6.3 Composite Index Column Order

**Rule**: Place most selective column first

```sql
-- users table: 100,000 rows
-- 50,000 users in USA
-- 10,000 users with status = 'active'

-- ✅ Good: Selective column first
CREATE INDEX idx_status_country ON users(status, country);

-- ❌ Bad: Less selective column first
CREATE INDEX idx_country_status ON users(country, status);

-- Query benefits from good index:
WHERE status = 'active' AND country = 'USA'
-- Narrows down to 10,000 first, then filters to fewer
```

### 6.4 Prefix Index for Long Strings

```sql
-- Index first 10 characters of email
CREATE INDEX idx_email_prefix ON users(email(10));

-- Saves space but less selective
-- Good for: long VARCHAR/TEXT columns
```

---

## 7. When NOT to Use Indexes

### ❌ Small Tables
```sql
-- Table with 100 rows: index overhead not worth it
-- Full scan is fast enough
```

### ❌ Low Cardinality Columns
```sql
-- gender (M/F), is_active (true/false)
-- Index doesn't help narrow down results
```

### ❌ Frequently Updated Columns
```sql
-- last_login updated on every login
-- Index slows down writes significantly
```

### ❌ Columns Not Used in Queries
```sql
-- Don't index columns you never search/filter on
```

### ❌ Too Many Indexes
```sql
-- Each index slows down INSERT/UPDATE/DELETE
-- Keep only necessary indexes
-- Monitor unused indexes:

SELECT * FROM sys.schema_unused_indexes;
```

---

## 8. Query Optimization Techniques

### 8.1 Use LIMIT
```sql
-- ✅ Good
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- ❌ Bad: Fetches all rows
SELECT * FROM users ORDER BY created_at DESC;
```

### 8.2 Avoid SELECT *
```sql
-- ✅ Good: Select only needed columns
SELECT id, name, email FROM users WHERE status = 'active';

-- ❌ Bad: Fetches unnecessary data
SELECT * FROM users WHERE status = 'active';
```

### 8.3 Use Indexed Columns in WHERE
```sql
-- ✅ Good: Uses index
SELECT * FROM users WHERE user_id = 123;

-- ❌ Bad: Function prevents index usage
SELECT * FROM users WHERE LOWER(email) = 'john@example.com';

-- ✅ Better: Store lowercase email in separate column
SELECT * FROM users WHERE email_lower = 'john@example.com';
```

### 8.4 Avoid OR, Use UNION
```sql
-- ❌ Bad: OR prevents index usage
SELECT * FROM users WHERE status = 'active' OR country = 'USA';

-- ✅ Good: UNION uses indexes
SELECT * FROM users WHERE status = 'active'
UNION
SELECT * FROM users WHERE country = 'USA';
```

### 8.5 Use EXISTS Instead of IN for Subqueries
```sql
-- ❌ Bad: Subquery runs fully
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE amount > 100);

-- ✅ Good: Stops when first match found
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.amount > 100
);
```

### 8.6 Use JOIN Instead of Subqueries
```sql
-- ❌ Bad: Subquery for each row
SELECT u.name,
    (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count
FROM users u;

-- ✅ Good: Single JOIN with GROUP BY
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

### 8.7 Optimize LIKE Queries
```sql
-- ✅ Good: Can use index
SELECT * FROM users WHERE email LIKE 'john%';

-- ❌ Bad: Cannot use index (starts with wildcard)
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- ✅ Better: Use Full-Text Search for complex patterns
```

### 8.8 Optimize ORDER BY
```sql
-- ✅ Good: Uses index
CREATE INDEX idx_created ON orders(created_at);
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- ❌ Bad: Causes filesort (no index)
SELECT * FROM orders ORDER BY RAND() LIMIT 10;
```

---

## Performance Monitoring

### Check Slow Queries
```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 2;  -- Queries > 2 seconds

-- View slow queries
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;
```

### Find Missing Indexes
```sql
-- Queries doing full table scans
SELECT * FROM sys.statements_with_full_table_scans
LIMIT 10;
```

### Index Usage Statistics
```sql
-- Which indexes are actually used
SELECT * FROM sys.schema_index_statistics
WHERE table_schema = 'your_database'
ORDER BY rows_selected DESC;
```

---

## Quick Reference

### Index Creation Syntax
```sql
-- Single column
CREATE INDEX idx_name ON table(column);

-- Composite
CREATE INDEX idx_name ON table(col1, col2);

-- Unique
CREATE UNIQUE INDEX idx_name ON table(column);

-- Covering
CREATE INDEX idx_name ON table(col1, col2, col3);

-- Drop index
DROP INDEX idx_name ON table;
```

### EXPLAIN Quick Guide
```
✅ type: const, eq_ref, ref, range
❌ type: index, ALL
✅ Extra: Using index
❌ Extra: Using filesort, Using temporary
```

---

## 📝 Practice Exercises

See `/tasks` folder for 5 query optimization exercises.
