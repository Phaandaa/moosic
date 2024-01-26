package com.example.server.entity;

import java.lang.reflect.Array;
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
    private ArrayList<String> studentIds; // References to Students' User IDs

    public Teacher() {

    }

    public Teacher(String id, String name, ArrayList<String> studentIds) {
        this.id = id;
        this.name = name;
        this.studentIds = studentIds;
    }

    public void addStudent(String string) {
        studentIds.add(string);
    }

}
