package com.example.server.entity;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "users")
public class User implements UserType{

    @Id
    private String id;
    
    @Field(name = "name")
    private String name;

    @Field(name = "email")
    private String email;

    @Field(name = "role")
    private String role;

    @Field(name = "creation_time")
    private Date creationTime;

    public User() {

    }

    public User(String id, String name, String email, String role, Date creationTime) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.creationTime = creationTime;
    }
 
}
