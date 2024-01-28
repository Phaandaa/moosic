package com.example.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.Student;

public interface StudentRepository extends MongoRepository<Student, String> {
    
}
