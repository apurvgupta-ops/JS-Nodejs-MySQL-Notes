package com.crud.fullstack.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crud.fullstack.entity.Student;
import com.crud.fullstack.service.StudentService;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/create")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        System.out.println("Received student: " + student);
        // For example, you might save the student to a database
        Student createdStudent = studentService.createStudent(student);
        System.out.println("Created student: " + createdStudent);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent);
    }

}
