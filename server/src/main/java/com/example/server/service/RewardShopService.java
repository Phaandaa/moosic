package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.RewardShopRepository;
import com.example.server.entity.RewardShop;

@Service
public class RewardShopService {
    
    @Autowired
    private RewardShopRepository rewardShopRepository;

    public List<RewardShop> findAllRewardShop() {
        try {
            List<RewardShop> items = rewardShopRepository.findAll();
            if (items.isEmpty() || items == null) {
                throw new NoSuchElementException("No items found in shop currently ");
            }
            return items;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching items in shop: " + e.getMessage());
        }
    }

    public RewardShop findRewardShopById(String id) {
        try {
            return rewardShopRepository.findById(id).orElseThrow(()->
                new NoSuchElementException("Shop item not found with the ID " + id));
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching shop item ID " + id + ": " + e.getMessage());
        }
    }
}
