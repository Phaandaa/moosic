package com.example.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dao.StudentInventoryRepository;
import com.example.server.entity.StudentInventory;
import com.example.server.models.CreateInventoryDTO;

@Service
public class StudentInventoryService {
    
    // read
    @Autowired
    private StudentInventoryRepository studentInventoryRepository;

    public StudentInventory getStudentInventoryByStudentId(String studentId) {
        try {
            return studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }

    // create 
    @Transactional
    public StudentInventory createStudentInventory(CreateInventoryDTO CreateInventoryDTO) {
        String studentId = CreateInventoryDTO.getStudentId();

        // Check if an inventory already exists for the student
        if (studentInventoryRepository.findByStudentId(studentId).isPresent()) {
            throw new RuntimeException("Student inventory already exists with the student ID " + studentId);
        }

        try {
            List<String> ownedAvatarList = CreateInventoryDTO.getOwnedAvatarList();
            List<String> ownedBadgeList = CreateInventoryDTO.getOwnedBadgeList();
            List<String> ownedFrameList = CreateInventoryDTO.getOwnedFrameList();

            StudentInventory studentInventory = new StudentInventory(studentId, ownedAvatarList, ownedBadgeList, ownedFrameList);
            studentInventoryRepository.save(studentInventory);
            return studentInventory;
        } catch (RuntimeException e) {
            if (e.getMessage() != null || e.getMessage() != "") {
                throw new RuntimeException("Error creating new student inventory: " + e.getMessage());
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create student inventory: " + e.getMessage());
        }
    }

    // add Avatar
    public StudentInventory addAvatar (String studentId, String avatarId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));

            List<String> ownedAvatarList = studentInventory.getOwnedAvatarList();

            // Initialize the list if it's null
            if (ownedAvatarList == null) {
                ownedAvatarList = new ArrayList<>();
            }

            // Check if the avatar is already in the list
            if (ownedAvatarList.contains(avatarId)) {
                throw new RuntimeException("Avatar already exists in the student inventory with student ID " + studentId);
            }

            ownedAvatarList.add(avatarId);
            studentInventory.setOwnedAvatarList(ownedAvatarList);
            studentInventoryRepository.save(studentInventory);
            return studentInventory;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error adding avatar to student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }

    // add Badge
    public StudentInventory addBadge (String studentId, String badgeId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));

            List<String> ownedBadgeList = studentInventory.getOwnedBadgeList();

            // Initialize the list if it's null
            if (ownedBadgeList == null) {
                ownedBadgeList = new ArrayList<>();
            }

            // Check if the badge is already in the list
            if (ownedBadgeList.contains(badgeId)) {
                throw new RuntimeException("Badge already exists in the student inventory with student ID " + studentId);
            }

            ownedBadgeList.add(badgeId);
            studentInventory.setOwnedBadgeList(ownedBadgeList);
            studentInventoryRepository.save(studentInventory);
            return studentInventory;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error adding badge to student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }

    // add Frame
    public StudentInventory addFrame (String studentId, String frameId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));

            List<String> ownedFrameList = studentInventory.getOwnedFrameList();

            // Initialize the list if it's null
            if (ownedFrameList == null) {
                ownedFrameList = new ArrayList<>();
            }

            // Check if the frame is already in the list
            if (ownedFrameList.contains(frameId)) {
                throw new RuntimeException("Frame already exists in the student inventory with student ID " + studentId);
            }

            ownedFrameList.add(frameId);
            studentInventory.setOwnedFrameList(ownedFrameList);
            studentInventoryRepository.save(studentInventory);
            return studentInventory;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error adding frame to student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }

    // get owned avatar list
    public List<String> getOwnedAvatarList(String studentId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));
            return studentInventory.getOwnedAvatarList();
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching owned avatar list for student ID " + studentId + ": " + e.getMessage());
        }
    }

    // get owned badge list
    public List<String> getOwnedBadgeList(String studentId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));
            return studentInventory.getOwnedBadgeList();
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching owned badge list for student ID " + studentId + ": " + e.getMessage());
        }
    }

    // get owned frame list
    public List<String> getOwnedFrameList(String studentId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));
            return studentInventory.getOwnedFrameList();
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching owned frame list for student ID " + studentId + ": " + e.getMessage());
        }
    }

    // delete
    public void deleteStudentInventory(String studentId) {
        try {
            studentInventoryRepository.deleteByStudentId(studentId);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }

    // delete badge from inventory
    public StudentInventory deleteBadge (String studentId, String badgeId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));

            List<String> ownedBadgeList = studentInventory.getOwnedBadgeList();
            ownedBadgeList.remove(badgeId);
            studentInventory.setOwnedBadgeList(ownedBadgeList);
            studentInventoryRepository.save(studentInventory);
            return studentInventory;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting badge from student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }

    // delete avatar from inventory
    public StudentInventory deleteAvatar (String studentId, String avatarId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));

            List<String> ownedAvatarList = studentInventory.getOwnedAvatarList();
            ownedAvatarList.remove(avatarId);
            studentInventory.setOwnedAvatarList(ownedAvatarList);
            studentInventoryRepository.save(studentInventory);
            return studentInventory;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting avatar from student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }

    // delete frame from inventory
    public StudentInventory deleteFrame (String studentId, String frameId) {
        try {
            StudentInventory studentInventory = studentInventoryRepository.findByStudentId(studentId).orElseThrow(()->
                new NoSuchElementException("Student inventory not found with the student ID " + studentId));

            List<String> ownedFrameList = studentInventory.getOwnedFrameList();
            ownedFrameList.remove(frameId);
            studentInventory.setOwnedFrameList(ownedFrameList);
            studentInventoryRepository.save(studentInventory);
            return studentInventory;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting frame from student inventory with student ID " + studentId + ": " + e.getMessage());
        }
    }
}
