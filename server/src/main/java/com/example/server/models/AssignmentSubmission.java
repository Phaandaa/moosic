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
public class AssignmentSubmission {
    
    @JsonProperty("student_id")
    private String student_id;

    @JsonProperty("student_name")
    private String studentName;

    @JsonProperty("submission_link")
    private String submissionLink;
    
}
