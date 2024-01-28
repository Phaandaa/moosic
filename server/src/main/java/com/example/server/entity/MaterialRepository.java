package com.example.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "material_repository")
public class MaterialRepository {
    @Id
    private String materialId;
    private String title;
    private String description;
    private String fileLink;
    private String status; // Pending, Approved, Rejected
    private String reasonForStatus;
    private String teacherId;
    private String teacherName;


    public MaterialRepository(String title, String description, String fileLink, String status, String reasonForStatus,
            String teacherId, String teacherName) {
        this.title = title;
        this.description = description;
        this.fileLink = fileLink;
        this.status = status;
        this.reasonForStatus = reasonForStatus;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
    }


    @Override
    public String toString() {
        return "MaterialRepository [materialId=" + materialId + ", title=" + title + ", description=" + description
                + ", fileLink=" + fileLink + ", status=" + status + ", reasonForStatus=" + reasonForStatus
                + ", teacherId=" + teacherId + ", teacherName=" + teacherName + "]";
    }

    
    
}
