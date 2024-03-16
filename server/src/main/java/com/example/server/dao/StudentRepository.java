package com.example.server.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.Student;

public interface StudentRepository extends MongoRepository<Student, String> {
   
    public Optional<Student> findById(String id);

    @Query(value = "{ 'teacherId' : ?0 }", sort = "{ 'creation_time' : -1 }")
    public List<Student> findAllByTeacherId(String teacherId);

    @Query(value = "{}", sort = "{ 'creation_time' : -1 }")
    public List<Student> findAllSortedByCreationTime();

}
