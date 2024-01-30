package com.example.server.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import io.github.cdimascio.dotenv.Dotenv;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CloudStorageService {
    
    private Dotenv dotenv = Dotenv.load();

    public Storage getStorage() throws IOException {
        String projectId = dotenv.get("GCP_PROJECT_ID");
        GoogleCredentials credentials = GoogleCredentials
                .fromStream(getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json"));
        Storage storage = StorageOptions.newBuilder()
                .setProjectId(projectId)
                .setCredentials(credentials)
                .build()
                .getService();
        
        return storage;
    }

    public List<String> uploadFileToGCS(List<MultipartFile> files) throws IOException { 
        List<String> publicUrls = new ArrayList<>();
        String bucketName = dotenv.get("GCS_BUCKET_NAME");

        Storage storage = getStorage();
        for (MultipartFile file : files) {
            String objectName = "assignments/" + file.getOriginalFilename();
            BlobId blobId = BlobId.of(bucketName, objectName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(file.getContentType())
                    .build();

            // Upload the file to Google Cloud Storage
            byte[] content = file.getBytes();
            storage.createFrom(blobInfo, new ByteArrayInputStream(content));

            // Generate the public URL
            String publicUrl = "https://storage.googleapis.com/" + bucketName + "/" + objectName;
            publicUrls.add(publicUrl);
        }
        return publicUrls;
    }
} 
