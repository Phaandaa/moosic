package com.example.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.Assignment;

public interface AssignmentRepository extends MongoRepository<Assignment, String>{

    @Query(value = "{ 'teacherId' : ?0 }", sort = "{ 'creation_time' : -1 }")
    List<Assignment> findByTeacherId(String teacherId);

    @Query(value = "{ 'studentId' : ?0 }", sort = "{ 'creation_time' : -1 }")
    List<Assignment> findByStudentId(String studentId);

    @Query(value = "{ 'studentId' : ?0, 'teacherId' : ?1 }", sort = "{ 'creation_time' : -1 }")
    List<Assignment> findByStudentIdAndTeacherId(String studentId, String teacherId);

    @Query(value = "{ 'assignmentId' : ?0 }", sort = "{ 'creation_time' : -1 }")
    List<Assignment> findByAssignmentId(String assignmentId);

    @Query(value = "{ 'submissionLinks' : { $exists: true, $ne: null } }", sort = "{ 'creation_time' : -1 }")
    List<Assignment> findBySubmissionLinksIsNotNull();
}
