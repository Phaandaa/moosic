import React, {useState} from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';

function ProvidePracticeFeedbackScreen({}){
    return (
        <View style={theme.container}> 
            <ScrollView style={theme.container} contentContainerStyle={theme.contentContainer}> 
                <View>
                    <AnimatedPlaceholderInput 
                        placeholder="Feedback" 
                        secureTextEntry={false} 
                        textInputConfig={{autoCapitalize: 'words'}}
                        value={assignmentName}
                        onChangeText={setAssignmentName}>    
                    </AnimatedPlaceholderInput>
                </View>
            </ScrollView>
        </View>
    )
}
export default ProvidePracticeFeedbackScreen;