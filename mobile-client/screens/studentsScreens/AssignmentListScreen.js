import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, Linking } from 'react-native';
import theme from '../../styles/theme';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';

function AssignmentListScreen({navigation}){
    const [studentID, setStudentID] = useState('');
    const [assignmentData, setAssignmentData] = useState([]);

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
            } catch (error) {
                console.error('Error fetching assignments:', error);
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
                    <TouchableOpacity key={index} style={theme.card2} onPress={() => navigation.navigate('ViewAssignmentsScreen', { assignment: assignment })}>
                        <View style={theme.cardTextContainer}>
                            <Text style={theme.cardTitle}>{assignment.title}</Text>
                            <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text>
                        </View>
                        <TouchableOpacity style={theme.smallButton}>
                            <Text style={theme.smallButtonText} onPress={() => navigation.navigate('ViewAssignmentsScreen', { assignment: assignment })}>View</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={theme.card2}>
                    <Text>No assignments created yet.</Text>
                </View>
            )}
        </ScrollView>
    );
}
export default AssignmentListScreen;