package com.crud.fullstack.service;

import org.springframework.stereotype.Service;

import com.crud.fullstack.entity.Student;
import com.crud.fullstack.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        // Logic to create the student in the database or perform other operations
        // For example, you might use a repository to save the student entity

        Student savedStudent = studentRepository.save(student);
        return savedStudent;
    }
}
