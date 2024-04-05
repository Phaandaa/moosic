import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Button} from 'react-native';
import theme from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AssignmentSearchBar from '../../components/ui/assignmentSearchBar';
import trimDate from '../../components/ui/trimDate';
import { useAuth } from '../../context/Authcontext';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

function PracticeListTeacherScreen({route, navigation}){
    const { state } = useAuth();
    const { studentID, studentName }  = route.params;
    const [teacherID, setTeacherID] = useState('');
    const [practiceData, setPracticeData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setTeacherID(state.userData.id);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
          const fetchPractices = async () => {
            if (teacherID && studentID) {
              try {
                const response = await axios.get(`${IP_ADDRESS}/practices/${studentID}/${teacherID}`, state.authHeader);
                const responseData = response.data;
                const sortedData = responseData.sort((a, b) => {
                  return new Date(b.submissionTimestamp) - new Date(a.submissionTimestamp);
                });
    
                setPracticeData(sortedData); 
                setSearchResults(sortedData);
              } catch (error) {
                console.error('PracticeListTeacherScreen.js line 71, Error fetching practice:', error);
              }
            }
          };
    
          fetchPractices();
        }, [teacherID, studentID])
    );
    

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
                <Text style={theme.cardTitle}>Practice Log for {studentName}</Text>
                <AssignmentSearchBar onSearch={handleSearch} />
            </View>
            <ScrollView> 
                {searchResults.length > 0 ? ( 
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