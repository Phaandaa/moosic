package com.example.server.controller;

import java.util.List;

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
import com.example.server.entity.UserType;
import com.example.server.models.CreateUserDTO;
import com.example.server.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {
    
    @Autowired
    public UserService userService;

    @Operation(summary = "Create a new user")
    @PostMapping("/create")
    public ResponseEntity<UserType> createUser(@RequestBody CreateUserDTO userDTO) {
        return ResponseEntity.ok(userService.createUser(userDTO));
    }
    
    @Operation(summary = "Create a new admin")
    @PostMapping("/create-admin")
    public ResponseEntity<User> createAdmin(@RequestBody CreateUserDTO userDTO) {
        return ResponseEntity.ok(userService.createAdmin(userDTO));
    }

    @Operation(summary = "Get all users")
    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "Get user by user_id")
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Delete user by user_id")
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUserById(@PathVariable String userId){
        userService.deleteUserById(userId);
        return ResponseEntity.ok("User with id " + userId + " was deleted.");
    }

}
