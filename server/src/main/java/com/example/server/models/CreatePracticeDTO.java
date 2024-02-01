package com.example.server.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePracticeDTO {
    
    @JsonProperty("student_id")
    private String studentId;

    @JsonProperty("student_name")
    private String studentName;

    @JsonProperty("teacher_id")
    private String teacherId;

    @JsonProperty("teacher_name")
    private String teacherName;

    private String title;

    private String comment;

}
