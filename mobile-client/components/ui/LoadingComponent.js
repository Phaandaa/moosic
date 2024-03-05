// LoadingComponent.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingComponent = ({ isLoading, children }) => {
  if (!isLoading) return children;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
  },
});

export default LoadingComponent;
