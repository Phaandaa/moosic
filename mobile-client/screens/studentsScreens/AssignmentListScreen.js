import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, Linking } from 'react-native';
import theme from '../../styles/theme';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AssignmentSearchBar from '../../components/ui/assignmentSearchBar';
import trimDate from '../../components/ui/trimDate';

function AssignmentListScreen({navigation}){
    const [studentID, setStudentID] = useState('');
    const [assignmentData, setAssignmentData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Check stored data for studentID
    const checkStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                console.log('AssignmentList.js line 23, studentID:', parsedData.userId);
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
                console.log("AssignmentList.js line 37, student ID: ", studentID)
            } catch (error) {
                console.error("AssignmentList.js line 39, Error processing stored data: ", error);
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
                const sortedData = responseData.sort((a, b) => {
                    // Assuming the deadline is in a format that can be directly compared, like 'YYYY-MM-DD'
                    // If the date format is different, you may need to parse it to a Date object first
                    return new Date(b.createdAtDate) - new Date(a.createdAtDate);
                });

                setAssignmentData(sortedData); // Set the state with the response data
                setSearchResults(sortedData); // Assuming you also want to filter

                console.log("AssignmentList.js line 67: ", assignmentData)
            } catch (error) {
                console.error('AssignmentList.js line 69, Error fetching assignments:', error);
            }
        };
        if(studentID){
            fetchAssignments();
        }
    }, [studentID]);

    const handleSearch = (searchText) => {
        // Filter the assignmentData based on whether the assignment title includes the searchText
        if (searchText) {
            // Filter the assignmentData based on whether the assignment title includes the searchText
            const results = assignmentData.filter(assignment => 
              assignment.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setSearchResults(results);
          } else {
            // If the search text is empty, reset the search results to the full assignment data
            setSearchResults(assignmentData);
          }
    };
    
    return (
        <View style={theme.container}>
            <View style={{marginBottom: 10}}>
                <AssignmentSearchBar onSearch={handleSearch} />
            </View>
            <ScrollView >
                {/* <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Assignments</Text> */}
                        {/* Search bar */}
                {searchResults.length > 0 ? ( // Use searchResults here
                    searchResults.map((assignment, index) => (
                        <TouchableOpacity key={index} style={theme.card2} onPress={() => navigation.navigate('ViewAssignmentsScreen', { assignment: assignment })}>
                            <View style={theme.cardTextContainer}>
                                <Text style={theme.cardTitle}>{assignment.title}</Text>
                                <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text>
                                <Text style={theme.cardTextSecondary}>Created on: {trimDate(assignment.createdAtDate)}</Text>
                            </View>
                            <TouchableOpacity style={theme.smallButton}>
                                <Text style={theme.smallButtonText} onPress={() => navigation.navigate('ViewAssignmentsScreen', { assignment: assignment })}>View</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={theme.card2}>
                    <Text>No assignments found.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
export default AssignmentListScreen;