package com.example.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.cloud.spring.pubsub.core.PubSubTemplate;

import java.util.List;
import java.util.NoSuchElementException;

import com.example.server.models.NotificationDTO;
import com.example.server.dao.NotificationRepository;
import com.example.server.entity.Notification;
import com.example.server.entity.PointsLog;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class NotificationService {
    
    private final PubSubTemplate pubSubTemplate;
    private final String topicName;
    private final ObjectMapper objectMapper;
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(
        PubSubTemplate pubSubTemplate, 
        @Value("${spring.cloud.gcp.pubsub.topic-name}") String topicName,
        ObjectMapper objectMapper,
        NotificationRepository notificationRepository) {
        this.pubSubTemplate = pubSubTemplate;
        this.topicName = topicName;
        this.objectMapper = objectMapper;
        this.notificationRepository = notificationRepository;
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

    public List<Notification> getNotificationsByRecipientId(String recipientId) {
        try {
            List<Notification> notifications = notificationRepository.findByRecipientId(recipientId);
            if (notifications.isEmpty() || notifications == null) {
                throw new NoSuchElementException("No notifications found for user ID " + recipientId);
            }
            return notifications;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching points logs for student ID: " + recipientId + " " + e.getMessage());
        }
    }
}
