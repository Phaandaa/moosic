package com.example.server.entity;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "purchase_history")
public class PurchaseHistory {
    @Id
    private String id;

    @Field(name = "student_id")
    private String studentId;

    @Field(name = "student_name")
    private String studentName;

    @Field(name = "item_id")
    private String itemId; // reference to reward shop

    @Field(name = "purchase_amount")
    private Integer purchaseAmount;

    @Field(name = "total_price")
    private int totalPrice;

    @Field(name = "puchase_date")
    private String purchaseDate;

    @Field(name = "creation_time")
    private Date creationTime;

    public PurchaseHistory(String studentId, String studentName, String itemId, Integer purchaseAmount,
            Integer totalPrice) {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd yyyy");
        Date currentDate = new Date();
        String formattedDate = sdf.format(currentDate);
        this.studentId = studentId;
        this.studentName = studentName;
        this.itemId = itemId;
        this.purchaseAmount = purchaseAmount;
        this.totalPrice = totalPrice;
        this.purchaseDate = formattedDate;
        this.creationTime = currentDate;
    }

    public static void hasExceededLimit(Integer amount, Integer limit, List<PurchaseHistory> purchaseHistories) {
        Integer purchaseCount = 0;
        for (PurchaseHistory purchaseHistory : purchaseHistories) {
            purchaseCount = purchaseCount + purchaseHistory.getPurchaseAmount();
        }
        if (purchaseCount + amount > limit) {
            throw new IllegalArgumentException("Purchase amount exceeds item purchase limitation for student");
        }
    }

    @Override
    public String toString() {
        return "PurchaseHistory [id=" + id + ", studentId=" + studentId + ", studentName=" + studentName + ", itemId="
                + itemId + ", purchaseAmount=" + purchaseAmount + ", totalPrice=" + totalPrice + ", purchaseDate="
                + purchaseDate + "]";
    }
    
}
