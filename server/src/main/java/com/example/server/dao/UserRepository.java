package com.example.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.User;


public interface UserRepository extends MongoRepository<User, String> {
    
    public List<User> findByRole(String role);
}
