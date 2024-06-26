package com.example.server.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.PointsLogRepository;
import com.example.server.dao.PurchaseHistoryRepository;
import com.example.server.dao.RewardShopRepository;
import com.example.server.dao.StudentInventoryRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.entity.PointsLog;
import com.example.server.entity.PurchaseHistory;
import com.example.server.entity.RewardShop;
import com.example.server.entity.Student;
import com.example.server.entity.StudentInventory;
import com.example.server.models.RewardShopItemDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RewardShopService {
    
    @Autowired
    private RewardShopRepository rewardShopRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PointsLogRepository pointsLogRepository;

    @Autowired
    private StudentInventoryRepository studentInventoryRepository;
    
    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Autowired
    private CloudStorageService cloudStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    public List<RewardShop> getAllRewardShopItem() {
        try {
            List<RewardShop> items = rewardShopRepository.findAll();
            if (items.isEmpty() || items == null) {
                items = new ArrayList<>();
            }
            return items;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching items in shop: " + e.getMessage());
        }
    }

    // get subtypes of reward shop
    public List<String> getRewardShopSubtypes() {
        List<RewardShop> items = rewardShopRepository.findAll();
        Set <String> subtypes = items.stream()
                                    .map(RewardShop::getSubtype)
                                    .filter(Objects::nonNull)
                                    .collect(Collectors.toSet());
        return new ArrayList<>(subtypes);
    }
        

    // get reward shop item by subtype
    public List<RewardShop> getRewardShopItemBySubtype(String type) {
        try {
            List<RewardShop> items = rewardShopRepository.findBySubtype(type);
            if (items.isEmpty() || items == null) {
                items = new ArrayList<>();
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

    public RewardShop addNewRewardShopItem(String rewardShopItemJSON, MultipartFile file) {
        try {
            RewardShopItemDTO rewardShopItemDTO = objectMapper.readValue(rewardShopItemJSON, RewardShopItemDTO.class);
            String imageURL = cloudStorageService.uploadFileToGCS(file, "shop");
            String description = rewardShopItemDTO.getDescription();
            Integer points = rewardShopItemDTO.getPoints();
            Integer stock = rewardShopItemDTO.getStock();
            Integer limiation = rewardShopItemDTO.getLimitation();
            String Subtype = rewardShopItemDTO.getSubtype();
            String type = rewardShopItemDTO.getType();
            RewardShop createdRewardShopItem = new RewardShop(description, points, stock, limiation, imageURL, type, Subtype, new Date());
            rewardShopRepository.save(createdRewardShopItem);
            return createdRewardShopItem;
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

    public RewardShop addNewRewardShopItemWithoutPic(RewardShopItemDTO rewardShopItemDTO) {
        try {
            String description = rewardShopItemDTO.getDescription();
            Integer points = rewardShopItemDTO.getPoints();
            Integer stock = rewardShopItemDTO.getStock();
            Integer limiation = rewardShopItemDTO.getLimitation();
            String type = rewardShopItemDTO.getType();
            String subtype = rewardShopItemDTO.getSubtype();
            RewardShop createdRewardShopItem = new RewardShop(description, points, stock, limiation, null, type, subtype, new Date());
            rewardShopRepository.save(createdRewardShopItem);
            return createdRewardShopItem;
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
            String subtype = rewardShopItem.getSubtype();
            rewardShopItem.setDescription(description);
            rewardShopItem.setPoints(points);
            rewardShopItem.setStock(stock);
            rewardShopItem.setLimitation(limitation);
            rewardShopItem.setType(type);
            rewardShopItem.setSubtype(subtype);
            rewardShopRepository.save(rewardShopItem);
            return "Reward Shop item updated successfully";
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating Reward Shop item with ID: "  + ": " + e.getMessage());
        }
    }

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

    @Transactional
    public RewardShop verifyPhysicalPurchase(String id, String studentId, Integer purchaseAmount) {
        try {          
            RewardShop rewardShopItem = rewardShopRepository.findById(id).orElseThrow(()->
                new NoSuchElementException("Reward Shop item not found with the ID " + id));

            Integer itemLimitCount = rewardShopItem.getLimitation();
            List<PurchaseHistory> studentPurchaseHistories = purchaseHistoryRepository.findByStudentIdAndItemId(studentId, id);
            PurchaseHistory.hasExceededLimit(purchaseAmount, itemLimitCount, studentPurchaseHistories);

            rewardShopItem.deductStock(purchaseAmount);
            rewardShopRepository.save(rewardShopItem);

            Student student = studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + id));
            Integer totalPrice = rewardShopItem.getPoints() * purchaseAmount;
            student.deductPoints(totalPrice);
            studentRepository.save(student);

            String pointsLogDesc = "Bought " + rewardShopItem.getDescription() + " from shop";
            PointsLog pointsLog = new PointsLog(studentId, pointsLogDesc, -totalPrice);
            pointsLogRepository.save(pointsLog);

            PurchaseHistory purchaseHistory = new PurchaseHistory(
                studentId, 
                student.getName(), 
                rewardShopItem.getId(), 
                purchaseAmount, 
                totalPrice);
            purchaseHistoryRepository.save(purchaseHistory);
            
            return rewardShopItem;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RuntimeException("Error verifying physical purchase: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify physical purchase: " + e.getMessage());
        }
    }

    @Transactional
    public RewardShop verifyDigitalPurchase(String id, String studentId, Integer purchaseAmount) {
        try {          
            if (!purchaseAmount.equals(1)) {
                throw new IllegalArgumentException("Digital Item purchase amount should only be 1");
            }
            RewardShop rewardShopItem = rewardShopRepository.findById(id).orElseThrow(()->
                new NoSuchElementException("Reward Shop item not found with the ID " + id));

            Integer itemLimitCount = rewardShopItem.getLimitation();
            List<PurchaseHistory> studentPurchaseHistories = purchaseHistoryRepository.findByStudentIdAndItemId(studentId, id);
            PurchaseHistory.hasExceededLimit(purchaseAmount, itemLimitCount, studentPurchaseHistories);

            rewardShopItem.deductStock(purchaseAmount);
            rewardShopRepository.save(rewardShopItem);

            Student student = studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            Integer totalPrice = rewardShopItem.getPoints();
            student.deductPoints(totalPrice);
            studentRepository.save(student);

            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student Inventory not found for student ID " + studentId));
            studentInventory.addInventoryItem(rewardShopItem.getSubtype(), rewardShopItem.getImageLink());
            System.out.println("Here is the item bought:" + rewardShopItem.getImageLink());
            studentInventoryRepository.save(studentInventory);

            // tambahin points log murid
            String pointsLogDesc = "Bought " + rewardShopItem.getDescription() + " from shop";
            PointsLog pointsLog = new PointsLog(studentId, pointsLogDesc, -totalPrice);
            pointsLogRepository.save(pointsLog);

            // tambahin purchase history murid 
            PurchaseHistory purchaseHistory = new PurchaseHistory(
                studentId, 
                student.getName(), 
                rewardShopItem.getId(), 
                purchaseAmount, 
                totalPrice);
            purchaseHistoryRepository.save(purchaseHistory);
            
            return rewardShopItem;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new RuntimeException("Error verifying physical purchase: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify physical purchase: " + e.getMessage());
        }
    }
}

