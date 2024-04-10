package com.example.server.service;
import io.jsonwebtoken.Jwts;

import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.net.URI;
import java.net.URL;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import org.json.JSONObject;

import org.springframework.stereotype.Service;

@Service
public class VerifyIdTokenService {

    public void verifyIdToken(String idToken) throws Exception {
        // Fetch public keys from Google's x509 certificates URL
        Map<String, PublicKey> googlePublicKeys = fetchGooglePublicKeys();

        // Decode the JWT Header to find the 'kid' claim
        String header = idToken.split("\\.")[0];
        JSONObject headerClaims = decodeBase64Json(header);

        // Use 'kid' to select the appropriate public key
        String kid = headerClaims.getString("kid");
        PublicKey publicKey = googlePublicKeys.get(kid);

        // Parse and validate the token
        try {
            Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(idToken);
            System.out.println("Token validation successful.");
        } catch (Exception e) {
            throw new Exception("Invalid token");
        }
    }

    private Map<String, PublicKey> fetchGooglePublicKeys() throws IOException, Exception {
        Map<String, PublicKey> keys = new HashMap<>();
        URI uri = new URI("https", "www.googleapis.com", "/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com", null);
        URL url = uri.toURL();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()))) {
            String result = reader.lines().collect(Collectors.joining("\n"));
            JSONObject jObject = new JSONObject(result);
            jObject.keys().forEachRemaining(key -> {
                try {
                    keys.put(key, convertPemToPublicKey(jObject.getString(key)));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
        return keys;
    }

    private PublicKey convertPemToPublicKey(String publicKeyPem) throws Exception {
        publicKeyPem = publicKeyPem.replace("-----BEGIN CERTIFICATE-----", "")
                                   .replace("-----END CERTIFICATE-----", "")
                                   .replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(publicKeyPem);
        X509Certificate cert = (X509Certificate) CertificateFactory.getInstance("X.509")
                                                                     .generateCertificate(new ByteArrayInputStream(decoded));
        return cert.getPublicKey();
    }

    private JSONObject decodeBase64Json(String str) {
        byte[] decodedBytes = Base64.getUrlDecoder().decode(str);
        String decodedString = new String(decodedBytes);
        return new JSONObject(decodedString);
    }
}
