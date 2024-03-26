package com.example.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.cloud.spring.pubsub.core.PubSubTemplate;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import com.example.server.models.NotificationDTO;
import com.example.server.dao.NotificationRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.dao.TeacherRepository;
import com.example.server.entity.Goal;
import com.example.server.entity.Notification;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class NotificationService {
    
    private final PubSubTemplate pubSubTemplate;
    private final String topicName;
    private final ObjectMapper objectMapper;
    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    @Autowired
    public NotificationService(
        PubSubTemplate pubSubTemplate, 
        @Value("${spring.cloud.gcp.pubsub.topic-name}") String topicName,
        ObjectMapper objectMapper,
        NotificationRepository notificationRepository,
        StudentRepository studentRepository,
        TeacherRepository teacherRepository) {
        this.pubSubTemplate = pubSubTemplate;
        this.topicName = topicName;
        this.objectMapper = objectMapper;
        this.notificationRepository = notificationRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    public String publishMessage(String expoPushToken, String title, String body) {
        try {
            NotificationDTO payload = new NotificationDTO(expoPushToken, title, body);
            String jsonString = objectMapper.writeValueAsString(payload);
            pubSubTemplate.publish(this.topicName, jsonString);
            return "Ok";
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public void sendNotification(String targetUserType, String title, String body, String userId) {
        try {
            List<String> expoPushTokens;
            switch (targetUserType) {
                case "Student":
                    Student student = studentRepository.findById(userId).orElseThrow(()->
                        new NoSuchElementException("No student found with the ID " + userId));
                    expoPushTokens = student.getExpoPushToken();
                    break;
                case "Teacher":
                    Teacher teacher = teacherRepository.findById(userId).orElseThrow(()->
                        new NoSuchElementException("No teacher found with the ID " + userId));
                    expoPushTokens = teacher.getExpoPushToken();
                    break;
                default:
                    expoPushTokens = new ArrayList<>();
                    break;
            }

            for (String expoPushToken : expoPushTokens) {
                publishMessage(expoPushToken, title, body);
            }

            Notification newNotif = new Notification(title, body, userId);
            notificationRepository.save(newNotif);
           
        } catch (NoSuchElementException e) {
            throw e;
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

    @Scheduled(cron = "0 5 0 * * *") 
    public void removeOldNotifications() {
        try {
            Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
            List<Notification> oldNotifications = notificationRepository.findAllOlderThanAWeek(oneWeekAgo);
            notificationRepository.deleteAll(oldNotifications);

        } catch (Exception e) {
            System.out.println("Error removing old notifications" + e.getMessage());
            e.printStackTrace();
        }
    }
}
