package com.example.server.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.StudentRepository;
import com.example.server.dao.TeacherRepository;
import com.example.server.dao.UserRepository;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;
import com.example.server.entity.User;
import com.mongodb.lang.NonNull;
import com.example.server.models.CreateUserDTO;
import com.example.server.models.FirebaseToken;


// TODO: Handle possible exceptions, please check with example from OOP project

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseAuthService firebaseAuthService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Transactional
    public User createUser(CreateUserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException();
        }
        String email = userDTO.getEmail();
        String password = userDTO.getPassword();
        FirebaseToken firebaseResponse = firebaseAuthService.signUpWithEmailAndPassword(email, password);
        // TODO: insert firebase request here
        // send request to firebase, await response for user id
        String id = firebaseResponse.getLocalId(); // shud be response from firebase
        String name = userDTO.getName();
        String role = userDTO.getRole();
        User newUser = new User(id, name, email, role);
        userRepository.save(newUser);
        switch (role) {
            case "Student":
                createStudent(id, name, userDTO);
                break;
            case "Teacher":
                createTeacher(id, name);
                break;
            default:
                break;
        }
        return newUser;
    }

    public User createAdmin(CreateUserDTO userDTO) {
        if (userDTO == null) {
            throw new IllegalArgumentException();
        }
        String email = userDTO.getEmail();
        String password = userDTO.getPassword();
        String name = userDTO.getName();
        FirebaseToken firebaseResponse = firebaseAuthService.signUpWithEmailAndPassword(email, password);
        String id = firebaseResponse.getLocalId();
        User newUser = new User(id, name, email, "Admin");
        userRepository.save(newUser);
        return newUser;
    }

    private void createStudent(String id, String name, CreateUserDTO userDTO) {
        String teacherId = userDTO.getInfo().get("teacher_id");
        String instrument = userDTO.getInfo().get("instrument");
        Student newStudent = new Student(id, 0, teacherId, name, new ArrayList<>(), instrument);
        Optional<Teacher> selectedTeacher = teacherRepository.findById(teacherId);
        if (selectedTeacher.isPresent()) {
            Teacher teacher = selectedTeacher.get();
            teacher.addStudent(id);
            teacherRepository.save(teacher);
        }
        studentRepository.save(newStudent);
    }

    private void createTeacher(String id, String name) {
        Teacher newTeacher = new Teacher(id, name, new ArrayList<>());
        teacherRepository.save(newTeacher);
    }

    public List<User> getAllUsers() {
        System.out.println(userRepository.findAll());
        return userRepository.findAll();
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    public void deleteUserById(String userId) {
        User toBeDeletedUser = userRepository.findById(userId).orElseThrow();
        userRepository.delete(toBeDeletedUser);
    }

    public User updateUser(FirebaseToken firebaseToken) {
        User toBeUpdatedUser = userRepository.findById(firebaseToken.getLocalId()).orElseThrow();
        toBeUpdatedUser.setEmail(firebaseToken.getEmail());
        return userRepository.save(toBeUpdatedUser);
    } 
}
