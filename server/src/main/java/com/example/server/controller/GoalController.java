package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.models.UpdateGoalDTO;
import com.example.server.service.GoalService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/goals")
public class GoalController {
    
    @Autowired
    private GoalService goalService;

    @Operation(summary = "Get goal by student ID")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getOngoingGoalByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(goalService.getGoalByStudentId(studentId));
    }

    @Operation(summary = "Update goal by student ID")
    @PutMapping("/update-goal/{studentId}")
    public ResponseEntity<?> updateGoalByStudentId(
        @PathVariable String studentId, 
        @RequestBody UpdateGoalDTO updateGoalDTO) {
        return ResponseEntity.ok(goalService.updateGoalByStudentId(studentId, updateGoalDTO));
    }

    @Operation(summary = "Get goals by teacher ID")
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getGoalByTeacherId(@PathVariable String teacherId) {
        return ResponseEntity.ok(goalService.getGoalByTeacherId(teacherId));
    }
}
