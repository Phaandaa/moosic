package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Goal {
    @Id
    private String id;

    @Field(name = "student_id")
    private String studentId;

    @Field(name = "student_name")
    private String studentName;

    @Field(name = "teacher_id")
    private String teacherId;

    @Field(name = "practice_count")
    private Integer practiceCount;

    @Field(name = "assignment_count")
    private Integer assignmentCount;

    @Field(name = "practice_goal_count")
    private Integer practiceGoalCount;

    @Field(name = "assignment_goal_count")
    private Integer assignmentGoalCount;

    @Field(name = "status")
    private String status;

    @Field(name = "points")
    private Integer points;

    @Field(name = "points_received")
    private boolean pointsReceived;

    public Goal(String studentId, String studentName, String teacherId, Integer practiceCount, Integer assignmentCount,
            Integer practiceGoalCount, Integer assignmentGoalCount, String status, Integer points,
            boolean pointsReceived) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.teacherId = teacherId;
        this.practiceCount = practiceCount;
        this.assignmentCount = assignmentCount;
        this.practiceGoalCount = practiceGoalCount;
        this.assignmentGoalCount = assignmentGoalCount;
        this.status = status;
        this.points = points;
        this.pointsReceived = pointsReceived;
    }

    public void weeklyReset(){
        assignmentCount = 0;
        practiceCount = 0;
        pointsReceived = false;
    }

    public void finishAssignment() {
        assignmentCount++;
        checkGoalCompletion();
    }

    public void finishPractice() {
        practiceCount++;
        checkGoalCompletion();
    }

    public void checkGoalCompletion() {
        if (practiceCount >= practiceGoalCount && assignmentCount >= assignmentGoalCount) {
            status = "Done";
        }
    }
    
}
