package com.example.server.entity;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "material_repository")
public class MaterialRepository {
    @Id
    private String id;
    private String title;
    private String description;
    private String fileLink;
    private String status; // Pending, Approved, Rejected
    private String reasonForStatus;
    private List<String> type;
    private List<String> instrument;
    private List<String> grade;
    private String teacherId;
    private String teacherName;
    private Date creationTime;
    private String textDate;


    public MaterialRepository(String title, String description, String fileLink, String status, String reasonForStatus, List<String> type,
        List<String> instrument, List<String> grade, String teacherId, String teacherName) {
        this.title = title;
        this.description = description;
        this.fileLink = fileLink;
        this.status = status;
        this.reasonForStatus = reasonForStatus;
        this.type = type;
        this.instrument = instrument;
        this.grade = grade;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.creationTime = new Date();
        this.textDate = LocalDateTime.now().toString();
    }
    
}
