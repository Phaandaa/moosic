// package com.example.server.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;

// import com.example.server.models.FirebaseToken;
// import com.example.server.service.FirebaseAuthService;

// public class AuthController {
//     @Autowired
//     private FirebaseAuthService firebaseAuthService;

//     @PostMapping("/signin")
//     public FirebaseToken signInWithEmailAndPassword(@RequestBody AuthRequest authRequest) {
//         return firebaseAuthService.signInWithEmailAndPassword(authRequest.getEmail(), authRequest.getPassword());
//     }
// }
