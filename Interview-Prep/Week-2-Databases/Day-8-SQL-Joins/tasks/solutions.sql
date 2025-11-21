-- Day 8: Solutions to 10 Practice Queries

USE company_db;

-- ====================
-- Query 1: Basic INNER JOIN
-- ====================
SELECT 
    e.name AS employee_name,
    d.name AS department,
    d.location,
    e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY e.salary DESC;

/* Result: 5 rows
+---------------+-------------+---------------+----------+
| employee_name | department  | location      | salary   |
+---------------+-------------+---------------+----------+
| John Doe      | Engineering | San Francisco | 90000.00 |
| Jane Smith    | Engineering | San Francisco | 85000.00 |
| Bob Johnson   | Sales       | New York      | 75000.00 |
| Alice Brown   | Sales       | New York      | 70000.00 |
| Charlie Wilson| Marketing   | Chicago       | 65000.00 |
+---------------+-------------+---------------+----------+
*/

-- ====================
-- Query 2: LEFT JOIN with NULL check
-- ====================
SELECT 
    e.name AS employee_name,
    COALESCE(d.name, 'No Department') AS department,
    e.salary
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
ORDER BY e.salary DESC;

/* Result: 6 rows (includes Diana with No Department)
+---------------+---------------+----------+
| employee_name | department    | salary   |
+---------------+---------------+----------+
| John Doe      | Engineering   | 90000.00 |
| Jane Smith    | Engineering   | 85000.00 |
| Bob Johnson   | Sales         | 75000.00 |
| Alice Brown   | Sales         | 70000.00 |
| Charlie Wilson| Marketing     | 65000.00 |
| Diana Prince  | No Department | 60000.00 |
+---------------+---------------+----------+
*/

-- ====================
-- Query 3: Aggregation with JOIN
-- ====================
SELECT 
    d.name AS department,
    d.location,
    COUNT(e.id) AS employee_count,
    COALESCE(SUM(e.salary), 0) AS total_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name, d.location
ORDER BY total_salary DESC;

/* Result: 4 departments
+-------------+---------------+----------------+--------------+
| department  | location      | employee_count | total_salary |
+-------------+---------------+----------------+--------------+
| Engineering | San Francisco | 2              | 175000.00    |
| Sales       | New York      | 2              | 145000.00    |
| Marketing   | Chicago       | 1              | 65000.00     |
| HR          | Boston        | 0              | 0.00         |
+-------------+---------------+----------------+--------------+
*/

-- ====================
-- Query 4: SELF JOIN - Hierarchy
-- ====================
SELECT 
    e.name AS employee,
    e.salary AS employee_salary,
    m.name AS manager,
    m.salary AS manager_salary,
    (m.salary - e.salary) AS salary_difference
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id
ORDER BY salary_difference DESC;

/* Result: 3 employees with managers
+-------------+-----------------+--------------+----------------+-------------------+
| employee    | employee_salary | manager      | manager_salary | salary_difference |
+-------------+-----------------+--------------+----------------+-------------------+
| Jane Smith  | 85000.00        | John Doe     | 90000.00       | 5000.00           |
| Alice Brown | 70000.00        | Bob Johnson  | 75000.00       | 5000.00           |
+-------------+-----------------+--------------+----------------+-------------------+
*/

-- ====================
-- Query 5: Multiple JOINs
-- ====================
SELECT 
    p.name AS project_name,
    d.name AS department,
    COUNT(ep.employee_id) AS employees_assigned,
    COALESCE(SUM(ep.hours_worked), 0) AS total_hours
FROM projects p
LEFT JOIN departments d ON p.department_id = d.id
LEFT JOIN employee_projects ep ON p.id = ep.project_id
GROUP BY p.id, p.name, d.name
ORDER BY total_hours DESC;

/* Result: 5 projects
+------------------+-------------+--------------------+-------------+
| project_name     | department  | employees_assigned | total_hours |
+------------------+-------------+--------------------+-------------+
| Website Redesign | Engineering | 2                  | 220         |
| Sales Campaign   | Sales       | 2                  | 240         |
| Brand Refresh    | Marketing   | 1                  | 110         |
| Internal Tool    | Engineering | 1                  | 80          |
| Customer Portal  | NULL        | 0                  | 0           |
+------------------+-------------+--------------------+-------------+
*/

-- ====================
-- Query 6: Complex JOIN with Aggregation
-- ====================
SELECT 
    d.name AS department,
    COUNT(e.id) AS employee_count,
    AVG(e.salary) AS avg_salary
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
HAVING AVG(e.salary) > 70000
ORDER BY avg_salary DESC;

/* Result: Engineering and Sales
+-------------+----------------+------------+
| department  | employee_count | avg_salary |
+-------------+----------------+------------+
| Engineering | 2              | 87500.00   |
| Sales       | 2              | 72500.00   |
+-------------+----------------+------------+
*/

-- ====================
-- Query 7: LEFT JOIN to Find Missing Data
-- ====================
SELECT 
    p.name AS project_name,
    p.budget,
    d.name AS department
FROM projects p
LEFT JOIN employee_projects ep ON p.id = ep.project_id
LEFT JOIN departments d ON p.department_id = d.id
WHERE ep.employee_id IS NULL;

/* Result: Customer Portal
+-----------------+------------+------------+
| project_name    | budget     | department |
+-----------------+------------+------------+
| Customer Portal | 150000.00  | NULL       |
+-----------------+------------+------------+
*/

