package com.example.server.entity;

import java.util.Iterator;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class GoalChecklistItem {
    private Integer goalChecklistItemKey;
    private String description;
    private String status;
}

@Document(collection = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Goal {
    @Id
    private String id;

    @Field(name = "title")
    private String title;

    @Field(name = "student_id")
    private String studentId;

    @Field(name = "student_name")
    private String studentName;

    @Field(name = "teacher_id")
    private String teacherId;

    @Field(name = "goal_checklist")
    private List<GoalChecklistItem> goalChecklist;

    @Field(name = "status")
    private String status;

    public Goal(String title, String studentId, String studentName, String teacherId,
            List<GoalChecklistItem> goalChecklist, String status) {
        this.title = title;
        this.studentId = studentId;
        this.studentName = studentName;
        this.teacherId = teacherId;
        this.goalChecklist = goalChecklist;
        this.status = status;
    }

    private void addGoalChecklistItem(GoalChecklistItem goalChecklistItem) {
        goalChecklist.add(goalChecklistItem);
    }

    private void removeGoalChecklistItem(Integer selectedKey) {
        for (Iterator<GoalChecklistItem> iterator = goalChecklist.iterator(); iterator.hasNext();) {
            GoalChecklistItem goalItem = iterator.next();
            if (goalItem.getGoalChecklistItemKey().equals(selectedKey)) {
                iterator.remove();
                break;
            }
        }
    }    
    
}
