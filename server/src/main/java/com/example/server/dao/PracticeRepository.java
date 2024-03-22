package com.example.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.Practice;

public interface PracticeRepository extends MongoRepository<Practice, String> {
    @Query(value = "{ 'studentId' : ?0 }", sort = "{ 'creation_time' : -1 }")
    public List<Practice> findByStudentId(String studentId);
    
    @Query(value = "{ 'teacherId' : ?0 }", sort = "{ 'creation_time' : -1 }")
    public List<Practice> findByTeacherId(String teacherId);

    @Query(value = "{ 'studentId' : ?0, 'teacherId' : ?1 }", sort = "{ 'creation_time' : -1 }")
    public List<Practice> findByStudentIdAndTeacherId(String studentId, String teacherId);
}
