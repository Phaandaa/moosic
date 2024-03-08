package com.example.server.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "student_inventory")
public class StudentInventory {
    @Id
    private String id;

    @Field(name = "student_id")
    private String studentId;

    @Field(name = "owned_avatar_list")
    private List<String> ownedAvatarList;

    @Field (name = "owned_badge_list")
    private List<String> ownedBadgeList;

    public StudentInventory() {

    }

    public StudentInventory(String studentId, List<String> ownedAvatarList, List<String> ownedBadgeList) {
        this.studentId = studentId;
        this.ownedAvatarList = ownedAvatarList;
        this.ownedBadgeList = ownedBadgeList;
    }

    @Override
    public String toString() {
        return "StudentInventory [id=" + id + ", studentId=" + studentId + ", ownedAvatarList=" + ownedAvatarList
                + ", ownedBadgeList=" + ownedBadgeList + "]";
    }
    
}
