package com.example.server.dao;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.server.entity.RewardShop;

public interface RewardShopRepository extends MongoRepository<RewardShop, String> {
    
}
