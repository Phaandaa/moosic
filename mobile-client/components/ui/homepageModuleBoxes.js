import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Correct import statement
import theme from '../../screens/styles/theme';

const BoxComponent = ({ color, title, iconName, navigation, subtitle,iconColor }) => {
  const handleStart = () => {
    // Navigation logic to the other page (replace 'OtherPage' with your actual page name)
    // navigation.navigate('OtherPage');
  };

  return (
    <View style={[theme.box, { backgroundColor: color, overflow: 'hidden', position: 'relative' }]}>
      {/* Icon (conditional rendering) */}
      {iconName && (
        <Ionicons
          name={iconName}
          size={170}
          color= {iconColor}
          style={{ position: 'absolute', bottom: -20, right: -40 }}
        />
      )}

      {/* Title */}
      <Text style={[theme.textBold, { textAlign: 'left', color: 'white', fontSize: 16, fontStyle:"italic"}]}>{title}</Text>
      <Text style={[theme.textSubtitle, { textAlign: 'left', color:'white', fontSize: 20, fontStyle:'italic' }]}>{subtitle}</Text>


      {/* Start Button */}
      <TouchableOpacity style={[theme.button, {marginTop: 30, marginBottom: 30, width: '40%'}]} onPress={handleStart}>
        <Text style={theme.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BoxComponent;
