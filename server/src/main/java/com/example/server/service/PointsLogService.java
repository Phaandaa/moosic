package com.example.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.PointsLogRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.entity.PointsLog;

@Service
public class PointsLogService {
    
    @Autowired
    private PointsLogRepository pointsLogRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<PointsLog> getPointsLogByStudent(String studentId) {
        try {
            studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            List<PointsLog> pointsLogs = pointsLogRepository.findByStudentId(studentId);
            if (pointsLogs.isEmpty() || pointsLogs == null) {
                return new ArrayList<>();
            }
            return pointsLogs;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching points logs for student ID: " + studentId + " " + e.getMessage());
        }
    }
}
