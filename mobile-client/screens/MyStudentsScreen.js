import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import theme from '../styles/theme';
import axios from 'axios';
import  IP_ADDRESS  from '../constants/ip_address_temp';


function MyStudentsScreen({ navigation }) {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async() => {
        try {
            const response = await axios.get(`${IP_ADDRESS}/students/teacher/WA2G3fxLzNSdKWwerstzG7siTfu1/`);
            const data = response.data;
            // const formattedData = data.map(student => ({
            //     key: student.id,
            //     value: student.name,
            // }));
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }


    // const fetchStudents = async () => {
    //     try {
    //         const response = await fetch('http://192.168.1.47:8080/students'); // Use your actual API URL here
    //         const data = await response.json();
    //         setStudents(data);
    //     } catch (error) {
    //         Alert.alert("Error", "Could not fetch students");
    //         console.error(error);
    //     }
    // };

    return (
        <ScrollView style={theme.container}>
            {students.map((student, index) => (
                student.name ? (
                    <TouchableOpacity key={index} style={theme.card}>
                        <View style={theme.cardTextContainer}>
                            <Text style={theme.cardTextBold}>{student.name || "Unnamed Student"}</Text>
                        </View>
                        <View style={theme.buttonContainer}>
                            <TouchableOpacity style={theme.smallButton}>
                                <Text style={theme.smallButtonText} onPress={() => navigation.navigate('PracticeListTeacherScreen')}>Practice</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={theme.smallButton}>
                                <Text style={theme.smallButtonText} onPress={() => navigation.navigate('ViewCreatedAssignmentsScreen', { studentId: student.id })}>Assignments</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ) : null
            ))}
        </ScrollView>
    );
}

export default MyStudentsScreen;

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
