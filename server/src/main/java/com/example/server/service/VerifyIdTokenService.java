package com.example.server.service;
import io.jsonwebtoken.Jwts;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.KeyFactory;
import java.util.Base64;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class VerifyIdTokenService {
    private static final Logger logger = LoggerFactory.getLogger(VerifyIdTokenService.class);

    public void verifyIdToken(String idToken) throws Exception {

       // Fetch public keys from Google's x509 certificates URL
    Map<String, String> googlePublicKeys = fetchGooglePublicKeys();

    // Decode the JWT Header to find the 'kid' claim
    String header = idToken.split("\\.")[0];
    Map<String, Object> headerClaims = decodeBase64Json(header);

    // Use 'kid' to select the appropriate public key
    String kid = headerClaims.get("kid").toString();
    String publicKeyPem = googlePublicKeys.get(kid);
    
    // Convert public key from PEM format
    PublicKey publicKey = convertPemToPublicKey(publicKeyPem);

    // Parse and validate the token
    try {
        Jwts.parserBuilder()
            .setSigningKey(publicKey)
            .build()
            .parseClaimsJws(idToken);
    } catch (Exception e) {
        logger.error("Invalid token: " + e.getMessage());
        throw new Exception("Invalid token");

    }}
    // Claims claims = Jwts.parserBuilder()
    //     .setSigningKey(publicKey)
    //     .build()
    //     .parseClaimsJws(idToken)
    //     .getBody();
    // }

    private PublicKey convertPemToPublicKey(String publicKeyPem) throws Exception {
        publicKeyPem = publicKeyPem.replace("-----BEGIN PUBLIC KEY-----", "")
                                   .replace("-----END PUBLIC KEY-----", "")
                                   .replaceAll("\\s", "");
        byte[] encoded = Base64.getDecoder().decode(publicKeyPem);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(keySpec);
    }

public Map<String, String> fetchGooglePublicKeys() throws IOException, JSONException, URISyntaxException {
    Map<String, String> keys = new HashMap<>();
    URI uri = new URI("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
    URL url = uri.toURL();
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
        String result = reader.lines().collect(Collectors.joining("\n"));
        JSONObject jObject = new JSONObject(result);
        jObject.keys().forEachRemaining(key -> keys.put(key, jObject.getString(key)));
    }
    return keys;
}
    
    private Map<String, Object> decodeBase64Json(String str) throws Exception {
        byte[] decodedBytes = Base64.getUrlDecoder().decode(str);
        String decodedString = new String(decodedBytes);
        return new JSONObject(decodedString).toMap();
    }
}
