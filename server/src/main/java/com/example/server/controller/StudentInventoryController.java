package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.server.models.CreateInventoryDTO;
import com.example.server.service.StudentInventoryService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/student-inventory")
public class StudentInventoryController {
    
    @Autowired
    private StudentInventoryService studentInventoryService;

    @Operation(summary = "Create student inventory")
    @PostMapping("/create")
    public ResponseEntity<?> createStudentInventory(@RequestBody CreateInventoryDTO createInventoryDTO) {
        return ResponseEntity.ok(studentInventoryService.createStudentInventory(createInventoryDTO));
    }

    @Operation(summary = "Get student inventory by student id")
    @GetMapping("/{studentId}")
    public ResponseEntity<?> getStudentInventoryByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentInventoryService.getStudentInventoryByStudentId(studentId));
    }

    @Operation(summary = "Get owned avatar list by student id")
    @GetMapping("/{studentId}/avatars")
    public ResponseEntity<?> getOwnedAvatarsByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentInventoryService.getOwnedAvatarList(studentId));
    }

    @Operation(summary = "Get owned badge list by student id")
    @GetMapping("/{studentId}/badges")
    public ResponseEntity<?> getOwnedBadgesByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentInventoryService.getOwnedBadgeList(studentId));
    }

    @Operation(summary = "Add avatar to student inventory")
    @PostMapping("/{studentId}/add-avatar")
    public ResponseEntity<?> addAvatar(@PathVariable String studentId, @RequestBody String avatarUrl) {
        return ResponseEntity.ok(studentInventoryService.addAvatar(studentId, avatarUrl));
    }

    @Operation(summary = "Add badge to student inventory")
    @PostMapping("/{studentId}/add-badge")
    public ResponseEntity<?> addBadge(@PathVariable String studentId, @RequestBody String badgeUrl) {
        return ResponseEntity.ok(studentInventoryService.addBadge(studentId, badgeUrl));
    }

    @Operation(summary = "Delete student inventory by student id")
    @DeleteMapping("/{studentId}")
    public ResponseEntity<?> deleteStudentInventoryByStudentId(@PathVariable String studentId) {
        studentInventoryService.deleteStudentInventory(studentId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete avatar from student inventory")
    @DeleteMapping("/{studentId}/delete-avatar")
    public ResponseEntity<?> deleteAvatar(@PathVariable String studentId, @RequestBody String avatarUrl) {
        return ResponseEntity.ok(studentInventoryService.deleteAvatar(studentId, avatarUrl));
    }

    @Operation(summary = "Delete badge from student inventory")
    @DeleteMapping("/{studentId}/delete-badge")
    public ResponseEntity<?> deleteBadge(@PathVariable String studentId, @RequestBody String badgeUrl) {
        return ResponseEntity.ok(studentInventoryService.deleteBadge(studentId, badgeUrl));
    }
}
