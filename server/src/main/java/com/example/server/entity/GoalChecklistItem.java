package com.example.server.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoalChecklistItem {
    private String goalChecklistItemKey;
    private String description;
    private String status;
}