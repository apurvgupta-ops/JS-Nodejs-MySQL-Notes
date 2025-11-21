# Day 8: Interview Questions - SQL Joins

## Question 1: Explain the difference between INNER JOIN and LEFT JOIN

**Answer:**

**INNER JOIN:**
- Returns only rows that have **matching values** in both tables
- Excludes rows with no match
- Most common join type

**LEFT JOIN (LEFT OUTER JOIN):**
- Returns **all rows** from the left table
- Returns matching rows from the right table
- For non-matching rows, returns NULL for right table columns

**Example:**

```sql
-- Sample data
-- employees: 6 rows (1 without department)
-- departments: 4 rows (1 without employees)

-- INNER JOIN: Returns only 5 rows (employees WITH departments)
SELECT e.name, d.name AS department
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- LEFT JOIN: Returns all 6 rows (all employees, NULL for no department)
SELECT e.name, d.name AS department
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
```

**When to use:**
- **INNER JOIN**: When you only want records that exist in both tables
- **LEFT JOIN**: When you want all records from the main table, even if no match exists

---

## Question 2: What is a SELF JOIN and provide a practical use case

**Answer:**

A **SELF JOIN** is when a table is joined with itself. Used for comparing rows within the same table or representing hierarchical data.

**Common Use Cases:**
1. Employee-Manager relationships
2. Product comparisons
3. Finding duplicates
4. Hierarchical data (org charts, categories)

**Example: Employee-Manager Hierarchy**

```sql
-- Show employees and their managers
SELECT 
    emp.name AS employee,
    emp.salary AS emp_salary,
    mgr.name AS manager,
    mgr.salary AS mgr_salary
FROM employees emp
LEFT JOIN employees mgr ON emp.manager_id = mgr.id;
```

**Example: Find Colleagues**

```sql
-- Employees in the same department
SELECT 
    e1.name AS employee1,
    e2.name AS employee2,
    d.name AS department
FROM employees e1
INNER JOIN employees e2 
    ON e1.department_id = e2.department_id 
    AND e1.id < e2.id  -- Avoid duplicates and self-pairs
INNER JOIN departments d ON e1.department_id = d.id;
```

**Key Points:**
- Use different aliases (e1, e2) to distinguish the same table
- Often used with LEFT JOIN (to include all rows)
- Add conditions to prevent self-pairing (e1.id != e2.id)
- Useful for hierarchical queries (before CTEs)

---

## Question 3: How do you optimize JOIN queries?

**Answer:**

### 1. **Index Join Columns**
```sql
-- Add indexes on foreign keys
CREATE INDEX idx_employees_dept ON employees(department_id);
CREATE INDEX idx_employees_mgr ON employees(manager_id);

-- For composite joins
CREATE INDEX idx_emp_proj ON employee_projects(employee_id, project_id);
```

### 2. **Use EXPLAIN to Analyze**
```sql
EXPLAIN SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- Check:
-- - type: 'ref' or 'eq_ref' (good), 'ALL' (bad - full scan)
-- - key: Shows which index is used
-- - rows: Number of rows examined
-- - Extra: Look for "Using index" (covering index)
```

### 3. **Filter Early (WHERE Before JOIN)**
```sql
-- ✅ Good: Filter reduces dataset before join
SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > 80000;

-- ❌ Bad: Join first, filter later (processes more data)
SELECT *
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > 80000 AND d.location = 'New York';
```

### 4. **Select Only Needed Columns**
```sql
-- ✅ Good: Specific columns
SELECT e.name, e.salary, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- ❌ Bad: SELECT *
SELECT *
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

### 5. **Use Proper Join Order**
```sql
-- Start with smallest/most filtered table
-- MySQL optimizer does this, but explicit order helps

-- ✅ Good: Small filtered set first
SELECT e.name, d.name
FROM (
    SELECT * FROM employees WHERE hire_date > '2020-01-01'
) e
INNER JOIN departments d ON e.department_id = d.id;
```

### 6. **Avoid Cartesian Products**
```sql
-- ❌ Bad: Missing join condition
SELECT e.name, d.name
FROM employees e, departments d;  -- 6 × 4 = 24 rows!

