import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Correct import statement
import theme from '../../screens/styles/theme';

const BoxComponent = ({ color, title, iconName, navigation }) => {
  const handleStart = () => {
    // Navigation logic to the other page (replace 'OtherPage' with your actual page name)
    // navigation.navigate('OtherPage');
  };

  return (
    <View style={[theme.box, { backgroundColor: color}]}>
      {/* Title */}
      <Text style={theme.textTitle}>{title}</Text>

      {/* Icon (conditional rendering) */}
      {iconName && <Ionicons name={iconName} size={30} color="white" />}

      {/* Start Button */}
      <TouchableOpacity style={[theme.button]} onPress={handleStart}>
        <Text style={theme.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BoxComponent;
