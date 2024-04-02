import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import theme from '../styles/theme';
import { useAuth } from '../context/Authcontext';
import IP_ADDRESS from '../constants/ip_address_temp';
const NotificationsScreen = ({ navigation }) => {
  const { state, dispatch } = useAuth();
  const [notifications, setNotifications] = useState([]);

  
  useEffect(() => {
    setNotifications(state.notifications);
    const readAllNotifications = async() => {
      try {
          const response = await axios.get(`${IP_ADDRESS}/notifications/mark-read/${state.userData.id}`, state.authHeader);
          dispatch({ type: 'UPDATE_NOTIFS', payload: { notifications: response.data } });
      } catch (error) {
          console.error("Notificationspage.js line 19, ", error);
      }
    };
    readAllNotifications();
  }, []);
  
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
    {notifications.length > 0 ? ( 
          notifications.map((notification, index) => (
            <>
              <View key={notification.id} style={theme.card3}>
                {notification.readStatus == "unread" && <View style={theme.notificationDot} />}
                  <View style={theme.cardTextContainer}>
                      <Text style={theme.cardTitle}>{notification.title}</Text>
                      <Text style={theme.cardText}>{notification.body}</Text>
                      <Text style={theme.cardText}>
                        <Ionicons name="calendar-outline" size={16} color="#525F7F" /> {notification.textDate}
                      </Text>
                  </View>
                  
              </View>
            </>
          ))
      ) : (
          <View style={theme.card2}>
          <Text>No notification found.</Text>
          </View>
      )}
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
  }
});
