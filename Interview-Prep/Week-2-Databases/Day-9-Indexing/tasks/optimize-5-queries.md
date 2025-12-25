# Day 9: Optimize 5 Queries

## Setup

```bash
# Load the test database with 100,000 rows
mysql -u root -p < setup-large-db.sql
```

This creates a `performance_test` database with:
- `users` table (100,000 rows)
- `orders` table (500,000 rows)
- `products` table (10,000 rows)

---

## Query 1: Slow WHERE Clause

### Problem Query (SLOW)
```sql
USE performance_test;

-- Takes 2-3 seconds
SELECT * FROM users 
WHERE YEAR(created_at) = 2023;
```

### Task
1. Run `EXPLAIN` on the query
2. Identify the problem
3. Optimize the query
4. Create appropriate index
5. Verify improvement with `EXPLAIN ANALYZE`

### Hints
- Function on column prevents index usage
- Convert to range query
- Index the date column

---

## Query 2: Inefficient JOIN

### Problem Query (SLOW)
```sql
-- Takes 5+ seconds
SELECT 
    u.name,
    u.email,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name, u.email;
```

### Task
1. Run `EXPLAIN` to see execution plan
2. Check if indexes exist on join columns
3. Add missing indexes
4. Verify `type` changes from ALL to ref/eq_ref

### Hints
- Index foreign keys
- Index WHERE clause columns
- Check rows examined before/after

---

## Query 3: SELECT * Problem

### Problem Query (SLOW)
```sql
-- Fetches all 50 columns
SELECT * FROM orders 
WHERE status = 'pending' 
ORDER BY created_at DESC 
LIMIT 100;
```

### Task
1. Rewrite to select only needed columns
2. Create covering index
3. Verify "Using index" in EXPLAIN

### Columns Needed
- id, user_id, amount, status, created_at

### Hints
- Covering index should include all selected columns
- Order columns: WHERE → JOIN → SELECT → ORDER BY

---

## Query 4: Unoptimized Subquery

### Problem Query (SLOW)
```sql
-- Subquery runs for each row
SELECT 
    p.name,
    p.price,
    (SELECT COUNT(*) FROM orders o 
     JOIN order_items oi ON o.id = oi.order_id
     WHERE oi.product_id = p.id) AS times_ordered
FROM products p
WHERE p.category = 'Electronics';
```

### Task
1. Rewrite using JOIN instead of subquery
2. Add appropriate indexes
3. Compare execution time

### Hints
- Use LEFT JOIN with GROUP BY
- Index product_id in order_items
- Index category in products

---

## Query 5: Complex Multi-Table Query

### Problem Query (SLOW)
```sql
-- Very slow with 3+ table joins
SELECT 
    u.name AS customer,
    u.email,
    p.name AS product,
    o.amount,
    o.created_at AS order_date
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE u.country = 'USA'
  AND o.status = 'completed'
  AND o.created_at >= '2023-01-01'
ORDER BY o.created_at DESC
LIMIT 50;
```

### Task
1. Run EXPLAIN to identify issues
2. Create composite indexes strategically
3. Optimize column order in indexes
4. Verify all joins use indexes

### Hints
- Index all foreign keys
- Create composite index for users(country, id)
- Create composite index for orders(status, created_at)
- Check if ORDER BY can use index

---

## Measurement Template

For each query, document:

### Before Optimization
```sql
EXPLAIN [query];
-- Record: type, rows, Extra

EXPLAIN ANALYZE [query];
-- Record: actual_time

SELECT COUNT(*) FROM [table];
-- Record: table size
```

### After Optimization
```sql
-- Indexes created:
CREATE INDEX idx_name ON table(columns);

EXPLAIN [optimized_query];
-- Record: type, rows, Extra, key used

EXPLAIN ANALYZE [optimized_query];
-- Record: actual_time

-- Performance improvement:
-- Before: X seconds
-- After: Y seconds
-- Improvement: Z% faster
```

---

## Success Criteria

- [ ] Query 1: < 0.5 seconds (from ~2 seconds)
- [ ] Query 2: < 1 second (from ~5 seconds)
- [ ] Query 3: "Using index" in EXPLAIN
- [ ] Query 4: < 0.5 seconds with JOIN
- [ ] Query 5: All joins use type 'ref' or better

---

## Bonus Challenge

Find and optimize the 3 slowest queries in your own projects:

1. Enable slow query log
2. Identify top 3 slow queries
3. Apply optimization techniques
4. Measure improvements

---

## Solutions

Check `/solutions` folder after completing all exercises.
