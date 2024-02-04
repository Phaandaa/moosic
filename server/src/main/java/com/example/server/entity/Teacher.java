package com.example.server.entity;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "teachers")
public class Teacher {
    @Id
    private String id;
    private String name;
    private String email;
    private ArrayList<String> studentIds; // References to Students' User IDs
    private String avatar;
    private String phone;

    public Teacher() {

    }

    public Teacher(String id, String name, String email, String avatar, ArrayList<String> studentIds, String phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.studentIds = studentIds;
        this.avatar = avatar;
        this.phone = phone;

    }

    public void addStudent(String string) {
        studentIds.add(string);
    }

    public void deleteStudent(String string) {
        studentIds.remove(string);
    }

}
