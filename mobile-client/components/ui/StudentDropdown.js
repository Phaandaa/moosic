import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import Colors from '../../constants/colors';

const StudentDropdown = ({ onSelectionChange }) => {
    const [selected, setSelected] = useState([]);
    const [students, setStudents] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchUserDataAndStudents = async () => {
          setIsFetching(true);
          try {
            const storedData = await AsyncStorage.getItem('authData');
            if (!storedData) {
              throw new Error('No user data found.');
            }
            const parsedData = JSON.parse(storedData);
            const userId = parsedData.userId; // Make sure this is the correct key for userId
            const response = await axios.get(`${IP_ADDRESS}/students/teacher/${userId}/`);

            const formattedData = response.data.map(student => ({
              key: student.id, // Ensure the key is a string
              value: student.name,
            }));
            setStudents(formattedData); // Update the students state with formatted data
          } catch (error) {
            Alert.alert('Error', error.toString());
          } finally {
            setIsFetching(false);
          }
        };
      
        fetchUserDataAndStudents();
      }, []);
      

      useEffect(() => {
        if (onSelectionChange && Array.isArray(selected)) {
          onSelectionChange(selected);
        }
      }, [selected]);
      


    return (
        <View style={styles.dropdownBox}>
            <Text style={styles.label}>Select Students</Text>
            {isFetching ? (
                <Text style={styles.loadingText}>Loading students...</Text>
            ) : (
                <MultipleSelectList
                    setSelected={(val) => setSelected(val)}
                    data={students}
                    label='Students'
                    badgeStyles={styles.badgeStyles}
                    badgeTextStyles={styles.badgeTextStyles}
                    notFoundText='Student does not exist.'
                    listParentLabelStyle={styles.listParentLabelStyle}
                    dropDownContainer={styles.dropDownContainer}
                    save="key"
                    onSelect={() => console.log('StudentDropdown.js line 66, selectedstudent: ',selected)}
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
        backgroundColor: Colors.mainPurple,
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