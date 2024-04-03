import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, Linking } from 'react-native';
import theme from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AssignmentSearchBar from '../../components/ui/assignmentSearchBar';
import trimDate from '../../components/ui/trimDate';
import { useAuth } from '../../context/Authcontext';

function AssignmentListScreen({navigation}){
    const { state } = useAuth();
    const [assignmentData, setAssignmentData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchAssignments = async() => {
            try {
                const response = await axios.get(`${IP_ADDRESS}/assignments/student/${state.userData.id}`, state.authHeader);
                const responseData = response.data;
                setAssignmentData(responseData); 
                setSearchResults(responseData); 
            } catch (error) {
                console.error('AssignmentList.js line 25, Error fetching assignments:', error);
            }
        };
        
        fetchAssignments();
    }, [state.userData.id]);

    const handleSearch = (searchText) => {
        if (searchText) {
            const results = assignmentData.filter(assignment => 
              assignment.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setSearchResults(results);
          } else {
            setSearchResults(assignmentData);
          }
    };
    
    return (
        <View style={theme.container}>
            <View style={{marginBottom: 10}}>
                <AssignmentSearchBar onSearch={handleSearch} />
            </View>
            <ScrollView >
                {searchResults.length > 0 ? ( 
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