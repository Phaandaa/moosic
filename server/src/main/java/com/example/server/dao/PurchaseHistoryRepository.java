package com.example.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.PurchaseHistory;
import java.util.List;

public interface PurchaseHistoryRepository extends MongoRepository<PurchaseHistory, String> {
    public List<PurchaseHistory> findByStudentId(String studentId);
    
    public List<PurchaseHistory> findAll();

    public List<PurchaseHistory> findByStudentIdAndItemId(String studentId, String itemId);
}
