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
@Document(collection = "rewards_shop")
public class RewardShop {
    @Id
    private String id;

    @Field(name = "description")
    private String description;

    @Field(name = "description")
    private Integer points;

    @Field(name = "availability")
    private Integer availability;

    @Field(name = "admin_password")
    private String adminPassword;

    @Field(name = "limitation")
    private Integer limitation;

    @Field(name = "image_link")
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
        return "RewardShop [rewardId=" + id + ", description=" + description + ", points=" + points
                + ", availability=" + availability + ", adminPassword=" + adminPassword + ", limitation=" + limitation
                + ", imageLink=" + imageLink + "]";
    }

}
