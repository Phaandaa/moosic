package com.example.server.config;

import java.util.Base64;
import org.json.JSONObject;

public class JWTValidator {
    public static void validateJWT(String jwtToken) {
        // Split the JWT token into its components
        String[] parts = jwtToken.split("\\.");
        if (parts.length != 3) {
            System.out.println("Invalid JWT structure: JWT should have 3 parts separated by dots.");
            return;
        }

        // Decode the Base64-encoded header and payload
        String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
        String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));

        // Parse the header and payload JSON
        JSONObject headerObject = new JSONObject(headerJson);
        JSONObject payloadObject = new JSONObject(payloadJson);

        // Display the decoded header and payload
        System.out.println("Header: " + headerObject.toString(4));
        System.out.println("Payload: " + payloadObject.toString(4));

        // Check the algorithm used for signing
        String algorithm = headerObject.optString("alg");
        System.out.println("JWT token is signed using " + algorithm + " algorithm");
    }
}