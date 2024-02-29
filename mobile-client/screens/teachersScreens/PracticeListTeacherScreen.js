import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Button} from 'react-native';
import theme from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AssignmentSearchBar from '../../components/ui/assignmentSearchBar';

function PracticeListTeacherScreen({route, navigation}){
    const { studentID }  = route.params;

    const [teacherID, setTeacherID] = useState('');
    const [practiceData, setPracticeData] = useState([]);
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
    // Fetch studentID on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await checkStoredData();
                setTeacherID(id);
                console.log('teacherID', teacherID)
            } catch (error) {
                console.error('Error processing stored data', error);
            }
        };
        fetchData();
    }, []);

    // Fetch practices using studentID
    useEffect(() => {
        const fetchPractices = async() => {
            try {
                console.log('teacherstudentID', teacherID, studentID)
                const response = await fetch(`${IP_ADDRESS}/practices/${studentID}/${teacherID}`, {
                    method: 'GET'
                });
                
                if (!response.ok) {
                    const errorText = response.statusText || 'Unknown error occurred';
                    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
                }
                const responseData = await response.json();
                setPracticeData(responseData); // Set the state with the response data
                setSearchResults(responseData);
                console.log(practiceData)
            } catch (error) {
                console.error('Error fetching assignments:', error);
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
        <ScrollView style={theme.container}>
            {/* <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Assignments</Text> */}
                    {/* Search bar */}
            <AssignmentSearchBar onSearch={handleSearch} />
            {searchResults.length > 0 ? ( // Use searchResults here
                searchResults.map((practice, index) => (
                    <TouchableOpacity key={index} style={theme.card2} onPress={() => navigation.navigate('ViewPracticeStudentScreen', { practice: practice })}>
                        <View style={theme.cardTextContainer}>
                            <Text style={theme.cardTitle}>{practice.title}</Text>
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
    );
}
export default PracticeListTeacherScreen;