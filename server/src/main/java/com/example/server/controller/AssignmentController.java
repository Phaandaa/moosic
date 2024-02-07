package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.entity.Assignment;
import com.example.server.models.CreateAssignmentDTO;
import com.example.server.service.AssignmentService;

import io.swagger.v3.oas.annotations.Operation;


@RestController
@CrossOrigin
@RequestMapping("/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;
    
    
    @Operation(summary = "Create assignments")
    @PostMapping(path = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createAssignment(
            @RequestPart("assignment") CreateAssignmentDTO assignmentDTO,
            @RequestPart("files") List<MultipartFile> files) {

        return ResponseEntity.ok(assignmentService.createAssignment(assignmentDTO, files));
        
    }
    
    @Operation(summary = "Get assignments by student ID")    
    @GetMapping("/{studentId}")
    public ResponseEntity<?> getAssignmentByStudentId(@PathVariable String studentId) {
        List<Assignment> assignments = assignmentService.findAssignmentByStudentId(studentId);
        return ResponseEntity.ok(assignments);
    }
}
