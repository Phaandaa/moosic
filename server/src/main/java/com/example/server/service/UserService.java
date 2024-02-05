package com.example.server.service;

import java.util.*;

import org.checkerframework.checker.units.qual.t;
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
import com.example.server.models.SignInResponseDTO;


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
        String id = firebaseResponse.getLocalId();
        String name = userDTO.getName();
        String role = userDTO.getRole();
        User newUser = new User(id, name, email, role);
        userRepository.save(newUser);
        switch (role) {
            case "Student":
                createStudent(id, name, email, userDTO);
                break;
            case "Teacher":
                createTeacher(id, name, email, userDTO);
                break;
            default:
                break;
        }
        return newUser;
    }

    @Transactional
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

    public SignInResponseDTO signInWithEmailAndPassword(String email, String password) {
        FirebaseToken firebaseToken = firebaseAuthService.signInWithEmailAndPassword(email, password);
        User selectedUser = userRepository.findById(firebaseToken.getLocalId()).orElseThrow();
        SignInResponseDTO signInResponseDTO = new SignInResponseDTO(firebaseToken, selectedUser.getName(), selectedUser.getRole());
        return signInResponseDTO;
    }

    private void createStudent(String id, String name, String email, CreateUserDTO userDTO) {
        String instrument = userDTO.getInfo().get("instrument");
        String grade = userDTO.getInfo().get("grade");
        Student newStudent = new Student(id, 0, null, name, new ArrayList<>(), instrument, grade, null, email,null);
        studentRepository.save(newStudent);
    }

    private void createTeacher(String id, String name, String email, CreateUserDTO userDTO) {
        Teacher newTeacher = new Teacher(id, name, email, null, new ArrayList<>(), null);
        teacherRepository.save(newTeacher);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    public void deleteUserById(String userId) {
        User toBeDeletedUser = userRepository.findById(userId).orElseThrow();
        userRepository.delete(toBeDeletedUser);
    }
}
