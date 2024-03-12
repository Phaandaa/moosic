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

		// Print out the loaded environment variables
        // System.out.println("MONGODB_URI: " + mongodbURI);
        // System.out.println("MONGODB_DB: " + mongodbDB);
        // System.out.println("FIREBASE_API_KEY: " + firebaseApiKey);

		System.setProperty("spring.data.mongodb.uri", mongodbURI);
		System.setProperty("spring.data.mongodb.database", mongodbDB);
		System.setProperty("firebase.apiKey", firebaseApiKey);

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
