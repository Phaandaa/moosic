package com.example.server.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.PracticeRepository;
import com.example.server.entity.Practice;
import com.example.server.models.CreatePracticeDTO;

@Service
public class PracticeService {
    
    @Autowired
    private PracticeRepository practiceRepository;

    @Autowired
    private CloudStorageService cloudStorageService;

    // TODO: do we auto rename the video name when we upload to cloud storage?

    @Transactional
    public Practice createPractice(CreatePracticeDTO practiceDTO, MultipartFile video) throws IOException {
        String videoURL = cloudStorageService.uploadFileToGCS(video);
        String studentId = practiceDTO.getStudentId();
        String studentName = practiceDTO.getStudentName();
        String teacherId = practiceDTO.getTeacherId();
        String teacherName = practiceDTO.getTeacherName();
        String title = practiceDTO.getTitle();
        String comment = practiceDTO.getComment();
        Practice createdPractice = new Practice(studentId, studentName, teacherId, teacherName, videoURL, title,
                comment,
                null);
        practiceRepository.save(createdPractice);
        return createdPractice;
    }
    
    public List<Practice> findPracticeByStudentId(String studentId) {
        try {
            return practiceRepository.findByStudentId(studentId);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching practice logs for student ID: " + studentId + " " + e.getMessage(), e);
        }
    }
    
    public List<Practice> findPracticeByTeacherId(String teacherId) {
        try {
            return practiceRepository.findByTeacherId(teacherId);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching practice logs for teacher ID: " + teacherId + " " + e.getMessage(), e);
        }
    }
}
