package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.entity.Student;
import com.example.server.entity.Teacher;
import com.example.server.service.TeacherService;
import com.google.api.Http;

@RestController
@CrossOrigin
@RequestMapping("/teachers")
public class TeacherController {
    
    @Autowired
    private TeacherService teacherService;

    // Get all teachers
    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        List<Teacher> teachers = teacherService.getAllTeachers();
        return new ResponseEntity<>(teachers, HttpStatus.OK);
    }

    // Get specific teacher using teacher id
    @GetMapping("/{teacherId}")
    public ResponseEntity<Teacher> getTeacherById(String teacherId) {
        Teacher teacher = teacherService.getTeacherById(teacherId);
        if (teacher == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(teacher, HttpStatus.OK);
        }
    }

    // add student to teacher
    @PostMapping("/{teacherId}/add-student")
    public ResponseEntity<String> addStudent(String teacherId, String studentId) {
        teacherService.addStudent(teacherId, studentId);
        return new ResponseEntity<>("Student added successfully.", HttpStatus.OK);
    }

    // delete student from teacher
    @PostMapping("/{teacherId}/delete-student")
    public ResponseEntity<String> deleteStudent(String teacherId, String studentId) {
        teacherService.deleteStudent(teacherId, studentId);
        return new ResponseEntity<>("Student deleted successfully.", HttpStatus.OK);
    }
}

