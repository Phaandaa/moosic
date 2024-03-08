package com.example.server.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.AssignmentRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.entity.Assignment;
import com.example.server.entity.Student;
import com.example.server.exception.StudentNotFoundException;
import com.example.server.models.CreateAssignmentDTO;
import com.example.server.models.EditAssignmentDTO;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private CloudStorageService cloudStorageService;

    @Autowired
    private StudentRepository studentRepository;

    // TODO: Ask if assignment should be created for each student or no. tbh easier to code
    // if each student has their own assignment entry so teacher can give feedback
    // and student can submit individually without complex code on frontend

    @Transactional
    public List<Assignment> createAssignment(CreateAssignmentDTO createAssignmentDTO, List<MultipartFile> files) {
        try {
            List<String> publicUrls = cloudStorageService.uploadFilesToGCS(files);
            List<HashMap<String, String>> students = createAssignmentDTO.getSelectedStudents();
            String title = createAssignmentDTO.getAssignmentTitle();
            String description = createAssignmentDTO.getAssignmentDesc();
            String teacherId = createAssignmentDTO.getTeacherId();
            String teacherName = createAssignmentDTO.getTeacherName();
            String deadline = createAssignmentDTO.getAssignmentDeadline();
            Integer points = createAssignmentDTO.getPoints();

            List<Assignment> newAssignments = new ArrayList<>();

            for (HashMap<String, String> student : students) {
                String studentId = student.get("student_id");

                // Fetch the student entity from the repository
                Student studentEntity = studentRepository.findById(studentId).orElseThrow(()->
                    new StudentNotFoundException("Student not found with the ID " + studentId));

                // Retrieve student name
                String studentName = studentEntity.getName();

                Assignment newAssignment = new Assignment(title, publicUrls, description, deadline, studentId,
                        studentName, null, teacherId, teacherName, null, points, null, null);
                newAssignments.add(newAssignment);
            }
            return assignmentRepository.saveAll(newAssignments);
        } catch (NoSuchElementException e) { 
            throw e;
        } catch (RuntimeException e) {
            if (e.getMessage() != null || e.getMessage() != "") {
                e = new RuntimeException("Failed to create assignments: " + e.getMessage());
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create assignments: " + e.getMessage());
        }
        
    }
    
    public List<Assignment> findAssignmentByStudentId(String studentId) {
        try {
            List<Assignment> assignments = assignmentRepository.findByStudentId(studentId);
            if (assignments.isEmpty() || assignments == null) {
                throw new NoSuchElementException("No assignments found for student ID " + studentId);
            }
            return assignments;            
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding assignment by student ID " + studentId + ": " + e.getMessage());
        }
    }

    public List<Assignment> findAssignmentByTeacherId(String teacherId) {
        try {
            List<Assignment> assignments = assignmentRepository.findByTeacherId(teacherId);
            if (assignments.isEmpty() || assignments == null) {
                throw new NoSuchElementException("No assignments found for teacher ID " + teacherId);
            }
            return assignments;            
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding assignment by teacher ID " + teacherId + ": " + e.getMessage());
        }
    }

    public List<Assignment> findAssignmentByStudentIdAndTeacherId(String studentId, String teacherId) {
        try {
            List<Assignment> assignments = assignmentRepository.findByStudentIdAndTeacherId(studentId, teacherId);
            if (assignments.isEmpty() || assignments == null) {
                throw new NoSuchElementException("No assignments found for student ID " + studentId + " and teacher ID " + teacherId);
            }
            return assignments;            
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding assignment by student ID " + studentId + " and teacher ID " + teacherId + ": " + e.getMessage());
        }
    }

    public Assignment updateStudentCommentAndSubmissionLinks(String assignmentId, List<MultipartFile> files, String studentComment) {
        try {
            Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(()->
                new NoSuchElementException("No assignment found with the ID " + assignmentId));

            if (files != null && !files.isEmpty()) {
                List<String> publicUrls = cloudStorageService.uploadFilesToGCS(files);
                assignment.setSubmissionLinks(publicUrls);
            } else {
                throw new IllegalArgumentException("Please updload files to submit assignment");
            }

            if (studentComment != null) {
                assignment.setStudentComment(studentComment);
            }

            Date timestamp = new Date();
            assignment.setSubmissionTimestamp(timestamp);

            return assignmentRepository.save(assignment);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating student comment and submission links for assignment ID " + assignmentId + ": " + e.getMessage());
        }
    }

    public Assignment updateAssignmentStudentPointsAndComments(String assignmentId, List<MultipartFile> feedbackDocuments, int points, String teacherFeedback){
        try {
            Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(()->
                new NoSuchElementException("No assignment found with the ID " + assignmentId));

            if (points <= 0) {
                throw new IllegalArgumentException("Points should be greater than zero");
            }

            assignment.setPoints(points);
            studentRepository.findById(assignment.getStudentId()).ifPresent(student -> {
                student.addPoints(points);
                studentRepository.save(student);
            });

            if (teacherFeedback != null && !teacherFeedback.isEmpty()) {
                assignment.setTeacherFeedback(teacherFeedback);
            }

            // Update feedback document links
            if (feedbackDocuments != null && !feedbackDocuments.isEmpty()) {
                List<String> feedbackDocumentLinks = cloudStorageService.uploadFilesToGCS(feedbackDocuments);
                assignment.setFeedbackDocumentLinks(feedbackDocumentLinks);
            }

            Date timestamp = new Date();
            assignment.setFeedbackTimestamp(timestamp);
    
            return assignmentRepository.save(assignment);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating student points and teacher feedback for assignment ID " + assignmentId + ": " + e.getMessage());
        }
    }

    @Transactional
    public Assignment updateAssignmentListing (String assignmentId, EditAssignmentDTO EditAssignmentDTO, List<MultipartFile> files) {
        try {

            Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(()->
                new NoSuchElementException("No assignment found with the ID " + assignmentId));

            System.out.println(EditAssignmentDTO.getAssignmentDesc());
            System.out.println(EditAssignmentDTO.getAssignmentDeadline());
            System.out.println(EditAssignmentDTO.getPoints());

            if (files != null && !files.isEmpty()) {
                List<String> publicUrls = cloudStorageService.uploadFilesToGCS(files);
                assignment.setFeedbackDocumentLinks(publicUrls);
            }

            if (EditAssignmentDTO.getAssignmentDesc() != null) {
                assignment.setDescription(EditAssignmentDTO.getAssignmentDesc());
            }

            if (EditAssignmentDTO.getAssignmentDeadline() != null) {
                assignment.setDeadline(EditAssignmentDTO.getAssignmentDeadline());
            }

            if (EditAssignmentDTO.getPoints() != null) {
                assignment.setPoints(EditAssignmentDTO.getPoints());
            }

            return assignmentRepository.save(assignment);

        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating assignment listing for assignment ID " + assignmentId + ": " + e.getMessage());
        }
    }

    // Detele assignemnt by ID
    public void deleteAssignment(String assignmentId) {
    try {
        assignmentRepository.deleteById(assignmentId);
    } catch (EmptyResultDataAccessException e) {
        throw new RuntimeException("Assignment with ID " + assignmentId + " does not exist.");
    } catch (DataAccessException e) {
        throw new RuntimeException("Error deleting assignment with ID " + assignmentId + ": " + e.getMessage());
    }
}
}
