package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.models.CreateGoalDTO;
import com.example.server.models.GoalItemDTO;
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

    @Operation(summary = "Create Goal Item")
    @PostMapping("/create-goal-item/{goalId}")
    public ResponseEntity<?> createGoalItem(@PathVariable String goalId, @RequestBody GoalItemDTO goalItemDTO) {
        return ResponseEntity.ok(goalService.createGoalItem(goalId, goalItemDTO));
    }

    @Operation(summary = "Remove Goal Item")
    @DeleteMapping("/remove-goal-item/{goalId}/{goalItemKey}")
    public ResponseEntity<?> removeGoalItemByKey(@PathVariable String goalId, @PathVariable String goalItemKey) {
        return ResponseEntity.ok(goalService.deleteGoalItem(goalId, goalItemKey));
    }

    @Operation(summary = "Mark goal item as completed")
    @PutMapping("/change-goal-item-status/{goalId}/{goalItemKey}")
    public ResponseEntity<?> changeGoalItemStatus(@PathVariable String goalId, @PathVariable String goalItemKey) {
        return ResponseEntity.ok(goalService.changeGoalItemStatus(goalId, goalItemKey));
    }

    // Can only be done after all goal item is marked complete
    @Operation(summary = "Mark whole goal as completed")
    @PutMapping("/mark-goal-done/{goalId}")
    public ResponseEntity<?> markGoalAsDone(@PathVariable String goalId) {
        return ResponseEntity.ok(goalService.markGoalAsDone(goalId));
    }

    @Operation(summary = "Get ongoing goal by student ID")
    @GetMapping("/student/ongoing/{studentId}")
    public ResponseEntity<?> getOngoingGoalByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(goalService.getOngoingGoalByStudentId(studentId));
    }

    @Operation(summary = "Get goals by teacher ID")
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getGoalByTeacherId(@PathVariable String teacherId) {
        return ResponseEntity.ok(goalService.getGoalByTeacherId(teacherId));
    }
}
