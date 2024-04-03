import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import theme from '../../styles/theme'

const { width } = Dimensions.get('window');
const MARGIN = 10; 
const BOXES_PER_ROW = 2; 
const FLATLIST_PADDING = 20; 
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
        {iconName && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconName}
              size={80}
              color={iconColor}
            />
          </View>
        )}

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

const styles = StyleSheet.create({
  box: {
    margin: MARGIN / 2,
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 10,
    borderRadius: 15, 
    height: 200, 
    width: ITEM_WIDTH,
    
  },
  iconContainer: {
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
