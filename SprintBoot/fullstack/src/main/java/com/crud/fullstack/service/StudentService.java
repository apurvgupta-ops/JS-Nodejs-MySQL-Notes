package com.crud.fullstack.service;

import java.util.List;
import java.util.Optional;

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
        Student savedStudent = studentRepository.save(student);
        return savedStudent;
    }

    public Student getStudentById(Long id) {
        // return studentRepository.findById(id).orElse(null);
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isPresent()) {
            return optionalStudent.get();
        } else {
            return null; // or throw an exception if the student is not found
        }
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student updateStudent(Long id, Student studentReq) {
        Optional<Student> existingStudent = studentRepository.findById(id);

        if (existingStudent.isEmpty()) {
            return null;
        }

        Student studentToSave = existingStudent.get();

        studentToSave.setName(studentReq.getName());
        studentToSave.setRollNo(studentReq.getRollNo());
        studentToSave.setEmail(studentReq.getEmail());

        return studentRepository.save(studentToSave);
    }

    public Boolean deleteStudent(Long id) {
        Boolean isStudent = studentRepository.existsById(id);

        if (!isStudent) {
            return false;
        }

        studentRepository.deleteById(id);

        return true;
    }

    public Boolean deleteStudentSoftly(Long id) {
        Optional<Student> existingStudent
                = studentRepository.findById(id);

        if (existingStudent.isEmpty()) {
            return false;
        }

        Student studentToSave = existingStudent.get();
        studentToSave.setDeleted(true);
        studentRepository.save(studentToSave);

        return true;
    }
}
