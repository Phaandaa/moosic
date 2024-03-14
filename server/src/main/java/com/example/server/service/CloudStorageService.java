package com.example.server.service;

import com.google.cloud.spring.storage.GoogleStorageLocation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.WritableResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CloudStorageService {

    @Value("${gcs-bucket}")
    private String gcsBucket; // Assume gcs-bucket is defined in your application.properties as 'gs://your-bucket-name'

    public String uploadFileToGCS(MultipartFile file, String bucketSegment) {
        try {
            String objectName = bucketSegment + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            WritableResource resource = (WritableResource) resourceLoader.getResource("gs://" + gcsBucket + "/" + objectName);
    
            try (OutputStream os = resource.getOutputStream()) {
                os.write(file.getBytes());
            }
    
            return objectName;
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
