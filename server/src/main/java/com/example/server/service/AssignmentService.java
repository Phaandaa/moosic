package com.example.server.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.AssignmentRepository;
import com.example.server.entity.Assignment;
import com.example.server.models.CreateAssignmentDTO;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private CloudStorageService cloudStorageService;

    public List<Assignment> createAssignment(CreateAssignmentDTO createAssignmentDTO, List<MultipartFile> files) throws IOException {
        List<String> publicUrls = cloudStorageService.uploadFileToGCS(files);
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
            String studentName = student.get("student_name");
            Assignment newAssignment = new Assignment(title, publicUrls, description, deadline, studentId, studentName,
                    null, teacherId, teacherName, null, points, null);
            newAssignments.add(newAssignment);
        }
        return assignmentRepository.saveAll(newAssignments);
    }


}
