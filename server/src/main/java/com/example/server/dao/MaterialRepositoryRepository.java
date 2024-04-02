package com.example.server.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.MaterialRepository;

public interface MaterialRepositoryRepository extends MongoRepository<MaterialRepository, String> {

    @Query(value = "{ 'teacherId' : ?0 }", sort = "{ 'creationTime' : -1 }")
    public List<MaterialRepository> findByTeacherId(String teacherId);

    @Query(value = "{}", sort = "{ 'creationTime' : -1 }")
    public List<MaterialRepository> findAllSortedByCreationTime();

    @Query(value = "{ 'status': 'Approved' }", sort = "{ 'creationTime' : -1 }")
    public List<MaterialRepository> findApprovedSorted();

    public MaterialRepository findById();
    
}
