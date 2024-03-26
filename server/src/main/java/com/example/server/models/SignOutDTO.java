package com.example.server.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignOutDTO {
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("expo_push_token")
    private String expoPushToken;

}
