package com.example.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dao.TeacherRepository;
import com.example.server.entity.Teacher;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    public List < Teacher > getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Teacher getTeacherById(String id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public void addStudent(String teacherId, String studentId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElse(null);
        if (teacher != null) {
            teacher.addStudent(studentId);
            teacherRepository.save(teacher);
        }
    }

    public void deleteStudent(String teacherId, String studentId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElse(null);
        if (teacher != null) {
            teacher.deleteStudent(studentId);
            teacherRepository.save(teacher);
        }
    }

}
