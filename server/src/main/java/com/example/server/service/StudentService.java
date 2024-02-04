package com.example.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.StudentRepository;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;

import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherService teacherService;

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
        }
    }

    @Transactional
    public void updateStudentAvatar(String studentId, String avatar){
        Optional<Student> selectedStudent = studentRepository.findById(studentId);
        if (selectedStudent.isPresent()) {
            Student student = selectedStudent.get();
            student.setAvatar(avatar);
            studentRepository.save(student);
        }
    }
    
}
