import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Dimensions, Button, Linking} from 'react-native';
import Modal from 'react-native-modal';
import theme from '../../styles/theme';
import { Audio, Video, ResizeMode} from 'expo-av';
import { useSelector } from 'react-redux';
import PracticeScreen from './CreatePracticeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import { Ionicons } from '@expo/vector-icons';

const getFileNameFromUrl = (url) => {
    return url.split('/').pop();
};

function ViewPracticeStudentScreen({route, navigation}){
    // const practiceData = useSelector(state => state.cache.practiceData);
    const { practice } = route.params;

    const [isModalVisible, setModalVisible] = useState(false);
    const [studentID, setStudentID] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [practiceData, setPracticeData] = useState([]);
    const [fetchError, setFetchError] = useState(false);


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const openVideo = (uri) => {
        setSelectedVideo(uri);
        // toggleModal(); 
    };

    // Check stored data for studentID
    const checkStoredData = async () => {
    try {
        const storedData = await AsyncStorage.getItem('authData');
        if (storedData !== null) {
            const parsedData = JSON.parse(storedData);
            console.log('studentID:', parsedData.userId);
            return parsedData.userId;
        }
    } catch (error) {
        console.error('Error retrieving data from AsyncStorage', error);
    }
    return '';
    };

    // Fetch studentID on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await checkStoredData();
                setStudentID(id);
                console.log(studentID)
            } catch (error) {
                console.error('Error processing stored data', error);
            }
        };
        fetchData();
    }, []);

    // // Fetch practices using studentID
    // useEffect(() => {
    //     const fetchAssignments = async() => {
    //         try {
    //             const response = await fetch(`${IP_ADDRESS}/practices/student/${studentID}`, {
    //                 method: 'GET'
    //             });
                
    //             if (!response.ok) {
    //                 const errorText = response.statusText || 'Unknown error occurred';
    //                 throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    //             }
    //             const responseData = await response.json();
    //             setPracticeData(responseData); // Set the state with the response data
    //             console.log(practiceData)
    //             setFetchError(false); // Set fetch error as false since the fetch was successful
    //         } catch (error) {
    //             console.error('Error fetching assignments:', error);
    //             setFetchError(true);
    //         }
    //     };
    //     if(studentID){
    //         fetchAssignments();
    //     }
    // }, [studentID]);


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
                                    <Text style={theme.documentName}> {getFileNameFromUrl(practice.videoLink)}</Text>
                                </TouchableOpacity>
                            {/* ))} */}
                        </View>
                        <View style={theme.buttonContainer2}>
                            <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('SubmitAssignmentScreen')}>
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
                            <TouchableOpacity onPress={() => Linking.openURL(practice.videoLink)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}> {getFileNameFromUrl(practice.videoLink)}</Text>
                            </TouchableOpacity>
                            <Text style={theme.cardText}>This is the student's comment.</Text>
                        </View>
                    </View>

                    <View style={theme.card3}>
                        <View style={theme.cardTextContainer}>
                            <View style={theme.oneRow}> 
                                <Text style={theme.cardTitlePink}>Feedback</Text>
                                {/* <Text style={theme.cardText}><Ionicons name="calendar-outline" size={16} color="#525F7F" /> {assignment.deadline}</Text> */}
                                {/* <Text style={theme.cardText}>Attachments:</Text> */}
                                    <View style={theme.smallPinkButton}>
                                        <Text style={theme.smallButtonText}>10 Points</Text>
                                    </View>
                            </View>
                            <TouchableOpacity onPress={() => Linking.openURL(practice.videoLink)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="link" size={24} color="#525F7F" />
                                    <Text style={theme.documentName}> {getFileNameFromUrl(practice.videoLink)}</Text>
                            </TouchableOpacity>
                            <Text style={theme.cardText}>This is the teacher's feedback.</Text>
                        </View>
                    </View>
        </ScrollView>
    );
}
export default ViewPracticeStudentScreen;

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
