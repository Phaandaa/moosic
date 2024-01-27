package com.example.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.Practice;

public interface PracticeRepository extends MongoRepository<Practice, String> {
    
}
