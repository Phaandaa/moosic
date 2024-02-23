package com.example.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.PointsLog;

public interface PointsLogRepository extends MongoRepository<PointsLog, String>{
    
    List<PointsLog> findByStudentId(String studentId);

}
