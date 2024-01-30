package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "assignments")
public class Assignment {
    @Id
    private String assignmentId;
    private String title;
    private String assignmentDocumentLink;
    private String description;
    private Date deadline;
    private String studentId; // reference student
    private String studentName;
    private String submission;
    private String teacherId; // reference teacher 
    private String teacherName;
    private String teacherFeedback;
    private Integer points;
    private String feedbackDocumentLink;


    public Assignment() {

    }
    
    public Assignment(String title, String assignmentDocumentLink, String description, Date deadline, String studentId,
            String studentName, String submission, String teacherId, String teacherName, String teacherFeedback,
            Integer points, String feedbackDocumentLink) {
        this.title = title;
        this.assignmentDocumentLink = assignmentDocumentLink;
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
    }


    @Override
    public String toString() {
        return "Assignment [assignmentId=" + assignmentId + ", title=" + title + ", assignmentDocumentLink="
                + assignmentDocumentLink + ", description=" + description + ", deadline=" + deadline + ", studentId="
                + studentId + ", studentName=" + studentName + ", submission=" + submission + ", teacherId=" + teacherId
                + ", teacherName=" + teacherName + ", teacherFeedback=" + teacherFeedback + ", points=" + points
                + ", feedbackDocumentLink=" + feedbackDocumentLink + "]";
    }

    
}

