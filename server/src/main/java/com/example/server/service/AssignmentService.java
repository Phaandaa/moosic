package com.example.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.spel.ast.Assign;
import org.springframework.stereotype.Service;

import com.example.server.dao.AssignmentRepository;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;

    
}
