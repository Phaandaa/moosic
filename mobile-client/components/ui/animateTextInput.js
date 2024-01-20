import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Animated } from 'react-native';

const AnimatedPlaceholderInput = ({ placeholder, secureTextEntry, textInputConfig, value, onChangeText }) => {
  const animatedValue = new Animated.Value(0);

  const handleFocus = () => {
    // Animate placeholder when the input is focused
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    // Animate placeholder back to its original position when the input is blurred
    if (value === '') {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 0],
  });

  const fontSize = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 14], // Adjust these values based on your preference
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.placeholder, { transform: [{ translateY }], fontSize }]}>
        {placeholder}
      </Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        {...textInputConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    bottom: 40, // Adjusted to align with the bottom of the TextInput
    color: '#A1B2CF',
  },
});

export default AnimatedPlaceholderInput;
