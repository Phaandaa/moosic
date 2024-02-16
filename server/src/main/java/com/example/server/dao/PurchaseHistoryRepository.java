package com.example.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.PurchaseHistory;

public interface PurchaseHistoryRepository extends MongoRepository<PurchaseHistory, String> {
    
}
