package com.example.server.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.server.models.AuthRequest;
import com.example.server.models.FirebaseToken;
import com.example.server.models.RefreshTokenResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import jakarta.annotation.PostConstruct;

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

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
    
            AuthRequest request = new AuthRequest();
            request.setEmail(email);
            request.setPassword(password);

            HttpEntity<AuthRequest> entity = new HttpEntity<>(request, headers);
    
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<FirebaseToken> responseEntity = restTemplate.exchange(url, HttpMethod.POST, entity, FirebaseToken.class);
    
            return responseEntity.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while signing up. Please try again later" + e.getMessage());
        }

    }

    public FirebaseToken signInWithEmailAndPassword(String email, String password) throws JsonMappingException, JsonProcessingException{
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
            ResponseEntity<FirebaseToken> responseEntity = restTemplate.exchange(url, HttpMethod.POST, entity, FirebaseToken.class);
            return responseEntity.getBody();
        } catch (HttpClientErrorException ex) {
            String responseBody = ex.getResponseBodyAsString();
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> errorMap = mapper.readValue(responseBody, new TypeReference<Map<String, Object>>() {});
            Map<String, Object> errorDetails = (Map<String, Object>) errorMap.get("error");
            String errorCode = (String) errorDetails.get("message");
            if (errorCode != null) {
                switch (errorCode) {
                    case "EMAIL_NOT_FOUND":
                        throw new IllegalArgumentException("Email address could not be found.");
                    case "INVALID_LOGIN_CREDENTIALS":
                        throw new IllegalArgumentException("Invalid email or password.");
                    case "USER_DISABLED":
                        throw new RuntimeException("This user has been disabled by an administrator.");
                    default:
                        throw new RuntimeException("An unexpected error occurred during authentication: " + errorCode);
                }
            } else {
                throw new RuntimeException("Error signing in: " + ex.getMessage());
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
           throw new RuntimeException("Error occurred while signing in. Please try again later" + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String email) {
        try {
            String url = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + firebaseApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("requestType", "PASSWORD_RESET");
            requestBody.put("email", email);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            RestTemplate restTemplate = new RestTemplate();
            restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while sending password reset email. Please try again later. " + e.getMessage());
        }
    }

    public RefreshTokenResponse refreshTokenId(String refreshToken) throws JsonMappingException, JsonProcessingException {
        try{
            String url = "https://securetoken.googleapis.com/v1/token?key="+ firebaseApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("grant_type", "refresh_token");
            requestBody.put("refresh_token", refreshToken);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
    
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<RefreshTokenResponse> responseEntity = restTemplate.exchange(url, HttpMethod.POST, entity, RefreshTokenResponse.class);
    
            return responseEntity.getBody();
        } catch (HttpClientErrorException ex) {
            String responseBody = ex.getResponseBodyAsString();
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> errorMap = mapper.readValue(responseBody, new TypeReference<Map<String, Object>>() {});
            Map<String, Object> errorDetails = (Map<String, Object>) errorMap.get("error");
            String errorCode = (String) errorDetails.get("message");
            if (errorCode != null) {
                switch (errorCode) {
                    case "TOKEN_EXPIRED":
                        throw new IllegalArgumentException("Token expired. Please login again.");
                    case "INVALID_REFRESH_TOKEN":
                        throw new IllegalArgumentException("Token not valid anymore. Please login again.");
                    case "USER_NOT_FOUND":
                        throw new IllegalArgumentException("User may have been deleted.");
                    case "USER_DISABLED":
                        throw new RuntimeException("This user has been disabled by an administrator.");
                    default:
                        throw new RuntimeException("An unexpected error occurred during authentication: " + errorCode);
                }
            } else {
                throw new RuntimeException("Error signing in: " + ex.getMessage());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while refreshing new token up. Please try again later" + e.getMessage());
        }

    }
}