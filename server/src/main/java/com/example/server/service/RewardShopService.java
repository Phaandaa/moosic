package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.RewardShopRepository;
import com.example.server.entity.RewardShop;
import com.example.server.models.RewardShopItemDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RewardShopService {
    
    @Autowired
    private RewardShopRepository rewardShopRepository;

    @Autowired
    private CloudStorageService cloudStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    public List<RewardShop> getAllRewardShopItem() {
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

    public RewardShop getRewardShopItemById(String id) {
        try {
            return rewardShopRepository.findById(id).orElseThrow(()->
                new NoSuchElementException("Shop item not found with the ID " + id));
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching shop item ID " + id + ": " + e.getMessage());
        }
    }

    public String deleteRewardShopItemById(String id) {
        try {
            rewardShopRepository.findById(id).orElseThrow(()->
                new NoSuchElementException("Reward Shop item not found with the ID " + id));
            rewardShopRepository.deleteById(id);
            return "Reward Shop item deleted successfully";
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error deleting Reward Shop item with ID: " + id + " " + e.getMessage());
        }
    }

    public String addNewRewardShopItem(String rewardShopItemJSON, MultipartFile file) {
        try {
            RewardShopItemDTO rewardShopItemDTO = objectMapper.readValue(rewardShopItemJSON, RewardShopItemDTO.class);
            String imageURL = cloudStorageService.uploadFileToGCS(file, "shop");
            String description = rewardShopItemDTO.getDescription();
            Integer points = rewardShopItemDTO.getPoints();
            Integer stock = rewardShopItemDTO.getStock();
            Integer limiation = rewardShopItemDTO.getLimitation();
            String type = rewardShopItemDTO.getType();
            RewardShop createdRewardShopItem = new RewardShop(description, points, stock, limiation, imageURL, type);
            rewardShopRepository.save(createdRewardShopItem);
            return "Create new item in reward shop successfully";
        } catch (RuntimeException e) {
            throw new RuntimeException("Error creating item in reward shop: " + e.getMessage());
        } catch (JsonMappingException e) {
            throw new IllegalArgumentException("Error creating item in reward shop: Failed to map JSON payload request: " + e.getMessage());
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error creating item in reward shop: Failed to map JSON payload request: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create item in reward shop: " + e.getMessage());
        }
    }

    public String addNewRewardShopItemWithoutPic(RewardShopItemDTO rewardShopItemDTO) {
        try {
            String description = rewardShopItemDTO.getDescription();
            Integer points = rewardShopItemDTO.getPoints();
            Integer stock = rewardShopItemDTO.getStock();
            Integer limiation = rewardShopItemDTO.getLimitation();
            String type = rewardShopItemDTO.getType();
            RewardShop createdRewardShopItem = new RewardShop(description, points, stock, limiation, null, type);
            rewardShopRepository.save(createdRewardShopItem);
            return "Create new item in reward shop successfully";
        } catch (RuntimeException e) {
            throw new RuntimeException("Error creating item in reward shop: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create item in reward shop: " + e.getMessage());
        }
    }

    public String updateRewardShopItemById(String id, RewardShopItemDTO rewardShopItemDTO) {
        try {
            RewardShop rewardShopItem = rewardShopRepository.findById(id).orElseThrow(()->
                new NoSuchElementException("Reward Shop item not found with the ID " + id));
            String description = rewardShopItemDTO.getDescription();
            Integer points = rewardShopItemDTO.getPoints();
            Integer stock = rewardShopItemDTO.getStock();
            Integer limitation = rewardShopItemDTO.getLimitation();
            String type = rewardShopItem.getType();
            rewardShopItem.setDescription(description);
            rewardShopItem.setPoints(points);
            rewardShopItem.setStock(stock);
            rewardShopItem.setLimitation(limitation);
            rewardShopItem.setType(type);
            rewardShopRepository.save(rewardShopItem);
            return "Reward Shop item updated successfully";
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating Reward Shop item with ID: "  + ": " + e.getMessage());
        }
    }

    // update image of reward item
    public RewardShop updateRewardShopItemImage(String id, MultipartFile file){
        try {
            RewardShop rewardShopItem = rewardShopRepository.findById(id).orElseThrow(()->
                new NoSuchElementException("Reward Shop item not found with the ID " + id));
            String newImageURL = cloudStorageService.uploadFileToGCS(file, "shop");
            rewardShopItem.setImageLink(newImageURL);
            rewardShopRepository.save(rewardShopItem);
            return rewardShopItem;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RuntimeException("Error creating item in reward shop: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create item in reward shop: " + e.getMessage());
        }
    }

    // TODO: verify purchase from admin side, requires inventory entity

}

