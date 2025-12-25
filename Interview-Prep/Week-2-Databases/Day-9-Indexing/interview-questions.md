# Day 9: Interview Questions - Indexing & Optimization

## Question 1: What is a B-Tree index and how does it work?

**Answer:**

**B-Tree (Balanced Tree)** is the default index structure in MySQL. It's a self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in O(log n) time.

### Structure

```
                [50, 75]
              /    |     \
         [25]   [60, 65]  [90, 95]
        /   \      |         |
    [10,20] [30] [62,63]  [91,92,93]
```

### Key Properties

1. **Balanced**: All leaf nodes at same depth
2. **Sorted**: Values stored in order
3. **Multiple keys per node**: Reduces tree height
4. **Fast lookup**: O(log n) time complexity

### How Search Works

```sql
-- Find salary = 85000
CREATE INDEX idx_salary ON employees(salary);

-- B-Tree traversal:
1. Start at root: 85000 > 50, go right
2. Compare: 85000 > 75, go right again
3. Found in leaf node
4. Return row pointer
```

### Time Complexity

| Operation | Without Index | With B-Tree |
| --------- | ------------- | ----------- |
| Search    | O(n)          | O(log n)    |
| Insert    | O(1)          | O(log n)    |
| Delete    | O(n)          | O(log n)    |
| Range     | O(n)          | O(log n)    |

### Best For

✅ **Exact match queries**
```sql
WHERE id = 123
WHERE email = 'user@example.com'
```

✅ **Range queries**
```sql
WHERE salary BETWEEN 50000 AND 100000
WHERE created_at > '2023-01-01'
```

✅ **Prefix matching**
```sql
WHERE name LIKE 'John%'
```

✅ **ORDER BY**
```sql
ORDER BY created_at DESC
```

### Not Good For

❌ **Suffix/Infix matching**
```sql
WHERE name LIKE '%son'  -- Can't use B-Tree
WHERE email LIKE '%@gmail%'  -- Full scan required
```

### Storage Overhead

- Typically 10-20% of table size
- Stored separately from table data
- Updated on every INSERT/UPDATE/DELETE

---

## Question 2: Explain covering index and its benefits

**Answer:**

A **covering index** includes all columns needed by a query, allowing MySQL to satisfy the query entirely from the index without accessing the table data.

### Example

**Without Covering Index:**

```sql
CREATE INDEX idx_dept ON employees(department_id);

SELECT name, salary FROM employees WHERE department_id = 5;

-- Execution:
-- 1. Use idx_dept to find matching rows (index lookup)
-- 2. Access table to get name and salary (table lookup)
-- Result: 2 I/O operations
```

**With Covering Index:**

```sql
CREATE INDEX idx_dept_name_salary 
ON employees(department_id, name, salary);

SELECT name, salary FROM employees WHERE department_id = 5;

-- Execution:
-- 1. Use index to find matching rows
-- 2. Return name and salary directly from index
-- Result: 1 I/O operation, EXPLAIN shows "Using index"
```

### Benefits

| Benefit            | Impact                        |
| ------------------ | ----------------------------- |
| **Reduced I/O**    | No table access needed        |
| **Faster queries** | 2-10x performance improvement |
| **Lower CPU**      | Less data processing          |
| **Better caching** | Index likely in memory        |

### How to Create

**Column order matters:**

```sql
-- Query: WHERE a = ? AND b = ? ORDER BY c
-- Covering index:
CREATE INDEX idx_covering ON table(a, b, c);

-- Order: WHERE → JOIN → SELECT → ORDER BY
```

### Verification

```sql
EXPLAIN SELECT name, salary 
FROM employees 
WHERE department_id = 5;

-- Look for "Extra: Using index"
```

### Trade-offs

✅ **Pros:**
- Much faster read queries
- Reduced table I/O
- Better for reporting queries

❌ **Cons:**
- Larger index size (more storage)
- Slower INSERT/UPDATE/DELETE
- More memory needed for caching

