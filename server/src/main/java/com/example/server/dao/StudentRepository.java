package com.example.server.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.Student;

public interface StudentRepository extends MongoRepository<Student, String> {
    public Optional<Student> findById(String id);

    public List<Student> findAllByTeacherId(String teacherId);
}