-- ✅ Good: Proper join
SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;  -- 5 rows
```

### 7. **Use Covering Indexes**
```sql
-- Create index with all needed columns
CREATE INDEX idx_emp_salary_dept 
ON employees(department_id, salary, name);

-- Query uses only index (no table access)
SELECT name, salary
FROM employees
WHERE department_id = 1 AND salary > 80000;
-- Extra: Using index condition
```

### 8. **Limit Result Set**
```sql
-- Add LIMIT when appropriate
SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
LIMIT 10;
```

**Performance Checklist:**
- [ ] Indexes on all join columns
- [ ] Used EXPLAIN to verify execution plan
- [ ] Filtered data early (WHERE clause)
- [ ] Selected only needed columns
- [ ] Avoided SELECT *
- [ ] No Cartesian products
- [ ] Result set limited when possible

---

## Question 4: Explain CROSS JOIN and when to use it

**Answer:**

**CROSS JOIN** returns the **Cartesian product** of two tables - every row from the first table combined with every row from the second table.

**Syntax:**
```sql
SELECT *
FROM table1
CROSS JOIN table2;

-- Or implicit syntax
SELECT *
FROM table1, table2;  -- Same as CROSS JOIN
```

**Result Size:**
```
Table1 rows × Table2 rows = Result rows
6 employees × 4 departments = 24 rows
```

**Example:**
```sql
-- All possible employee-department combinations
SELECT 
    e.name AS employee,
    d.name AS department
FROM employees e
CROSS JOIN departments d;
-- Returns 24 rows (6 × 4)
```

### When to Use CROSS JOIN:

**1. Generate All Combinations**
```sql
-- All possible employee-shift combinations for scheduling
SELECT 
    e.name AS employee,
    s.shift_name,
    s.start_time,
    s.end_time
FROM employees e
CROSS JOIN shifts s
ORDER BY e.name, s.start_time;
```

**2. Create Test Data**
```sql
-- Generate test scenarios
SELECT 
    u.username,
    p.product_name,
    CONCAT('Test case: ', u.username, ' - ', p.product_name) AS test_scenario
FROM test_users u
CROSS JOIN test_products p;
```

**3. Date/Time Series Generation**
```sql
-- Generate all date-employee combinations for attendance tracking
SELECT 
    dates.date,
    e.name AS employee
FROM (
    SELECT DATE_ADD('2024-01-01', INTERVAL n DAY) AS date
    FROM numbers
    WHERE n < 365
) dates
CROSS JOIN employees e
ORDER BY date, e.name;
```

**4. Matrix/Grid Generation**
```sql
-- Seating chart combinations
SELECT 
    CONCAT('Row ', r.row_num) AS row,
    CONCAT('Seat ', s.seat_num) AS seat
FROM rows r
CROSS JOIN seats s
ORDER BY r.row_num, s.seat_num;
```

### When NOT to Use:

❌ **Accidental Cartesian Product** (common mistake):
```sql
-- ❌ Bad: Missing join condition
SELECT e.name, d.name
FROM employees e, departments d;  -- Unintended CROSS JOIN

-- ✅ Good: Proper INNER JOIN
SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

❌ **Large Tables** (performance issue):
```sql
-- ❌ Bad: 1M × 1M = 1 Trillion rows!
SELECT *
FROM large_table1
CROSS JOIN large_table2;
```

**Key Points:**
- Returns m × n rows (can be huge!)
- Rarely used in production queries
- Useful for generating combinations
- Often indicates missing join condition (bug)
- Use with small tables only

---

## Question 5: How do you handle many-to-many relationships in SQL?

**Answer:**

**Many-to-many relationships** require a **junction table** (also called bridge, linking, or associative table).

### Example: Employees and Projects

