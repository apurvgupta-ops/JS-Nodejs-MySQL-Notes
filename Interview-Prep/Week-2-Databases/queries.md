CREATE TABLE employee (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(50),
  phno BIGINT,
  salary INTEGER
);

CREATE TABLE department (
id INTEGER PRIMARY KEY,
department VARCHAR(100),
emp_id INTEGER
);

INSERT INTO employee (id, name, email, phno, salary) VALUES
(1, 'Abc', 'a@gmail.com', 9876544321,100),
(2, 'bac', 'b@gmail.com', 9876544321,200),
(3, 'cba', 'c@gmail.com', 9876544321,300),
(4, 'dcb', 'd@gmail.com', 9876544321,400),
(5, 'dcb', 'd@gmail.com', 9876544321,500);

INSERT INTO department (id, department, emp_id) VALUES
(1,"software", 2),
(2,"full stack", 1),
(3,"python", 4),
(4,"nodejs", 3),
(5,"reactjs", 2),
(6,"mern", 1);

-- alter TABLE employee
-- ADD column salary INTEGER ;

select * from employee;
-- select name, salary from employee;
-- select * from employee where salary > 200;

select * from department;
-- select * from employee where id = 3; 
-- select count(*) as total_employee from employee;
-- select max(salary) as highest_salary from employee;
-- select min(salary) as lowest_salary from employee;
-- select avg(salary) as average_salary from employee;
-- select sum(salary) as total_salary from employee;
-- select distinct department from department;

-- select * from employee order by (salary) desc;

-- select * from employee where name like "A%";
-- select * from employee where name like "%A";

-- select * from employee where salary between 150 AND 300;

-- select emp_id , count(*) as dept_count from department group by emp_id;

-- select e.*, d.* from employee as e
-- join department as d on d.emp_id = e.id;

-- select e.*, d.* from employee as e
-- left join department as d on d.emp_id = e.id;

-- select e.* from employee as e
-- left join department as d on d.emp_id = e.id
-- where d.department = "software";

-- select e.* from employee as e
-- left join department as d on d.emp_id = e.id
-- where d.emp_id is null;

-- select e.name, count(d.id) as dept_count from employee as e 
-- left join department as d on d.emp_id = e.id 
-- group by  e.id, e.name
-- having dept_count > 1;

-- select e.name , group_concat(d.department SEPARATOR ", ") as department from employee as e
-- left join department as d on e.id = d.emp_id
-- group by e.id, e.name;
 

-- SUB QUERIES
-- select * from employee where salary > (select avg(salary) from employee);

-- select name , salary, RANK() over (order by salary desc) AS salary_rank from employee 

-- select max(salary) as second_salary from employee
-- where salary < (select Max(salary) from employee);

-- select d.department , sum(e.salary) as total_salary from department as d
-- left join employee as e on d.emp_id = e.id
-- group by d.department;

-- update employee 
-- set salary = salary * 1.1 
-- where id in 
-- (select emp_id from department where department = "nodejs");

-- select * from employee
 
 
-- select department, avg(e.salary) as average_salary from department as d
-- left join employee as e on e.id = d.emp_id
-- group by d.department
-- having average_salary > 250

select name, salary,
        case
            when salary > 300 then "HIGH"
            when salary > 200 then "MEDIUM"
            else "LOW"
        end as salary_categories
from employee  

 