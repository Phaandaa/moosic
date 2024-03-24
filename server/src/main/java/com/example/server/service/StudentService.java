package com.example.server.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.GoalRepository;
import com.example.server.dao.StudentRepository;
import com.example.server.dao.TeacherRepository;
import com.example.server.dao.UserRepository;
import com.example.server.entity.Goal;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GoalRepository goalRepository;

    public List<Student> getAllStudents() {
        try {
            List<Student> students = studentRepository.findAllSortedByCreationTime();
            if (students == null || students.isEmpty()) {
                throw new NoSuchElementException("No students found");
            }
            return students;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching all students " + ": " + e.getMessage());
        }
        
    }

    public Student getStudentById(String id) {
        try {
            return studentRepository.findById(id).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + id));
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching student ID " + id + ": " + e.getMessage());
        }
       
    }

    @Transactional
    public void updateStudentGrade(String studentId, String grade){
        try {
            Student student = studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            String gradeString = "" + Integer.parseInt(grade);
            student.setGrade(gradeString);
            studentRepository.save(student);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Grade should be a number");
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating frade for student ID " + studentId + ": " + e.getMessage());
        } 
    }

    @Transactional
    public void updateStudentTeacher(String studentId, String teacherId){
        try {
            Student student = studentRepository.findById(studentId).orElseThrow(()->
                    new NoSuchElementException("Student not found with the ID " + studentId));
            Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(()->
                    new NoSuchElementException("Teacher not found with the ID " + teacherId));
            student.setTeacherId(teacherId);
            teacher.addStudent(studentId);
            String teacherName = teacher.getName();
            student.setTeacherName(teacherName);
            Goal goal = goalRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Goal not found with student ID " + studentId));
            goal.setTeacherId(teacherId);
            studentRepository.save(student);
            teacherRepository.save(teacher);
            goalRepository.save(goal);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating teacher ID " + teacherId + " with student ID " + studentId + ": " + e.getMessage());
        }
        
    } 
    
    @Transactional
    public void updateStudentAvatar(String studentId, String avatar) {
        try {
            Student student = studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            student.setAvatar(avatar);
            studentRepository.save(student);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating student avatar for student ID: " + studentId + ": " + e.getMessage());
        }
        
    }

    @Transactional
    public void updateStudentTuitionDay(String studentId, String tuitionDay) {
        try {
            Student student = studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            student.setTuitionDay(tuitionDay);
            studentRepository.save(student);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating tuition day for student ID: " + studentId + ": " + e.getMessage());
        }
        
    }

    @Transactional
    public void updateStudentAvatarFrame(String studentId, String avatarFrame) {
        try {
            Student student = studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            student.setAvatarFrame(avatarFrame);
            studentRepository.save(student);
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating student avatar frame for student ID: " + studentId + ": " + e.getMessage());
        }}

    public List<Student> findStudentsByTeacherId(String teacherId) {
        List<Student> students = studentRepository.findAllByTeacherId(teacherId);
        if (students == null || students.isEmpty()) {
            throw new NoSuchElementException("No students found for teacher ID " + teacherId);
        }
        return students;
    }
        

    @Transactional
public void deleteTeacherIdForAllStudent(String teacherId) {
    try {
        List<Student> students = findStudentsByTeacherId(teacherId);
        for (Student student : students) {
            student.setTeacherId(null);
            student.setTeacherName(null);
            studentRepository.save(student);
        }
    } catch (NoSuchElementException e) {
        System.out.println("No students found for teacher ID " + teacherId);
        // No further action needed, just logging the absence of students.
    } catch (Exception e) {
        throw new RuntimeException("Error processing students for teacher ID: " + teacherId + " " + e.getMessage());
    }
}

    @Transactional
    public void deleteStudentById(String studentId) {
        try {
            studentRepository.findById(studentId).orElseThrow(()->
                new NoSuchElementException("Student not found with the ID " + studentId));
            studentRepository.findById(studentId).orElseThrow(()->
                    new NoSuchElementException("User not found with the ID " + studentId));
            studentRepository.deleteById(studentId);
            userRepository.deleteById(studentId);
        } catch (NoSuchElementException e) {
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error deleting student for student ID: " + studentId + " " + e.getMessage());
        }
        
    }

    @Transactional
    public void deleteStudent (String studentId) {
        try {
            Student student = studentRepository.findById(studentId).orElse(null);

            if (student == null) {
                throw new NoSuchElementException("No student is found with ID " + studentId);
            }

            studentRepository.deleteById(studentId);
            userRepository.deleteById(studentId);

            teacherRepository.findById(student.getId()).ifPresent(teacher -> {
                teacher.deleteStudent(studentId);
                teacherRepository.save(teacher);
            });
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting student");
        }
    
    }
}
