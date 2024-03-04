package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.StudentRepository;
import com.example.server.dao.TeacherRepository;
import com.example.server.dao.UserRepository;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;
import com.example.server.entity.User;

@Service
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List <Teacher> getAllTeachers() {
        try {
            List<Teacher> teachers = teacherRepository.findAll();
            if (teachers.isEmpty() || teachers == null) {
                throw new NoSuchElementException("No teachers found");
            }
            return teachers;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all teachers");
        }
    }

    public Teacher getTeacherById(String id) {
        try {
            return teacherRepository.findById(id).orElseThrow(()->
                    new NoSuchElementException("No teacher found with ID " + id)
                    );
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching teacher with ID " + id);
        }
        
    }

    // TODO: just delete in student service
    public void deleteStudent(String teacherId, String studentId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(()->
                new NoSuchElementException("No teacher found with ID " + teacherId)
                );
        if (teacher != null) {
            teacher.deleteStudent(studentId);
            teacherRepository.save(teacher);
        }
        throw new NoSuchElementException("No teacher found with ID " + teacherId);
    }

    @Transactional
    public void updateTeacherAvatar(String teacherId, String avatar){
        try {
            Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(()->
                new NoSuchElementException("No teacher found with ID " + teacherId)
                );
            teacher.setAvatar(avatar);
            teacherRepository.save(teacher);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating teacher avatar");
        }
                
    }

    @Transactional
    public void updateTeacherPhone(String teacherId, String phone){
        try {
            Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(()->
                new NoSuchElementException("No teacher found with ID " + teacherId)
                );        
            teacher.setPhone(phone);
            teacherRepository.save(teacher);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating teacher phone");
        }
    }

    public void deleteTeacher(String teacherId) {
        try {
            Teacher selectedTeacher = teacherRepository.findById(teacherId).orElse(null);
            User selectedUser = userRepository.findById(teacherId).orElse(null);
            if (selectedTeacher == null) {
                throw new NoSuchElementException("No teacher is found with ID " + teacherId);
            }
            if (selectedUser == null) {
                throw new NoSuchElementException("No user is found with ID " + teacherId);
            }
            teacherRepository.deleteById(teacherId);
            userRepository.deleteById(teacherId);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting teacher");
        }
        
    }

    public Teacher getTeacherByStudentId(String studentId) {
        Optional<Student> studentOptional = studentRepository.findById(studentId);

        if (studentOptional.isPresent()){
            Student student = studentOptional.get();
            String teacherId = student.getTeacherId();
            
            try {
                return teacherRepository.findById(teacherId).orElseThrow(() ->
                    new NoSuchElementException("No teacher found with ID " + teacherId)
                );
            } catch (NoSuchElementException e) {
                throw new RuntimeException("Teacher not found for student with ID " + studentId);
            } catch (Exception e) {
                throw new RuntimeException("Error fetching teacher with ID " + teacherId);
            }
        } else {
            throw new RuntimeException("Student with ID " + studentId + " not found");
        }
    }
}
