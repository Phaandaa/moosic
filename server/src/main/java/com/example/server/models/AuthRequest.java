package com.example.server.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    private String email;
    private String password;
    private boolean returnSecureToken;
    private String expoPushToken;
}
