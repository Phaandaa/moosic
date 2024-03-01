import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, Alert, StyleSheet,View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomepageSearchBar from '../../components/ui/homepageSearchbar';
import theme from '../../styles/theme';
import IP_ADDRESS from '../../constants/ip_address_temp';

function MyStudentsScreen({ navigation }) {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [teacherID, setTeacherID] = useState('');
    const [fetchError, setFetchError] = useState(false);

    

    // Check stored data for teacherID
    const checkStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('authData');
            if (storedData !== null) {
                const parsedData = JSON.parse(storedData);
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
            } catch (error) {
                console.error('Error processing stored data', error);
            }
        };
        fetchData();
    }, []);

    // Fetch students using teacherID
    useEffect(() => {
        const fetchStudentsApi = `${IP_ADDRESS}/students/teacher/${teacherID}/`;
        const fetchStudents = async() => {
            try {
                const response = await axios.get(fetchStudentsApi);
                const data = response.data;
                
                if (data.length > 0) {
                    setStudents(data);
                    setFilteredStudents(data);
                } else {
                    // If the response is successful but contains no data
                    setFetchError(true);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                setFetchError(true);
            }
        };
        if(teacherID){
            fetchStudents();
        }
    }, [teacherID]);

    // Handle search functionality
    const handleSearch = (query) => {
        if (!query.trim()) {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student =>
                student.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    };

    return (
        <ScrollView style={theme.container}>
            <HomepageSearchBar onSearch={handleSearch} />
            
            {fetchError ? (
                <Text style={[theme.textTitle, {marginTop: 10}]}>You have no students.</Text>
            ) : (
                <>
                    <Text style={[theme.textTitle, {marginTop: 10}]}>My Students</Text>
                    {filteredStudents.map((student, index) => (
                        student.name ? (
                            <TouchableOpacity key={index} style={styles.card}>
                                <View style={styles.cardTextContainer}>
                                    <Text style={theme.cardTextBold}>{student.name || "Unnamed Student"}</Text>
                                </View>
                                <View style={theme.buttonContainer}>
                                    <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('PracticeListTeacherScreen')}>
                                        <Text style={theme.smallButtonText}>Practice</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('CreatedAssignmentsListScreen', { studentID: student.id })}>
                                        <Text style={theme.smallButtonText}>Assignments</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ) : null
                    ))}
                    
                </>
            )}
            
        </ScrollView>
    );    
}

export default MyStudentsScreen;

// Styles remain the same


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#EE97BC',
        padding: 20,
        borderRadius: 15,
        marginTop: 10, 
        flexDirection: 'row',
        justifyContent: 'space-between', // Align items on both ends
        alignItems: 'center', // Center items vertically
        
    },
    cardTextContainer: {
        flex: 1, // Take up as much space as possible
        marginRight: 8, // Add some margin to the right of the text
    },
    cardText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        // If you need space between buttons add justifyContent: 'space-between',
    },
    smallButton: {
        backgroundColor: '#4664EA',
        padding: 10,
        borderRadius: 15,
        marginLeft: 8, // Add some margin to separate the buttons
    },
    smallButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    }
})
