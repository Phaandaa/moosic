import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Dimensions, Button, Linking} from 'react-native';
import Modal from 'react-native-modal';
import theme from '../../styles/theme';
import { Audio, Video, ResizeMode} from 'expo-av';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import { Ionicons } from '@expo/vector-icons';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop().slice(37);
};

function ViewPracticeTeacherScreen({route, navigation}){
    // const practiceData = useSelector(state => state.cache.practiceData);
    const { practice } = route.params;
    console.log(practice)

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
                            {/* <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text> */}
                            {/* <Text style={theme.cardText}>Attachments:</Text> */}
                            {/* {practice.videoLink.map((link, linkIndex) => ( */}
                                <TouchableOpacity onPress={() => Linking.openURL(practice.videoLink)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}>{getFileNameFromUrl(practice.videoLink)}</Text>
                                </TouchableOpacity>
                            {/* ))} */}
                        </View>
                        <View style={theme.buttonContainer2}>
                                <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('ProvidePracticeFeedbackScreen', {practiceID : practice.id})}>
                                    <Text style={theme.smallButtonText}>Give Feedback</Text>
                                </TouchableOpacity>
                        </View>
                    </View>

                    {practice.feedback ? (
                        <View style={theme.card3}>
                            <View style={theme.cardTextContainer}>
                                <View style={theme.oneRow}> 
                                    <Text style={theme.cardTitlePink}>Feedback</Text>
                                    {/* <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text> */}
                                    {/* <Text style={theme.cardText}>Attachments:</Text> */}
                                        <View style={theme.smallPinkButton}>
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
export default ViewPracticeTeacherScreen;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#EE97BC',
        padding: 20,
        borderRadius: 15,
        marginTop: 10, 
        flexDirection: 'row',
        justifyContent: 'space-between', // Align items on both ends
        alignItems: 'center', // Center items vertically
    },
    cardTextContainer: {
        flex: 1, // Take up as much space as possible
        marginRight: 8, // Add some margin to the right of the text
    },
    cardText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        // If you need space between buttons add justifyContent: 'space-between',
    },
    smallButton: {
        backgroundColor: '#4664EA',
        padding: 10,
        borderRadius: 15,
        marginLeft: 8, // Add some margin to separate the buttons
    },
    smallButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalVideo: {
        width: Dimensions.get('window').width * 0.8, // 80% of window width
        height: Dimensions.get('window').height * 0.7
    }
})
