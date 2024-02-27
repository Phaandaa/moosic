package com.example.server.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "practice")
public class Practice {
    
    @Id 
    private String id;
    
    @Field(name = "student_id")
    private String studentId;

    @Field(name = "student_name")
    private String studentName;

    @Field(name = "teacher_id")
    private String teacherId;

    @Field(name = "teacher_name")
    private String teacherName;

    @Field(name = "video_link")
    private String videoLink;

    @Field(name = "title")
    private String title;

    @Field(name = "comment")
    private String comment;

    @Field(name = "feedback")
    private String feedback;

    @Field(name = "points")
    private Integer points;

    @Field(name = "feedbackLinks")
    private List<String> feedbackLinks;

    public Practice() {

    }

    public Practice(String studentId, String studentName, String teacherId, String teacherName, String videoLink,
            String title, String comment, String feedback, List<String> feedbackLink) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.videoLink = videoLink;
        this.title = title;
        this.comment = comment;
        this.feedback = feedback;
        this.points = 0;
        this.feedbackLinks = null;
    }

}
