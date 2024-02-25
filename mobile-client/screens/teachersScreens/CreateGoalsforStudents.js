import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import theme from '../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateGoalsforStudents = ({ navigation }) => {

    return (
        <View style={[theme.container, {paddingBottom: 0}]}>
            <Text> Create Goals for Students </Text>
        </View>
    );
}



export default CreateGoalsforStudents;