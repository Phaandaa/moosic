package com.example.server.controller;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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


    @Operation(summary = "Get owned avatar list details by student id")
    @GetMapping("/{studentId}/avatar-details")
    public ResponseEntity<?> getOwnedAvatarsDetailsByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentInventoryService.getOwnedAvatarDetails(studentId));
    }

    @Operation(summary = "Get owned badge list details by student id")
    @GetMapping("/{studentId}/badge-details")
    public ResponseEntity<?> getOwnedBadgesByStudentId(@PathVariable String studentId) {
    try {
        return ResponseEntity.ok(studentInventoryService.getOwnedBadgeDetails(studentId));
    } catch (NoSuchElementException e) {
        // Return a response indicating that no badges were found
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    } catch (Exception e) {
        // Handle other exceptions and return a generic error response
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching badge details.");
    }
}


    @Operation(summary = "Get owned frame list details by student id")
    @GetMapping("/{studentId}/frame-details")
    public ResponseEntity<?> getOwnedFrameByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentInventoryService.getOwnedFrameDetails(studentId));
    }

    @Operation(summary = "Add avatar to student inventory")
    @PostMapping("/{studentId}/add-avatar")
    public ResponseEntity<?> addAvatar(@PathVariable String studentId, @RequestBody String avatarId) {
        return ResponseEntity.ok(studentInventoryService.addAvatar(studentId, avatarId));
    }

    @Operation(summary = "Add badge to student inventory")
    @PostMapping("/{studentId}/add-badge")
    public ResponseEntity<?> addBadge(@PathVariable String studentId, @RequestBody String badgeId) {
        return ResponseEntity.ok(studentInventoryService.addBadge(studentId, badgeId));
    }

    @Operation(summary = "Add frame to student inventory")
    @PostMapping("/{studentId}/add-frame")
    public ResponseEntity<?> addFrame(@PathVariable String studentId, @RequestBody String frameId) {
        return ResponseEntity.ok(studentInventoryService.addFrame(studentId, frameId));
    }

    @Operation(summary = "Delete student inventory by student id")
    @DeleteMapping("/{studentId}")
    public ResponseEntity<?> deleteStudentInventoryByStudentId(@PathVariable String studentId) {
        studentInventoryService.deleteStudentInventory(studentId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete avatar from student inventory")
    @DeleteMapping("/{studentId}/delete-avatar")
    public ResponseEntity<?> deleteAvatar(@PathVariable String studentId, @RequestBody String avatarId) {
        return ResponseEntity.ok(studentInventoryService.deleteAvatar(studentId, avatarId));
    }

    @Operation(summary = "Delete badge from student inventory")
    @DeleteMapping("/{studentId}/delete-badge")
    public ResponseEntity<?> deleteBadge(@PathVariable String studentId, @RequestBody String badgeId) {
        return ResponseEntity.ok(studentInventoryService.deleteBadge(studentId, badgeId));
    }

    @Operation(summary = "Delete frame in student inventory")
    @DeleteMapping("/{studentId}/delete-frame")
    public ResponseEntity<?> deleteFrame(@PathVariable String studentId, @RequestBody String frameId) {
        return ResponseEntity.ok(studentInventoryService.deleteFrame(studentId, frameId));
    }
}
