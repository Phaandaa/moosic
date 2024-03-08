import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, Linking } from 'react-native';
import theme from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import IP_ADDRESS from '../../constants/ip_address_temp';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop().slice(37);
};

function CreatedAssignmentDetailsScreen({route, navigation}) {
    const { assignment } = route.params;
    console.log('createdassignment', assignment)

    const deleteAssignment = async() => {
        console.log('assignmentId', assignment.assignmentId)
        try {
            const response = await fetch(`${IP_ADDRESS}/assignments/${assignment.assignmentId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorText = response.statusText || 'Unknown error occurred';
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            Alert.alert('Success', 'Assignment has been removed!');

            navigation.goBack();

        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    return (
        <ScrollView style={theme.container}>
            {/* <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Assignments</Text> */}
                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            
                            <Text style={theme.cardTitle}>{assignment.title}</Text>
                            <Text style={theme.cardText}>{assignment.description}</Text>
                            <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text>
                            {/* <Text style={theme.cardText}>Attachments:</Text> */}
                            {assignment.assignmentDocumentLinks.map((link, linkIndex) => (
                                <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                                </TouchableOpacity>
                            ))}
                            <View style={theme.buttonContainer2}>
                                <TouchableOpacity style={theme.smallPinkButton} onPress={() => navigation.navigate('EditAssignmentScreen', { assignment })}>
                                    <Text style={theme.smallButtonText}>Edit Assignment</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={theme.smallPinkButton} onPress={deleteAssignment}>
                                    <Text style={theme.smallButtonText}>Delete Assignment</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {assignment.submissionLinks && assignment.submissionLinks.length > 0 ? (
                        <View style={theme.card3}>
                            <View style={theme.cardTextContainer}>
                                <View style={theme.oneRow}> 
                                    <Text style={theme.cardTitlePink}>Submission</Text>
                                </View>
                                
                                {assignment.submissionLinks.map((link, linkIndex) => (
                                    <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="link" size={24} color="#525F7F" />
                                        <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                                    </TouchableOpacity>
                                ))}
                                <Text style={theme.cardText}>{assignment.studentComment}</Text>
                                <View style={theme.buttonContainer2}>
                                    <TouchableOpacity style={theme.smallPinkButton} onPress={() => navigation.navigate('ProvideAssignmentFeedbackScreen', {assignmentID : assignment.assignmentId})}>
                                        <Text style={theme.smallButtonText}>Give Feedback</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={theme.card3}>
                            <View style={theme.cardTextContainer}>
                                <View style={theme.oneRow}>
                                    <Text style={theme.cardText}>No submission yet.</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            <View style={theme.oneRow}> 
                                <Text style={theme.cardTitlePink}>Feedback</Text>
                                <View style={theme.smallPinkButton}>
                                    <Text style={theme.smallButtonText}>{assignment.points} Points</Text>
                                </View>
                            </View>
                
                            {assignment.feedbackDocumentLinks && assignment.feedbackDocumentLinks.map((link, linkIndex) => (
                                <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                                </TouchableOpacity>
                            ))}
                            <Text style={theme.cardText}>{assignment.teacherFeedback}</Text>
                        </View>
                    </View>
                    



        </ScrollView>
    );
}

export default CreatedAssignmentDetailsScreen;