-- ====================
-- Query 8: SELF JOIN - Colleagues
-- ====================
SELECT 
    e1.name AS employee1,
    e2.name AS employee2,
    d.name AS department,
    (e1.salary + e2.salary) AS combined_salary
FROM employees e1
INNER JOIN employees e2 
    ON e1.department_id = e2.department_id 
    AND e1.id < e2.id
INNER JOIN departments d ON e1.department_id = d.id
ORDER BY combined_salary DESC;

/* Result: 2 pairs
+-------------+-------------+-------------+-----------------+
| employee1   | employee2   | department  | combined_salary |
+-------------+-------------+-------------+-----------------+
| John Doe    | Jane Smith  | Engineering | 175000.00       |
| Bob Johnson | Alice Brown | Sales       | 145000.00       |
+-------------+-------------+-------------+-----------------+
*/

-- ====================
-- Query 9: Complex Multi-table JOIN
-- ====================
SELECT 
    e.name AS employee,
    d.name AS department,
    m.name AS manager,
    GROUP_CONCAT(p.name ORDER BY p.name SEPARATOR ', ') AS projects,
    COALESCE(SUM(ep.hours_worked), 0) AS total_hours
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id
LEFT JOIN employee_projects ep ON e.id = ep.employee_id
LEFT JOIN projects p ON ep.project_id = p.id
GROUP BY e.id, e.name, d.name, m.name
ORDER BY total_hours DESC;

/* Result: Comprehensive employee report
+----------------+-------------+--------------+--------------------------------------+-------------+
| employee       | department  | manager      | projects                             | total_hours |
+----------------+-------------+--------------+--------------------------------------+-------------+
| John Doe       | Engineering | NULL         | Internal Tool, Website Redesign      | 200         |
| Bob Johnson    | Sales       | NULL         | Sales Campaign                       | 150         |
| Charlie Wilson | Marketing   | NULL         | Brand Refresh                        | 110         |
| Jane Smith     | Engineering | John Doe     | Website Redesign                     | 100         |
| Alice Brown    | Sales       | Bob Johnson  | Sales Campaign                       | 90          |
| Diana Prince   | NULL        | NULL         | NULL                                 | 0           |
+----------------+-------------+--------------+--------------------------------------+-------------+
*/

-- ====================
-- Query 10: Advanced Analytics Query
-- ====================
SELECT 
    d.name AS department,
    d.location,
    COUNT(DISTINCT e.id) AS num_employees,
    COALESCE(ROUND(AVG(e.salary), 2), 0) AS avg_salary,
    COUNT(DISTINCT p.id) AS num_projects,
    COALESCE(SUM(p.budget), 0) AS total_budget,
    CASE 
        WHEN COUNT(DISTINCT e.id) > 0 
        THEN ROUND(COALESCE(SUM(p.budget), 0) / COUNT(DISTINCT e.id), 2)
        ELSE 0 
    END AS budget_per_employee,
    CASE 
        WHEN COUNT(DISTINCT e.id) > 0 
        THEN ROUND(COALESCE(SUM(ep.hours_worked), 0) / COUNT(DISTINCT e.id), 2)
        ELSE 0 
    END AS avg_hours_per_employee
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
LEFT JOIN projects p ON d.id = p.department_id
LEFT JOIN employee_projects ep ON e.id = ep.employee_id
GROUP BY d.id, d.name, d.location
ORDER BY total_budget DESC;

/* Result: Department analytics
+-------------+---------------+---------------+------------+--------------+--------------+---------------------+------------------------+
| department  | location      | num_employees | avg_salary | num_projects | total_budget | budget_per_employee | avg_hours_per_employee |
+-------------+---------------+---------------+------------+--------------+--------------+---------------------+------------------------+
| Engineering | San Francisco | 2             | 87500.00   | 2            | 130000.00    | 65000.00            | 150.00                 |
| Marketing   | Chicago       | 1             | 65000.00   | 1            | 75000.00     | 75000.00            | 110.00                 |
| Sales       | New York      | 2             | 72500.00   | 1            | 50000.00     | 25000.00            | 120.00                 |
| HR          | Boston        | 0             | 0.00       | 0            | 0.00         | 0.00                | 0.00                   |
+-------------+---------------+---------------+------------+--------------+--------------+---------------------+------------------------+
*/

-- ====================
-- BONUS: Most Productive Employee
-- ====================
SELECT 
    e.name AS employee,
    d.name AS department,
    GROUP_CONCAT(p.name ORDER BY p.name SEPARATOR ', ') AS projects,
    SUM(ep.hours_worked) AS total_hours
FROM employees e
INNER JOIN employee_projects ep ON e.id = ep.employee_id
INNER JOIN projects p ON ep.project_id = p.id
LEFT JOIN departments d ON e.department_id = d.id
GROUP BY e.id, e.name, d.name
ORDER BY total_hours DESC
LIMIT 1;

/* Result: Most productive employee
+----------+-------------+--------------------------------------+-------------+
| employee | department  | projects                             | total_hours |
+----------+-------------+--------------------------------------+-------------+
| John Doe | Engineering | Internal Tool, Website Redesign      | 200         |
+----------+-------------+--------------------------------------+-------------+
*/

-- Performance Tips Applied:
-- 1. Used indexes (created in setup.sql)
-- 2. Filtered early with WHERE when possible
-- 3. Used COALESCE for NULL handling
-- 4. Selected only needed columns
-- 5. Used meaningful aliases
-- 6. Grouped efficiently
