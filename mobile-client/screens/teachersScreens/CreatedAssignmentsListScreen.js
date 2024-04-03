import React, { useState,useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Button, Linking } from 'react-native';
import theme from '../../styles/theme';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AssignmentSearchBar from '../../components/ui/assignmentSearchBar';
import { useDispatch } from 'react-redux';
import { setCache } from '../../cacheSlice';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../constants/colors';
import trimDate from '../../components/ui/trimDate';
import { useAuth } from '../../context/Authcontext'
import axios from 'axios';

function CreatedAssignmentsListScreen ({route, navigation}) {
    const dispatch = useDispatch();
    const cacheStudentID = useSelector(state => state.cache.studentID); 
    const cacheStudentName = useSelector(state => state.cache.studentID); 

    const { state } = useAuth();
    const [teacherID, setTeacherID] = useState('');
    const [studentID, setStudentID] = useState(cacheStudentID || '');
    const [studentName, setStudentName] = useState(cacheStudentName || '');


    const updateStudentIDCache = async (newStudentID) => {
        dispatch(setCache({ key: 'studentID', value: newStudentID }));
        await AsyncStorage.setItem('studentID', JSON.stringify(newStudentID));
    };

    const updateStudentNameCache = async (newStudentName) => {
        dispatch(setCache({ key: 'studentName', value: newStudentName }));
        await AsyncStorage.setItem('studentName', JSON.stringify(newStudentName));
    };

    useEffect(() => {
        if (route.params?.studentID && route.params.studentID !== studentID) {
            setStudentID(route.params.studentID);
            updateStudentIDCache(route.params.studentID);
        }
        if (route.params?.studentName && route.params.studentName !== studentName) {
            setStudentName(route.params.studentName);
            updateStudentNameCache(route.params.studentName);
        }
    }, [route.params]);

    
    useFocusEffect(
        React.useCallback(() => {
            const fetchCreatedAssignments = async () => {
                if (teacherID && studentID) {
                    try {
                        const response = await axios.get(`${IP_ADDRESS}/assignments/${studentID}/${teacherID}`, state.authHeader);
                        const responseData = response.data;
                        const sortedData = responseData.sort((a, b) => {
                            return new Date(b.createdAtDate) - new Date(a.createdAtDate);
                        });

                        setAssignmentData(sortedData); 
                        setSearchResults(sortedData); 
                    } catch (error) {
                        console.error('Error fetching assignments:', error);
                    }
                }
            };

            fetchCreatedAssignments();
        }, [teacherID, studentID]) 
    );
         
    const [assignmentData, setAssignmentData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

     const checkStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                console.log('CreateAssignmentListScreen.js line 99, teacherID:', parsedData.userId);
                return parsedData.userId;
            }
        } catch (error) {
            console.error('CreateAssignmentListScreen.js line 103, Error retrieving data from AsyncStorage', error);
        }
        return '';
    };

    useEffect(() => {
        setTeacherID(state.userData.id);
    }, []);

    useEffect(() => {
        const fetchCreatedAssignments = async() => {
            console.group('CreateAssignmentListScreen.js line 125, studentID: ', studentID)
            try {
                const response = await axios.get(`${IP_ADDRESS}/assignments/${studentID}/${teacherID}`, state.authHeader);
                
                const responseData = response.data;
                setAssignmentData(responseData); 
                setSearchResults(responseData);
            } catch (error) {
                console.error('CreateAssignmentListScreen.js line 139, Error fetching assignments:', error);
            }
        };
        if(teacherID){
            fetchCreatedAssignments();
        }
    }, [studentID, teacherID]);

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
                <Text style={theme.cardTitle}>Assignments for {studentName}</Text>
                <AssignmentSearchBar onSearch={handleSearch} />
            </View>
            <ScrollView>
            {searchResults.length > 0 ? ( 
                searchResults.map((assignment, index) => (
                    <TouchableOpacity key={index} style={theme.card2} onPress={() => navigation.navigate('CreatedAssignmentDetailsScreen', { assignment: assignment })}>
                        <View style={theme.cardTextContainer}>
                            <Text style={theme.cardTitle}>{assignment.title}</Text>
                            <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color={Colors.fontPrimary} /> {assignment.deadline}</Text>
                            <Text style={theme.cardTextSecondary}>Created on: {trimDate(assignment.createdAtDate)}</Text>

                        </View>
                        <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('CreatedAssignmentDetailsScreen', { assignment: assignment })}>
                            <Text style={theme.smallButtonText}>View</Text>
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

export default CreatedAssignmentsListScreen;
