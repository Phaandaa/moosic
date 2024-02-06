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
import com.example.server.entity.UserType;
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

    private void isNotEmptyOrNull(String variable, String attributeName) {
        if (variable == null || variable.isEmpty()) {
            throw new IllegalArgumentException(attributeName + " cannot be empty");
        }
    }

    @Transactional
    public UserType createUser(CreateUserDTO userDTO) {
        try {
            if (userDTO == null) {
                throw new IllegalArgumentException("Request body not valid");
            }
            String email = userDTO.getEmail();
            isNotEmptyOrNull(email, "Email");
            User user = userRepository.findByEmail(email);
            if (user != null) {
                throw new IllegalArgumentException("User with email " + email + " existed");
            }
            String password = userDTO.getPassword();
            isNotEmptyOrNull(password, "Password");
            String name = userDTO.getName();
            isNotEmptyOrNull(name, "Name");
            String role = userDTO.getRole();
            isNotEmptyOrNull(role, "Role");
            if (role.equals("Teacher")) {
                System.out.println("masuk");
                String instrument = userDTO.getInfo().get("instrument");
                isNotEmptyOrNull(instrument, "Instrument");
            }
            if (role.equals("Student")) {
                String instrument = userDTO.getInfo().get("instrument");
                isNotEmptyOrNull(instrument, "Instrument");
                String grade = userDTO.getInfo().get("grade");
                isNotEmptyOrNull(grade, "Grade");
            }
            FirebaseToken firebaseResponse = firebaseAuthService.signUpWithEmailAndPassword(email, password);
            String id = firebaseResponse.getLocalId();
            User newUser = new User(id, name, email, role);
            userRepository.save(newUser);

            switch (role) {
                case "Student":
                    return createStudent(id, name, email, userDTO);
                    // break;
                case "Teacher":
                    return createTeacher(id, name, email, userDTO);
                    // break;
                default:
                    return newUser;
            }
            // return newUser;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creating account: " + e.getMessage());
        }
    }

    @Transactional
    public User createAdmin(CreateUserDTO userDTO) {
        try {
            if (userDTO == null) {
                throw new IllegalArgumentException("Request body not valid");
            }
            String email = userDTO.getEmail();
            isNotEmptyOrNull(email, "Email");
            String password = userDTO.getPassword();
            isNotEmptyOrNull(password, "Password");
            String name = userDTO.getName();
            isNotEmptyOrNull(name, "Name");
            FirebaseToken firebaseResponse = firebaseAuthService.signUpWithEmailAndPassword(email, password);
            String id = firebaseResponse.getLocalId();
            User newUser = new User(id, name, email, "Admin");
            userRepository.save(newUser);
            return newUser;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creating admin: " + e.getMessage());
        }
        
    }

    public SignInResponseDTO signInWithEmailAndPassword(String email, String password) {
        try {
            FirebaseToken firebaseToken = firebaseAuthService.signInWithEmailAndPassword(email, password);
            User selectedUser = userRepository.findById(firebaseToken.getLocalId()).orElseThrow(()->
                new NoSuchElementException("No user found with ID " + firebaseToken.getLocalId()));
            SignInResponseDTO signInResponseDTO = new SignInResponseDTO(firebaseToken, selectedUser.getName(), selectedUser.getRole());
            return signInResponseDTO;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error signing in: " + e.getMessage());
        }
        
    }

    private Student createStudent(String id, String name, String email, CreateUserDTO userDTO) {
        try {
            String instrument = userDTO.getInfo().get("instrument");
            String grade = userDTO.getInfo().get("grade");
            // Student newStudent = new Student(0, null, new ArrayList<>(), instrument, grade, null, null);
            Student newStudent = new Student(id, name, email, 0, null, new ArrayList<>(), instrument, grade, null,null);
            studentRepository.save(newStudent);
            return newStudent;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creating new student: " + e.getMessage());
        }
        
    }

    private Teacher createTeacher(String id, String name, String email, CreateUserDTO userDTO) {
        try {
            String instrument = userDTO.getInfo().get("instrument");
            Teacher newTeacher = new Teacher(id, name, email, null, new ArrayList<>(), null, instrument);
            teacherRepository.save(newTeacher);
            return newTeacher;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creating teacher: " + e.getMessage());
        }
        
    }

    public List<User> getAllUsers() { 
        try {
            List<User> users = userRepository.findAll();
            if (users == null || users.isEmpty()) {
                throw new NoSuchElementException("No users found");
            }
            return users;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all users: " + e.getMessage());
        }
        
    }

    public User getUserById(String userId) {
        try {
            return userRepository.findById(userId).orElseThrow(()->
                new NoSuchElementException("No user found with ID " + userId));
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user with ID " + userId + ": " + e.getMessage());
        }
        
    }

    public void deleteUserById(String userId) {
        try {
            User toBeDeletedUser = userRepository.findById(userId).orElseThrow(()->
            new NoSuchElementException("No user found with ID " + userId));
            userRepository.delete(toBeDeletedUser);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user with ID " + userId + ": " + e.getMessage());
        }
        
    }
}
