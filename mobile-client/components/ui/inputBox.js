import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import theme from '../../styles/theme'

function InputBox({label, placeholder, value, onChangeText, textInputConfig = {}}){
    return (
        <View style={theme.inputOuterContainer}>
            <Text style={theme.inputLabel}>{label}</Text>
            <View style={theme.inputContainer}>
                <View style={theme.inputTextContainer}>
                    <TextInput style={styles.inputText} placeholder={placeholder} value={value} onChangeText={onChangeText} multiline={true} {...textInputConfig} />
                </View>
            </View>
        </View>
    )
}
export default InputBox;

const styles = StyleSheet.create({
    inputContainer: {
        marginHorizonal: 4, 
        marginVertical: 8
    }, 
    label: {
        fontSize: 12, 
        marginBottom: 4
    },
    input: {
        padding: 6,
        borderRadius: 6,
        fontSize: 18,
    //     height: 40,
    // borderColor: 'gray',
    // borderWidth: 1,
    // marginBottom: 20,
    }
})
