# Day 8: Practice - 10 SQL Join Queries

## Setup Database

Run the setup script first:
```bash
mysql -u root -p < setup.sql
```

---

## Query 1: Basic INNER JOIN
**Task:** List all employees with their department names and locations.

**Expected columns:** employee_name, department, location, salary

```sql
-- Write your query here



-- Expected result: 5 rows (employees with departments)
```

---

## Query 2: LEFT JOIN with NULL check
**Task:** Find all employees and show "No Department" for those without a department assignment.

```sql
-- Write your query here



-- Expected result: 6 rows (including Diana with "No Department")
```

---

## Query 3: Aggregation with JOIN
**Task:** Calculate total salary expense per department. Include departments with 0 employees showing 0 expense.

**Expected columns:** department, location, employee_count, total_salary

```sql
-- Write your query here



-- Expected result: 4 departments (HR shows 0)
```

---

## Query 4: SELF JOIN - Hierarchy
**Task:** Show employee-manager pairs with their salary difference.

**Expected columns:** employee, employee_salary, manager, manager_salary, salary_difference

```sql
-- Write your query here



-- Expected result: 3 rows (employees with managers)
```

---

## Query 5: Multiple JOINs
**Task:** List all projects with assigned employees and total hours worked.

**Expected columns:** project_name, department, employees_assigned, total_hours

```sql
-- Write your query here



-- Expected result: 5 projects (Customer Portal shows 0 employees)
```

---

## Query 6: Complex JOIN with Aggregation
**Task:** Find departments where average employee salary is above $70,000.

```sql
-- Write your query here



-- Expected result: Engineering and Sales departments
```

---

## Query 7: LEFT JOIN to Find Missing Data
**Task:** Find all projects that don't have any employees assigned.

**Expected columns:** project_name, budget, department

```sql
-- Write your query here



-- Expected result: Customer Portal
```

---

## Query 8: SELF JOIN - Colleagues
**Task:** Find pairs of employees who work in the same department.

**Expected columns:** employee1, employee2, department, combined_salary

```sql
-- Write your query here



-- Expected result: 3 pairs (Engineering: 2 pairs, Sales: 1 pair)
```

---

## Query 9: Complex Multi-table JOIN
**Task:** Create a comprehensive employee report.

Show: employee name, department, manager, projects (concatenated), total hours worked

```sql
-- Write your query here



-- Expected result: Employee details with aggregated project info
```

---

## Query 10: Advanced Analytics Query
**Task:** Department Performance Report

Calculate for each department:
- Number of employees
- Average salary
- Number of projects
- Total project budget
- Budget per employee
- Average hours worked per employee

Order by total project budget descending.

```sql
-- Write your query here



-- Expected result: Comprehensive department analytics
```

---

## Bonus Challenge

**Task:** Find the most productive employee (most hours worked across all projects) and show their details including department, all projects, and total hours.

```sql
-- Write your query here



```

---

## Solutions

Check your answers in the `/solutions` folder after attempting all queries.

## Tips

1. Start simple, test each join separately
2. Use EXPLAIN to check query performance
3. Add indexes on join columns
4. Use meaningful aliases
5. Format your queries for readability
