package com.example.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.PurchaseHistoryRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.entity.PurchaseHistory;

@Service
public class PurchaseHistoryService {
    
    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<PurchaseHistory> findAllPurchaseHistory() {
        try {
            List<PurchaseHistory> purchaseHistories = purchaseHistoryRepository.findAllSorted();
            if (purchaseHistories.isEmpty() || purchaseHistories == null) {
                purchaseHistories = new ArrayList<>();
            }
            return purchaseHistories;            
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all purchase histories" + e.getMessage());
        }
    }

    public List<PurchaseHistory> findPurchaseHistoryByStudentId(String studentId) {
        try {
            studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            List<PurchaseHistory> purchaseHistories = purchaseHistoryRepository.findByStudentId(studentId);
            if (purchaseHistories.isEmpty() || purchaseHistories == null) {
                purchaseHistories = new ArrayList<>();
            }
            return purchaseHistories;            
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching purchase histories for student ID " + studentId + ": " + e.getMessage());
        }
    }
}
