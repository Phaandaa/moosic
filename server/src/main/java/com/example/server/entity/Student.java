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
    private ArrayList<String> purchaseHistory; // List of references to Rewards Shop Items
    private String instrument;

    public Student() {

    }

    public Student(String id, Integer pointsCounter, String teacherId, ArrayList<String> purchaseHistory, String instrument) {
        this.id = id;
        this.pointsCounter = pointsCounter;
        this.teacherId = teacherId;
        this.purchaseHistory = purchaseHistory;
        this.instrument = instrument;
    }

}
