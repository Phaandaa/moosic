import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoadingScreen = () => (
  <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', 
  },
});

export default LoadingScreen;
