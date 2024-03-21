package com.example.server.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.Goal;

public interface GoalRepository extends MongoRepository<Goal, String>{

    public Optional<Goal> findById(String goalId);
    
    public Optional<Goal> findByStudentId(String studentId);

    public List<Goal> findAllByTeacherId(String teacherId);

    public List<Goal> findAll();

    public List<Goal> findByStudentIdIn(List<String> studentIds);
    
}
