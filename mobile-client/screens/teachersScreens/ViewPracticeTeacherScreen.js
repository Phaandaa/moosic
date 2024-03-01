import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert, Dimensions, Button, Linking} from 'react-native';
import Modal from 'react-native-modal';
import theme from '../../styles/theme';
import { Audio, Video, ResizeMode} from 'expo-av';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../constants/ip_address_temp';
import { Ionicons } from '@expo/vector-icons';

// Utility function to extract file name from URL
const getFileNameFromUrl = (url) => {
    if (!url) return '';
    return url.split('/').pop().slice(37);
};

const ViewPracticeTeacherScreen = ({ route, navigation }) => {
    const { practice } = route.params;

    // Render a link or disabled text based on the file's presence and validity
    const renderLinkOrDisabledText = (link, iconName, iconColor) => {
        const fileName = getFileNameFromUrl(link);
        if (link && fileName) {
            return (
                <TouchableOpacity onPress={() => Linking.openURL(link)} style={styles.linkContainer}>
                    <Ionicons name={iconName} size={24} color={iconColor} />
                    <Text style={theme.documentName}>{fileName}</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity style={styles.disabledLinkContainer}>
                    <Ionicons name={iconName} size={24} color={iconColor} />
                    <Text style={theme.cardText}>No file available</Text>
                </TouchableOpacity>
            );
        }
    };

    return (
        <ScrollView style={theme.container}>
            <View style={theme.card3}>
                <View style={theme.cardTextContainer}>
                    <Text style={theme.cardTitle}>{practice.title}</Text>
                    <Text style={theme.cardText}>{practice.comment}</Text>

                    {renderLinkOrDisabledText(practice.videoLink, "link", "#525F7F")}

                    <View style={theme.buttonContainer2}>
                        <TouchableOpacity style={theme.smallButton} onPress={() => navigation.navigate('ProvidePracticeFeedbackScreen', {practiceID : practice.id})}>
                            <Text style={theme.smallButtonText}>Give Feedback</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {practice.feedback ? (
                <View style={theme.card3}>
                    <View style={theme.cardTextContainer}>
                        <View style={theme.oneRow}>
                            <Text style={theme.cardTitlePink}>Feedback</Text>
                            <View style={theme.smallPinkButton}>
                                <Text style={theme.smallButtonText}>{practice.points} Points</Text>
                            </View>
                        </View>
                        {renderLinkOrDisabledText(practice.feedbackLink, "link", "#525F7F")}
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
};
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
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabledLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.5,
    },
})
