package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.PointsLogRepository;
import com.example.server.entity.PointsLog;

@Service
public class PointsLogService {
    
    @Autowired
    private PointsLogRepository pointsLogRepository;

    // get points log by student 
    public List<PointsLog> getPointsLogByStudent(String studentId) {
        try {
            List<PointsLog> pointsLogs = pointsLogRepository.findByStudentId(studentId);
            if (pointsLogs.isEmpty() || pointsLogs == null) {
                throw new NoSuchElementException("No points logs found for student ID " + studentId);
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