### When to Use

✅ **Good candidates:**
- Frequently run queries
- Queries selecting few columns
- Read-heavy tables
- Reporting/analytics queries

❌ **Avoid when:**
- Too many columns needed
- Frequently updated columns
- Very wide columns (TEXT/BLOB)
- Write-heavy tables

### Real Example

```sql
-- Before: Slow query
SELECT user_id, created_at, status 
FROM orders 
WHERE status = 'completed' 
  AND created_at >= '2023-01-01'
ORDER BY created_at DESC
LIMIT 100;
-- Execution time: 2.5 seconds

-- Create covering index
CREATE INDEX idx_orders_covering 
ON orders(status, created_at, user_id);

-- After: Fast query
-- Execution time: 0.05 seconds (50x faster!)
-- EXPLAIN shows: "Using index"
```

---

## Question 3: How do you use EXPLAIN to analyze query performance?

**Answer:**

`EXPLAIN` shows MySQL's query execution plan, revealing how the database will execute your query.

### Basic Usage

```sql
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
```

### Key Columns

#### 1. **type** (Most Important)

Indicates join type, from best to worst:

```
✅ system     - Table has 0 or 1 row
✅ const      - Single row via PRIMARY KEY/UNIQUE
✅ eq_ref     - One row per previous table row (unique join)
✅ ref        - Multiple rows with index value
✅ range      - Index range scan (>, <, BETWEEN, IN)
⚠️  index     - Full index scan (reads entire index)
⚠️  ALL       - Full table scan (SLOWEST - reads entire table)
```

**Example:**

```sql
-- type: const (fastest)
EXPLAIN SELECT * FROM users WHERE id = 123;

-- type: ref (good)
EXPLAIN SELECT * FROM users WHERE status = 'active';

-- type: ALL (slowest - needs index!)
EXPLAIN SELECT * FROM users WHERE YEAR(created_at) = 2023;
```

#### 2. **key** (Which Index Used)

```sql
-- Shows which index MySQL chose
key: idx_email  ✅ Index is used
key: NULL       ❌ No index used (full scan)
```

#### 3. **rows** (Estimated Rows Examined)

```sql
rows: 10        ✅ Good - small result set
rows: 500000    ❌ Bad - examining too many rows
```

#### 4. **Extra** (Additional Information)

```
✅ Using index              - Covering index (best!)
✅ Using index condition    - Index pushdown
⚠️  Using where            - Filtering after read
⚠️  Using filesort         - Sorting needed (add ORDER BY index)
⚠️  Using temporary        - Temp table needed (expensive)
❌ Using join buffer       - Join without index (add index!)
```

### EXPLAIN Example

```sql
EXPLAIN SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name;

+----+------+-------+------+---------------+------------+---------+-------+------+-------------------------+
| id | type | table | key  | possible_keys | key_len    | ref     | rows  | Extra                   |
+----+------+-------+------+---------------+------------+---------+-------+------+-------------------------+
|  1 | ref  | u     | idx_ | idx_status    | 5          | const   | 5000  | Using where             |
|  1 | ref  | o     | idx_ | idx_user_id   | 4          | u.id    | 10    | NULL                    |
+----+------+-------+------+---------------+------------+---------+-------+------+-------------------------+

Analysis:
✅ Both tables use type 'ref' (good)
✅ Both use indexes (key column shows index names)
⚠️  users table examines 5000 rows (might need optimization)
```

### EXPLAIN ANALYZE (MySQL 8.0+)

Shows **actual** execution stats:

```sql
EXPLAIN ANALYZE 
SELECT * FROM users WHERE status = 'active';

-- Output:
-> Filter: (users.status = 'active')  (cost=1000 rows=5000) (actual time=0.5..25 rows=4850 loops=1)
    -> Table scan on users  (cost=1000 rows=10000) (actual time=0.1..20 rows=10000 loops=1)
```

