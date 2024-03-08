package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.StudentInventoryRepository;
import com.example.server.entity.StudentInventory;
import com.example.server.models.CreateInventoryDTO;

@Service
public class StudentInventoryService {
    
    @Autowired
    private StudentInventoryRepository studentInventoryRepository;

    public StudentInventory getStudentInventoryByStudentId(String studentId) {
        try {
            return studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }

    public StudentInventory createStudentInventory(CreateInventoryDTO CreateInventoryDTO) {
        try {
            String studentId = CreateInventoryDTO.getStudentId();
            List<String> ownedAvatarList = CreateInventoryDTO.getOwnedAvatarList();
            List<String> ownedBadgeList = CreateInventoryDTO.getOwnedBadgeList();

            StudentInventory studentInventory = new StudentInventory(studentId, ownedAvatarList, ownedBadgeList);
            studentInventoryRepository.save(studentInventory);
            return studentInventory;
        } catch (RuntimeException e) {
            if (e.getMessage() != null || e.getMessage() != "") {
                throw new RuntimeException("Error creating new student inventory: " + e.getMessage());
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create student inventory: " + e.getMessage());
        }
    }

    
}
