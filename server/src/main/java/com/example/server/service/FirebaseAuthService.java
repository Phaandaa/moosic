package com.example.server.service;

// import java.util.HashMap;
// import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// import com.example.server.models.FirebaseUserData;


import com.example.server.models.AuthRequest;
import com.example.server.models.FirebaseToken;

import jakarta.annotation.PostConstruct;

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
    }

    // public FirebaseToken signInWithEmailAndPassword(String email, String password){
    //     String url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + firebaseApiKey;

    //     HttpHeaders headers = new HttpHeaders();
    //     headers.setContentType(MediaType.APPLICATION_JSON);

    //     AuthRequest request = new AuthRequest();
    //     request.setEmail(email);
    //     request.setPassword(password);

    //     HttpEntity<AuthRequest> entity = new HttpEntity<>(request, headers);

    //     RestTemplate restTemplate = new RestTemplate();
    //     ResponseEntity<FirebaseToken> responseEntity = restTemplate.exchange(
    //         url, HttpMethod.POST, entity, FirebaseToken.class);

    //     return responseEntity.getBody();
    // }

    // public FirebaseUserData getUserData(String idToken){

    //     String url = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + firebaseApiKey;

    //     HttpHeaders headers = new HttpHeaders();
    //     headers.setContentType(MediaType.APPLICATION_JSON);

    //     Map<String, String> requestMap = new HashMap<>();
    //     requestMap.put("idToken", idToken);

    //     HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestMap, headers);

    //     RestTemplate restTemplate = new RestTemplate();

    //     ResponseEntity<FirebaseUserData> responseEntity = restTemplate.exchange(
    //         url, HttpMethod.POST, entity, FirebaseUserData.class);

    //     return responseEntity.getBody();
    // }
}