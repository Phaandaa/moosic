package com.example.server.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "teachers")
public class Teacher extends User{
    private ArrayList<String> studentIds; 
    private String avatar;
    private String phoneNumber; 
    private List<String> expoPushToken;
    private String instrument;

    public Teacher() {

    }

    public Teacher(String id, String name, String email, String avatar, ArrayList<String> studentIds, String phoneNumber, String instrument, Date creationTime, List<String> expoPushToken) {
        super(id, name, email, "Teacher", creationTime);
        this.studentIds = studentIds;
        this.avatar = avatar;
        this.phoneNumber = phoneNumber;
        this.instrument = instrument;
        this.expoPushToken = expoPushToken;

    }

    public void addStudent(String string) {
        studentIds.add(string);
    }

    public void deleteStudent(String studentId) {
        this.studentIds.remove(studentId);
    }

    public void addDevice(String newExpoPushToken) {
        if (!expoPushToken.contains(newExpoPushToken)) expoPushToken.add(newExpoPushToken);
    }

    public void removeDevice(String oldExpoPushToken) {
        expoPushToken.remove(oldExpoPushToken);
    }

}
