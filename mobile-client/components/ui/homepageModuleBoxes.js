import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import theme from '../../styles/theme'

// Get the screen width
const { width } = Dimensions.get('window');
// Define the desired space between items and the padding around the FlatList
const MARGIN = 10; // Margin on each side of a box
const BOXES_PER_ROW = 2; // We want two boxes per row
const FLATLIST_PADDING = 20; // Padding on the sides of the FlatList

// Calculate the item width, taking into account margins and FlatList padding
const ITEM_WIDTH = (width - (FLATLIST_PADDING * 2) - (MARGIN * (BOXES_PER_ROW + 1))) / BOXES_PER_ROW;

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
    navigation.navigate(navigationPage);
  };

  return (
    <TouchableOpacity onPress={handleStart} >
      <View style={[styles.box, { backgroundColor: color }]}>
        {/* Icon centered */}
        {iconName && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconName}
              size={80} // Adjust the size as needed
              color={iconColor}
            />
          </View>
        )}

        {/* Title and subtitle container */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Adjust the styles as needed
const styles = StyleSheet.create({
  box: {
    margin: MARGIN / 2,
    alignItems: 'center', // Center children horizontally
    justifyContent: 'center', // Center children vertically
    padding: 10, // Add padding as needed
    borderRadius: 15, // Add border radius
    height: 200, // Fixed height for the box
    width: ITEM_WIDTH, // Width calculated based on the screen width
    
  },
  iconContainer: {
    // Container for the icon to center it properly
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  textContainer: {
    alignItems: 'center', 
    marginTop: 10, 
  },
  title: {
    fontSize: 16,
    color: 'white',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10,
    color: 'white',
    fontStyle: 'italic',
    width: '50%', 
    textAlign: 'center', 
  },
});

export default BoxComponent;
