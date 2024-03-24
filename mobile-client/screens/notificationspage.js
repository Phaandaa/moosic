import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Notifications</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SetReminderScreen')}>
        <Text style={styles.buttonText}>Set Reminder</Text>
        <Ionicons name="alarm-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginRight: 10,
  },
});
