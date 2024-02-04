package com.example.server.controller;

import com.example.server.models.FirebaseToken;
import com.example.server.models.SignInResponseDTO;
import com.example.server.service.FirebaseAuthService;
import com.example.server.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.server.models.AuthRequest;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private UserService userService;

    @Autowired
    public AuthController(FirebaseAuthService firebaseAuthService) {
        this.firebaseAuthService = firebaseAuthService;
    }

    @Operation(summary = "User sign in with email and password")
    @PostMapping("/signin")
    public ResponseEntity<SignInResponseDTO> signInWithEmailAndPassword(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(
                userService.signInWithEmailAndPassword(authRequest.getEmail(), authRequest.getPassword())
            );
    }
}
