import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, Linking } from 'react-native';
import theme from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop().slice(37);
};
const trimDate = (date) => {
    return date.slice(0, 10) + ' ' + date.slice(11, 16);
}

function ViewAssignmentsScreen({route, navigation}) {
    const { assignment } = route.params;

    return (
        <ScrollView style={theme.container}>
                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            
                            <Text style={theme.cardTitle}>{assignment.title}</Text>
                            <Text style={theme.cardText}>{assignment.description}</Text>
                            <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text>
                            {assignment.assignmentDocumentLinks.map((link, linkIndex) => (
                                <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                                </TouchableOpacity>
                            ))}
                            <Text style={theme.cardTextSecondary}>Created on: {trimDate(assignment.createdAtDate)}</Text>

                        </View>
                        <View style={theme.buttonContainer2}>
                            <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('SubmitAssignmentScreen', {assignmentID: assignment.assignmentId})}>
                                <Text style={theme.smallButtonText}>Submit Assignment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {assignment.submissionLinks && assignment.submissionLinks.length > 0 ? (
                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            <View style={theme.oneRow}> 
                                <Text style={theme.cardTitlePurple}>My Submission</Text>
                            </View>
                            {assignment.submissionLinks && assignment.submissionLinks.map((link, linkIndex) => (
                                <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}> {getFileNameFromUrl(link)}</Text>
                                </TouchableOpacity>
                            ))}
                            <Text style={theme.cardText}>{assignment.studentComment}</Text>
                            <Text style={theme.cardTextSecondary}>Submitted on: {trimDate(assignment.submissionTimestamp)}</Text>

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

                    {assignment.teacherFeedback ? (
                        <View style={theme.card3}>
                            <View style={theme.cardTextContainer}>
                                <View style={theme.oneRow}> 
                                    <Text style={theme.cardTitlePurple}>Feedback</Text>
                                        <View style={theme.smallButton}>
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
                                <Text style={theme.cardTextSecondary}>Posted on: {trimDate(assignment.feedbackTimestamp)}</Text>

                            </View>
                        </View>
                    ) : (
                        <View style={theme.card3}>
                            <View style={theme.cardTextContainer}>
                                <View style={theme.oneRow}>
                                    <Text style={theme.cardText}>No feedback yet.</Text>
                                </View>
                            </View>
                        </View>
                    )}
        </ScrollView>
    );
}

export default ViewAssignmentsScreen;

