package com.example.server.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.entity.Practice;
import com.example.server.entity.Student;
import com.example.server.exception.ErrorResponse;
import com.example.server.service.StudentService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentService studentService;


    @Operation(summary = "Get all students in the database")
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @Operation(summary = "Get a student by student id")
    @GetMapping("/{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable String studentId) {
        try {
            Student student = studentService.getStudentById(studentId);
            return ResponseEntity.ok(student);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get a student by student id")
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

    @Operation(summary = "Get students by teacher id")
    @GetMapping("teacher/{teacherId}/")
    public ResponseEntity<?> getStudentsByTeacherId(@PathVariable String teacherId) {
        try {
            List<Student> students = studentService.findStudentsByTeacherId(teacherId);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all practice logs by teacher id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Change student's teacher - priority 2
    @PutMapping("/{studentId}/update-teacher")
    public ResponseEntity<String> updateStudentTeacher(
            @PathVariable String studentId,
            @RequestParam String teacherId) {

        try {
            studentService.updateStudentTeacher(studentId, teacherId);
            return new ResponseEntity<>("Student's teacher updated successfully.", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Failed to update student's teacher: "+e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update student avatar 
    @PutMapping("/{studentId}/update-avatar")
    public ResponseEntity<String> updateStudentAvatar(
            @PathVariable String studentId,
            @RequestParam String avatar) {

        try {
            studentService.updateStudentAvatar(studentId, avatar);
            return new ResponseEntity<>("Student's avatar updated successfully.", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Failed to update student's avatar: "+e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
