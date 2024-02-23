package com.example.server.service;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.GoalRepository;
import com.example.server.entity.Goal;
import com.example.server.entity.GoalChecklistItem;
import com.example.server.models.CreateGoalDTO;
import com.example.server.models.GoalItemDTO;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    // create goal
    public Goal createGoal(CreateGoalDTO goalDTO) {
        try {
            String studentId = goalDTO.getStudentId();
            String studentName = goalDTO.getStudentName();
            String teacherId = goalDTO.getTeacherId();
            String title = goalDTO.getTitle();
            Goal createdGoal = new Goal(title, studentId, studentName, teacherId, new ArrayList<>(), "Not done");
            goalRepository.save(createdGoal);
            return createdGoal;
        } catch (RuntimeException e) {
            if (e.getMessage() != null || e.getMessage() != "") {
                throw new RuntimeException("Error creating new goal: " + e.getMessage());
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create goal: " + e.getMessage());
        }
    }

    // add goal item to goal
    public String createGoalItem(String goalId, GoalItemDTO goalItemDTO) {
        try {
            Goal goal = goalRepository.findById(goalId).orElseThrow(()->
                new NoSuchElementException("Goal not found with the ID " + goalId));
            String goalChecklistItemKey = UUID.randomUUID().toString();
            String description = goalItemDTO.getDescription();
            GoalChecklistItem newGoalItem = new GoalChecklistItem(goalChecklistItemKey, description, "Not done");
            goal.addGoalChecklistItem(newGoalItem);
            goalRepository.save(goal);
            return "Successfully added item goal";
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error adding goal item for goal ID: " + goalId + ": " + e.getMessage());
        }
    }

    
    // remove goal item in goal

    // edit goal item in goal

    // change status for goal item

    // mark goal as completed

    // get goal by student id 

    // get goal by teacher id

}
