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
import com.example.server.models.CreatePracticeDTO;
import com.example.server.service.PracticeService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/practices")
public class PracticeController {

    @Autowired
    private PracticeService practiceService;
    
    @Operation(summary = "Create practice")
    @PostMapping(path = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createAssignment(
            @RequestPart("practice") CreatePracticeDTO practiceDTO,
            @RequestPart("video") MultipartFile video) {

        return ResponseEntity.ok(practiceService.createPractice(practiceDTO, video));
        
    }

    // Get practice logs by student ID
    @Operation(summary = "Get practice logs by student ID")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getPracticeByStudentId(@PathVariable String studentId) {
        List<Practice> practices = practiceService.findPracticeByStudentId(studentId);
        return ResponseEntity.ok(practices);
    }
    
    // Get practice logs by teacher ID
    @Operation(summary = "Get practice logs by teacher ID")
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getPracticeByTeacherId(@PathVariable String teacherId) {
        List<Practice> practices = practiceService.findPracticeByTeacherId(teacherId);
        return ResponseEntity.ok(practices);
    }

}
