import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, Linking } from 'react-native';
import theme from '../../styles/theme';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop();
  };
function ViewAssignmentsScreen({navigation}) {
    // const assignmentDataAll = useSelector(state => state.cache.assignmentDataAll) || []; 
    // Added a fallback to an empty array to ensure assignmentDataAll is always an array
     
    // console.log('assignmentDataAll', assignmentDataAll)
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [studentID, setStudentID] = useState('');
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
                console.log('studentID:', parsedData.userId);
                return parsedData.userId;
            }
        } catch (error) {
            console.error('Error retrieving data from AsyncStorage', error);
        }
        return '';
    };

    // Fetch studentID on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await checkStoredData();
                setStudentID(id);
                console.log(studentID)
            } catch (error) {
                console.error('Error processing stored data', error);
            }
        };
        fetchData();
    }, []);

    // Fetch assignments using studentID
    useEffect(() => {
        const fetchAssignments = async() => {
            try {
                const response = await fetch(`${IP_ADDRESS}/assignments/student/${studentID}`, {
                    method: 'GET'
                });
                
                if (!response.ok) {
                    const errorText = response.statusText || 'Unknown error occurred';
                    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
                }
                const responseData = await response.json();
                setAssignmentData(responseData); // Set the state with the response data
                console.log(assignmentData)
                setFilteredAssignments(responseData); // Assuming you also want to filter
                setFetchError(false); // Set fetch error as false since the fetch was successful
            } catch (error) {
                console.error('Error fetching assignments:', error);
                setFetchError(true);
            }
        };
        if(studentID){
            fetchAssignments();
        }
    }, [studentID]);

    return (
        <ScrollView style={theme.container}>
            {/* <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Assignments</Text> */}
            {assignmentData.length > 0 ? (
                assignmentData.map((assignment, index) => (
                    <View key={index} style={theme.card2}>
                        <View style={theme.cardTextContainer}>
                            <Text style={theme.cardTitle}>{assignment.title}</Text>
                            <Text style={theme.cardText}>Description: {assignment.description}</Text>
                            <Text style={theme.cardText}>Deadline: {assignment.deadline}</Text>
                            <Text style={theme.cardText}>Attachments:</Text>
                            {assignment.assignmentDocumentLinks.map((link, linkIndex) => (
                                <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={theme.buttonContainer2}>
                            <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('SubmitAssignmentScreen')}>
                                <Text style={theme.smallButtonText}>Submit Assignment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={theme.smallButton}>
                                <Text style={theme.smallButtonText}>View Feedback</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            ) : (
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

export default ViewAssignmentsScreen;
