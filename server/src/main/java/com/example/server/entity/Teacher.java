package com.example.server.entity;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "teachers")
public class Teacher extends User{
    private ArrayList<String> studentIds; // References to Students' User IDs
    private String avatar;
    private String phone;
    private String instrument;

    public Teacher() {

    }

    public Teacher(String id, String name, String email, String avatar, ArrayList<String> studentIds, String phone, String instrument) {
        super(id, name, email, "Teacher");
        this.studentIds = studentIds;
        this.avatar = avatar;
        this.phone = phone;
        this.instrument = instrument;

    }

    public void addStudent(String string) {
        studentIds.add(string);
    }

    public void deleteStudent(String string) {
        studentIds.remove(string);
    }

}
