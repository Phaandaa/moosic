package com.example.server.dao;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.Teacher;

public interface TeacherRepository extends MongoRepository<Teacher, String>{
    public Optional <Teacher> findById(String id);
}
