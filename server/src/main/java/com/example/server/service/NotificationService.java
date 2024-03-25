package com.example.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.google.cloud.spring.pubsub.core.PubSubTemplate;

import com.example.server.models.NotificationDTO;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class NotificationService {
    
    private final PubSubTemplate pubSubTemplate;
    private final String topicName;
    private final ObjectMapper objectMapper;

    @Autowired
    public NotificationService(
        PubSubTemplate pubSubTemplate, 
        @Value("${spring.cloud.gcp.pubsub.topic-name}") String topicName,
        ObjectMapper objectMapper) {
        this.pubSubTemplate = pubSubTemplate;
        this.topicName = topicName;
        this.objectMapper = objectMapper;
    }

    public String testPublishMessage(String expoPushToken, String title, String body, String message) {
        try {
            NotificationDTO payload = new NotificationDTO(expoPushToken, title, body, message);
            String jsonString = objectMapper.writeValueAsString(payload);
            pubSubTemplate.publish(this.topicName, jsonString);
            return "Ok";
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

}
