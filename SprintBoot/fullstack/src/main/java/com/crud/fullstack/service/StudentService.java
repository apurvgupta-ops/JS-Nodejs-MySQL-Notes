package com.crud.fullstack.service;

import com.crud.fullstack.entity.Student;
import com.crud.fullstack.repository.StudentRepository;

public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public void createStudent(Student student) {
        // Logic to create the student in the database or perform other operations
        // For example, you might use a repository to save the student entity

        studentRepository.save(student);
    }
}
