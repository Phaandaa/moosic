package com.example.server.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.server.models.AuthRequest;
import com.example.server.models.FirebaseToken;
import com.google.api.Http;
import com.example.server.models.ChangePasswordRequest;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;


@Service
public class FirebaseAuthService {
    @Value("${firebase.apiKey}")
    private String firebaseApiKey;

    @PostConstruct
    public void init() {
        System.out.println("Firebase API Key: " + firebaseApiKey);
    }

    public FirebaseToken signUpWithEmailAndPassword(String email, String password) {
        try{
            String url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="+ firebaseApiKey;

            // set up http request headers and indicate the content being sent in request body is JSON format
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
    
            AuthRequest request = new AuthRequest();
            request.setEmail(email);
            request.setPassword(password);
    
            // completes http request entity
            HttpEntity<AuthRequest> entity = new HttpEntity<>(request, headers);
    
            // A RestTemplate is a class in Spring Framework used for making HTTP requests
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<FirebaseToken> responseEntity = restTemplate.exchange(url, HttpMethod.POST, entity, FirebaseToken.class);
    
            return responseEntity.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while signing up. Please try again later" + e.getMessage());
        }

    }

    public FirebaseToken signInWithEmailAndPassword(String email, String password){
       try {
            String url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + firebaseApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            AuthRequest request = new AuthRequest();
            request.setEmail(email);
            request.setPassword(password);
            request.setReturnSecureToken(true);

            HttpEntity<AuthRequest> entity = new HttpEntity<>(request, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<FirebaseToken> responseEntity = restTemplate.exchange(
                url, HttpMethod.POST, entity, FirebaseToken.class);
            return responseEntity.getBody();
       } catch (Exception e) {
           throw new RuntimeException("Error occurred while signing in. Please try again later" + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String email) {
        try {
            // Firebase endpoint for sending a password reset email
            String url = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + firebaseApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Constructing the request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("requestType", "PASSWORD_RESET");
            requestBody.put("email", email);

            // Wrapping the request body and headers in an HttpEntity
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            // Using RestTemplate to send the POST request
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while sending password reset email. Please try again later. " + e.getMessage());
        }
    }

}