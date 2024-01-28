package com.example.server.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.entity.User;
import com.example.server.models.CreateUserDTO;
import com.example.server.service.UserService;

// TODO: make return into Response Entity and add status codes
// TODO: Validation before processing
// TODO: Throw error if there is duplicate user 

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    public UserService userService;

    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody CreateUserDTO userDTO) {
        return ResponseEntity.ok(userService.createUser(userDTO));
    }
    
    @PostMapping("/create-admin")
    public ResponseEntity<User> createAdmin(@RequestBody CreateUserDTO userDTO) {
        return ResponseEntity.ok(userService.createAdmin(userDTO));
    }

    // get all users
    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // get all students

    // get all teachers

    // get students under a certain teacher

    // get user by id user_id
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // delete user by user_id
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUserById(@PathVariable String userId){
        userService.deleteUserById(userId);
        return ResponseEntity.ok("User with id " + userId + " was deleted.");
    }

    // test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Hello World!");
    }


}
