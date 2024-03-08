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
public class UpdateGoalDTO {
    @JsonProperty("practice_goal_count")
    private Integer practiceGoalCount;

    @JsonProperty("assignment_goal_count")
    private Integer assignmentGoalCount;

    @JsonProperty("points")
    private Integer points;
}
