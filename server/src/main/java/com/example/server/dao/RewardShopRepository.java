package com.example.server.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.RewardShop;

public interface RewardShopRepository extends MongoRepository<RewardShop, String> {
    
    public List<RewardShop> findAll();

    public Optional<RewardShop> findById(String id);

    public List<RewardShop> findBySubtype(String Subtype);

    @Aggregation("{ '$group': { '_id': '$subtype' } }")
    List<SubtypeProjection> findDistinctSubtypes();

    interface SubtypeProjection {
        String get_id();
    }
}
