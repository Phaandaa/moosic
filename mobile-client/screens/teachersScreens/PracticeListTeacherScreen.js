import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Button} from 'react-native';
import theme from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AssignmentSearchBar from '../../components/ui/assignmentSearchBar';
import trimDate from '../../components/ui/trimDate';
import { useAuth } from '../../context/Authcontext';
import axios from 'axios';

function PracticeListTeacherScreen({route, navigation}){
    const { state } = useAuth();
    const { studentID, studentName }  = route.params;
    const [teacherID, setTeacherID] = useState('');
    const [practiceData, setPracticeData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Check stored data for teacherID
    const checkStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                console.log('PracticeListTeacherScreen.js line 22, teacherID:', parsedData.userId);
                return parsedData.userId;
            }
        } catch (error) {
            console.error('PracticeListTeacherScreen.js line 26, Error retrieving data from AsyncStorage: ', error);
        }
        return '';
    };
    // Fetch studentID on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await checkStoredData();
                setTeacherID(id);
                console.log('PracticeListTeacherScreen.js line 36, teacherID: ', teacherID)
            } catch (error) {
                console.error('PracticeListTeacherScreen.js line 38, Error processing stored data: ', error);
            }
        };
        fetchData();
    }, []);

    // Fetch practices using studentID
    useEffect(() => {
        const fetchPractices = async() => {
            try {
                const response = await axios.get(`${IP_ADDRESS}/practices/${studentID}/${teacherID}`, state.authHeader);
                const responseData = response.data;

                const sortedData = responseData.sort((a, b) => {
                    return new Date(b.submissionTimestamp) - new Date(a.submissionTimestamp);
                });

                setPracticeData(sortedData); // Set the state with the response data
                setSearchResults(sortedData);

                console.log('PracticeListTeacherScreen.js line 69, practiceDate[0]: ', practiceData[0])
            } catch (error) {
                console.error('PracticeListTeacherScreen.js line 71, Error fetching practice:', error);
            }
        };
        if(teacherID){
            fetchPractices();
        }
    }, [studentID, teacherID]);

    const handleSearch = (searchText) => {
        // Filter the assignmentData based on whether the assignment title includes the searchText
        if (searchText) {
            // Filter the assignmentData based on whether the assignment title includes the searchText
            const results = practiceData.filter(practice => 
              practice.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setSearchResults(results);
          } else {
            // If the search text is empty, reset the search results to the full assignment data
            setSearchResults(practiceData);
          }
    };
    
    return (
        <View style={theme.container}>
            {/* <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Assignments</Text> */}
                    {/* Search bar */}
            <View style={{marginBottom: 10}}>
                <Text style={theme.cardTitle}>Practice Log for {studentName}</Text>
                <AssignmentSearchBar onSearch={handleSearch} />
            </View>
            <ScrollView> 
                {searchResults.length > 0 ? ( // Use searchResults here
                    searchResults.map((practice, index) => (
                        <TouchableOpacity key={index} style={theme.card2} onPress={() => navigation.navigate('ViewPracticeTeacherScreen', { practice: practice })}>
                            <View style={theme.cardTextContainer}>
                                <Text style={theme.cardTitle}>{practice.title}</Text>
                                <Text style={theme.cardTextSecondary}>Created on: {trimDate(practice.submissionTimestamp)}</Text>
                            </View>
                            <TouchableOpacity style={theme.smallButton}>
                                <Text style={theme.smallButtonText} onPress={() => navigation.navigate('ViewPracticeTeacherScreen', { practice: practice })}>View</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={theme.card2}>
                    <Text>No practice found.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
export default PracticeListTeacherScreen;