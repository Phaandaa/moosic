package com.example.server.models;

import java.util.ArrayList;
import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateAssignmentDTO {

    @JsonProperty("teacher_id")
    private String teacherId;

    @JsonProperty("teacher_name")
    private String teacherName;

    @JsonProperty("assignment_title")
    private String assignmentTitle;

    @JsonProperty("assignment_desc")
    private String assignmentDesc;

    @JsonProperty("assignment_deadline")
    private String assignmentDeadline;

    @JsonProperty("selected_students")
    private ArrayList<HashMap<String, String>> selectedStudents;

    @JsonProperty("points")
    private Integer points;

    @Override
    public String toString() {
        return "CreateAssignmentDTO [teacherId=" + teacherId + ", teacherName=" + teacherName + ", assignmentTitle="
                + assignmentTitle + ", assignmentDesc=" + assignmentDesc + ", assignmentDeadline=" + assignmentDeadline
                + ", selectedStudents=" + selectedStudents + ", points=" + points + "]";
    }
    
}
