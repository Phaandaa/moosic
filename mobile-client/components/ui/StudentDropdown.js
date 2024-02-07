import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';

const StudentDropdown = ({ onSelectionChange }) => {
    const [selected, setSelected] = useState([]);
    const [students, setStudents] = useState([]);
    // const teacherID = 'WA2G3fxLzNSdKWwerstzG7siTfu1';

    useEffect(() => {
        // Call the passed callback function whenever 'selected' changes
        onSelectionChange(selected);
    }, [selected]);
    

    useEffect(() => {
        fetchStudents();   
        // onSelectionChange(selected); // This will call the function passed as a prop with the new selected values
    }, []);

    // useEffect(() => {

    // }, [selected, onSelectionChange]); 

    // const teacherID = 

    const fetchStudents = async() => {
        try {
            const response = await axios.get(`http://192.168.1.47:8080/students/teacher/WA2G3fxLzNSdKWwerstzG7siTfu1/`);
            const data = response.data;
            const formattedData = data.map(student => ({
                key: student.id,
                value: student.name,
            }));
            setStudents(formattedData);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    // const data = [
    //     {key: '1', value: 'Jessica'},
    //     {key: '2', value: 'Michael'},
    //     {key: '3', value: 'Sarah'},
    //     {key: '4', value: 'James', disabled:true},
    //     {key: '5', value: 'Emily'},
    //     {key: '6', value: 'John'},
    //     {key: '7', value: 'Olivia'}
    // ]
    
    return (
        <View style={styles.dropdownContainer}>
            <MultipleSelectList
                setSelected={(val) => setSelected(val)}
                data={students}
                label='Students'
                onSelect={() => console.log(selected)}
                save="key"
                // fontFamily='regular'
                // labelStyles={{fontWeight: '900', color:'red'}}
                notFoundText='Student does not exist.'
                badgeStyles={{backgroundColor:'#4664EA'}}
                badgeTextStyles={{color:'white'}}
                // checkBoxStyles={{backgroundColor:'#4664EA', borderWidth:0}}
                // disabledCheckBoxStyles={{backgroundColor:'black'}}
                // disabledItemStyles={{backgroundColor:'gray'}}
                // disabledTextStyles={{backgroundColor:'red'}}
            />
        </View>  
    )
};

export default StudentDropdown; 

const styles = StyleSheet.create({
    dropdownContainer:{
        paddingHorizontal: 20, 
        paddingTop:20,
    }

});