**Key metrics:**
- **cost**: Estimated cost
- **rows**: Estimated rows
- **actual time**: Real execution time
- **actual rows**: Real row count

### Common Patterns

#### Pattern 1: Missing Index

```sql
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';

type: ALL        ❌ Full table scan
key: NULL        ❌ No index
rows: 100000     ❌ Scans entire table

-- Fix: Add index
CREATE INDEX idx_email ON users(email);
```

#### Pattern 2: Function Prevents Index

```sql
EXPLAIN SELECT * FROM users WHERE YEAR(created_at) = 2023;

type: ALL        ❌ Function on column
key: NULL        ❌ Can't use index

-- Fix: Use range query
EXPLAIN SELECT * FROM users 
WHERE created_at >= '2023-01-01' AND created_at < '2024-01-01';

type: range      ✅ Index range scan
key: idx_created ✅ Uses index
```

#### Pattern 3: Covering Index

```sql
EXPLAIN SELECT name, email FROM users WHERE status = 'active';

Extra: Using where    ⚠️ Accesses table

-- Fix: Covering index
CREATE INDEX idx_covering ON users(status, name, email);

Extra: Using index    ✅ No table access
```

### Step-by-Step Analysis

1. **Run EXPLAIN**
2. **Check type** - Should be ref/range or better
3. **Check key** - Should show an index
4. **Check rows** - Should be small
5. **Check Extra** - Look for "Using index"
6. **Optimize** - Add indexes, rewrite query
7. **Re-run EXPLAIN** - Verify improvement

---

## Question 4: When should you NOT use indexes?

**Answer:**

While indexes speed up queries, they have costs and aren't always beneficial.

### ❌ 1. Small Tables

**Don't index:**
```sql
-- Table with 100-1000 rows
-- Full scan is fast enough (< 0.01 seconds)
-- Index overhead not worth it
```

**Reason:**
- Full table scan is already fast
- Index adds storage and maintenance cost
- Query planner may ignore index anyway

### ❌ 2. Low Cardinality Columns

**Don't index:**
```sql
gender ENUM('M', 'F')              -- Only 2 values
is_active BOOLEAN                   -- Only true/false
status ENUM('pending', 'active')   -- Few distinct values
```

**Why it's bad:**
```sql
-- Table: 100,000 users, 50,000 male, 50,000 female
SELECT * FROM users WHERE gender = 'M';

-- With index: Still reads 50% of table
-- Without index: Reads 100% of table
-- Difference: Minimal benefit, not worth index cost
```

**Rule of thumb:**
- **High cardinality** (unique values > 5-10% of rows): Index beneficial
- **Low cardinality** (< 5% unique values): Index not helpful

### ❌ 3. Frequently Updated Columns

**Don't index:**
```sql
-- Updated on every user action
last_login TIMESTAMP
page_views INT
login_count INT
```

**Cost example:**
```sql
-- Without index
UPDATE users SET last_login = NOW() WHERE id = 123;
-- 1 write operation

-- With index on last_login
UPDATE users SET last_login = NOW() WHERE id = 123;
-- 2 write operations: 1) Update table 2) Update index
-- Slower updates!
```

**When acceptable:**
- Index needed for critical queries
- Updates are infrequent
- Read-to-write ratio is high (10:1 or more)

### ❌ 4. Columns Not Used in Queries

**Don't index:**
```sql
-- These columns are never in WHERE/JOIN/ORDER BY
description TEXT
notes TEXT
metadata JSON
```

**Find unused columns:**
```sql
-- Check actual query patterns
SELECT * FROM sys.schema_unused_indexes
WHERE object_schema = 'your_database';
```

### ❌ 5. Too Many Indexes

**Problem:**
```sql
-- users table with 10 indexes
-- Every INSERT updates 10 indexes!

INSERT INTO users (name, email, status, ...)
VALUES ('John', 'john@example.com', 'active', ...);
-- Must update: PRIMARY KEY + 9 other indexes
```

