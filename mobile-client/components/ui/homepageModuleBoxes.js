import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import theme from '../../styles/theme'

const BoxComponent = ({
  color,
  title,
  iconName,
  navigation,
  navigationPage,
  subtitle,
  iconColor,
  buttonText,
}) => {
  const handleStart = () => {
    // Navigation logic to the other page (replace 'OtherPage' with your actual page name)
    navigation.navigate(navigationPage);
  };

  const calculateFontSize = () => {
    // Adjust these values based on your preferences
    const baseFontSize = 20;
    const maxButtonWidth = 200; // Maximum width of the button

    const buttonTextLength = buttonText.length;
    const calculatedFontSize = Math.min(baseFontSize, maxButtonWidth / buttonTextLength);

    return calculatedFontSize;
  };

  return (
    <View style={[theme.box, { backgroundColor: color, overflow: 'hidden', position: 'relative'}]}>
      {/* Icon (conditional rendering) */}
      {iconName && (
        <Ionicons
          name={iconName}
          size={170}
          color={iconColor}
          style={{ position: 'absolute', bottom: -10, right: -20 }}
        />
      )}

      {/* Title */}
      <Text
        style={[
          theme.textBold,
          { textAlign: 'left', color: 'white', fontSize: 16, fontStyle: 'italic' },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          theme.textSubtitle,
          { textAlign: 'left', color: 'white', fontSize: 20, fontStyle: 'italic',  width: '75%' },
        ]}
      >
        {subtitle}
      </Text>

      {/* Start Button */}
      <TouchableOpacity
        style={[
          theme.button,
          {
            marginTop: 20,
            marginBottom: 20,
            width: '40%',
            backgroundColor: 'white',
            borderRadius: 25,
            padding: 5,
          },
        ]}
        onPress={handleStart}
      >
        <Text
          style={[
            theme.buttonText,
            { color: color, fontSize: calculateFontSize() },
          ]}
        >
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BoxComponent;
