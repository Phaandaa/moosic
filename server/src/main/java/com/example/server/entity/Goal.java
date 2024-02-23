package com.example.server.entity;

import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

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

    @Field(name = "points")
    private Integer points;

    public Goal(String title, String studentId, String studentName, String teacherId,
            List<GoalChecklistItem> goalChecklist, String status, Integer points) {
        this.title = title;
        this.studentId = studentId;
        this.studentName = studentName;
        this.teacherId = teacherId;
        this.goalChecklist = goalChecklist;
        this.status = status;
        this.points = points;
    }

    public void addGoalChecklistItem(GoalChecklistItem goalChecklistItem) {
        goalChecklist.add(goalChecklistItem);
    }

    public void removeGoalChecklistItem(String selectedKey) {
        boolean found = false;
        for (Iterator<GoalChecklistItem> iterator = goalChecklist.iterator(); iterator.hasNext();) {
            GoalChecklistItem goalItem = iterator.next();
            if (goalItem.getGoalChecklistItemKey().equals(selectedKey)) {
                iterator.remove();
                found = true;
                break;
            }
        }
    
        if (!found) {
            throw new NoSuchElementException("Goal Item with key '" + selectedKey + "' not found.");
        }
    }    

    public void changeGoalChecklistStatus(String selectedKey) {
        boolean found = false;
        for (GoalChecklistItem goalItem : goalChecklist) {
            if (goalItem.getGoalChecklistItemKey().equals(selectedKey)) {
                switch (goalItem.getStatus()) {
                    case "Done":
                        goalItem.setStatus("Not done");
                        break;
                    case "Not done":
                        goalItem.setStatus("Done");
                        break;
                    default:
                        break;
                }
                found = true;
                break;
            }
        }
    
        if (!found) {
            throw new NoSuchElementException("Goal Item with key '" + selectedKey + "' not found.");
        }
    }
    
}
