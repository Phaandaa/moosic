import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Modal, Button, Dimensions} from 'react-native';
import theme from './styles/theme';
import ProvidePracticeFeedbackScreen from './ProvidePracticeFeedbackScreen';
import { useSelector } from 'react-redux';
import { Audio, Video, ResizeMode} from 'expo-av';
function PracticeListTeacherScreen({navigation}){
    // const practiceData = useSelector(state => state.cache.practiceData);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const openVideo = (uri) => {
        setSelectedVideo(uri);
        toggleModal(); 
    }

    return (
        <View style={theme.container}> 
        {/* Student 1  */}
            <TouchableOpacity style={theme.card}>
                <View style={theme.cardTextContainer}>
                    <Text style={theme.cardTextBold}>Dummy Song</Text>
                    <Text style={theme.cardText}>Dummy comment</Text>
                </View>
                <View style={theme.buttonContainer}>
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText} onPress={() => openVideo(require('../assets/dummyvid.mp4'))}>Recording</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText} onPress={() => navigation.navigate(ProvidePracticeFeedbackScreen)}>Feedback</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            {/* Modal for viewing the video */}
            <Modal
                    isVisible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {/* {selectedVideo && ( */}
                                <Video
                                source={require('../assets/dummyvid.mp4')}
                                style={styles.modalVideo}
                                resizeMode={ResizeMode.CONTAIN}
                                shouldPlay
                            />
                            {/* )} */}
                            <Button title="Close" onPress={toggleModal} />
                        </View>
                    </View>
                </Modal>
        </View>

    )
}
export default PracticeListTeacherScreen;

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
