package com.example.server.service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.PracticeRepository;
import com.example.server.dao.StudentRepository;
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

    // TODO: do we auto rename the video name when we upload to cloud storage?

    @Transactional
    public Practice createPractice(CreatePracticeDTO practiceDTO, MultipartFile video) {
        try {
            String videoURL = cloudStorageService.uploadFileToGCS(video, "preactice");
            String studentId = practiceDTO.getStudentId();
            String studentName = practiceDTO.getStudentName();
            String teacherId = practiceDTO.getTeacherId();
            String teacherName = practiceDTO.getTeacherName();
            String title = practiceDTO.getTitle();
            String comment = practiceDTO.getComment();
            Practice createdPractice = new Practice(studentId, studentName, teacherId, teacherName, videoURL, title,
                    comment,null,null);

            Date timestamp = new Date();
            createdPractice.setSubmissionTimestamp(timestamp);
            practiceRepository.save(createdPractice);
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

    public Practice updatePractice(String practiceId, String teacherFeedback, Integer points, MultipartFile video) {
        try {
            Practice practice = practiceRepository.findById(practiceId).orElseThrow(()->
                new NoSuchElementException("No practice log found with the ID " + practiceId));

            if (video != null && !video.isEmpty()) {;
                String videoURL = cloudStorageService.uploadFileToGCS(video, "preactice");
                practice.setFeedbackLinks(videoURL);
            } else {
                throw new IllegalArgumentException("Please updload files to submit assignment");
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
            practice.setSubmissionTimestamp(timestamp);

            practiceRepository.save(practice);
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
}
