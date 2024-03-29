package com.example.server.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    private String avatarFrame;
    private String teacherName;
    private String phoneNumber;
    private String tuitionDay;
    private List<String> expoPushToken;


    public Student() {

    }

    public Student(String id, String name, String email, Integer pointsCounter, String teacherId, ArrayList<String> purchaseHistory, String instrument, String phoneNumber, String grade, String avatar, String teacherName, String avatarFrame, Date creationTime, String tuitionDay, List<String> expoPushToken) {
        super(id, name, email, "Student",creationTime);
        this.pointsCounter = pointsCounter;
        this.teacherId = teacherId;
        this.purchaseHistory = purchaseHistory;
        this.instrument = instrument;
        this.grade = grade;
        this.avatar = avatar;
        this.teacherName = teacherName;
        this.avatarFrame = avatarFrame;
        this.phoneNumber = phoneNumber;
        this.tuitionDay = tuitionDay;
        this.expoPushToken = expoPushToken;
    }

    public void deductPoints(Integer pointAmount) {
        if (pointAmount < 0) {
            throw new IllegalArgumentException("Point amount cannot be negative");
        }
        if (pointAmount > pointsCounter) {
            throw new IllegalArgumentException("Point deduction cannot be more than point counter");
        }
        pointsCounter = pointsCounter - pointAmount;
    }

    public void addPoints(Integer pointAmount) {
        if (pointAmount < 0) {
            throw new IllegalArgumentException("Point amount cannot be negative");
        }
        pointsCounter = pointsCounter + pointAmount;
    }

    public void addDevice(String newExpoPushToken) {
        if (!expoPushToken.contains(newExpoPushToken)) expoPushToken.add(newExpoPushToken);
    }

    public void removeDevice(String oldExpoPushToken) {
        expoPushToken.remove(oldExpoPushToken);
    }

}
