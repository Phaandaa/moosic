package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.service.PointsLogService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/points-logs")
public class PointsLogController {
    
    @Autowired
    private PointsLogService pointsLogService;

    @Operation(summary = "Get points log by student ID")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getPointsLogByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(pointsLogService.getPointsLogByStudent(studentId));
    }
}
