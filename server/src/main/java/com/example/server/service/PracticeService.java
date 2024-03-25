package com.example.server.service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.GoalRepository;
import com.example.server.dao.PointsLogRepository;
import com.example.server.dao.PracticeRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.entity.Goal;
import com.example.server.entity.PointsLog;
import com.example.server.entity.Practice;
import com.example.server.entity.Student;
import com.example.server.models.CreatePracticeDTO;

@Service
public class PracticeService {
    
    @Autowired
    private PracticeRepository practiceRepository;

    @Autowired
    private CloudStorageService cloudStorageService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PointsLogRepository pointsLogRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Practice createPractice(CreatePracticeDTO practiceDTO, MultipartFile video) {
        try {
            String videoURL = cloudStorageService.uploadFileToGCS(video, "practice");
            String studentId = practiceDTO.getStudentId();
            String studentName = practiceDTO.getStudentName();
            String teacherId = practiceDTO.getTeacherId();
            String teacherName = practiceDTO.getTeacherName();
            String title = practiceDTO.getTitle();
            String comment = practiceDTO.getComment();
            Practice createdPractice = new Practice(studentId, studentName, teacherId, teacherName, videoURL, title,
                    comment,null,null, new Date());

            Date timestamp = new Date();
            createdPractice.setSubmissionTimestamp(timestamp);
            practiceRepository.save(createdPractice);

            notificationService.sendNotification(
                "Teacher",
                String.format("%s Practice Upload", studentName),
                String.format("%s has uploaded a practice log. You can start reviewing it and give feedback!", studentName),
                teacherId
            );

            return createdPractice;
        } catch (RuntimeException e) {
            if (e.getMessage() != null || e.getMessage() != "") {
                throw new RuntimeException("Error creating new practice: " + e.getMessage());
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create practice: " + e.getMessage());
        }
        
    }
    
    public List<Practice> findPracticeByStudentId(String studentId) {
        try {
            List<Practice> practices = practiceRepository.findByStudentId(studentId);
            if (practices.isEmpty() || practices == null) {
                throw new NoSuchElementException("No practice logs found for student ID " + studentId);
            }
            return practices;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching practice logs for student ID: " + studentId + " " + e.getMessage());
        }
    }
    
    public List<Practice> findPracticeByTeacherId(String teacherId) {
        try {
            List<Practice> practices = practiceRepository.findByTeacherId(teacherId);
            System.out.println(practices);
            if (practices.isEmpty() || practices == null) {
                throw new NoSuchElementException("No practice logs found for teacher ID " + teacherId);
            }
            return practices;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching practice logs for teacher ID: " + teacherId + " " + e.getMessage());
        }
    }

    public List<Practice> findPracticeByStudentIdAndTeacherId(String studentId, String teacherId) {
        try {
            List<Practice> practices = practiceRepository.findByStudentIdAndTeacherId(studentId, teacherId);
            if (practices.isEmpty() || practices == null) {
                throw new NoSuchElementException("No practice logs found for student ID " + studentId + " and teacher ID " + teacherId);
            }
            return practices;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching practice logs for student ID: " + studentId + " and teacher ID: " + teacherId + " " + e.getMessage());
        }
    }

    @Transactional
    public Practice updatePractice(String practiceId, String teacherFeedback, Integer points, MultipartFile video) {
        try {
            Practice practice = practiceRepository.findById(practiceId).orElseThrow(()->
                new NoSuchElementException("No practice log found with the ID " + practiceId));

            if (video != null && !video.isEmpty()) {;
                String videoURL = cloudStorageService.uploadFileToGCS(video, "practice");
                practice.setFeedbackLinks(videoURL);
            } 
            
            if (teacherFeedback == null || teacherFeedback == "") {
                throw new IllegalArgumentException("Teacher feedback cannot be empty");
            }
            practice.setFeedback(teacherFeedback);

            if (points <= 0) {
                throw new IllegalArgumentException("Points should be greater than zero");
            }

            practice.setPoints(points);
            studentRepository.findById(practice.getStudentId()).ifPresent(student -> {
                student.addPoints(points);
                studentRepository.save(student);
            });

            Date timestamp = new Date();
            practice.setFeedbackTimestamp(timestamp);

            practiceRepository.save(practice);

            // Add points log for submitting practice
            String pointsLogDescription = "Finished " + practice.getTitle() + " practice";
            PointsLog newPointsLog = new PointsLog(practice.getStudentId(), pointsLogDescription, points);
            pointsLogRepository.save(newPointsLog);

            // TODO: Check with goals and add points if goal is finished
            String studentId = practice.getStudentId();
            Student student = studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("No student found with the ID " + studentId));
            student.addPoints(points);
            Goal goal = goalRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Goal not found with student ID " + studentId));
            goal.finishPractice();
            if (goal.getStatus().equals("Done") && !goal.isPointsReceived()) {
                student.addPoints(goal.getPoints());
                goal.setPointsReceived(true);
                String pointsLogDescription2 = "Finished weekly goal";
                PointsLog newPointsLog2 = new PointsLog(studentId, pointsLogDescription2, goal.getPoints());
                pointsLogRepository.save(newPointsLog2);
            }
            goalRepository.save(goal);
            studentRepository.save(student);

            notificationService.sendNotification(
                "Student", 
                String.format("Practice %s feedback"), 
                String.format("Your practice %s has been reviewed and marked. Check out the feedback :)"),
                studentId);

            return practice;
        } catch (NoSuchElementException e) {
            throw e;

        } catch (RuntimeException e) {
            if (e.getMessage() != null || e.getMessage() != "") {
                throw new RuntimeException("Error updating practice log: " + e.getMessage());
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update practice log: " + e.getMessage());
        }
    }

    @Transactional
    public void deletePractice(String practiceId) {
        try {
            Practice practice = practiceRepository.findById(practiceId).orElseThrow(()->
                new NoSuchElementException("No practice log found with the ID " + practiceId));
            practiceRepository.deleteById(practiceId);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting practice log: " + e.getMessage());
        }
    }
}
