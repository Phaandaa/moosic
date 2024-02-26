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

import java.util.logging.Logger;


@Service
public class CloudStorageService {
    
    private Dotenv dotenv = Dotenv.load();
    private static final Logger logger = Logger.getLogger(CloudStorageService.class.getName());


    public Storage getStorage() {
        try {
            String projectId = dotenv.get("GCP_PROJECT_ID");
            GoogleCredentials credentials = GoogleCredentials
                    .fromStream(getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json"));
            Storage storage = StorageOptions.newBuilder()
                    .setProjectId(projectId)
                    .setCredentials(credentials)
                    .build()
                    .getService();

            return storage;
        } catch (IOException e) {
            throw new RuntimeException("Failed to load service account key.json");
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to Google Cloud Storage");
        }
       
    }

    public List<String> uploadFilesToGCS(List<MultipartFile> files) {
        try {
            logger.info("Starting file upload process to Google Cloud Storage...");
            List<String> publicUrls = new ArrayList<>();
            String bucketName = dotenv.get("GCS_BUCKET_NAME");

            Storage storage = getStorage();
            for (MultipartFile file : files) {
                String objectName = "assignments/" + file.getOriginalFilename();
                BlobId blobId = BlobId.of(bucketName, objectName);
                BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                        .setContentType(file.getContentType())
                        .build();

                byte[] content = file.getBytes();
                storage.createFrom(blobInfo, new ByteArrayInputStream(content));

                String publicUrl = "https://storage.googleapis.com/" + bucketName + "/" + objectName;
                publicUrls.add(publicUrl);
            }
            logger.info("File upload process completed successfully.");
            return publicUrls;
        } catch (Exception e) {
            logger.severe("Failed to upload files to Google Cloud Storage: " + e.getMessage());
            throw new RuntimeException("Failed to upload files to Google Cloud Storage");
        }
        
    }
    
    public String uploadFileToGCS(MultipartFile file) {
        try {
            String bucketName = dotenv.get("GCS_BUCKET_NAME");

            Storage storage = getStorage();
            String objectName = "practice/" + file.getOriginalFilename();
            BlobId blobId = BlobId.of(bucketName, objectName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(file.getContentType())
                    .build();

            byte[] content = file.getBytes();
            storage.createFrom(blobInfo, new ByteArrayInputStream(content));

            String publicUrl = "https://storage.googleapis.com/" + bucketName + "/" + objectName;
            return publicUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to get bucket name for Google Cloud Storage");
        } catch (Exception e) {
            logger.severe("Failed to upload files to Google Cloud Storage: " + e.getMessage());
            throw new RuntimeException("Failed to upload file to Google Cloud Storage");
        }
        
    }
} 
