import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, Linking } from 'react-native';
import theme from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop().slice(37);
};
function ViewAssignmentsScreen({route, navigation}) {
    const { assignment } = route.params;
    console.log('assignment:', assignment)

    // const assignmentDataAll = useSelector(state => state.cache.assignmentDataAll) || []; 

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
                        </View>
                        <View style={theme.buttonContainer2}>
                            <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('SubmitAssignmentScreen', {assignmentID: assignment.assignmentId})}>
                                <Text style={theme.smallButtonText}>Submit Assignment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            <View style={theme.oneRow}> 
                                <Text style={theme.cardTitlePink}>My Submission</Text>
                                {/* <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text> */}
                                {/* <Text style={theme.cardText}>Attachments:</Text> */}

                            </View>
                            {assignment.submissionLinks.map((link, linkIndex) => (
                                <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                                </TouchableOpacity>
                            ))}
                            <Text style={theme.cardText}>{assignment.studentComment}</Text>
                        </View>
                    </View>

                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            <View style={theme.oneRow}> 
                                <Text style={theme.cardTitlePink}>Feedback</Text>
                                {/* <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text> */}
                                {/* <Text style={theme.cardText}>Attachments:</Text> */}
                                    <View style={theme.smallPinkButton}>
                                        <Text style={theme.smallButtonText}>{assignment.points} Points</Text>
                                    </View>
                            </View>
                            {assignment.feedbackDocumentLinks.map((link, linkIndex) => (
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

export default ViewAssignmentsScreen;


