package com.example.server.config;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.Jwts;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import java.net.URI;
import java.net.URL;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.Base64;

import java.security.cert.X509Certificate;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private Map<String, PublicKey> publicKeys; 

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("TokenAuthenticationFilter: Filtering request...");

        String token = extractToken(request);
        if (token != null && !token.isEmpty()) {
            System.out.println("TokenAuthenticationFilter: Token found, processing...");
            try {
                // Assuming retrievePublicKeys() method is implemented to fetch and cache the keys
                decodeTokenHeader(token);
                if (publicKeys == null) {
                    System.out.println("TokenAuthenticationFilter: Retrieving public keys...");
                    publicKeys = retrievePublicKeys();
                }

                System.err.println(token);
                
                // Parse the token
                System.out.println("TokenAuthenticationFilter: Parsing token...");
                Claims claims = Jwts.parserBuilder()
                    .setSigningKeyResolver(new SigningKeyResolver(publicKeys))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

                System.out.println(claims);
                System.out.println(claims.getSubject());

                // Extract user details and create Authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    claims.getSubject(), null, null);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("TokenAuthenticationFilter: Authentication successful.");
            } catch (Exception e) {
                // Handle invalid token
                System.out.println("TokenAuthenticationFilter: Authentication failed - " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            System.out.println("TokenAuthenticationFilter: No token found.");
        }
        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            System.out.println("TokenAuthenticationFilter: Extracted token from request.");
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        System.out.println("TokenAuthenticationFilter: No Authorization header found.");
        return null;
    }

    private Map<String, PublicKey> retrievePublicKeys() throws Exception {
    System.out.println("TokenAuthenticationFilter: Fetching public keys...");
    Map<String, PublicKey> publicKeys = new HashMap<>();
    ObjectMapper mapper = new ObjectMapper();
    URI uri = new URI("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com");
    URL url = uri.toURL();
    Map<String, String> keys = mapper.readValue(url, Map.class);

    CertificateFactory factory = CertificateFactory.getInstance("X.509");

    for (Map.Entry<String, String> entry : keys.entrySet()) {
        String certString = entry.getValue();

        // Remove the "BEGIN" and "END" lines
        String publicKeyPEM = certString
            .replace("-----BEGIN CERTIFICATE-----\n", "")
            .replace("-----END CERTIFICATE-----", "")
            .replace("\n", "");

        byte[] encoded = Base64.getDecoder().decode(publicKeyPEM);
        X509Certificate certificate = (X509Certificate) factory.generateCertificate(new ByteArrayInputStream(encoded));
        PublicKey publicKey = certificate.getPublicKey();

        publicKeys.put(entry.getKey(), publicKey);
    }

    System.out.println("TokenAuthenticationFilter: Public keys fetched and processed.");
    return publicKeys;
}
    

    // Implement a custom SigningKeyResolver using the public keys
    private static class SigningKeyResolver extends io.jsonwebtoken.SigningKeyResolverAdapter {
        private final Map<String, PublicKey> publicKeys;

        public SigningKeyResolver(Map<String, PublicKey> publicKeys) {
            this.publicKeys = publicKeys;
        }

        @Override
        public PublicKey resolveSigningKey(JwsHeader header, Claims claims) {
            return publicKeys.get(header.getKeyId());
        }
    }

    private void decodeTokenHeader(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid JWT token.");
            }
    
            String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
            System.out.println("Decoded JWT header: " + headerJson);
        } catch (Exception e) {
            System.out.println("Error decoding token header: " + e.getMessage());
        }
    }
}