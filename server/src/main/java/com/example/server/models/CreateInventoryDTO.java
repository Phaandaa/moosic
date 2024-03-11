package com.example.server.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateInventoryDTO {
    
    @JsonProperty("student_id")
    private String studentId;

    @JsonProperty("owned_avatar_list")
    private List<String> ownedAvatarList;

    @JsonProperty("owned_badge_list")
    private List<String> ownedBadgeList;

    @JsonProperty("owned_frame_list")
    private List<String> ownedFrameList;
}
