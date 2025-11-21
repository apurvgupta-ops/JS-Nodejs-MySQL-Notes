# Day 8: SQL Joins Mastery

## 📚 Table of Contents
1. Understanding Joins
2. INNER JOIN
3. LEFT JOIN (LEFT OUTER JOIN)
4. RIGHT JOIN (RIGHT OUTER JOIN)
5. CROSS JOIN
6. SELF JOIN
7. Multiple Joins
8. Join Performance

---

## 1. Understanding Joins

**Joins** combine rows from two or more tables based on related columns.

### Sample Database Setup

```sql
-- Create database
CREATE DATABASE company_db;
USE company_db;

-- Employees table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    salary DECIMAL(10,2),
    manager_id INT,
    hire_date DATE
);

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

-- Projects table
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    budget DECIMAL(12,2),
    department_id INT
);

-- Employee_Projects junction table
CREATE TABLE employee_projects (
    employee_id INT,
    project_id INT,
    hours_worked INT,
    PRIMARY KEY (employee_id, project_id)
);

-- Insert sample data
INSERT INTO departments (name, location) VALUES
('Engineering', 'San Francisco'),
('Sales', 'New York'),
('Marketing', 'Chicago'),
('HR', 'Boston');

INSERT INTO employees (name, department_id, salary, manager_id, hire_date) VALUES
('John Doe', 1, 90000, NULL, '2020-01-15'),
('Jane Smith', 1, 85000, 1, '2020-03-20'),
('Bob Johnson', 2, 75000, NULL, '2019-06-10'),
('Alice Brown', 2, 70000, 3, '2021-02-14'),
('Charlie Wilson', 3, 65000, NULL, '2020-11-05'),
('Diana Prince', NULL, 60000, NULL, '2022-01-10'); -- No department

INSERT INTO projects (name, budget, department_id) VALUES
('Website Redesign', 100000, 1),
('Sales Campaign', 50000, 2),
('Brand Refresh', 75000, 3),
('Internal Tool', 30000, 1),
('Customer Portal', 150000, NULL); -- No department assigned

INSERT INTO employee_projects (employee_id, project_id, hours_worked) VALUES
(1, 1, 120),
(1, 4, 80),
(2, 1, 100),
(3, 2, 150),
(4, 2, 90),
(5, 3, 110);
```

---

## 2. INNER JOIN

Returns only matching rows from both tables.

### Syntax
```sql
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;
```

### Examples

**Basic Inner Join:**
```sql
-- Get employees with their department names
SELECT 
    e.name AS employee_name,
    e.salary,
    d.name AS department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- Result: Only employees WITH departments (Diana excluded)
```

**With WHERE clause:**
```sql
-- Engineers earning over $80,000
SELECT 
    e.name,
    e.salary,
    d.name AS department
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE d.name = 'Engineering' AND e.salary > 80000;
```

**With Aggregate Functions:**
```sql
-- Average salary per department
SELECT 
    d.name AS department,
    COUNT(e.id) AS employee_count,
    AVG(e.salary) AS avg_salary
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
ORDER BY avg_salary DESC;
```

---

## 3. LEFT JOIN (LEFT OUTER JOIN)

Returns all rows from the left table and matching rows from the right table. If no match, NULL values for right table columns.

### Syntax
```sql
SELECT columns
FROM table1
LEFT JOIN table2 ON table1.column = table2.column;
```

### Examples

**Basic Left Join:**
```sql
-- All employees with their departments (including Diana without department)
SELECT 
    e.name AS employee_name,
    d.name AS department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;

-- Result: All employees, Diana has NULL for department_name
```

**Find Unmatched Records:**
```sql
-- Employees without a department
SELECT 
    e.name,
    e.salary
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
WHERE d.id IS NULL;

-- Result: Diana Prince
```

**Multiple Left Joins:**
```sql
-- Employees with their departments and managers
SELECT 
    e.name AS employee,
    d.name AS department,
    m.name AS manager
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id;
```

---

## 4. RIGHT JOIN (RIGHT OUTER JOIN)

Returns all rows from the right table and matching rows from the left table.

### Syntax
```sql
SELECT columns
FROM table1
RIGHT JOIN table2 ON table1.column = table2.column;
```

### Examples

**Basic Right Join:**
```sql
-- All departments with their employees (including departments without employees)
SELECT 
    d.name AS department,
    COUNT(e.id) AS employee_count
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id
GROUP BY d.id, d.name;

-- Result: All departments, HR has 0 employees
```

**Find Departments Without Employees:**
```sql
SELECT 
    d.name AS department,
    d.location
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id
WHERE e.id IS NULL;

-- Result: HR department
```

---

## 5. CROSS JOIN

Returns the Cartesian product of both tables (every row from table1 with every row from table2).

### Syntax
```sql
SELECT columns
FROM table1
CROSS JOIN table2;
```

### Examples

**Basic Cross Join:**
```sql
-- All possible employee-project combinations
SELECT 
    e.name AS employee,
    p.name AS project
FROM employees e
CROSS JOIN projects p;

-- Result: 6 employees × 5 projects = 30 rows
```

