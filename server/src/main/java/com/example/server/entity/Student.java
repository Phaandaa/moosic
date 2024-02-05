package com.example.server.entity;

import java.util.ArrayList;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "students")
public class Student extends User{

    private Integer pointsCounter;
    private String teacherId; // Reference to a Teacher's User ID
    private ArrayList<String> purchaseHistory; // List of references to Rewards Shop Items
    private String instrument;
    private String grade;
    private String avatar;
    private String teacherName;

    public Student() {

    }

    public Student(String id, String name, String email, Integer pointsCounter, String teacherId, ArrayList<String> purchaseHistory, String instrument, String grade, String avatar, String teacherName) {
        super(id, name, email, "Student");
        this.pointsCounter = pointsCounter;
        this.teacherId = teacherId;
        this.purchaseHistory = purchaseHistory;
        this.instrument = instrument;
        this.grade = grade;
        this.avatar = avatar;
        this.teacherName = teacherName;
    }

}
