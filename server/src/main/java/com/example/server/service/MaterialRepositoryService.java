package com.example.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.dao.MaterialRepositoryRepository;
import com.example.server.dao.TeacherRepository;
import com.example.server.dao.UserRepository;
import com.example.server.entity.MaterialRepository;
import com.example.server.models.CreateMaterialRepositoryDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MaterialRepositoryService {
    
    @Autowired
    private MaterialRepositoryRepository materialRepositoryRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private CloudStorageService cloudStorageService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public MaterialRepository createMaterialRepository(String materialRepositoryJSON, MultipartFile file) {
        try {
            CreateMaterialRepositoryDTO materialRepositoryDTO = objectMapper.readValue(materialRepositoryJSON, CreateMaterialRepositoryDTO.class);
            String fileURL = cloudStorageService.uploadFileToGCS(file, "material-repository");
            String teacherId = materialRepositoryDTO.getTeacherId();
            userRepository.findById(teacherId).orElseThrow(()->
                new NoSuchElementException("No user found with the ID " + teacherId));
            List<String> type = materialRepositoryDTO.getType();
            List<String> instrument = materialRepositoryDTO.getInstrument();
            List<String> grade = materialRepositoryDTO.getGrade();
            String teacherName = materialRepositoryDTO.getTeacherName();
            String title = materialRepositoryDTO.getTitle();
            String description = materialRepositoryDTO.getDescription();
            String status = materialRepositoryDTO.getStatus();
            MaterialRepository createdMaterialRepository = new MaterialRepository(title, description, fileURL, status, null, type, instrument, grade, teacherId, teacherName);

            materialRepositoryRepository.save(createdMaterialRepository);
            return createdMaterialRepository;
        } catch (RuntimeException e) {
            if (e.getMessage() != null || e.getMessage() != "") {
                throw new RuntimeException("Error creating new material: " + e.getMessage());
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create new material: " + e.getMessage());
        }
        
    }

    public List<MaterialRepository> getAllMaterialRepository() {
        try {
            List<MaterialRepository> materials = materialRepositoryRepository.findAllSortedByCreationTime();
            if (materials.isEmpty() || materials == null) {
                return new ArrayList<>();
            }
            return materials;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching materials from repository: " + e.getMessage());
        }
    }

    public List<MaterialRepository> getAllApprovedMaterialRepository() {
        try {
            List<MaterialRepository> materials = materialRepositoryRepository.findApprovedSorted();
            if (materials.isEmpty() || materials == null) {
                return new ArrayList<>();
            }
            return materials;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching approved materials from repository: " + e.getMessage());
        }
    }

    @Transactional
    public MaterialRepository approveMaterialAndReason(String materialId, String newStatus, String reasonForStatus) {
        try {
            MaterialRepository material = materialRepositoryRepository.findById(materialId).orElseThrow(()->
                new NoSuchElementException("No material found with the ID " + materialId));

            material.setStatus(newStatus);
            material.setReasonForStatus(reasonForStatus);

            materialRepositoryRepository.save(material);

            notificationService.sendNotification(
                "Teacher", 
                String.format("%s material review", material.getTitle()), 
                String.format("Your uploaded material %s has been reviewed. Status: %s", material.getTitle(), material.getStatus()), 
                material.getTeacherId()
            );
            return material;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching approved materials from repository: " + e.getMessage());
        }
    }

    @Transactional
    public MaterialRepository updateFileForMaterialRepository(String materialId, MultipartFile file) {
        try {
            String newFileURL = cloudStorageService.uploadFileToGCS(file, "material-repository");
            MaterialRepository material = materialRepositoryRepository.findById(materialId).orElseThrow(()->
                new NoSuchElementException("No material found with the ID " + materialId));

            material.setFileLink(newFileURL);
            material.setStatus("Pending");
            material.setReasonForStatus(null);

            materialRepositoryRepository.save(material);
            return material;
        } catch (RuntimeException e) {
            if (e.getMessage() != null || e.getMessage() != "") {
                throw new RuntimeException("Error updating material file: " + e.getMessage());
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update material file: " + e.getMessage());
        }
    }

    public List<MaterialRepository> getMaterialRepositoryByTeacherId(String teacherId) {
        try {
            teacherRepository.findById(teacherId).orElseThrow(()->
                new NoSuchElementException("No teacher found with the ID " + teacherId));
            List<MaterialRepository> materials = materialRepositoryRepository.findByTeacherId(teacherId);
            if (materials.isEmpty() || materials == null) {
                return new ArrayList<>();
            }
            return materials;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error fetching approved materials from repository: " + e.getMessage());
        }
    }

}
