package com.example.server.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.AssignmentRepository;
import com.example.server.entity.Assignment;
import com.example.server.models.CreateAssignmentDTO;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    public Assignment createAssignment(CreateAssignmentDTO AssignmentDTO) {
        if (AssignmentDTO == null) {
            throw new IllegalArgumentException("AssignmentDTO cannot be null");
        }

        String title = AssignmentDTO.getStudentName();
        String description = AssignmentDTO.getDescription();
        Date deadline = AssignmentDTO.getDeadline();
        String studentName = AssignmentDTO.getStudentName();
        String teacherName = AssignmentDTO.getTeacherName();
        String teacherId = AssignmentDTO.getTeacherId();
        String studentId = AssignmentDTO.getStudentId();
        String submission = AssignmentDTO.getSubmission();
        String teacherFeedback = AssignmentDTO.getTeacherFeedback();
        String feedbackDocumentLink = AssignmentDTO.getFeedbackDocumentLink();
        String assignmentDocumentLink = AssignmentDTO.getAssignmentDocumentLink();
        Integer points = AssignmentDTO.getPoints();

        Assignment newAssignment = new Assignment(title, assignmentDocumentLink, description, deadline, studentId,
            studentName, submission, teacherId, teacherName, teacherFeedback,
            points,feedbackDocumentLink);

    return assignmentRepository.save(newAssignment);

    }

}
