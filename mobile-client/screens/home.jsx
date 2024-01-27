// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BoxComponent from '../components/ui/practiceModuleBoxes';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BoxComponent  color="#3498db" title="Sample Box" iconName="bulb" navigation={navigation} />
      <Text style={styles.title}>Welcome!</Text>
      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.navigate('Practice')}
      >
        <Text style={styles.buttonText}>Start Practice</Text>
      </TouchableOpacity>
      {/* Add more buttons or features as needed */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateAssignmentScreen')}
      >
        <Text style={styles.buttonText}>Create Assignment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MyStudentsScreen')}
      >
        <Text style={styles.buttonText}>View My Students</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
