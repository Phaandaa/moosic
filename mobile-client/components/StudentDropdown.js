import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';

const StudentDropdown = ({ onSelectionChange }) => {
    const [selected, setSelected] = React.useState([]);

    React.useEffect(() => {
        onSelectionChange(selected); // This will call the function passed as a prop with the new selected values
    }, [selected, onSelectionChange]);

    const data = [
        {key: '1', value: 'Jessica'},
        {key: '2', value: 'Michael'},
        {key: '3', value: 'Sarah'},
        {key: '4', value: 'James', disabled:true},
        {key: '5', value: 'Emily'},
        {key: '6', value: 'John'},
        {key: '7', value: 'Olivia'}
    ]
    
    return (
        <View style={styles.dropdownContainer}>
            <MultipleSelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                label='Students'
                onSelect={() => console.log(selected)}
                save="value"
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
