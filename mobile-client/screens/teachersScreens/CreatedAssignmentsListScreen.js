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


function CreatedAssignmentsListScreen ({route, navigation}) {
    const dispatch = useDispatch();
    const cacheStudentID = useSelector(state => state.cache.studentID); // Assuming you have set up the Redux slice correctly

    const [teacherID, setTeacherID] = useState('');
    const [studentID, setStudentID] = useState(cacheStudentID || '');

    const updateStudentIDCache = async (newStudentID) => {
        dispatch(setCache({ key: 'studentID', value: newStudentID }));
        await AsyncStorage.setItem('studentID', JSON.stringify(newStudentID));
    };

    useEffect(() => {
        if (route.params?.studentID && route.params.studentID !== studentID) {
            setStudentID(route.params.studentID);
            updateStudentIDCache(route.params.studentID);
        }
    }, [route.params]);

    
    useFocusEffect(
        React.useCallback(() => {
            // Function that fetches the assignments
            const fetchCreatedAssignments = async () => {
                // Check if we have a valid teacherID and studentID before fetching
                if (teacherID && studentID) {
                    try {
                        const response = await fetch(`${IP_ADDRESS}/assignments/${studentID}/${teacherID}`, {
                            method: 'GET'
                        });
                        
                        if (!response.ok) {
                            const errorText = response.statusText || 'Unknown error occurred';
                            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
                        }

                        const responseData = await response.json();
                        setAssignmentData(responseData); // Set the state with the response data
                        setSearchResults(responseData); // Assuming you also want to filter
                    } catch (error) {
                        console.error('Error fetching assignments:', error);
                    }
                }
            };

            fetchCreatedAssignments();
        }, [teacherID, studentID]) // Dependencies array
    );

    // const {studentID} = route.params
    // const dispatch = useDispatch();
    // dispatch(setCache({ key: 'studentID', value: studentID }));

    // const assignmentDataAll = useSelector(state => state.cache.assignmentDataAll) || []; 
         
    const [assignmentData, setAssignmentData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

     // Check stored data for teacherID
     const checkStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                console.log('teacherID:', parsedData.userId);
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
                console.log(teacherID)
            } catch (error) {
                console.error('Error processing stored data', error);
            }
        };
        fetchData();
    }, []);

    // Fetch assignments using teacherID
    useEffect(() => {
        const fetchCreatedAssignments = async() => {
            console.group('studentID', studentID)
            try {
                const response = await fetch(`${IP_ADDRESS}/assignments/${studentID}/${teacherID}`, {
                    method: 'GET'
                });
                
                if (!response.ok) {
                    const errorText = response.statusText || 'Unknown error occurred';
                    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
                }
                const responseData = await response.json();
                setAssignmentData(responseData); // Set the state with the response data
                setSearchResults(responseData); // Assuming you also want to filter
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };
        if(teacherID){
            fetchCreatedAssignments();
        }
    }, [studentID, teacherID]);

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
        <ScrollView style={theme.container}>
            {/* <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Assignments</Text> */}
                    {/* Search bar */}
            <AssignmentSearchBar onSearch={handleSearch} />
            {searchResults.length > 0 ? ( // Use searchResults here
                searchResults.map((assignment, index) => (
                    <TouchableOpacity key={index} style={theme.card2} onPress={() => navigation.navigate('CreatedAssignmentDetailsScreen', { assignment: assignment })}>
                        <View style={theme.cardTextContainer}>
                            <Text style={theme.cardTitle}>{assignment.title}</Text>
                            <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text>
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
    );
}

export default CreatedAssignmentsListScreen;
