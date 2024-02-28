package com.example.server.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class EditAssignmentDTO {
    @JsonProperty("assignment_desc")
    private String assignmentDesc;

    @JsonProperty("assignment_deadline")
    private String assignmentDeadline;

    @JsonProperty("points")
    private Integer points;

    @Override
    public String toString() {
        return "EditAssignmentDTO [assignmentDesc=" + assignmentDesc + ", assignmentDeadline=" + assignmentDeadline
                + ", points=" + points + "]";
    }
}

