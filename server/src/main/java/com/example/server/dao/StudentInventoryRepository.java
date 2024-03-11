package com.example.server.dao;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.server.entity.StudentInventory;

public interface StudentInventoryRepository extends MongoRepository<StudentInventory, String>{
    
    public Optional<StudentInventory> findByStudentId(String studentId);

    public void deleteByStudentId(String studentId);

}
