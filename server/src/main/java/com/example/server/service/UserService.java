package com.example.server.service;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.server.entity.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;

@Service
public class UserService {

    Firestore db = FirestoreOptions.getDefaultInstance().getService();

    public String createUser() {
        return "";
    }

    public List<User> getAllUsers() throws InterruptedException, ExecutionException {
        System.out.println("getAllUsers");
        ApiFuture<QuerySnapshot> future = db.collection("users").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<User> users = documents.stream()
                .map(document -> document.toObject(User.class))
                .collect(Collectors.toList());
        System.out.println(users);
        return users;
    }

    public User getUserById(Integer userId) {
        return null;
    }

    public String deleteUserById(Integer userId) {

        CollectionReference users = db.collection("users");
        Query query = users.whereEqualTo("user_id", userId);
        ApiFuture<QuerySnapshot> future = query.get();
        QuerySnapshot querySnapshot;
        try {
            querySnapshot = future.get();
            List<QueryDocumentSnapshot> documents = querySnapshot.getDocuments();

            if (documents.isEmpty()) {
                System.out.println("No matching documents found");
                return "User not found";
            }
            DocumentReference userDocRef = documents.get(0).getReference();
            ApiFuture<WriteResult> writeResult = userDocRef.delete();
            return ("Deleted user with ID: " + userId + " at time: " + writeResult.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Error deleting user";
        }

    }
}
