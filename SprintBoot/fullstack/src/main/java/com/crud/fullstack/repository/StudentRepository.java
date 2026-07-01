package com.crud.fullstack.repository;

import com.crud.fullstack.entity.Student;

public class StudentRepository {

    public void save(Student student) {
        // Logic to save the student to a database or perform other operations
        // For example, you might use an ORM framework to persist the student entity

        System.out.println("Saving student: " + student);
    }
}
