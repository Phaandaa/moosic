package com.example.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.WritableResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CloudStorageService {

    private String gcsBucket;
    
    private final ResourceLoader resourceLoader;

    @Autowired
    public CloudStorageService(ResourceLoader resourceLoader, @Value("${gcs-bucket}") String gcsBucket) {
        this.resourceLoader = resourceLoader;
        this.gcsBucket = gcsBucket;
    }

    public String uploadFileToGCS(MultipartFile file, String bucketSegment) {
        try {
            String fileModifiedName = file.getOriginalFilename().replace(" ", "_");
            String objectName = bucketSegment + "/" + UUID.randomUUID() + "_" + fileModifiedName;
            WritableResource resource = (WritableResource) resourceLoader.getResource("gs://" + gcsBucket + "/" + objectName);
    
            try (OutputStream os = resource.getOutputStream()) {
                os.write(file.getBytes());
            }
            String fileURL = "https://storage.googleapis.com/" + gcsBucket + "/" + objectName;
            return fileURL;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to Google Cloud Storage: " + e.getMessage());
        }
    }

    public List<String> uploadFilesToGCS(List<MultipartFile> files, String bucketSegment) {
        List<String> fileNames = new ArrayList<>();
        for (MultipartFile file : files) {
            String fileName = uploadFileToGCS(file, bucketSegment);
            fileNames.add(fileName);
        }
        return fileNames;
    }
}
