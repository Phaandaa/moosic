package com.example.server.dao;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String>{

    @Query(value = "{ 'recipient_id' : ?0 }", sort = "{ 'creation_time' : -1 }")
    public List<Notification> findByRecipientId(String studentId);

    @Query("{ 'creation_time' : { $lt: ?0 } }")
    List<Notification> findAllOlderThanThreeDays(Instant threeDaysAgo);
    
}
