package com.example.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.server.entity.Assignment;

public interface AssignmentRepository extends MongoRepository<Assignment, String>{

    List<Assignment> findByTeacherId(String teacherId);

    List<Assignment> findByStudentId(String studentId);

    List<Assignment> findByStudentIdAndTeacherId(String studentId, String teacherId);

    List<Assignment> findByAssignmentId(String assignmentId);

    List<Assignment> findBySubmissionLinksIsNotNull();
}
