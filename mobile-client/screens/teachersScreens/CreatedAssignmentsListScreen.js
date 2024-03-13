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


function CreatedAssignmentsListScreen ({route, navigation}) {
    const dispatch = useDispatch();
    const cacheStudentID = useSelector(state => state.cache.studentID); // Assuming you have set up the Redux slice correctly
    const cacheStudentName = useSelector(state => state.cache.studentID); // Assuming you have set up the Redux slice correctly

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
                        // Sort assignments by deadline in descending order
                        const sortedData = responseData.sort((a, b) => {
                            // Assuming the deadline is in a format that can be directly compared, like 'YYYY-MM-DD'
                            // If the date format is different, you may need to parse it to a Date object first
                            return new Date(b.createdAtDate) - new Date(a.createdAtDate);
                        });

                        setAssignmentData(sortedData); // Set the state with the response data
                        setSearchResults(sortedData); // Assuming you also want to filter
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
        <View style={theme.container}>
            {/* <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Assignments</Text> */}
                    {/* Search bar */}
            <View style={{marginBottom: 10}}>
                <Text style={theme.cardTitle}>Assignments for {studentName}</Text>
                <AssignmentSearchBar onSearch={handleSearch} />
            </View>
            <ScrollView>
            {searchResults.length > 0 ? ( // Use searchResults here
                searchResults.map((assignment, index) => (
                    <TouchableOpacity key={index} style={theme.card2} onPress={() => navigation.navigate('CreatedAssignmentDetailsScreen', { assignment: assignment })}>
                        <View style={theme.cardTextContainer}>
                            <Text style={theme.cardTitle}>{assignment.title}</Text>
                            <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color={Colors.fontPrimary} /> {assignment.deadline}</Text>
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
