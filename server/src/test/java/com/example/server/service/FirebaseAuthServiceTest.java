package com.example.server.service;

import com.example.server.models.FirebaseToken;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class FirebaseAuthServiceTest {
    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Test
    void signUpWithEmailAndPassword_ValidCredentials_Success() {
        // Replace with valid email and password for testing
        String email = "test1@example.com";
        String password = "testPassword";

        FirebaseToken result = firebaseAuthService.signUpWithEmailAndPassword(email, password);

        assertNotNull(result);
    }

    @Test
    void signInWithEmailAndPassword_ValidCredentials_Success() {
        String email = "test1@example.com";
        String password = "testPassword";

        FirebaseToken signInResult = firebaseAuthService.signInWithEmailAndPassword(email, password);

        System.out.println("SignIn Result: " + signInResult);
        assertNotNull(signInResult);
    }
}
