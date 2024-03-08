package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.GoalRepository;
import com.example.server.dao.PointsLogRepository;
import com.example.server.entity.Goal;
import com.example.server.models.UpdateGoalDTO;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    // edit goal practice, assignment and 
    public Goal updateGoalByStudentId(String studentId, UpdateGoalDTO updateGoalDTO) {
        try {
            Goal goal = goalRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Goal not found with student ID " + studentId));
            goal.setPracticeGoalCount(updateGoalDTO.getPracticeGoalCount());
            goal.setAssignmentGoalCount(updateGoalDTO.getAssignmentGoalCount());
            goal.setPoints(updateGoalDTO.getPoints());
            goalRepository.save(goal);
            return goal;          
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding goals by student ID " + studentId + ": " + e.getMessage());
        }
    }

    // get goal by student id 
    public Goal getGoalByStudentId(String studentId) {
        try {
            Goal goal = goalRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Goal not found with student ID " + studentId));
            return goal;          
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding goals by student ID " + studentId + ": " + e.getMessage());
        }
    }

    // get goal by teacher id
    public List<Goal> getGoalByTeacherId(String teacherId) {
        try {
            List<Goal> goals = goalRepository.findAllByTeacherId(teacherId);
            if (goals.isEmpty() || goals == null) {
                throw new NoSuchElementException("No goals found for teacher ID " + teacherId);
            }
            return goals;       
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding goals by teacher ID " + teacherId + ": " + e.getMessage());
        }
    }

}
