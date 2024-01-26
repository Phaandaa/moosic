package com.example.server.models;

public class FirebaseUserData {
    private String localId;
    private String email;
    private boolean emailVerified;
    private String displayName;
    private String photoUrl;
    private String passwordHash;
    private double passwordUpdatedAt;
    private String validSince;
    private boolean disabled;
    private String lastLoginAt;
    private String createdAt;
    private boolean customAuth;

    public String getLocalId() {
        return localId;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return displayName;
    }
}


