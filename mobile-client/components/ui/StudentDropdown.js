import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import Colors from '../../constants/colors';
import { useAuth } from '../../context/Authcontext'

const StudentDropdown = ({ onSelectionChange }) => {
    const { state } = useAuth();
    const [selected, setSelected] = useState([]);
    const [students, setStudents] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchUserDataAndStudents = async () => {
          setIsFetching(true);
          try {
            
            const response = await axios.get(`${IP_ADDRESS}/students/teacher/${state.userData.id}/`, state.authHeader);
            const formattedData = response.data.map(student => ({
              key: student.id, 
              value: student.name,
            }));
            setStudents(formattedData);
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
        backgroundColor: '#FFFFFF', 
        borderWidth: 1,
        borderColor: '#CCCCCC', 
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10, 
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#000000', 
        marginBottom: 10,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 16,
        color: '#CCCCCC', 
    },
    badgeStyles: {
        backgroundColor: Colors.mainPurple,
    },
    badgeTextStyles: {
        color: 'white', 
    },
    listParentLabelStyle: {
        fontSize: 16,
    },
    dropDownContainer: {
        borderWidth: 0, 
    },
    
});

export default StudentDropdown;