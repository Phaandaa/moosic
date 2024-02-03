import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import theme from '../../screens/styles/theme';

function InputBox({label, value, onChangeText, textInputConfig = {}}){
    return (
        <View style={theme.card2}>
            <View style={theme.cardTextContainer}>
                <Text style={theme.cardTitle}>{label}</Text>
                <TextInput style={styles.input} value={value} onChangeText={onChangeText} {...textInputConfig} />
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
