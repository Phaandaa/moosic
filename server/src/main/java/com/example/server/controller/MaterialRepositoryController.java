package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.models.CreateMaterialRepositoryDTO;
import com.example.server.service.MaterialRepositoryService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@CrossOrigin
@RequestMapping("/material-repository")
public class MaterialRepositoryController {

    @Autowired
    private MaterialRepositoryService materialRepositoryService;

    @Operation(summary = "Get all material repositories for admin")
    @GetMapping("/admin}")
    public ResponseEntity<?> getAllMaterialRepositoryForAdmin() {
        return ResponseEntity.ok(materialRepositoryService.getAllMaterialRepository());
    }

    @Operation(summary = "Get all approved material repositories for teacher")
    @GetMapping("/teacher}")
    public ResponseEntity<?> getApprovedMaterialRepositoryForTeachers() {
        return ResponseEntity.ok(materialRepositoryService.getAllApprovedMaterialRepository());
    }

    @Operation(summary = "Get material repository by teacher id")
    @GetMapping("/teacher/{teacherId}}")
    public ResponseEntity<?> getMaterialRepositoryById(@PathVariable String teacherId) {
        return ResponseEntity.ok(materialRepositoryService.getMaterialRepositoryByTeacherId(teacherId));
    }
    
    @Operation(summary = "Create new material repository")
    @PostMapping(path = "/create", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createMaterialRepository(
            @RequestPart("material_repository") CreateMaterialRepositoryDTO materialRepositoryDTO,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(materialRepositoryService.createMaterialRepository(materialRepositoryDTO, file));
    }

    @Operation(summary = "Approve material and give reason")
    @PutMapping("/admin/{materialId}")
    public ResponseEntity<?> approveMaterialRepository(
            @PathVariable String materialId,
            @RequestParam("status") String newStatus,
            @RequestParam("reasonForStatus") String reasonForStatus) {
        return ResponseEntity.ok(materialRepositoryService.approveMaterialAndReason(materialId, newStatus, reasonForStatus));
    }

    @Operation(summary = "Update material for teacher")
    @PutMapping(path = "/teacher/{materialId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateMaterialLink(
            @PathVariable String materialId,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(materialRepositoryService.updateFileForMaterialRepository(materialId, file));
    }
    
}
