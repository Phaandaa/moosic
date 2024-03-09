package com.example.server.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RewardShopItemDTO {
    private String description;
    private Integer points;
    private Integer stock;
    private Integer limitation;
    private String type;
    private String subType;
}
