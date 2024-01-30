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

    public Assignment createAssignment(Assignment assignment) {
        if (assignment == null) {
            throw new IllegalArgumentException("AssignmentDTO cannot be null");
        }

        String title = assignment.getStudentName();
        String description = assignment.getDescription();
        Date deadline = assignment.getDeadline();
        String studentName = assignment.getStudentName();
        String teacherName = assignment.getTeacherName();
        String teacherId = assignment.getTeacherId();
        String studentId = assignment.getStudentId();
        String submission = assignment.getSubmission();
        String teacherFeedback = assignment.getTeacherFeedback();
        String feedbackDocumentLink = assignment.getFeedbackDocumentLink();
        String assignmentDocumentLink = assignment.getAssignmentDocumentLink();
        Integer points = assignment.getPoints();

        Assignment newAssignment = new Assignment(title, assignmentDocumentLink, description, deadline, studentId,
            studentName, submission, teacherId, teacherName, teacherFeedback,
            points,feedbackDocumentLink);

    return assignmentRepository.save(newAssignment);

    }

}
