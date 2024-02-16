package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.server.dao.PurchaseHistoryRepository;
import com.example.server.entity.PurchaseHistory;

public class PurchaseHistoryService {
    
    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    public List<PurchaseHistory> findAllPurchaseHistory() {
        try {
            List<PurchaseHistory> purchaseHistories = purchaseHistoryRepository.findAll();
            if (purchaseHistories.isEmpty() || purchaseHistories == null) {
                throw new NoSuchElementException("No purchase histories found");
            }
            return purchaseHistories;            
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all purchase histories");
        }
    }

    public List<PurchaseHistory> findPurchaseHistoryByStudentId(String studentId) {
        try {
            List<PurchaseHistory> purchaseHistories = purchaseHistoryRepository.findByStudentId(studentId);
            if (purchaseHistories.isEmpty() || purchaseHistories == null) {
                throw new NoSuchElementException("No purchase histories found for student ID: " + studentId);
            }
            return purchaseHistories;            
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching purchase histories for student ID: " + studentId);
        }
    }
}
