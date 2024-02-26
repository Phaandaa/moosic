package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "points_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PointsLog {
    @Id
    private String id;

    @Field(name = "student_id")
    private String studentId;

    @Field(name = "description")
    private String description;

    @Field(name = "change_amount")
    private Integer changeAmount;

    @Field(name = "date")
    private String date;

    public PointsLog(String studentId, String description, Integer changeAmount, String date) {
        this.studentId = studentId;
        this.description = description;
        this.changeAmount = changeAmount;
        this.date = date;
    }

}