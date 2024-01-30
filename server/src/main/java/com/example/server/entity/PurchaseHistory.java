package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "purchase_history")
public class PurchaseHistory {
    @Id
    private String purchaseId;
    private String studentId;
    private String studentName;
    private String itemId; // reference to reward shop
    private int amountOfPurchase;
    private int totalPointPrice;
    private Date purchaseDate;

    public PurchaseHistory(String studentId, String studentName, String itemId, int amountOfPurchase,
            int totalPointPrice, Date purchaseDate) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.itemId = itemId;
        this.amountOfPurchase = amountOfPurchase;
        this.totalPointPrice = totalPointPrice;
        this.purchaseDate = purchaseDate;

    
    }

    @Override
    public String toString() {
        return "PurchaseHistory [purchaseId=" + purchaseId + ", studentId=" + studentId + ", studentName=" + studentName
                + ", itemId=" + itemId + ", amountOfPurchase=" + amountOfPurchase + ", totalPointPrice="
                + totalPointPrice + ", purchaseDate=" + purchaseDate + "]";
    }
    
}
