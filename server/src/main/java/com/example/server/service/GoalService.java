package com.example.server.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.GoalRepository;
import com.example.server.entity.Goal;
import com.example.server.models.CreateGoalDTO;

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
            Goal createdGoal = new Goal(title, studentId, studentName, teacherId, new ArrayList<>());
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

    // remove goal item in goal

    // edit goal item in goal

    // change status for goal item

    // mark goal as completed

    // get goal by student id 

    // get goal by teacher id

}
