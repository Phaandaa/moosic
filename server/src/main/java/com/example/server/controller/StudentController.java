package com.example.server.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.entity.Student;
import com.example.server.service.StudentService;

@RestController
@CrossOrigin
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentService studentService;

    // Create student - already in user controller

    // Get all student
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // Get specific student using student id

    // Change student's grade
    @PutMapping("/{studentId}/update-grade")
    public ResponseEntity<String> updateStudentGrade(
            @PathVariable String studentId,
            @RequestParam String grade) {

        try {
            studentService.updateStudentGrade(studentId, grade);
            return ResponseEntity.ok("Student's grade updated successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Change student's teacher - priority 2

    // Delete student by Id
}
