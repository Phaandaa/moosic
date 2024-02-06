package com.example.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.StudentRepository;
import com.example.server.dao.TeacherRepository;
import com.example.server.dao.UserRepository;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

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

            studentRepository.findById(studentId).ifPresent(student -> {
                student.setTeacherId(teacherId);
                student.setTeacherName(teacher.getName());
                studentRepository.save(student);
            });
        }
    }

    public void deleteStudent(String teacherId, String studentId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElse(null);
        if (teacher != null) {
            teacher.deleteStudent(studentId);
            teacherRepository.save(teacher);
        }
    }

    @Transactional
    public void updateTeacherAvatar(String teacherId, String avatar){
        Optional<Teacher> selectedTeacher = teacherRepository.findById(teacherId);
        if (selectedTeacher.isPresent()) {
            Teacher teacher = selectedTeacher.get();
            teacher.setAvatar(avatar);
            teacherRepository.save(teacher);
        }
    }

    @Transactional
    public void updateTeacherPhone(String teacherId, String phone){
        Optional<Teacher> selectedTeacher = teacherRepository.findById(teacherId);
        if (selectedTeacher.isPresent()) {
            Teacher teacher = selectedTeacher.get();
            teacher.setPhone(phone);
            teacherRepository.save(teacher);
        }
    }

    public void deleteTeacher(String teacherId) {
        teacherRepository.deleteById(teacherId);
        userRepository.deleteById(teacherId);
    }
}
