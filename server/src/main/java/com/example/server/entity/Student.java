package com.example.server.entity;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private Integer pointsCounter;
    private String teacherId; // Reference to a Teacher's User ID
    private String name;
    private ArrayList<String> purchaseHistory; // List of references to Rewards Shop Items
    private String instrument;
    private String grade;
    private String avatar;
    private String email;

    public Student() {

    }

    public Student(String id, Integer pointsCounter, String teacherId, String name, ArrayList<String> purchaseHistory, String instrument, String grade, String avatar, String email) {
        this.id = id;
        this.pointsCounter = pointsCounter;
        this.teacherId = teacherId;
        this.name = name;
        this.purchaseHistory = purchaseHistory;
        this.instrument = instrument;
        this.grade = grade;
        this.avatar = avatar;
        this.email = email;
    }

}
