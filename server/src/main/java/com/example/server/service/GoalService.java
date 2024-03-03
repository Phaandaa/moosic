package com.example.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.GoalRepository;
import com.example.server.dao.PointsLogRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.entity.Goal;
import com.example.server.entity.GoalChecklistItem;
import com.example.server.entity.PointsLog;
import com.example.server.entity.Student;
import com.example.server.models.CreateGoalDTO;
import com.example.server.models.GoalItemDTO;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PointsLogRepository pointsLogRepository;

    // create goal
    public Goal createGoal(CreateGoalDTO goalDTO) {
        try {
            String studentId = goalDTO.getStudentId();
            String studentName = goalDTO.getStudentName();
            String teacherId = goalDTO.getTeacherId();
            String title = goalDTO.getTitle();
            Integer points = goalDTO.getPoints();
            Goal createdGoal = new Goal(title, studentId, studentName, teacherId, new ArrayList<>(), "Not done", points);
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
    public Goal createGoalItem(String goalId, GoalItemDTO goalItemDTO) {
        try {
            Goal goal = goalRepository.findById(goalId).orElseThrow(()->
                new NoSuchElementException("Goal not found with the ID " + goalId));
            String goalChecklistItemKey = UUID.randomUUID().toString();
            String description = goalItemDTO.getDescription();
            GoalChecklistItem newGoalItem = new GoalChecklistItem(goalChecklistItemKey, description, "Not done");
            goal.addGoalChecklistItem(newGoalItem);
            goalRepository.save(goal);
            return goal;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error adding goal item for goal ID: " + goalId + ": " + e.getMessage());
        }
    }
    
    // remove goal item in goal
    public Goal deleteGoalItem(String goalId, String goalItemKey) {
        try {
            Goal goal = goalRepository.findById(goalId).orElseThrow(()->
                new NoSuchElementException("Goal not found with the ID " + goalId));
            goal.removeGoalChecklistItem(goalItemKey);
            goalRepository.save(goal);
            return goal;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error removing goal item for goal ID: " + goalId + ": " + e.getMessage());
        }
    }

    // mark goal as completed
    @Transactional
    public Goal markGoalAsDone(String goalId) {
        try {
            Goal goal = goalRepository.findById(goalId).orElseThrow(()->
                new NoSuchElementException("Goal not found with the ID " + goalId));
            
            for (GoalChecklistItem goalItem : goal.getGoalChecklist()) {
                if ("Not done".equals(goalItem.getStatus())) {
                    throw new IllegalArgumentException("All goal items inside must be complete before goal is marked as complete");
                }
            }
            goal.setStatus("Done");

            String studentId = goal.getStudentId();
            Student student = studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            Integer points = goal.getPoints();
            student.addPoints(points);
            studentRepository.save(student);

            String pointsLogDescription = "Finished " + goal.getTitle() + " goal";
            Date currentDate = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("MMM dd yyyy");
            String formattedDate = sdf.format(currentDate);
            PointsLog newPointsLog = new PointsLog(studentId, pointsLogDescription, points, formattedDate);
            pointsLogRepository.save(newPointsLog);
            
            goalRepository.save(goal);
            return goal;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error marking goal as complete for goal ID: " + goalId + ": " + e.getMessage());
        }
    }

    // change status for goal item
    public Goal changeGoalItemStatus(String goalId, String goalItemKey) {
        try {
            Goal goal = goalRepository.findById(goalId).orElseThrow(()->
                new NoSuchElementException("Goal not found with the ID " + goalId));
            goal.changeGoalChecklistStatus(goalItemKey);
            goalRepository.save(goal);
            return goal;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error changing goal item status for goal ID: " + goalId + ": " + e.getMessage());
        }
    }

    // edit goal item in goal

    // get both ongoing and completed goals by student id
    public List<Goal> getGoalsByStudentId(String studentId) {
        try {
            List<Goal> goals = goalRepository.findAllByStudentId(studentId);
            if (goals.isEmpty() || goals == null) {
                throw new NoSuchElementException("No goals found for student ID " + studentId);
            }
            return goals;       
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding goals by student ID " + studentId + ": " + e.getMessage());
        }
    }

    // get goal by student id 
    public Goal getOngoingGoalByStudentId(String studentId) {
        try {
            List<Goal> goals = goalRepository.findAllByStudentId(studentId);
            if (goals.isEmpty() || goals == null) {
                throw new NoSuchElementException("No goals found for student ID " + studentId);
            }
            for (Goal goal : goals) {
                if ("Not done".equals(goal.getStatus())) {
                    return goal;
                }
            }
            throw new NoSuchElementException("No ongoing goals found for student ID " + studentId);          
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding goals by student ID " + studentId + ": " + e.getMessage());
        }
    }

    // get completed goal by Studentid
    public List<Goal> getCompletedGoalByStudentId(String studentId) {
        try {
            List<Goal> goals = goalRepository.findAllByStudentId(studentId);
            if (goals.isEmpty() || goals == null) {
                throw new NoSuchElementException("No goals found for student ID " + studentId);
            }
            List<Goal> completedGoals = new ArrayList<>();
            for (Goal goal : goals) {
                if ("Done".equals(goal.getStatus())) {
                    completedGoals.add(goal);
                }
            }
            if (completedGoals.isEmpty() || completedGoals == null) {
                throw new NoSuchElementException("No completed goals found for student ID " + studentId);
            }
            return completedGoals;       
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error finding completed goals by student ID " + studentId + ": " + e.getMessage());
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
