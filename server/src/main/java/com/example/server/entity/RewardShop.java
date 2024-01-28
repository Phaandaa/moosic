package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "rewards_shop")
public class RewardShop {
    @Id
    private String rewardId;
    private String description;
    private int points;
    private int availability;
    private String adminPassword;
    private int limitation;
    private String imageLink;

    public RewardShop(String description, int points, int availability, String adminPassword, int limitation,
            String imageLink) {
        this.description = description;
        this.points = points;
        this.availability = availability;
        this.adminPassword = adminPassword;
        this.limitation = limitation;
        this.imageLink = imageLink;

    
    }

    @Override
    public String toString() {
        return "RewardShop [rewardId=" + rewardId + ", description=" + description + ", points=" + points
                + ", availability=" + availability + ", adminPassword=" + adminPassword + ", limitation=" + limitation
                + ", imageLink=" + imageLink + "]";
    }

}
