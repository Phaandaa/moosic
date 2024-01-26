package com.example.server;

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

		if (mongodbDB == null || mongodbURI == null || firebaseApiKey == null) {
			System.out.println("Please set MONGODB_URI, MONGODB_DB, and FIREBASE_API_KEY in .env file");
			System.exit(1);
		}
		System.out.println("Loaded environment variables:");
        System.out.println("MONGODB_URI: " + mongodbURI);
        System.out.println("MONGODB_DB: " + mongodbDB);
        System.out.println("FIREBASE_API_KEY: " + firebaseApiKey);
		
		System.setProperty("spring.data.mongodb.uri", mongodbURI);
		System.setProperty("spring.data.mongodb.database", mongodbDB);
		System.setProperty("firebase.apiKey", firebaseApiKey);
		SpringApplication.run(ServerApplication.class, args);
	}

}
