package com.example.server.controller;

import com.example.server.models.FirebaseToken;
import com.example.server.service.FirebaseAuthService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public AuthController(FirebaseAuthService firebaseAuthService) {
        this.firebaseAuthService = firebaseAuthService;
    }

    @PostMapping("/signup")
    public FirebaseToken signUpWithEmailAndPassword(@RequestBody AuthRequest authRequest) {
        return firebaseAuthService.signUpWithEmailAndPassword(authRequest.getEmail(), authRequest.getPassword());
    }

    @PostMapping("/signin")
    public FirebaseToken signInWithEmailAndPassword(@RequestBody AuthRequest authRequest) {
        return firebaseAuthService.signInWithEmailAndPassword(authRequest.getEmail(), authRequest.getPassword());
    }
}
