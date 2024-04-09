package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.entity.Assignment;
import com.example.server.models.CreateAssignmentDTO;
import com.example.server.models.EditAssignmentDTO;
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
            @RequestPart(name = "files", required = false) List<MultipartFile> files) {

        return ResponseEntity.ok(assignmentService.createAssignment(assignmentDTO, files));
        
    }
    
    @Operation(summary = "Get assignments by student ID")    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getAssignmentByStudentId(@PathVariable String studentId) {
        List<Assignment> assignments = assignmentService.findAssignmentByStudentId(studentId);
        return ResponseEntity.ok(assignments);
    }

    @Operation(summary = "Get assignments by teacher ID")
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getAssignmentByTeacherId(@PathVariable String teacherId) {
        List<Assignment> assignments = assignmentService.findAssignmentByTeacherId(teacherId);
        return ResponseEntity.ok(assignments);
    }

    @Operation(summary = "Get assignments by student ID and teacher ID")
    @GetMapping("/{studentId}/{teacherId}")
    public ResponseEntity<?> getAssignmentByStudentIdAndTeacherId(@PathVariable String studentId, @PathVariable String teacherId) {
        List<Assignment> assignments = assignmentService.findAssignmentByStudentIdAndTeacherId(studentId, teacherId);
        return ResponseEntity.ok(assignments);
    }

    @Operation(summary = "Update student comment and submission links for an assignment")
    @PutMapping(path = "/student/{assignmentId}/update", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> submitAssignment(@PathVariable String assignmentId, 
            @RequestPart("files") List<MultipartFile> files, 
            @RequestParam(value = "studentComment", required = false) String studentComment){
                
        Assignment updatedAssignment = assignmentService.updateStudentCommentAndSubmissionLinks(assignmentId, files, studentComment);
        return ResponseEntity.ok(updatedAssignment);
    }

    @Operation(summary = "Update teacher feedback, points, feedback links for an assignment")
    @PutMapping(path = "/teacher/{assignmentId}/update", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateAssignment(@PathVariable String assignmentId,
            @RequestParam(value = "points") Integer points, 
            @RequestPart(value = "files", required = false) List<MultipartFile> files, 
            @RequestParam(value = "teacherFeedback") String teacherFeedback){
                
        Assignment updatedAssignment = assignmentService.updateAssignmentStudentPointsAndComments(assignmentId, files, points, teacherFeedback);

        return ResponseEntity.ok(updatedAssignment);
    }

    @Operation(summary = "Update assignment details")
    @PutMapping(path = "/teacher/{assignmentId}/update-details", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateAssignmentDetails(@PathVariable String assignmentId,
                                                    @RequestPart("assignment") EditAssignmentDTO assignmentDTO, 
                                                    @RequestPart(name = "files", required = false) List<MultipartFile> files){
                
        Assignment updatedAssignment = assignmentService.updateAssignmentListing(assignmentId, assignmentDTO, files);

        return ResponseEntity.ok(updatedAssignment);
    }

    @Operation(summary = "Delete assignment by assignment ID")
    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<?> deleteAssignment(@PathVariable String assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
        return ResponseEntity.ok().build();
    }
}
