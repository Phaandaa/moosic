package com.example.server.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.entity.PurchaseHistory;
import com.example.server.service.PurchaseHistoryService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/purchase-history")
public class PurchaseHistoryController {
    @Autowired
    private PurchaseHistoryService purchaseHistoryService;

    @Operation(summary = "Get all purchase history from reward shop")
    @GetMapping
    public ResponseEntity<List<PurchaseHistory>> getAllPurchaseHistory() {
        return ResponseEntity.ok(purchaseHistoryService.findAllPurchaseHistory());
    }

    @Operation(summary = "Get all purchase history by student ID")
    @GetMapping("/{studentId}")
    public ResponseEntity<List<PurchaseHistory>> getPurchaseHistoryByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(purchaseHistoryService.findPurchaseHistoryByStudentId(studentId));
    }


}
