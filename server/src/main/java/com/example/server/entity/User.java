package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "users")
public class User {

    @Id
    private String id;
    
    // local id from firebase
    @Field(name = "user_id")
    private String userId;

    @Field(name = "name")
    private String name;

    @Field(name = "role")
    private String role;

    @Field(name = "email")
    private String email;

    public User() {

    }
}
