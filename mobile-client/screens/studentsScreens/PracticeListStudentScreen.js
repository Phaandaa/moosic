import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, Linking } from 'react-native';
import theme from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AssignmentSearchBar from '../../components/ui/assignmentSearchBar';
import trimDate from '../../components/ui/trimDate';
import { useAuth } from '../../context/Authcontext';

function PracticeListStudentScreen({navigation}){
    const { state } = useAuth();
    const [studentID, setStudentID] = useState('');
    const [practiceData, setPracticeData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Check stored data for studentID
    const checkStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
                console.log('PracticeListStudent.js line 21, studentID:', parsedData.userId);
                return parsedData.userId;
            }
        } catch (error) {
            console.error('Error retrieving data from AsyncStorage', error);
        }
        return '';
    };
    useEffect(() => {
        setStudentID(state.userData.id);
    }, []);

    useEffect(() => {
        const fetchPractices = async() => {
            try {
                `${IP_ADDRESS}/practices/student/${studentID}`
                const response = await axios.get(`${IP_ADDRESS}/practices/student/${studentID}`, state.authHeader);
                const responseData = await response.data;

                const sortedData = responseData.sort((a, b) => {
                    return new Date(b.submissionTimestamp) - new Date(a.submissionTimestamp);
                });

                setPracticeData(sortedData); 
                setSearchResults(sortedData);

            } catch (error) {
                console.error('PracticeListStudent.js line 70, Error fetching assignments:', error);
            }
        };
        if(studentID){
            fetchPractices();
        }
    }, [studentID]);

    const handleSearch = (searchText) => {
        if (searchText) {
            const results = practiceData.filter(practice => 
              practice.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setSearchResults(results);
          } else {
            setSearchResults(practiceData);
          }
    };
    
    return (
        <View style={theme.container}>
            <View style={{marginBottom: 10}}>
                <AssignmentSearchBar onSearch={handleSearch} />
            </View>
            <ScrollView>  
                {searchResults.length > 0 ? ( 
                    searchResults.map((practice, index) => (
                        <TouchableOpacity key={index} style={theme.card2} onPress={() => navigation.navigate('ViewPracticeStudentScreen', { practice: practice })}>
                            <View style={theme.cardTextContainer}>
                                <Text style={theme.cardTitle}>{practice.title}</Text>
                                <Text style={theme.cardTextSecondary}>Created on: {trimDate(practice.submissionTimestamp)}</Text>
                            </View>
                            <TouchableOpacity style={theme.smallButton}>
                                <Text style={theme.smallButtonText} onPress={() => navigation.navigate('ViewPracticeStudentScreen', { practice: practice })}>View</Text>
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
export default PracticeListStudentScreen;