package com.example.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.Assignment;

public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    
}
