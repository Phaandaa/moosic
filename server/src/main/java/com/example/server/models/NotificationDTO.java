package com.example.server.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class NotificationDTO {
    
    @JsonProperty("device_id")
    private String deviceId;

    private String title;

    private String body;

}
