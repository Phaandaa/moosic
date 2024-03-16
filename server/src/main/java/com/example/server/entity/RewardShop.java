package com.example.server.entity;

import java.util.Date;

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
@Document(collection = "rewards_shop")
public class RewardShop {
    @Id
    private String id;

    @Field(name = "description")
    private String description;

    @Field(name = "points")
    private Integer points;

    @Field(name = "stock")
    private Integer stock;

    @Field(name = "limitation")
    private Integer limitation;

    @Field(name = "image_link")
    private String imageLink;

    @Field(name = "type")
    private String type;

    // sticker / avatar / badge / frame
    @Field(name= "subtype")
    private String subtype;

    @Field(name = "creation_time")
    private Date creationTime;

    public RewardShop(String description, Integer points, Integer stock, Integer limitation, String imageLink,
            String type, String subtype, Date creationTime) {
        this.description = description;
        this.points = points;
        this.stock = stock;
        this.limitation = limitation;
        this.imageLink = imageLink;
        this.type = type;
        this.subtype = subtype;
        this.creationTime = creationTime;
    }

    public void deductStock(Integer amount) {
        if (amount > stock) {
            throw new IllegalArgumentException("Purchase amount cannot be more than stock amount");
        }
        stock = stock - amount;
    }

    @Override
    public String toString() {
        return "RewardShop [id=" + id + ", description=" + description + ", points=" + points + ", stock=" + stock
                + ", limitation=" + limitation + ", imageLink=" + imageLink + ", type=" + type + ", subtype=" + subtype +"]";
    }

}
