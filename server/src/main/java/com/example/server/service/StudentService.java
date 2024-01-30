package com.example.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.server.dao.StudentRepository;
import com.example.server.entity.Student;
import java.util.Optional;

public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(String id) {
        return studentRepository.findById(id).orElse(null);
    }

    public void updateStudentGrade(String studentId, String grade){
        Optional<Student> selectedStudent = studentRepository.findById(studentId);
        if (selectedStudent.isPresent()) {
            Student student = selectedStudent.get();
            student.setGrade(grade);
            studentRepository.save(student);
        }
    }


    
}
