package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.service.NotificationService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/notifications")
public class NotificationTestController {

    @Autowired
    private NotificationService notificationService;
    
    @Operation(summary = "Test notification message")
    @GetMapping("/test")
    public ResponseEntity<?> testSendMessage(
        @RequestParam String expoPushToken,
        @RequestParam String title,
        @RequestParam String body,
        @RequestParam String message) {
        return ResponseEntity.ok(notificationService.testPublishMessage(expoPushToken, title, body, message));
    }
}
