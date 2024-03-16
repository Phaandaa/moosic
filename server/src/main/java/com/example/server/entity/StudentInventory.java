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

    @Field (name = "owned_frame_list")
    private List<String> ownedFrameList;

    public StudentInventory() {

    }

    public StudentInventory(String studentId, List<String> ownedAvatarList, List<String> ownedBadgeList, List<String> ownedFrameList) {
        this.studentId = studentId;
        this.ownedAvatarList = ownedAvatarList;
        this.ownedBadgeList = ownedBadgeList;
        this.ownedFrameList = ownedFrameList;
    }

    public void addInventoryItem(String subtype, String imageURL) {
        switch (subtype) {
            case "avatar":
                ownedAvatarList.add(imageURL);
                break;
            case "badge":
                ownedBadgeList.add(imageURL);
                break;
            case "frame":
                ownedFrameList.add(imageURL);
                break;
            default:
                throw new IllegalArgumentException("Subtype is not valid");
        }
    }

    @Override
    public String toString() {
        return "StudentInventory [id=" + id + ", studentId=" + studentId + ", ownedAvatarList=" + ownedAvatarList
                + ", ownedBadgeList=" + ownedBadgeList + ", ownedFrameList=" + ownedFrameList + "]";
    }


    
}
