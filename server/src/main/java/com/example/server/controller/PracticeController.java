package com.example.server.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.entity.Practice;
import com.example.server.exception.ErrorResponse;
import com.example.server.models.CreatePracticeDTO;
import com.example.server.service.PracticeService;

@RestController
@CrossOrigin
@RequestMapping("/practices")
public class PracticeController {

    @Autowired
    private PracticeService practiceService;
    
    @PostMapping(path = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createAssignment(
            @RequestPart("practice") CreatePracticeDTO practiceDTO,
            @RequestPart("video") MultipartFile video) {

        try {
            return ResponseEntity.ok(practiceService.createPractice(practiceDTO, video));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred creating practice log. Please try again later.");
        }
    }

    // Get practice logs by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getPracticeByStudentId(@PathVariable String studentId) {
        try {
            List<Practice> practices = practiceService.findPracticeByStudentId(studentId);
            return ResponseEntity.ok(practices);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all practice logs by student id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    // Get practice logs by teacher ID
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getPracticeByTeacherId(@PathVariable String teacherId) {
        try {
            List<Practice> practices = practiceService.findPracticeByTeacherId(teacherId);
            return ResponseEntity.ok(practices);
        } catch (Exception e) {
            ErrorResponse error = new ErrorResponse();
            error.setMessage("Error fetching all practice logs by teacher id");
            error.setDetails(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
