package com.example.server.entity;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {
    @Id
    private String id;

    private String title;

    private String body;

    @Field(name = "recipient_id")
    private String recipientId;
    
    @Field(name = "creation_time")
    private Date creationTime;

    @Field(name = "text_date")
    private String textDate;

    @Field(name = "read_status")
    private String readStatus;

    public Notification(String title, String body, String recipientId) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm");
        Date currentDate = new Date();
        this.title = title;
        this.body = body; 
        this.recipientId = recipientId;
        this.creationTime = currentDate;
        this.textDate = sdf.format(currentDate);
        this.readStatus = "unread";
    }
    
}
