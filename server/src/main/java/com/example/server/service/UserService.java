package com.example.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.UserRepository;
import com.example.server.entity.User;


// TODO: Handle possible exceptions, please check with example from OOP project

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        if (user != null) {
            return userRepository.save(user);
        }
        return null;
    }

    public List<User> getAllUsers() {
        System.out.println(userRepository.findAll());
        return userRepository.findAll();
    }

    public User getUserById(Integer userId) {
        return userRepository.findByUserId(userId);
    }

    public void deleteUserById(Integer userId) {

        User toBeDeletedUser = userRepository.findByUserId(userId);
        if (toBeDeletedUser != null) {
            userRepository.delete(toBeDeletedUser);
        }

    }
}
