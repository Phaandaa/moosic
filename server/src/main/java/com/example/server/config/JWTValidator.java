package com.example.server.config;

import java.util.Base64;
import org.json.JSONObject;

public class JWTValidator {
    public static void main(String[] args) {
        if (args.length != 1) {
            System.out.println("Usage: java JWTValidator <JWT token>");
            return;
        }
        
        // Example JWT token
        String jwtToken = args[0];

        // Extract header from the JWT token
        String[] parts = jwtToken.split("\\.");
        String encodedHeader = parts[0];
        
        // Decode the Base64-encoded header
        byte[] decodedHeader = Base64.getDecoder().decode(encodedHeader);
        String headerJson = new String(decodedHeader);

        // Parse the header JSON
        JSONObject headerObject = new JSONObject(headerJson);

        // Check the algorithm used for signing
        String algorithm = headerObject.optString("alg");
        if ("RS256".equals(algorithm)) {
            System.out.println("JWT token is signed using RS256 algorithm");
        } else {
            System.out.println("JWT token is not signed using RS256 algorithm");
        }
    }
}