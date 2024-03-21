package com.example.server.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.server.dao.GoalRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.entity.Goal;
import com.example.server.entity.Student;
import com.example.server.models.UpdateGoalDTO;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private StudentRepository studentRepository;

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

    @Scheduled(cron = "0 0 0 * * MON")
    public void resetWeeklyGoal() {
        System.out.println("Trying the weekly reset process...");
        try {
            List<Goal> goals = goalRepository.findAll();
            for (Goal goal : goals) {
                goal.weeklyReset();
            }
            goalRepository.saveAll(goals);
        } catch (Exception e) {
            System.out.println("Error doing weekly goal reset");
        }
    }

    @Scheduled(cron = "0 0 0 * * *") // Runs every day at midnight
    public void resetPreviousDayGoals() {
        LocalDate today = LocalDate.now();
        DayOfWeek yesterday = today.minusDays(1).getDayOfWeek(); 
        String yesterdayText = yesterday.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        System.out.println(yesterdayText);

        System.out.println("Resetting goals for students who had tuition on " + yesterdayText + "...");

        try {
            List<Student> studentsWithYesterdayTuition = studentRepository.findAllByTuitionDay(yesterdayText);

            List<String> studentIds = studentsWithYesterdayTuition.stream()
                                                                .map(Student::getId)
                                                                .collect(Collectors.toList());

            List<Goal> goals = goalRepository.findByStudentIdIn(studentIds);

            goals.forEach(Goal::weeklyReset);
            goalRepository.saveAll(goals);

        } catch (Exception e) {
            System.out.println("Error doing goal reset for " + yesterdayText + ": " + e.getMessage());
            e.printStackTrace();
        }


    }
}
