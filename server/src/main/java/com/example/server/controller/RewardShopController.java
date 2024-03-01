package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.entity.RewardShop;
import com.example.server.models.RewardShopItemDTO;
import com.example.server.service.RewardShopService;

import io.swagger.v3.oas.annotations.Operation;
// TODO: Student transactions, consisting of purchase history rewards shop amnd inventory entity
@RestController
@CrossOrigin
@RequestMapping("/reward-shop")
public class RewardShopController {
    @Autowired RewardShopService rewardShopService;
    
    @Operation(summary = "Get all items in reward shop")
    @GetMapping
    public ResponseEntity<List<RewardShop>> getAllRewardShopItem() {
        return ResponseEntity.ok(rewardShopService.getAllRewardShopItem());
    }

    @Operation(summary = "Get item in reward shop by item ID")
    @GetMapping("/{itemId}")
    public ResponseEntity<RewardShop> getRewardShopItemById(@PathVariable String itemId) {
        RewardShop rewardShopItem = rewardShopService.getRewardShopItemById(itemId);
        return ResponseEntity.ok(rewardShopItem);
    }

    // delete item 
    @Operation(summary = "Delete item in reward shop by item ID")
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteRewardShopItemById(@PathVariable String itemId) {
        return ResponseEntity.ok(rewardShopService.deleteRewardShopItemById(itemId));
    }

    // add new item
    @Operation(summary = "Create new reward shop item with image")
    @PostMapping(path = "/create/with-image", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createRewardShopItem(
            @RequestPart("reward-shop-item") RewardShopItemDTO rewardShopItemDTO,
            @RequestPart("files") MultipartFile file) {
        return ResponseEntity.ok(rewardShopService.addNewRewardShopItem(rewardShopItemDTO, file));
    }

    @Operation(summary = "Create new reward shop item without image")
    @PostMapping("/create/without-image")
    public ResponseEntity<?> createRewardShopItemWithoutPic(@RequestBody RewardShopItemDTO rewardShopItemDTO) {
        return ResponseEntity.ok(rewardShopService.addNewRewardShopItemWithoutPic(rewardShopItemDTO));
    }

    // update item
    @Operation(summary = "Update reward shop item")
    @PutMapping("/{itemId}")
    public ResponseEntity<String> updateRewardShopItemById(
        @PathVariable String itemId,
        @RequestBody RewardShopItemDTO rewardShopItem) {
        return ResponseEntity.ok(rewardShopService.updateRewardShopItemById(itemId, rewardShopItem));
    }

    // update image of item
    @Operation(summary = "Update image for reward shop item")
    @PutMapping(path = "/image-update/{itemId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<RewardShop> updateRewardShopItemImage(
        @PathVariable String itemId,
        @RequestParam("image") MultipartFile file) {
            return ResponseEntity.ok(rewardShopService.updateRewardShopItemImage(itemId, file));
    }

}

