package com.example.server.service;

import com.google.cloud.WriteChannel;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import io.github.cdimascio.dotenv.Dotenv;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CloudStorageService {
    
    private Dotenv dotenv = Dotenv.load();

    public List<String> uploadFileToGCS(List<MultipartFile> files) throws IOException { 
        List<String> publicUrls = new ArrayList<>();
        // TODO: change placeholder projectId and bucketName using real values and dotenv
        String projectId = dotenv.get("GCP_PROJECT_ID");
        String bucketName = dotenv.get("GCS_BUCKET_NAME");

        Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
        for (MultipartFile file : files) {
            String objectName = "assignments/" + file.getOriginalFilename();
            BlobId blobId = BlobId.of(bucketName, objectName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setAcl(new ArrayList<>(List.of(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER))))
                    .setContentType(file.getContentType())
                    .build();

            // Upload the file to Google Cloud Storage
            byte[] content = file.getBytes();
            storage.createFrom(blobInfo, new ByteArrayInputStream(content));

            // Generate the public URL
            String publicUrl = "https://storage.googleapis.com/" + bucketName + "/" + objectName;
            publicUrls.add(publicUrl);
        }
        // for (MultipartFile file : files) {
        //     String fileName = "assignments/" + file.getOriginalFilename();
        //     BlobId blobId = BlobId.of(bucketName, fileName);
        //     BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
        //             .setAcl(new ArrayList<>(List.of(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER))))
        //             .setContentType(file.getContentType())
        //             .build();

        //     try (WriteChannel writer = storage.writer(blobInfo)) {
        //         // Use a channel writer to stream the data from the file.
        //         byte[] buffer = new byte[1024];
        //         try (InputStream inputStream = file.getInputStream()) {
        //             int limit;
        //             while ((limit = inputStream.read(buffer)) >= 0) {
        //                 writer.write(ByteBuffer.wrap(buffer, 0, limit));
        //             }
        //         }
        //     }

        //     // Generate the public URL
        //     String publicUrl = "https://storage.googleapis.com/" + bucketName + "/" + URLEncoder.encode(fileName, StandardCharsets.UTF_8);
        //     publicUrls.add(publicUrl);
        // }
        return publicUrls;
    }
} 
