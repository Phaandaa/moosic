package com.example.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.StudentRepository;
import com.example.server.dao.TeacherRepository;
import com.example.server.dao.UserRepository;
import com.example.server.dto.CreateUserDTO;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;
import com.example.server.entity.User;
import com.mongodb.lang.NonNull;


// TODO: Handle possible exceptions, please check with example from OOP project

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Transactional
    public User createUser(CreateUserDTO userDTO) {
        if (userDTO != null) {
            // TODO: insert firebase request here 
            // send request to firebase, await response for user id 
            String id = "3f0f96a1-4949-4750-89ef-29961e8e621b"; // shud be response from firebase
            String name = userDTO.getName();
            String email = userDTO.getEmail();
            String role = userDTO.getRole();
            User newUser = new User(id, name, email, role);
            userRepository.save(newUser);
            switch (role) {
                case "Student":
                    createStudent(id, userDTO);
                    break;
                case "Teacher":
                    createTeacher(id);
                    break;
                default:
                    break;
            }
            return newUser;
        }
        return null;
    }

    private void createStudent(String id, CreateUserDTO userDTO) {
        String teacherId = userDTO.getInfo().get("teacher_id");
        String instrument = userDTO.getInfo().get("instrument");
        Student newStudent = new Student(id, 0, teacherId, new ArrayList<>(), instrument);
        studentRepository.save(newStudent);
    }

    private void createTeacher(String id) {
        Teacher newTeacher = new Teacher(id, new ArrayList<>());
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
}