**Schema Design:**
```sql
-- Main tables
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE projects (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    budget DECIMAL(12,2)
);

-- Junction table
CREATE TABLE employee_projects (
    employee_id INT,
    project_id INT,
    hours_worked INT,
    role VARCHAR(50),  -- Additional attributes
    assigned_date DATE,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

### Query Patterns:

**1. List All Relationships**
```sql
-- All employee-project assignments
SELECT 
    e.name AS employee,
    p.name AS project,
    ep.hours_worked,
    ep.role
FROM employee_projects ep
INNER JOIN employees e ON ep.employee_id = e.id
INNER JOIN projects p ON ep.project_id = p.id
ORDER BY e.name, p.name;
```

**2. Projects for Specific Employee**
```sql
-- All projects for employee ID 1
SELECT 
    p.name AS project,
    p.budget,
    ep.hours_worked,
    ep.role
FROM employee_projects ep
INNER JOIN projects p ON ep.project_id = p.id
WHERE ep.employee_id = 1;
```

**3. Employees on Specific Project**
```sql
-- All employees on project ID 2
SELECT 
    e.name AS employee,
    e.salary,
    ep.hours_worked,
    ep.role
FROM employee_projects ep
INNER JOIN employees e ON ep.employee_id = e.id
WHERE ep.project_id = 2;
```

**4. Aggregations**
```sql
-- Employee workload (total hours across all projects)
SELECT 
    e.name AS employee,
    COUNT(ep.project_id) AS project_count,
    SUM(ep.hours_worked) AS total_hours
FROM employees e
LEFT JOIN employee_projects ep ON e.id = ep.employee_id
GROUP BY e.id, e.name
ORDER BY total_hours DESC;

-- Project team size
SELECT 
    p.name AS project,
    p.budget,
    COUNT(ep.employee_id) AS team_size,
    SUM(ep.hours_worked) AS total_hours
FROM projects p
LEFT JOIN employee_projects ep ON p.id = ep.project_id
GROUP BY p.id, p.name, p.budget
ORDER BY team_size DESC;
```

**5. Find Unassigned**
```sql
-- Employees not assigned to any project
SELECT e.name
FROM employees e
LEFT JOIN employee_projects ep ON e.id = ep.employee_id
WHERE ep.employee_id IS NULL;

-- Projects without employees
SELECT p.name
FROM projects p
LEFT JOIN employee_projects ep ON p.id = ep.project_id
WHERE ep.project_id IS NULL;
```

### Best Practices:

**1. Composite Primary Key**
```sql
PRIMARY KEY (employee_id, project_id)
-- Ensures no duplicate assignments
```

**2. Add Indexes**
```sql
CREATE INDEX idx_emp_proj_emp ON employee_projects(employee_id);
CREATE INDEX idx_emp_proj_proj ON employee_projects(project_id);
-- Speeds up joins and lookups
```

**3. Additional Attributes in Junction Table**
```sql
-- Store relationship-specific data
CREATE TABLE employee_projects (
    employee_id INT,
    project_id INT,
    hours_worked INT,      -- Specific to this relationship
    role VARCHAR(50),       -- Role on this project
    assigned_date DATE,     -- When assigned
    start_date DATE,
    end_date DATE,
    PRIMARY KEY (employee_id, project_id)
);
```

**4. Cascading Deletes**
```sql
-- Auto-delete assignments when employee/project deleted
FOREIGN KEY (employee_id) 
    REFERENCES employees(id) 
    ON DELETE CASCADE,
FOREIGN KEY (project_id) 
    REFERENCES projects(id) 
    ON DELETE CASCADE
```

**Common Mistakes to Avoid:**

❌ **Storing multiple IDs in one column**
```sql
-- ❌ Bad: Comma-separated values
CREATE TABLE employees (
    id INT,
    project_ids VARCHAR(255)  -- '1,3,5' DON'T DO THIS!
);
```

❌ **Missing indexes on junction table**
❌ **No composite primary key** (allows duplicates)
❌ **Forgetting LEFT JOIN** (excludes unassigned records)

**Real-World Examples:**
- Students ↔ Courses (enrollments)
- Users ↔ Roles (user_roles)
- Products ↔ Orders (order_items)
- Actors ↔ Movies (cast)
- Tags ↔ Posts (post_tags)
