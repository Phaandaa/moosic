package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.models.CreateGoalDTO;
import com.example.server.service.GoalService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/goals")
public class GoalController {
    
    @Autowired
    private GoalService goalService;

    @Operation(summary = "Create goal")
    @PostMapping("/create")
    public ResponseEntity<?> createGoal(@RequestBody CreateGoalDTO goalDTO) {
        return ResponseEntity.ok(goalService.createGoal(goalDTO));
    } 
}
