package com.example.server.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.GoalRepository;
import com.example.server.dao.StudentInventoryRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.dao.TeacherRepository;
import com.example.server.dao.UserRepository;
import com.example.server.entity.Goal;
import com.example.server.entity.Student;
import com.example.server.entity.StudentInventory;
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

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private StudentInventoryRepository studentInventoryRepository;

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
            Date creationTime = new Date();
            User newUser = new User(id, name, email, role, creationTime);
            userRepository.save(newUser);

            switch (role) {
                case "Student":
                    return createStudent(id, name, email, userDTO, creationTime);
                    // break;
                case "Teacher":
                    return createTeacher(id, name, email, userDTO, creationTime);
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
            User newUser = new User(id, name, email, "Admin", new Date());
            userRepository.save(newUser);
            return newUser;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creating admin: " + e.getMessage());
        }
        
    }

    @Transactional
    public SignInResponseDTO signInWithEmailAndPassword(String email, String password, String expoPushToken) {
        try {
            FirebaseToken firebaseToken = firebaseAuthService.signInWithEmailAndPassword(email, password);
            User selectedUser = userRepository.findById(firebaseToken.getLocalId()).orElseThrow(()->
                new NoSuchElementException("No user found with ID " + firebaseToken.getLocalId()));
            
            switch (selectedUser.getRole()) {
                case "Student":
                    Student selectedStudent = studentRepository.findById(firebaseToken.getLocalId()).orElseThrow(()->
                        new NoSuchElementException("No student found with ID " + firebaseToken.getLocalId()));
                    if (!selectedStudent.getPhoneNumber().equals("")) {
                        throw new IllegalArgumentException("Please logout from previous device first.");
                    }
                    selectedStudent.setPhoneNumber(expoPushToken);
                    break;
                
                case "Teacher":
                    Teacher selectedTeacher = teacherRepository.findById(firebaseToken.getLocalId()).orElseThrow(()->
                        new NoSuchElementException("No teacher found with ID " + firebaseToken.getLocalId()));
                    if (!selectedTeacher.getPhoneNumber().equals("")) {
                        throw new IllegalArgumentException("Please logout from previous device first.");
                    }
                    selectedTeacher.setPhoneNumber(expoPushToken);
                    break;
                
                case "Admin":
                    break;
            
                default:
                    throw new NoSuchElementException("User is neither a student, teacher, or admin.");
            }
            
            SignInResponseDTO signInResponseDTO = new SignInResponseDTO(firebaseToken, selectedUser.getName(), selectedUser.getRole());
            return signInResponseDTO;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error signing in: " + e.getMessage());
        }
        
    }

    @Transactional
    public String signOut(String userId, String expoPushToken) {
        try {
            User selectedUser = userRepository.findById(userId).orElseThrow(()->
                new NoSuchElementException("No user found with ID " + userId));
            
            switch (selectedUser.getRole()) {
                case "Student":
                    Student selectedStudent = studentRepository.findById(userId).orElseThrow(()->
                        new NoSuchElementException("No student found with ID " + userId));
                    selectedStudent.setPhoneNumber("");
                    break;
                
                case "Teacher":
                    Teacher selectedTeacher = teacherRepository.findById(userId).orElseThrow(()->
                        new NoSuchElementException("No teacher found with ID " + userId));
                    selectedTeacher.setPhoneNumber("");
                    break;
                
                case "Admin":
                    break;
            
                default:
                    throw new NoSuchElementException("User is neither a student, teacher, or admin.");
            }
            
            return "Successfully signed out";
        } catch (NoSuchElementException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error signing out: " + e.getMessage());
        }
        
    }

    

    @Transactional
    private Student createStudent(String id, String name, String email, CreateUserDTO userDTO, Date creationTime) {
        try {
            String instrument = userDTO.getInfo().get("instrument");
            String grade = userDTO.getInfo().get("grade");
            String phoneNumber = userDTO.getInfo().get("phone");
            String tuitionDay = userDTO.getInfo().get("tuition_day");
            Student newStudent = new Student(id, name, email, 0, null, new ArrayList<>(), instrument, phoneNumber ,grade, null,null, null, creationTime,tuitionDay);
            studentRepository.save(newStudent);
            Goal newGoal = new Goal(id, name, null, 0, 0, 3, 1, "Not done", 20, false);
            goalRepository.save(newGoal);
            StudentInventory studentInventory = new StudentInventory(id, new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
            studentInventoryRepository.save(studentInventory);
            return newStudent;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creating new student: " + e.getMessage());
        }
        
    }

    private Teacher createTeacher(String id, String name, String email, CreateUserDTO userDTO, Date creationTime) {
        try {
            String instrument = userDTO.getInfo().get("instrument");
            String phoneNumber = userDTO.getInfo().get("phone");
            Teacher newTeacher = new Teacher(id, name, email, null, new ArrayList<>(), phoneNumber, instrument, creationTime);
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

    @Transactional
    public void deleteUserById(String userId) {
        try {
            User toBeDeletedUser = userRepository.findById(userId).orElseThrow(()->
                new NoSuchElementException("No user found with ID " + userId));
            if (toBeDeletedUser.getRole().equals("Student")) {
                Goal toBeDeletedGoal = goalRepository.findByStudentId(userId).orElseThrow(()->
                    new NoSuchElementException("No goal found with student ID " + userId));
                goalRepository.delete(toBeDeletedGoal);

                StudentInventory toBeDeletedStudentInventory = studentInventoryRepository.findByStudentId(userId).orElseThrow(()->
                    new NoSuchElementException("No student inventory found with student ID " + userId));
                studentInventoryRepository.delete(toBeDeletedStudentInventory);
            }
            userRepository.delete(toBeDeletedUser);

        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user with ID " + userId + ": " + e.getMessage());
        }
        
    }
}
