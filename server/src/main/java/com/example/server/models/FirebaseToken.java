package com.example.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class FirebaseToken {
    private String localId;
    private String email;
    private String idToken;
    private String refreshToken;
    private int expiresIn;


    public FirebaseToken(String idToken, String email, String refreshToken, String localId) {
        this.idToken = idToken;
        this.email = email;
        this.refreshToken = refreshToken;
        this.expiresIn = 3600;
        this.localId = localId;
    }
}
