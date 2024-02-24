package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Document(collection = "assignments")
public class Assignment {
    // TODO: check implementation on how deadline can be used as Date object
    // TODO: add created date field 
    @Id
    private String assignmentId;
    private String title;
    private List<String> assignmentDocumentLinks;
    private String description;
    private String deadline;
    private String studentId; // reference student
    private String studentName;
    private String submission;
    private String teacherId; // reference teacher 
    private String teacherName;
    private String teacherFeedback;
    private Integer points;
    private String feedbackDocumentLink;
    private String createdAtDate;

    
    public Assignment(String title, List<String> assignmentDocumentLinks, String description, String deadline,
            String studentId, String studentName, String submission, String teacherId, String teacherName,
            String teacherFeedback, Integer points, String feedbackDocumentLink) {
        this.title = title;
        this.assignmentDocumentLinks = assignmentDocumentLinks;
        this.description = description;
        this.deadline = deadline;
        this.studentId = studentId;
        this.studentName = studentName;
        this.submission = submission;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.teacherFeedback = teacherFeedback;
        this.points = points;
        this.feedbackDocumentLink = feedbackDocumentLink;
        this.createdAtDate = createdAtDate;
    }


    @Override
    public String toString() {
        return "Assignment [assignmentId=" + assignmentId + ", title=" + title + ", assignmentDocumentLinks="
                + assignmentDocumentLinks + ", description=" + description + ", deadline=" + deadline + ", studentId="
                + studentId + ", studentName=" + studentName + ", submission=" + submission + ", teacherId=" + teacherId
                + ", teacherName=" + teacherName + ", teacherFeedback=" + teacherFeedback + ", points=" + points
                + ", feedbackDocumentLink=" + feedbackDocumentLink + ", createdAt=" + createdAtDate + "]";
    }

    
}

