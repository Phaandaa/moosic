package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    // Get practice logs by student ID and teacher ID
    @Operation(summary = "Get practice logs by student ID and teacher ID")
    @GetMapping("/{studentId}/{teacherId}")
    public ResponseEntity<?> getPracticeByStudentIdAndTeacherId(@PathVariable String studentId, @PathVariable String teacherId) {
        List<Practice> practices = practiceService.findPracticeByStudentIdAndTeacherId(studentId, teacherId);
        return ResponseEntity.ok(practices);
    }

    // Teacher update practice (comments and points)
    @Operation(summary = "Feedback practice by teacher")
    @PutMapping(path = "/feedback/{practiceId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> feedbackPractice(@PathVariable String practiceId, 
        @RequestParam(value = "teacherFeedback") String teacherFeedback, 
        @RequestParam(value = "points") Integer points,
        @RequestPart(value="video", required = false) MultipartFile video) {
        
        Practice updatedPractice = practiceService.updatePractice(practiceId, teacherFeedback, points, video);
        return ResponseEntity.ok(updatedPractice);
        
    }

    // Delete practice by practice ID
    @Operation(summary = "Delete practice by practice ID")
    @DeleteMapping("/{practiceId}")
    public ResponseEntity<?> deletePractice(@PathVariable String practiceId) {
        
        practiceService.deletePractice(practiceId);
        return ResponseEntity.ok("Practice deleted successfully");
        
    }

}