**Practical Use - Generate Combinations:**
```sql
-- All possible employee-department combinations for analysis
SELECT 
    e.name AS employee,
    d.name AS potential_department
FROM employees e
CROSS JOIN departments d
ORDER BY e.name, d.name;
```

---

## 6. SELF JOIN

A table joined with itself.

### Examples

**Employee-Manager Relationship:**
```sql
-- Show employees and their managers
SELECT 
    e.name AS employee,
    m.name AS manager,
    e.salary AS employee_salary,
    m.salary AS manager_salary
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

**Find Employees Earning More Than Their Manager:**
```sql
SELECT 
    e.name AS employee,
    e.salary AS employee_salary,
    m.name AS manager,
    m.salary AS manager_salary
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

**Find Colleagues (Same Department):**
```sql
SELECT DISTINCT
    e1.name AS employee1,
    e2.name AS employee2,
    d.name AS department
FROM employees e1
INNER JOIN employees e2 ON e1.department_id = e2.department_id AND e1.id < e2.id
INNER JOIN departments d ON e1.department_id = d.id;
```

---

## 7. Multiple Joins

Combining multiple tables in a single query.

### Complex Example 1: Employee Full Details
```sql
SELECT 
    e.name AS employee,
    d.name AS department,
    m.name AS manager,
    p.name AS project,
    ep.hours_worked
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id
LEFT JOIN employee_projects ep ON e.id = ep.employee_id
LEFT JOIN projects p ON ep.project_id = p.id
ORDER BY e.name, p.name;
```

### Complex Example 2: Department Analytics
```sql
SELECT 
    d.name AS department,
    d.location,
    COUNT(DISTINCT e.id) AS employee_count,
    COUNT(DISTINCT p.id) AS project_count,
    COALESCE(SUM(p.budget), 0) AS total_budget,
    COALESCE(AVG(e.salary), 0) AS avg_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
LEFT JOIN projects p ON d.id = p.department_id
GROUP BY d.id, d.name, d.location
ORDER BY employee_count DESC;
```

### Complex Example 3: Project Workload
```sql
SELECT 
    p.name AS project,
    p.budget,
    d.name AS department,
    COUNT(ep.employee_id) AS employees_assigned,
    SUM(ep.hours_worked) AS total_hours,
    ROUND(p.budget / NULLIF(SUM(ep.hours_worked), 0), 2) AS cost_per_hour
FROM projects p
LEFT JOIN departments d ON p.department_id = d.id
LEFT JOIN employee_projects ep ON p.id = ep.project_id
GROUP BY p.id, p.name, p.budget, d.name
ORDER BY total_hours DESC;
```

---

## 8. Join Performance Tips

### 1. Use Indexes
```sql
-- Add indexes on join columns
CREATE INDEX idx_emp_dept ON employees(department_id);
CREATE INDEX idx_emp_mgr ON employees(manager_id);
CREATE INDEX idx_proj_dept ON projects(department_id);
```

### 2. Use EXPLAIN to Analyze
```sql
EXPLAIN SELECT 
    e.name,
    d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- Look for:
-- - type: 'ref' or 'eq_ref' is good
-- - possible_keys: Shows usable indexes
-- - key: Shows used index
-- - rows: Fewer is better
```

### 3. Filter Early
```sql
-- ✅ Good: Filter before join
SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary > 75000;

-- ❌ Bad: Filter after join (processes more data)
SELECT e.name, d.name
FROM (SELECT * FROM employees WHERE salary > 75000) e
INNER JOIN departments d ON e.department_id = d.id;
```

### 4. Avoid Cartesian Products
```sql
-- ❌ Bad: Missing join condition (Cartesian product)
SELECT e.name, d.name
FROM employees e, departments d;

-- ✅ Good: Proper join condition
SELECT e.name, d.name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;
```

---

## Quick Reference

| Join Type | Returns                            | Use Case                       |
| --------- | ---------------------------------- | ------------------------------ |
| **INNER** | Only matching rows                 | Standard relationships         |
| **LEFT**  | All from left + matches from right | Include all from main table    |
| **RIGHT** | All from right + matches from left | Rarely used (use LEFT instead) |
| **CROSS** | Cartesian product                  | Generate combinations          |
| **SELF**  | Table with itself                  | Hierarchies, comparisons       |

### Join Selection Guide

```
Need all records from left table?
├─ YES → LEFT JOIN
└─ NO → Need only matches?
    ├─ YES → INNER JOIN
    └─ NO → Need all combinations?
        ├─ YES → CROSS JOIN
        └─ NO → Same table comparison?
            └─ YES → SELF JOIN
```

---

## 📝 Practice Exercises

See the `/tasks` folder for 10 practice queries covering:
1. Basic joins with 2 tables
2. Multiple table joins
3. Aggregations with joins
4. Self joins for hierarchies
5. Complex business logic queries

---

## 🔗 Further Reading

- MySQL Join Documentation
- Visual JOIN explanation (Venn diagrams)
- Join optimization techniques
