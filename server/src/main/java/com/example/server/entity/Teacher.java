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
    private ArrayList<String> studentIds; // References to Students' User IDs

    public Teacher() {

    }

    public Teacher(String id, ArrayList<String> studentIds) {
        this.id = id;
        this.studentIds = studentIds;
    }

    public void addStudent(String string) {
        studentIds.add(string);
    }

}
