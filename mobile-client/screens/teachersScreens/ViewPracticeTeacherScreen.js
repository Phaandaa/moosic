import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Dimensions, Button, Linking} from 'react-native';
import theme from '../../styles/theme';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import { Ionicons } from '@expo/vector-icons';
import trimDate from '../../components/ui/trimDate';
import DeleteModal from '../../components/ui/DeleteModal';
import axios from 'axios';
import { useAuth } from '../../context/Authcontext';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop().slice(37);
};

function ViewPracticeTeacherScreen({route, navigation}){
    const { state } = useAuth();
    const { practice } = route.params;

    const [isModalVisible, setModalVisible] = useState(false);
    const [studentID, setStudentID] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [practiceData, setPracticeData] = useState([]);
    const [fetchError, setFetchError] = useState(false);

    const handleModalButtonPress = () => {
        deletePractice();
        setModalVisible(false);
    };

    const handleModalButtonPressCancel = () => {
        setModalVisible(false);
    };
    
    const deletePractice = async() => {
        console.log('ViewPracticeTeacherScreen.js line 33, practiceID', practice.id)
        try {
            const response = await axios.delete(`${IP_ADDRESS}/practices/${practice.id}`, state.authHeader);
            Alert.alert('Success', 'Practice has been removed!');
            navigation.goBack();
        } catch (error) {
            console.error('ViewPracticeTeacherScreen.js line 39, Error deleting practice:', error);
        }
    };

    return (
        <ScrollView style={theme.container}>
                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            
                            <Text style={theme.cardTitle}>{practice.title}</Text>
                            <Text style={theme.cardText}>{practice.comment}</Text>
                                <TouchableOpacity onPress={() => Linking.openURL(practice.videoLink)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}>{getFileNameFromUrl(practice.videoLink)}</Text>
                                </TouchableOpacity>
                            <Text style={theme.cardTextSecondary}>Created on: {trimDate(practice.submissionTimestamp)}</Text>

                        </View>
                        <View style={theme.buttonContainer2}>
                                <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('ProvidePracticeFeedbackScreen', {practiceID : practice.id})}>
                                    <Text style={theme.smallButtonText}>Give Feedback</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={theme.smallButtonLeftMargin} onPress={() => setModalVisible(true)}>
                                    <Text style={theme.smallButtonText}>Delete <Ionicons name="trash-bin" size={16} color="#ffffff" /></Text>
                                </TouchableOpacity>
                        </View>
                        
                    </View>

                    {practice.feedback ? (
                        <View style={theme.card3}>
                            <View style={theme.cardTextContainer}>
                                <View style={theme.oneRow}> 
                                    <Text style={theme.cardTitlePurple}>Feedback</Text>
                                        <View style={theme.smallButton}>
                                            <Text style={theme.smallButtonText}>{practice.points} Points</Text>
                                        </View>
                                </View>
                                <Text style={theme.cardText}>{practice.feedback}</Text>
                                {practice.feedbackLinks &&
                                <TouchableOpacity onPress={() => Linking.openURL(practice.feedbackLinks)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="link" size={24} color="#525F7F" />
                                        <Text style={theme.documentName}> {getFileNameFromUrl(practice.feedbackLinks)}</Text>
                                </TouchableOpacity>
                                }

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

                    <DeleteModal 
                        isModalVisible={isModalVisible} 
                        imageSource={require('../../assets/deletenote.png')}
                        textMessage="Are you sure you want to delete this record?"
                        buttonText1="Cancel"
                        buttonText2="Delete"
                        onButton1Press={handleModalButtonPressCancel}
                        onButton2Press={handleModalButtonPress}
                    />
        </ScrollView>
    );
}
export default ViewPracticeTeacherScreen;