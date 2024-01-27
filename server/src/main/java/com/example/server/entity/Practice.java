package com.example.server.entity;

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

    @Field(name = "feedback")
    private String feedback;

    public Practice() {

    }

    public Practice(String studentId, String studentName, String teacherId, String teacherName, String videoLink,
            String feedback) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.videoLink = videoLink;
        this.feedback = feedback;
    }

}
