-- Day 8: SQL Joins - Database Setup Script
-- Run this script to create the practice database

CREATE DATABASE IF NOT EXISTS company_db;
USE company_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS employee_projects;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

-- Employees table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    salary DECIMAL(10,2),
    manager_id INT,
    hire_date DATE,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- Projects table
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    budget DECIMAL(12,2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Employee_Projects junction table
CREATE TABLE employee_projects (
    employee_id INT,
    project_id INT,
    hours_worked INT,
    role VARCHAR(50),
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
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
('Diana Prince', NULL, 60000, NULL, '2022-01-10');

INSERT INTO projects (name, budget, department_id) VALUES
('Website Redesign', 100000, 1),
('Sales Campaign', 50000, 2),
('Brand Refresh', 75000, 3),
('Internal Tool', 30000, 1),
('Customer Portal', 150000, NULL);

INSERT INTO employee_projects (employee_id, project_id, hours_worked, role) VALUES
(1, 1, 120, 'Lead Developer'),
(1, 4, 80, 'Tech Lead'),
(2, 1, 100, 'Frontend Developer'),
(3, 2, 150, 'Sales Manager'),
(4, 2, 90, 'Sales Representative'),
(5, 3, 110, 'Marketing Manager');

-- Add indexes for better join performance
CREATE INDEX idx_employees_dept ON employees(department_id);
CREATE INDEX idx_employees_mgr ON employees(manager_id);
CREATE INDEX idx_projects_dept ON projects(department_id);
CREATE INDEX idx_emp_proj_emp ON employee_projects(employee_id);
CREATE INDEX idx_emp_proj_proj ON employee_projects(project_id);

-- Verification queries
SELECT 'Departments:' AS '';
SELECT * FROM departments;

SELECT 'Employees:' AS '';
SELECT * FROM employees;

SELECT 'Projects:' AS '';
SELECT * FROM projects;

SELECT 'Employee-Project Assignments:' AS '';
SELECT * FROM employee_projects;

SELECT 'Setup complete! Database ready for practice queries.' AS '';
