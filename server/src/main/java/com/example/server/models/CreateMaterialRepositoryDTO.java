package com.example.server.models;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateMaterialRepositoryDTO {

    private String title;
    private String description;
    private List<String> type;
    private List<String> instrument;
    private List<String> grade;
    private String teacherId;
    private String teacherName;
    
}
