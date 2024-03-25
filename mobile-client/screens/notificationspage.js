import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../styles/theme';
const NotificationsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
  {/* Fixed content at the top */}
  <Text style={styles.headerText}>Notifications</Text>
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate('SetReminderScreen')}>
    <Text style={styles.buttonText}>Set Reminder</Text>
    <Ionicons name="alarm-outline" size={20} color="white" />
  </TouchableOpacity>

  {/* Scrollable content */}
  <ScrollView style={theme.container}>
    {/* Conditional rendering for assignment */}
        <View  style={theme.card3}>
          <View style={theme.cardTextContainer}>
            <Text style={theme.cardTitle}>Notif 1</Text>
            <Text style={theme.cardText}>please practice istg</Text>
            <Text style={theme.cardText}>
              <Ionicons name="calendar-outline" size={16} color="#525F7F" /> 2022-03-31
            </Text>
          </View>
        </View>
     

    

    
  </ScrollView>
</View>

  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Adjust as needed
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginRight: 5,
  },
});
