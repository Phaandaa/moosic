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

import com.example.server.entity.Student;
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
        Student student = studentService.getStudentById(studentId);
        return ResponseEntity.ok(student);
    }

    @Operation(summary = "Update student's grade")
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
        List<Student> students = studentService.findStudentsByTeacherId(teacherId);
        return ResponseEntity.ok(students);
    }

    // Change student's teacher - priority 2
    @Operation(summary = "Update student's teacher")
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

     // Change student's tuition day
     @Operation(summary = "Update student's tuition day")
     @PutMapping("/{studentId}/update-tuition-day")
     public ResponseEntity<String> updateStudentTiotionDay(
             @PathVariable String studentId,
             @RequestParam String tuitionDay) {
         try {
             studentService.updateStudentTuitionDay(studentId, tuitionDay);
             return new ResponseEntity<>("Student's tuition day updated successfully.", HttpStatus.OK);
         } catch (NoSuchElementException e) {
             return new ResponseEntity<>("Failed to update student's teacher: "+e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
         }
     }

    @Operation(summary = "Update student's avatar")
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

    @Operation(summary = "Update student's avatar frame")
    @PutMapping("/{studentId}/update-avatar-frame")
    public ResponseEntity<String> updateStudentAvatarFrame(
            @PathVariable String studentId,
            @RequestParam String avatarFrame) {

        try {
            studentService.updateStudentAvatarFrame(studentId, avatarFrame);
            return new ResponseEntity<>("Student's avatar frame updated successfully.", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Failed to update student's avatar frame: "+e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Update student's information (grade, teacher, avatar)")
    @PutMapping("/{studentId}/update-info")
    public ResponseEntity<String> updateStudentInfo(
            @PathVariable String studentId,
            @RequestParam String grade,
            @RequestParam String teacherId,
            @RequestParam String avatar) {

        try {
            studentService.updateStudentGrade(studentId, grade);
            studentService.updateStudentAvatar(studentId, avatar);
            studentService.updateStudentTeacher(studentId, teacherId);
            return new ResponseEntity<>("Student's information updated successfully.", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Failed to update student's information: "+e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
