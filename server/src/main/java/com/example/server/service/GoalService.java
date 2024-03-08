package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.GoalRepository;
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
            Integer newPracticeGoalCount = updateGoalDTO.getPracticeGoalCount();
            Integer newAssignmentGoalCount = updateGoalDTO.getAssignmentGoalCount();
            Integer newPoints = updateGoalDTO.getPoints();
            if (newPracticeGoalCount <= 0) throw new IllegalArgumentException("Practice Goal Count cannot be 0 or under");
            if (newAssignmentGoalCount <= 0) throw new IllegalArgumentException("Assignment Goal Count cannot be 0 or under");
            if (newPoints <= 0) throw new IllegalArgumentException("Goal Points cannot be 0 or under");
            goal.setPracticeGoalCount(newPracticeGoalCount);
            goal.setAssignmentGoalCount(newAssignmentGoalCount);
            goal.setPoints(newPoints);
            goalRepository.save(goal);
            return goal;          
        } catch (NoSuchElementException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating goals by student ID " + studentId + ": " + e.getMessage());
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
