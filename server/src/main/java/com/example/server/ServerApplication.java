package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
@EnableScheduling
public class ServerApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		String mongodbURI = dotenv.get("MONGODB_URI");
		String mongodbDB = dotenv.get("MONGODB_DB");
		String firebaseApiKey = dotenv.get("FIREBASE_API_KEY");
		String gcpProjectId = dotenv.get("GCP_PROJECT_ID");
		String pubSubTopicName = dotenv.get("PUB_SUB_TOPIC_NAME");
		String googleApplicationCredentials = dotenv.get("GOOGLE_APPLICATION_CREDENTIALS");
		String gcsBucketName = dotenv.get("GCS_BUCKET_NAME");

		System.setProperty("spring.data.mongodb.uri", mongodbURI);
		System.setProperty("spring.data.mongodb.database", mongodbDB);
		System.setProperty("firebase.apiKey", firebaseApiKey);
		System.setProperty("spring.cloud.gcp.project-id", gcpProjectId);
		System.setProperty("spring.cloud.gcp.pubsub.topic-name", pubSubTopicName); 
		System.setProperty("spring.cloud.gcp.credentials.location", "file:" + googleApplicationCredentials);
		System.setProperty("gcs-bucket", gcsBucketName);
		
		SpringApplication.run(ServerApplication.class, args);
	}

	@PostConstruct
	public void initialize(){
		try {

			GoogleCredentials credentials = GoogleCredentials.fromStream(
                getClass().getClassLoader().getResourceAsStream("serviceAccountKey2.json")
            );

			FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();
			
			if (FirebaseApp.getApps().isEmpty()) {
				FirebaseApp.initializeApp(options);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