**Impact:**
- **Slower writes**: Each index must be updated
- **More storage**: Each index stores data
- **More memory**: Indexes compete for cache

**Rule:**
- Keep 3-5 indexes per table maximum
- Drop unused indexes
- Monitor index usage

### ❌ 6. Very Wide Columns

**Don't index:**
```sql
-- Large TEXT/BLOB columns
article_content TEXT (10KB average)
image_data BLOB (100KB+)
json_data JSON (large documents)
```

**Why:**
- **Huge index size**: 10GB table → 15GB with index
- **Poor cache efficiency**: Large index entries
- **Slow updates**: More data to write

**Alternative:**
```sql
-- Use prefix index for long strings
CREATE INDEX idx_content_prefix ON articles(content(100));
-- Index first 100 characters only

-- Or use Full-Text index
CREATE FULLTEXT INDEX idx_content ON articles(content);
```

### ❌ 7. Composite Index Wrong Column Order

**Bad composite index:**
```sql
-- Query: WHERE status = 'active'
CREATE INDEX idx_country_status ON users(country, status);
-- Index not used! Query doesn't filter on 'country' first
```

**Leftmost prefix rule:**
```sql
-- Index: (a, b, c)
-- ✅ Uses index: WHERE a = ?
-- ✅ Uses index: WHERE a = ? AND b = ?
-- ✅ Uses index: WHERE a = ? AND b = ? AND c = ?
-- ❌ NOT used: WHERE b = ?
-- ❌ NOT used: WHERE c = ?
```

### When to Remove Indexes

```sql
-- Find unused indexes
SELECT 
    object_schema,
    object_name,
    index_name
FROM sys.schema_unused_indexes
WHERE object_schema = 'your_database';

-- Drop unused index
DROP INDEX idx_unused ON table_name;
```

### Decision Checklist

Before adding an index, ask:

- [ ] Does the query significantly benefit? (> 2x faster)
- [ ] Is the column high cardinality?
- [ ] Is the table large enough? (> 10,000 rows)
- [ ] Are reads more frequent than writes? (10:1 ratio)
- [ ] Is the column not too wide? (< 1KB)
- [ ] Will this be used by actual queries?

If any answer is "No", reconsider the index.

---

## Question 5: Explain the difference between clustered and non-clustered indexes

**Answer:**

### Clustered Index

**Definition:** The actual table data is stored in the order of the clustered index. The table itself is the index.

**MySQL Specifics:**
- **PRIMARY KEY** is always the clustered index
- **Only ONE** clustered index per table
- InnoDB always has a clustered index

**Structure:**
```
Clustered Index (PRIMARY KEY: id)
+----+---------+----------------+
| id | name    | email          |  ← Actual table data
+----+---------+----------------+
| 1  | Alice   | alice@ex.com   |
| 2  | Bob     | bob@ex.com     |
| 3  | Charlie | charlie@ex.com |
+----+---------+----------------+
Data stored in PRIMARY KEY order
```

**How it works:**
```sql
-- Create table
CREATE TABLE users (
    id INT PRIMARY KEY,  -- Clustered index
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Query using PRIMARY KEY
SELECT * FROM users WHERE id = 5;
-- Direct lookup: Index IS the data
-- Very fast: Single I/O operation
```

**Benefits:**
- ✅ **Fast PRIMARY KEY lookups**: No additional table access
- ✅ **Fast range queries**: Data stored sequentially
- ✅ **No duplicate data**: Index and table are same

**Drawbacks:**
- ❌ **Slower INSERT**: Must maintain sort order
- ❌ **Slower UPDATE on PK**: May need to relocate row
- ❌ **Page splits**: Inserting in middle causes splits

### Non-Clustered Index (Secondary Index)

**Definition:** Separate structure from table data. Contains indexed columns plus a pointer to the actual row.

**MySQL Specifics:**
- All indexes EXCEPT PRIMARY KEY are non-clustered
- Can have **multiple** non-clustered indexes
- Pointers refer back to clustered index (PRIMARY KEY)

