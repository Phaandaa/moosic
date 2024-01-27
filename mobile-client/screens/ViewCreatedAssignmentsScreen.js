import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';

function ViewCreatedAssignmentsScreen({}){
    return (
        <ScrollView style={theme.container}>
        <View> 
            <View style={theme.card2}>
                <View style={theme.cardTextContainer}>
                    <Text style={theme.cardTitle}>Music Theory Grade 2</Text>
                    <Text style={theme.cardText}>Description: Do page 2-5 of Music Theory Grade 2</Text>
                    <Text style={theme.cardText}>Deadline: 27/05/2024</Text>
                    <Text style={theme.cardText}>Created on: 20/05/2024</Text>
                </View>
                <View style={theme.buttonContainer2}> 
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>View Submission</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>Give Feedback</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </ScrollView>
    )
}; 
export default ViewCreatedAssignmentsScreen;
