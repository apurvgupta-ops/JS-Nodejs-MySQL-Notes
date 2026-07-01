package com.crud.fullstack.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crud.fullstack.entity.Student;
import com.crud.fullstack.service.StudentService;

@RestController("/api/v1/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/create")
    public void createStudent(Student student) {
        // Logic to create a student
        // For example, you might save the student to a database
        studentService.createStudent(student);
    }

}
