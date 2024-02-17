import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert } from 'react-native';
import theme from '../../styles/theme';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';

function ViewAssignmentsScreen() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [studentID, setStudentID] = useState('');
    const [assignmentData, setAssignmentData] = useState({
      images: [],
      documents: [],
    }); // Initialize with empty arrays for images and documents

    const checkStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setStudentID(parsedData.userId); // Directly set the studentID here
            }
        } catch (error) {
            console.error('Error retrieving data from AsyncStorage', error);
            Alert.alert('Error', 'Failed to load user data');
        }
    };

    useEffect(() => {
        checkStoredData();
    }, []);

    useEffect(() => {
        const fetchAssignments = async () => {
            if (studentID) {
                try {
                    const response = await axios.get(`${IP_ADDRESS}/assignments/${studentID}/`);
                    setAssignmentData(response.data || {}); // Use default empty object if data is falsy
                } catch (error) {
                    console.error('Error fetching assignments:', error);
                    Alert.alert('Error', 'Could not fetch assignments');
                }
            }
        };
        fetchAssignments();
    }, [studentID]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const openImage = (uri) => {
        setSelectedImage(uri);
        toggleModal();
    };

    // No need to separately check hasImages and hasDocuments since they're initialized as empty arrays
    return (
        <ScrollView style={theme.container}>
            <View style={theme.card2}>
                <View style={theme.cardTextContainer}>
                    <Text style={theme.cardTitle}>{assignmentData.name || 'No Name Provided'}</Text>
                    <Text style={theme.cardText}>Description: {assignmentData.description || 'No Description Provided'}</Text>
                    <Text style={theme.cardText}>Deadline: {assignmentData.deadline || 'No Deadline'}</Text>
                    <Text style={theme.cardText}>Created on: {assignmentData.submissionDate || 'No Creation Date'}</Text>
                    <Text style={theme.cardText}>Attachments:</Text>
                    
                    {assignmentData.images.map((image, index) => (
                        <View key={index} style={theme.imageContainer}>
                            <TouchableOpacity onPress={() => openImage(image)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="image" size={24} color="black" />
                                <Text style={theme.documentName}>{`Image ${index + 1}`}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    
                    {assignmentData.documents.map((doc, index) => (
                        <View key={index} style={theme.documentItemContainer}>
                            <Ionicons name="document-attach" size={24} color="black" />
                            <Text style={theme.documentName}>{doc}</Text>
                        </View>
                    ))}

                    <Modal isVisible={isModalVisible}>
                        <View style={theme.modalContent}>
                            <Image source={{ uri: selectedImage }} style={theme.fullSizeImage} />
                            <Button title="Close" onPress={toggleModal} />
                        </View>
                    </Modal>
                </View>
                <View style={theme.buttonContainer2}>
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>Submit Assignment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>View Feedback</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default ViewAssignmentsScreen;
