package com.example.server.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.Teacher;

public interface TeacherRepository extends MongoRepository<Teacher, String>{
    public Optional <Teacher> findById(String id);

    @Query(value = "{}", sort = "{ 'creation_time' : -1 }")
    public List<Teacher> findAllSortedByCreationTime();
}
