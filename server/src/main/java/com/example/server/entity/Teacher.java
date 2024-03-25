package com.example.server.entity;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "teachers")
public class Teacher extends User{
    private ArrayList<String> studentIds; // References to Students' User IDs
    private String avatar;
    private String phoneNumber; // TODO: Ini nomor telfonnya? Can just add expoPushToken buat store push tokennya 
    private String expoPushToken;
    private String instrument;

    public Teacher() {

    }

    public Teacher(String id, String name, String email, String avatar, ArrayList<String> studentIds, String phoneNumber, String instrument, Date creationTime, String expoPushToken) {
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

}
