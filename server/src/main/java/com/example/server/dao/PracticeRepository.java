package com.example.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.Practice;

public interface PracticeRepository extends MongoRepository<Practice, String> {
    public List<Practice> findByStudentId(String studentId);

    public List<Practice> findByTeacherId(String teacherId);

    public List<Practice> findByStudentIdAndTeacherId(String studentId, String teacherId);
}
