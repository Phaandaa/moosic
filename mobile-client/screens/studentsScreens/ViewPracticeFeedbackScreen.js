import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import theme from '../../styles/theme';
import AnimatedPlaceholderInput from '../../components/ui/animateTextInput';
// import PracticeListTeacherScreen from './PracticeListTeacherScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setCache, clearCache } from '../../cacheSlice';
import InputBox from '../../components/ui/inputBox';

function ViewPracticeFeedbackScreen({navigation}){
    const dispatch = useDispatch();
    const practiceData = useSelector(state => state.cache.practiceData);
    const [feedback, setFeedback] = useState('')
    const [showFeedback, setShowFeedback] = useState(false);

    // const toggleFeedback = () => {
    //     {!feedback &&
    //         setShowFeedback(!showFeedback);
    //     }
    // };

    
  
    return (
        <View style={theme.container}> 
            <ScrollView style={theme.container} contentContainerStyle={theme.contentContainer} keyboardShouldPersistTaps='handled'> 
                <View>
                <View style={theme.card2}>
                    <View style={theme.cardTextContainer}>
                        <Text style={theme.cardTitle}>{practiceData.title}</Text>
                        <Text style={theme.cardText}>Comment: {practiceData.comment}</Text>
                        <Text style={theme.cardText}>Created on: Fri Feb 09 2024</Text>
                        <Text style={theme.cardText}>Feedback: Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</Text>
                        
                    </View>
                </View>
                    {/* <AnimatedPlaceholderInput 
                        placeholder="Feedback" 
                        secureTextEntry={false} 
                        value={feedback}
                        onChangeText={setFeedback}>    
                    </AnimatedPlaceholderInput> */}

                    {/* <InputBox label="Feedback" placeholder='Good Job!' value={feedback} onChangeText={setFeedback}/> */}

                    {/* Submit button */}
                    {/* <TouchableOpacity style={theme.button} onPress={submitHandler}>
                        <Text style={theme.buttonText}>Submit</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
        </View>
    )
}
export default ViewPracticeFeedbackScreen;