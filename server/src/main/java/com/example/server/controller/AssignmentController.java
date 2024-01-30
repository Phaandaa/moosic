package com.example.server.controller;

import com.example.server.entity.Assignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.server.models.AuthRequest;
import com.example.server.service.AssignmentService;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/assignments")
public class AssignmentController {

    @Autowired
    public AssignmentService assignmentService;

    @PostMapping("/create")
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        Assignment newAssignment = assignmentService.createAssignment(assignment);
        
    }
}
