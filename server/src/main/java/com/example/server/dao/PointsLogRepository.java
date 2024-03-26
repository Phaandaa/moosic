package com.example.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.PointsLog;

public interface PointsLogRepository extends MongoRepository<PointsLog, String>{
    
    @Query(value = "{ 'student_id' : ?0 }", sort = "{ 'creation_time' : -1 }")
    public List<PointsLog> findByStudentId(String studentId);

}
