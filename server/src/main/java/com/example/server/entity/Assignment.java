package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
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
    private List<String>  submissionLinks;
    private String teacherId; // reference teacher 
    private String teacherName;
    private String teacherFeedback;
    private Integer points;
    private String feedbackDocumentLink;
    private String createdAtDate;
    private String studentComment;

    
    public Assignment(String title, List<String> assignmentDocumentLinks, String description, String deadline,
            String studentId, String studentName, List<String> submissionLinks, String teacherId, String teacherName,
            String teacherFeedback, Integer points, String feedbackDocumentLink, String studentComment) {
        this.title = title;
        this.assignmentDocumentLinks = assignmentDocumentLinks;
        this.description = description;
        this.deadline = deadline;
        this.studentId = studentId;
        this.studentName = studentName;
        this.submissionLinks = submissionLinks;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.teacherFeedback = teacherFeedback;
        this.points = points;
        this.feedbackDocumentLink = feedbackDocumentLink;
        this.createdAtDate = LocalDateTime.now().toString();
        this.studentComment = studentComment;
    }


    @Override
    public String toString() {
        return "Assignment [assignmentId=" + assignmentId + ", title=" + title + ", assignmentDocumentLinks="
                + assignmentDocumentLinks + ", description=" + description + ", deadline=" + deadline + ", studentId="
                + studentId + ", studentName=" + studentName + ", submissionList=" + submissionLinks + ", teacherId="
                + teacherId + ", teacherName=" + teacherName + ", teacherFeedback=" + teacherFeedback + ", points="
                + points + ", feedbackDocumentLink=" + feedbackDocumentLink + ", createdAtDate=" + createdAtDate
                + ", studentComment=" + studentComment + "]";
    }
}

