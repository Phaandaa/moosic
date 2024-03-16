package com.example.server.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.server.entity.RewardShop;

public interface RewardShopRepository extends MongoRepository<RewardShop, String> {
    
    @Query(value = "{}", sort = "{ 'creation_time' : -1 }")
    public List<RewardShop> findAllSortedByCreationTime();

    public Optional<RewardShop> findById(String id);

    @Query(value = "{ 'subtype' : ?0 }", sort = "{ 'creation_time' : -1 }")
    public List<RewardShop> findBySubtype(String Subtype);
}
