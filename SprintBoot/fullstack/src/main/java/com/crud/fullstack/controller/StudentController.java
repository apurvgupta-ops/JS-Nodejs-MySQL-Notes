package com.crud.fullstack.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/v1/students")
public class StudentController {

    @PostMapping("/create")
    public void createStudent() {
        // Logic to create a student
    }

}
