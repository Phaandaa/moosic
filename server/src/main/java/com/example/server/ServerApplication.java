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
		System.setProperty("spring.data.mongodb.uri", mongodbURI);
		System.setProperty("spring.data.mongodb.database", mongodbDB);
		SpringApplication.run(ServerApplication.class, args);
	}

}
