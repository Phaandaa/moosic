package com.example.server.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.AssignmentRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.entity.Assignment;
import com.example.server.exception.StudentNotFoundException;
import com.example.server.models.CreateAssignmentDTO;

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
                studentRepository.findById(studentId).orElseThrow(()->
                    new StudentNotFoundException("Student not found with the ID " + studentId));
                String studentName = student.get("student_name");
                Assignment newAssignment = new Assignment(title, publicUrls, description, deadline, studentId,
                        studentName,
                        null, teacherId, teacherName, null, points, null);
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
}
