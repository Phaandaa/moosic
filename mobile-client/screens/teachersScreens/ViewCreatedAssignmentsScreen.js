import React, { useState,useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Button, Linking } from 'react-native';
import theme from '../../styles/theme';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import axios from 'axios';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop();
  };
  
function ViewCreatedAssignmentsScreen() {
    const assignmentDataAll = useSelector(state => state.cache.assignmentDataAll) || []; 
    // Added a fallback to an empty array to ensure assignmentDataAll is always an array
     
    console.log('assignmentDataAll', assignmentDataAll)
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [teacherID, setTeacherID] = useState('');
    const [fetchError, setFetchError] = useState(false);
    const [assignmentData, setAssignmentData] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

     // Check stored data for teacherID
     const checkStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                return parsedData.userId;
            }
        } catch (error) {
            console.error('Error retrieving data from AsyncStorage', error);
        }
        return '';
    };

    // Fetch teacherID on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await checkStoredData();
                setTeacherID(id);
            } catch (error) {
                console.error('Error processing stored data', error);
            }
        };
        fetchData();
    }, []);

    // Fetch assignments using teacherID
    useEffect(() => {
        const fetchCreatedAssignmentssApi = `${IP_ADDRESS}/assignments/teacher/${teacherID}/`;
        const fetchCreatedAssignments = async() => {
            try {
                const response = await axios.get(fetchCreatedAssignmentssApi);
                const data = response.data;
                console.log('data', data);
                if (data.length > 0) {
                    setAssignmentData(data);
                    setFilteredAssignments(data);
                } else {
                    // If the response is successful but contains no data
                    setFetchError(true);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setFetchError(true);
            }
        };
        if(teacherID){
            fetchCreatedAssignments();
        }
    }, [teacherID]);

    return (
        <ScrollView style={theme.container}>
            <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Created Assignments</Text>
            {assignmentDataAll.length > 0 ? assignmentDataAll.map((assignment, index) => (
                <View key={index} style={theme.card2}>
                    <View style={theme.cardTextContainer}>
                        <Text style={theme.cardTitle}>{assignmentData.title}</Text>
                        <Text style={theme.cardText}>Description: {assignmentData.description}</Text>
                        <Text style={theme.cardText}>Deadline: {assignmentData.deadline}</Text>
                        <Text style={theme.cardText}>Attachments:</Text>
                        {assignment.assignmentDocumentLinks.map((link, linkIndex) => (
                            <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="link" size={24} color="black" />
                                <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={theme.buttonContainer2}>
                        <TouchableOpacity style={theme.smallButton}>
                            <Text style={theme.smallButtonText}>View Submission</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )) : (
                <View style={theme.card2}>
                    <Text>No assignments created yet.</Text>
                </View>
            )}
            <Modal isVisible={isModalVisible}>
                <View style={theme.modalContent}>
                    <Image source={{ uri: selectedImage }} style={theme.fullSizeImage} />
                    <Button title="Close" onPress={toggleModal} />
                </View>
            </Modal>
        </ScrollView>
    );
}

export default ViewCreatedAssignmentsScreen;
