package com.example.server.controller;


import com.example.server.models.SignInResponseDTO;
import com.example.server.models.SignOutDTO;
import com.example.server.service.FirebaseAuthService;
import com.example.server.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dao.UserRepository;
import com.example.server.entity.User;
import com.example.server.models.AuthRequest;

@CrossOrigin
@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // @Autowired
    // public AuthController(FirebaseAuthService firebaseAuthService) {
    //     this.firebaseAuthService = firebaseAuthService;
    // }
    
    @Operation(summary = "User sign in with email and password")
    @PostMapping("/signin")
    public ResponseEntity<SignInResponseDTO> signInWithEmailAndPassword(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(
                userService.signInWithEmailAndPassword(authRequest.getEmail(), authRequest.getPassword(), authRequest.getExpoPushToken())
            );
    }

    @Operation(summary = "User sign out")
    @PostMapping("/signout")
    public ResponseEntity<?> signOut(@RequestParam String userId) {
        return ResponseEntity.ok(userService.signOut(userId));
    }

    @Operation(summary = "User change password via email")
    @PostMapping("/request-password-reset/{userId}")
    public ResponseEntity<String> requestPasswordReset(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        firebaseAuthService.sendPasswordResetEmail(user.getEmail());
        return ResponseEntity.ok("Password reset email sent");
    }
}
