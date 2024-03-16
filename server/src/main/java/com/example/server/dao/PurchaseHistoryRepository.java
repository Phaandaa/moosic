package com.example.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.PurchaseHistory;
import java.util.List;

public interface PurchaseHistoryRepository extends MongoRepository<PurchaseHistory, String> {

    @Query(value = "{ 'studentId' : ?0 }", sort = "{ 'creation_time' : -1 }")
    public List<PurchaseHistory> findByStudentId(String studentId);
    
    @Query(value = "{}", sort = "{ 'creation_time' : -1 }")
    public List<PurchaseHistory> findAllSorted();

    @Query(value = "{ 'studentId' : ?0, 'itemId' : ?1 }", sort = "{ 'creation_time' : -1 }")
    public List<PurchaseHistory> findByStudentIdAndItemId(String studentId, String itemId);
}
