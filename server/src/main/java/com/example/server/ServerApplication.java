package com.example.server;

import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		String mongodbURI = dotenv.get("MONGODB_URI");
		String mongodbDB = dotenv.get("MONGODB_DB");
		String firebaseApiKey = dotenv.get("FIREBASE_API_KEY");

		// Print out the loaded environment variables
        System.out.println("MONGODB_URI: " + mongodbURI);
        System.out.println("MONGODB_DB: " + mongodbDB);
        System.out.println("FIREBASE_API_KEY: " + firebaseApiKey);

		System.setProperty("spring.data.mongodb.uri", mongodbURI);
		System.setProperty("spring.data.mongodb.database", mongodbDB);
		System.setProperty("firebase.apiKey", firebaseApiKey);

		SpringApplication.run(ServerApplication.class, args);
	}
}
