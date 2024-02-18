import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';

const StudentDropdown = ({ onSelectionChange }) => {
    const [selected, setSelected] = useState([]);
    const [students, setStudents] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchUserDataAndStudents = async () => {
          setIsFetching(true);
          try {
            const storedData = await AsyncStorage.getItem('authData');
            if (!storedData) throw new Error('No user data found.');
      
            const parsedData = JSON.parse(storedData);
            const teacherId = parsedData.userId; // Assuming the logged-in user is a teacher.
            console.log('Teacher ID:', teacherId);

            const response = await axios.get(`${IP_ADDRESS}/students/teacher/${teacherId}/`);
            console.log('Response:', response.data); // Log the response data
      
            const data = response.data;
            if (!data.length) throw new Error('No students found.');
      
            // Map over the array of student objects to create the formattedData for the dropdown
            const formattedData = data.map(student => ({
              key: student.id, // Assuming 'id' is the unique identifier for the dropdown
              value: student.name, // The name that will be displayed in the dropdown
            }));
            setStudents(formattedData);
          } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', error.message);
          }
          setIsFetching(false);
        };
      
        fetchUserDataAndStudents();
      }, []);
      
      

    useEffect(() => {
        // Call the passed callback function whenever 'selected' changes
        if (onSelectionChange) {
            onSelectionChange(selected);
        }
    }, [selected, onSelectionChange]);

    return (
        <View style={styles.dropdownBox}>
            <Text style={styles.label}>Select Students</Text>
            {isFetching ? (
                <Text style={styles.loadingText}>Loading students...</Text>
            ) : (
                <MultipleSelectList
                    setSelected={setSelected}
                    data={students}
                    label='Students'
                    badgeStyles={styles.badgeStyles}
                    badgeTextStyles={styles.badgeTextStyles}
                    notFoundText='Student does not exist.'
                    listParentLabelStyle={styles.listParentLabelStyle}
                    dropDownContainer={styles.dropDownContainer}
                    // You may need additional props here depending on the structure of MultipleSelectList
                />
            )}
        </View>  
    );
};
const styles = StyleSheet.create({
    dropdownBox: {
        backgroundColor: '#FFFFFF', // Assuming a white background
        borderWidth: 1,
        borderColor: '#CCCCCC', // Light grey border
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10, // Adjust as needed
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#000000', // Black text for the label
        marginBottom: 10,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 16,
        color: '#CCCCCC', // Light grey text while loading
    },
    badgeStyles: {
        backgroundColor: '#4664EA', // Blue background for selected items
    },
    badgeTextStyles: {
        color: 'white', // White text for selected items
    },
    listParentLabelStyle: {
        fontSize: 16,
    },
    dropDownContainer: {
        borderWidth: 0, // No border for the dropdown itself
    },
    
});

export default StudentDropdown;