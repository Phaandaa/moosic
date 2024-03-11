package com.example.server.entity;

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

    public PurchaseHistory(String studentId, String studentName, String itemId, Integer purchaseAmount,
            Integer totalPrice, String purchaseDate) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.itemId = itemId;
        this.purchaseAmount = purchaseAmount;
        this.totalPrice = totalPrice;
        this.purchaseDate = purchaseDate;
    }

    @Override
    public String toString() {
        return "PurchaseHistory [id=" + id + ", studentId=" + studentId + ", studentName=" + studentName + ", itemId="
                + itemId + ", purchaseAmount=" + purchaseAmount + ", totalPrice=" + totalPrice + ", purchaseDate="
                + purchaseDate + "]";
    }
    
}
