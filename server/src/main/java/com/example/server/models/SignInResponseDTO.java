package com.example.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class SignInResponseDTO {
    
    private String name;
    private String userId;
    private String email;
    private String idToken;
    private String refreshToken;
    private int expiresIn;

    public SignInResponseDTO(FirebaseToken firebaseToken, String name) {
        this.name = name;
        this.userId = firebaseToken.getLocalId();
        this.email = firebaseToken.getEmail();
        this.idToken = firebaseToken.getIdToken();
        this.refreshToken = firebaseToken.getRefreshToken();
        this.expiresIn = firebaseToken.getExpiresIn();
    }
}
