package com.example.server.models;

public class AuthRequest {
    private String email;
    private String password;
    private boolean returnSecureToken;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public boolean isReturnSecureToken() {
        return returnSecureToken;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setReturnSecureToken(boolean returnSecureToken) {
        this.returnSecureToken = returnSecureToken;
    }
    
}
