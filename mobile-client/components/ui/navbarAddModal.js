// CreateOptionsModal.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useAuth } from './context/AuthContext'; // Adjust the import path as necessary

const CreateOptionsModal = ({ navigation }) => {
  const { state } = useAuth();

  return (
    <View style={styles.container}>
      {state.userRole === 'Teacher' ? (
        <>
          <Button title="Create Assignment" onPress={() => navigation.navigate('CreateAssignmentScreen')} />
          <Button title="Create Goals" onPress={() => navigation.navigate('CreateGoalsForStudents')} />
        </>
      ) : (
        <Button title="Create Practice Log" onPress={() => navigation.navigate('CreatePracticeScreen')} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateOptionsModal;
