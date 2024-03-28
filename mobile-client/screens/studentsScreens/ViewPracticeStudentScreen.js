import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Dimensions, Button, Linking} from 'react-native';
import theme from '../../styles/theme';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import { Ionicons } from '@expo/vector-icons';
import trimDate from '../../components/ui/trimDate';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop().slice(37);
};

function ViewPracticeStudentScreen({route, navigation}){
    // const practiceData = useSelector(state => state.cache.practiceData);
    const { practice } = route.params;
    console.log('ViewPracticeStudent.js line 17, practice: ', practice)

    const [isModalVisible, setModalVisible] = useState(false);
    const [studentID, setStudentID] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [practiceData, setPracticeData] = useState([]);
    const [fetchError, setFetchError] = useState(false);

    return (
        <ScrollView style={theme.container}>
            {/* <Text style={[theme.textTitle, { marginTop: 50, verticalAlign: 'middle' }]}>Your Assignments</Text> */}
                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            
                            <Text style={theme.cardTitle}>{practice.title}</Text>
                            <Text style={theme.cardText}>{practice.comment}</Text>
                            <Text style={theme.cardTextSecondary}>Created on: {trimDate(practice.submissionTimestamp)}</Text>

                            {/* <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text> */}
                            {/* <Text style={theme.cardText}>Attachments:</Text> */}
                            {/* {practice.videoLink.map((link, linkIndex) => ( */}
                                <TouchableOpacity onPress={() => Linking.openURL(practice.videoLink)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}>{getFileNameFromUrl(practice.videoLink)}</Text>
                                </TouchableOpacity>
                            {/* ))} */}
                        </View>
                    </View>

                    {practice.feedback ? (
                        <View style={theme.card3}>
                            <View style={theme.cardTextContainer}>
                                <View style={theme.oneRow}> 
                                    <Text style={theme.cardTitlePurple}>Feedback</Text>
                                    {/* <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text> */}
                                    {/* <Text style={theme.cardText}>Attachments:</Text> */}
                                        <View style={theme.smallButton}>
                                            <Text style={theme.smallButtonText}>{practice.points} Points</Text>
                                        </View>
                                </View>
                                <TouchableOpacity onPress={() => Linking.openURL(practice.feedbackLinks)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="link" size={24} color="#525F7F" />
                                        <Text style={theme.documentName}> {getFileNameFromUrl(practice.feedbackLinks)}</Text>
                                </TouchableOpacity>
                                <Text style={theme.cardText}>{practice.feedback}</Text>
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
export default ViewPracticeStudentScreen;