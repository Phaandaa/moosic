package com.example.server.dto;

import java.util.HashMap;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserDTO {
    private String name;
    private String email;
    private String role;
    private HashMap<String, String> info;

    public CreateUserDTO() {

    }

    public CreateUserDTO(String name, String email, String role, HashMap<String, String> info) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.info = info;
    }

}
