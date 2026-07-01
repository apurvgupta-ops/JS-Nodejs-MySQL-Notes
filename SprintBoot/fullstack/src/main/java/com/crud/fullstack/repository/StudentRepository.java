package com.crud.fullstack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crud.fullstack.entity.Student;

// @Component
// @Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // public Student save(Student student) {
    // // Logic to save the student to a database or perform other operations
    // // For example, you might use an ORM framework to persist the student entity
    // System.out.println("Saving student: " + student);
    // return student;
    // }
}
