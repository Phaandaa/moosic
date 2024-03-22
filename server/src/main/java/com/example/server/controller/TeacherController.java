package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.server.entity.Teacher;
import com.example.server.service.StudentService;
import com.example.server.service.TeacherService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/teachers")
public class TeacherController {
    
    @Autowired
    private TeacherService teacherService;

    @Autowired
    private StudentService studentService;

    @Operation(summary = "Get all teachers in the database")
    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        List<Teacher> teachers = teacherService.getAllTeachers();
        return new ResponseEntity<>(teachers, HttpStatus.OK);
    }

    @Operation(summary = "Get a teacher by teacher id")
    @GetMapping("/{teacherId}")
    public ResponseEntity<?> getTeacherById(@PathVariable String teacherId) {
        Teacher teacher = teacherService.getTeacherById(teacherId);
        return ResponseEntity.ok(teacher);
    }

    @Operation(summary = "Delete a student from a teacher")
    @PostMapping("/{teacherId}/delete-student")
    public ResponseEntity<String> deleteStudent(String teacherId, String studentId) {
        teacherService.deleteStudent(teacherId, studentId);
        return new ResponseEntity<>("Student deleted successfully.", HttpStatus.OK);
    }

    @Operation(summary = "Update teacher's avatar")
    @PutMapping("/{teacherId}/update-avatar")
    public ResponseEntity<String> updateTeacherAvatar(
            @PathVariable String teacherId,
            @RequestParam String avatar) {

        teacherService.updateTeacherAvatar(teacherId, avatar);
        return new ResponseEntity<>("Teacher's avatar updated successfully.", HttpStatus.OK);
        
    }

    @Operation(summary = "Update teacher's phone")
    @PutMapping("/{teacherId}/update-phone")
    public ResponseEntity<String> updateTeacherPhone(
            @PathVariable String teacherId,
            @RequestParam String phone) {
        
        teacherService.updateTeacherPhone(teacherId, phone);
        return new ResponseEntity<>("Teacher's phone updated successfully.", HttpStatus.OK);
        
    }

    @Operation(summary = "Update teacher information (avatar and phone)")
    @PutMapping("/{teacherId}/update-info")
    public ResponseEntity<String> updateTeacherInfo(
            @PathVariable String teacherId,
            @RequestParam String avatar,
            @RequestParam String phone) {

            teacherService.updateTeacherAvatar(teacherId, avatar);
            teacherService.updateTeacherPhone(teacherId, phone);
            return new ResponseEntity<>("Teacher's information updated successfully.", HttpStatus.OK);

    }

    @Operation(summary = "Delete a teacher by teacher id")
    @DeleteMapping("/{teacherId}")
    public ResponseEntity<String> deleteTeacher(String teacherId) {
        teacherService.deleteTeacher(teacherId);
        studentService.deleteTeacherIdForAllStudent(teacherId);
        return new ResponseEntity<>("Teacher deleted successfully.", HttpStatus.OK);
    }

    @Operation(summary = "Get teacher by student ID")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<Teacher> getTeacherByStudentId(@PathVariable String studentId){
        try {
            Teacher teacher = teacherService.getTeacherByStudentId(studentId);
            return ResponseEntity.ok(teacher);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); 
        }
    }
}   



