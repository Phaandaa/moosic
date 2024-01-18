package com.example.server.controller;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.entity.User;
import com.example.server.service.UserService;

// TODO: make return into Response Entity and add status codes

@RestController
@RequestMapping("/users")
public class UserController {
    
    public UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody User user) throws InterruptedException, ExecutionException {
        return ResponseEntity.ok(userService.createUser());
    }

    // get all users
    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers() throws InterruptedException, ExecutionException {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // get all students

    // get all teachers

    // get students under a certain teacher

    // get user by id user_id
    @GetMapping("/{user_id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer userId) throws InterruptedException, ExecutionException {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // delete user by user_id
    @DeleteMapping("/{user_id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Integer userId) throws InterruptedException, ExecutionException {
        userService.deleteUserById(userId);
        return ResponseEntity.ok("User with id " + userId + " was deleted.");
    }

    // test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Hello World!");
    }


}
