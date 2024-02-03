import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import PracticeListTeacherScreen from './PracticeListTeacherScreen';
import { useDispatch, useSelector } from 'react-redux';
import { setCache, clearCache } from '../cacheSlice';

function ProvidePracticeFeedbackScreen({navigation}){
    const dispatch = useDispatch();
    const practiceData = useSelector(state => state.cache.practiceData);
    const [feedback, setFeedback] = useState('')
    const [showFeedback, setShowFeedback] = useState(false);

    const toggleFeedback = () => {
        setShowFeedback(!showFeedback);
    };

    const submitHandler = () => {
        
        // Step 1: Collect Data

        if (!feedback) {
            alert('Please write feedback');
            return;
        }
        else{
            // dispatch(setCache({ key: 'practiceFeedback', value: practiceFeedback })); 
            // dispatch(setFeedback(feedback));
            // dispatch(setCache({ key: 'practiceData', value: practiceData })); 
           
            // Construct the update object
            const updatedPracticeData = {
                ...practiceData,
                feedback: feedback
            };

            // Dispatch setCache with the updated practice data
            dispatch(setCache({ key: 'practiceData', value: updatedPracticeData }));
            toggleFeedback()
            alert('Success!')
        }
    };
  
    return (
        <View style={theme.container}> 
            <ScrollView style={theme.container} contentContainerStyle={theme.contentContainer}> 
                <View>
                <View style={theme.card2}>
                <View style={theme.cardTextContainer}>
                <Text style={theme.cardTitle}>{practiceData.title}</Text>
                <Text style={theme.cardText}>Comment: {practiceData.comment}</Text>
                <Text style={theme.cardText}>Created on:</Text>
                
                {showFeedback && ( 
                <Text style={theme.cardText}>Feedback: {practiceData.feedback}</Text>
                )}

                </View>
                </View>
                    <AnimatedPlaceholderInput 
                        placeholder="Feedback" 
                        secureTextEntry={false} 
                        value={feedback}
                        onChangeText={setFeedback}>    
                    </AnimatedPlaceholderInput>

                    {/* Submit button */}
                    <TouchableOpacity style={theme.button} onPress={submitHandler}>
                        <Text style={theme.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}
export default ProvidePracticeFeedbackScreen;