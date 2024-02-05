import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import theme from './styles/theme';
import ProvidePracticeFeedbackScreen from './ProvidePracticeFeedbackScreen';
import { useSelector } from 'react-redux';
function PracticeListTeacherScreen({navigation}){
    const practiceData = useSelector(state => state.cache.practiceData);
    return (
        <View style={theme.container}> 
        {/* Student 1  */}
            <TouchableOpacity style={theme.card}>
                <View style={theme.cardTextContainer}>
                    <Text style={theme.cardTextBold}>{practiceData.title}</Text>
                    <Text style={theme.cardText}>{practiceData.comment}</Text>
                </View>
                <View style={theme.buttonContainer}>
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText}>Recording</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={theme.smallButton}>
                        <Text style={theme.smallButtonText} onPress={() => navigation.navigate(ProvidePracticeFeedbackScreen)}>Feedback</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
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
    }
})