**Structure:**
```
Non-Clustered Index (email)
+----------------+-------+
| email          | id    |  ← Index data + PK pointer
+----------------+-------+
| alice@ex.com   | 1     |
| bob@ex.com     | 2     |
| charlie@ex.com | 3     |
+----------------+-------+
               ↓
        Points to PRIMARY KEY
               ↓
Table Data (Clustered Index)
+----+---------+----------------+
| id | name    | email          |
+----+---------+----------------+
| 1  | Alice   | alice@ex.com   |
| 2  | Bob     | bob@ex.com     |
| 3  | Charlie | charlie@ex.com |
+----+---------+----------------+
```

**How it works:**
```sql
-- Create non-clustered index
CREATE INDEX idx_email ON users(email);

-- Query using secondary index
SELECT * FROM users WHERE email = 'alice@ex.com';

-- Execution:
-- 1. Lookup in idx_email index → finds id = 1
-- 2. Lookup in clustered index (table) using id = 1
-- 3. Return row data
-- Total: 2 I/O operations
```

**Benefits:**
- ✅ **Multiple indexes**: Many per table
- ✅ **No data duplication**: Only index columns stored
- ✅ **Covering index**: Can avoid table lookup
- ✅ **Flexible**: Can add/drop easily

**Drawbacks:**
- ❌ **Extra lookup**: Index → PK → table
- ❌ **More storage**: Additional structure
- ❌ **Slower updates**: Must update index + table

### Comparison Table

| Aspect            | Clustered Index                  | Non-Clustered Index |
| ----------------- | -------------------------------- | ------------------- |
| **Count**         | 1 per table                      | Multiple per table  |
| **Storage**       | Table data stored in index order | Separate structure  |
| **MySQL**         | PRIMARY KEY                      | Other indexes       |
| **Lookup**        | Direct (1 I/O)                   | Indirect (2 I/O)    |
| **Size**          | Same as table                    | 10-30% of table     |
| **INSERT speed**  | Slower (maintain order)          | Faster              |
| **Range queries** | Very fast                        | Fast with index     |

### Practical Examples

**Example 1: PRIMARY KEY vs Secondary**

```sql
CREATE TABLE orders (
    id INT PRIMARY KEY,           -- Clustered index
    user_id INT,
    status VARCHAR(20),
    created_at TIMESTAMP,
    INDEX idx_user (user_id),     -- Non-clustered
    INDEX idx_status (status)     -- Non-clustered
);

-- Using clustered index (fastest)
SELECT * FROM orders WHERE id = 12345;
-- 1 lookup: Direct to data

-- Using non-clustered index
SELECT * FROM orders WHERE user_id = 100;
-- 2 lookups: 1) idx_user → id  2) clustered index → data
```

**Example 2: Covering Index Optimization**

```sql
-- Query
SELECT user_id, status FROM orders WHERE status = 'pending';

-- Without covering index:
CREATE INDEX idx_status ON orders(status);
-- Lookups: 1) idx_status → id  2) clustered → user_id

-- With covering index:
CREATE INDEX idx_status_user ON orders(status, user_id);
-- Lookups: 1) idx_status_user → done! (no table access)
-- Much faster!
```

### Design Guidelines

**Choose PRIMARY KEY wisely:**
```sql
-- ✅ Good: Auto-increment ID
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Sequential inserts
    ...
);

-- ❌ Bad: UUID as PRIMARY KEY
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,  -- Random inserts cause page splits
    ...
);

-- ✅ Better: UUID with auto-increment PK
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) UNIQUE,
    ...
);
```

**Use non-clustered for:**
- Foreign keys
- Frequently searched columns
- WHERE/JOIN/ORDER BY columns

**Avoid too many non-clustered:**
- Each index slows INSERT/UPDATE/DELETE
- Keep 3-5 indexes per table maximum
