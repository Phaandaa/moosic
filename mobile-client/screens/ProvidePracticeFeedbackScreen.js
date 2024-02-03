import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';

function ProvidePracticeFeedbackScreen({}){
    const [feedback, setFeedback] = useState('');
    return (
        <View style={theme.container}> 
            <ScrollView style={theme.container} contentContainerStyle={theme.contentContainer}> 
                <View>
                    <AnimatedPlaceholderInput 
                        placeholder="Feedback" 
                        secureTextEntry={false} 
                        textInputConfig={{autoCapitalize: 'words'}}
                        value={feedback}
                        onChangeText={setFeedback}>    
                    </AnimatedPlaceholderInput>
                </View>
            </ScrollView>
        </View>
    )
}
export default ProvidePracticeFeedbackScreen;