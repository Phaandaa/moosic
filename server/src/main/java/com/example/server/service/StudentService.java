package com.example.server.service;

import java.rmi.StubNotFoundException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.StudentRepository;
import com.example.server.dao.UserRepository;
import com.example.server.entity.Practice;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;
import com.example.server.exception.StudentNotFoundException;

import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private UserRepository userRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(String id) {
        return studentRepository.findById(id).orElseThrow(()->
                new StudentNotFoundException("Student not found with the given ID."));
    }

    @Transactional
    public void updateStudentGrade(String studentId, String grade){
        Optional<Student> selectedStudent = studentRepository.findById(studentId);
        if (selectedStudent.isPresent()) {
            Student student = selectedStudent.get();
            student.setGrade(grade);
            studentRepository.save(student);
        } else {
            throw new StudentNotFoundException("Student not found with the given ID.");
        }
    }

    @Transactional
    public void updateStudentTeacher(String studentId, String teacherId){
        Optional<Student> selectedStudent = studentRepository.findById(studentId);
        if (selectedStudent.isPresent()) {
            Student student = selectedStudent.get();
            student.setTeacherId(teacherId);
            Teacher teacher = teacherService.getTeacherById(teacherId);
            String teacherName = teacher.getName();
            student.setTeacherName(teacherName);

            teacherService.addStudent(teacherId, studentId);
            studentRepository.save(student);
        } else {
            throw new StudentNotFoundException("Student not found with the given ID.");
        }
    }

    @Transactional
    public void updateStudentAvatar(String studentId, String avatar) {
        Optional<Student> selectedStudent = studentRepository.findById(studentId);
        if (selectedStudent.isPresent()) {
            Student student = selectedStudent.get();
            student.setAvatar(avatar);
            studentRepository.save(student);
        } else {
            throw new StudentNotFoundException("Student not found with the given ID.");
        }
    }
    
    public List<Student> findStudentsByTeacherId(String teacherId) {
        try {
            return studentRepository.findAllByTeacherId(teacherId);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Illegal argument", e);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching students for teacher ID: " + teacherId + " " + e.getMessage(), e);
        }
    }

    public void deleteTeacherIdForAllStudent(String teacherId) {
        List <Student> students = findStudentsByTeacherId(teacherId);
        for (Student student : students) {
            student.setTeacherId(null);
            student.setTeacherName(null);
            studentRepository.save(student);
        }
    }

    public void deleteStudentById(String studentId) {
        studentRepository.deleteById(studentId);
        userRepository.deleteById(studentId);
    }
    
}
