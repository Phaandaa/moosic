package com.example.server.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateMaterialRepositoryDTO {

    private String title;
    private String description;
    private String teacherId;
    private String teacherName;
    
}
