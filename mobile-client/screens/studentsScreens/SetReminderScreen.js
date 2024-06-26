import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, View, ScrollView, TouchableOpacity, Text, Button, Image, Alert, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import StudentDropdown from '../../components/ui/StudentDropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setCache } from '../../cacheSlice';
import IP_ADDRESS from '../../constants/ip_address_temp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/colors';
import SuccessModal from '../../components/ui/SuccessModal';
import DeleteModal from '../../components/ui/DeleteModal';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';
import theme from '../../styles/theme';

Notifications.setNotificationHandler({
  handleNotification: async () => {
      return {
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowAlert: true 
      };
  }
});

//// START: NEWLY ADDED FUNCTIONS ////
const allowsNotificationsAsync = async () => {
    const settings = await Notifications.getPermissionsAsync();
    return (
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  };
  
  const requestPermissionsAsync = async () => {
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  };
  //// END: NEWLY ADDED FUNCTIONS ////

function SetReminderScreen({navigation}){
  
    useEffect(() => {
        const subscription1 = Notifications.addNotificationReceivedListener((notification)=> {
            console.log('SetReminderScreen.js line 56, NOTIF RECEIVED');
            console.log('SetReminderScreen.js line 57, notification: ', notification);
            const userName = notification.request.content.data.userName;
            console.log('SetReminderScreen.js line 59, username: ', userName);
        });

        const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('SetReminderScreen.js line 63, NOTIF RESPONSE RECEIVED');
            console.log('SetReminderScreen.js line 64, response: ', response);
        });

        return () => {
            subscription1.remove();
            subscription2.remove();
        }
    }, []);

    const dispatch = useDispatch();
    const [frequency, setFrequency] = useState(1);
    const [notificationTime, setNotificationTime] = useState('');
    const [errors, setErrors] = useState({});

    const [isModalVisible, setModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const handleModalButtonPress = () => {
      navigation.navigate('Home');
      setModalVisible(false);
    };

    const handleDeleteModalButtonPress = () => {
        deleteReminder();
        setDeleteModalVisible(false);
    };
    const handleModalButtonPressCancel = () => {
      setDeleteModalVisible(false);
    };
    
    const deleteReminder = async() => {
      Notifications.cancelAllScheduledNotificationsAsync();
      navigation.navigate('Home');
      setDeleteModalVisible(false);
    };

    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = (event, selectedTime) => {
      const currentTime = selectedTime || time;
      setShowPicker(Platform.OS === 'ios');
      setTime(currentTime);
  
      const formattedTime = format(currentTime, 'p');
      setNotificationTime(formattedTime);
  };

    const validateInputs = () => {
      let isValid = true;
      let errors = {};
  
      if (!frequency || frequency < 1) {
        errors.frequency = 'Please set a valid frequency.';
        isValid = false;
      }
  
      if (!notificationTime) {
        errors.notificationTime = 'Please select a time.';
        isValid = false;
      }
  
      setErrors(errors);
      return isValid; 
    };

    const scheduleUserDefinedNotification = async (time, frequency) => {
        setErrors({});

        if (!validateInputs()) {
          console.log('SetReminderScreen.js line 136: Validation failed. Missing values.');
          return; 
        }

        if (!(time instanceof Date) || isNaN(frequency)) {
            console.error("Invalid time or frequency");
            return;
        }

        await Notifications.cancelAllScheduledNotificationsAsync();

        let triggerDate = new Date(); 
        triggerDate.setHours(time.getHours(), time.getMinutes(), 0, 0); 

        if (triggerDate < new Date()) {
            triggerDate.setDate(triggerDate.getDate() + frequency);
        }

        const trigger = {
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: true 
        };
        
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🎵 Tune Time 🎵",
                body: "Grab your instrument & let the fun begin 🤪",
                data: { withSome: "data" },
            },
            trigger,
        });      
        setModalVisible(true); 
    };

    return (
        <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
            <Text style={styles.header}>Schedule Practice Reminder</Text>
            <View style={styles.deadlineContainer}>
              <Text style={styles.dueDateLabel}>Frequency (days)</Text>
              <View style={styles.counterDisplay}>
                  <View style={styles.counter}>
                      <TouchableOpacity
                        onPress={() => setFrequency(Math.max(1, frequency - 1))}>
                        <Ionicons name="remove-circle" size={40} color={Colors.mainPurple}/>
                      </TouchableOpacity>
                      <View style={styles.countDisplay}>
                        <Text style={styles.counterText}>{frequency}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setFrequency(frequency + 1)}>
                        <Ionicons name="add-circle" size={40} color={Colors.mainPurple}/>
                      </TouchableOpacity>

                  </View>
              </View>
              {errors.frequency && <Text style={styles.errorText}> {errors.frequency}</Text>}
            </View>

            
            <View style={styles.deadlineContainer}>
            <Text style={styles.dueDateLabel}>Time</Text>
              <TouchableOpacity onPress={toggleDatepicker} style={styles.dateDisplay}>
                  <Text style={styles.dateText}>{notificationTime || 'Select time'}</Text>
                  <Ionicons name="calendar" size={24} color={Colors.mainPurple} />
              </TouchableOpacity>
              {errors.notificationTime && <Text style={styles.errorText}>{errors.notificationTime}</Text>}
            </View>

            {showPicker && (
            <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onChange}
            />
            )}

            <View style={{alignItems: 'center'}}>
              <Image source={require('../../assets/musicclock.png')}/>
            </View>

            <SuccessModal 
              isModalVisible={isModalVisible} 
              imageSource={require('../../assets/musicclock.png')}
              textMessage= {`Practice reminder is set for every ${frequency} day(s) at ${notificationTime}.`}
              buttonText="Back to Home"
              onButtonPress={handleModalButtonPress}
            />

            <DeleteModal 
              isModalVisible={isDeleteModalVisible} 
              imageSource={require('../../assets/deletenote.png')}
              textMessage="Are you sure you want to remove all reminders?"
              buttonText1="Cancel"
              buttonText2="Remove"
              onButton1Press={handleModalButtonPressCancel}
              onButton2Press={handleDeleteModalButtonPress}
            />

            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={() => scheduleUserDefinedNotification(time, parseInt(frequency, 10))}>
              <Text style={styles.buttonText}>Schedule Reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[theme.buttonRed, {alignItems: 'center'}]} onPress={() => setDeleteModalVisible(true)}>
              <Text style={styles.buttonText}>Remove All Reminders</Text>
            </TouchableOpacity>

        </View>
        </ScrollView>
    );
};
export default SetReminderScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    emptyText: {
      color: '#cccccc',
      textAlign: 'center',
      marginTop: 10,
    },
    formContainer: {
      padding: 20,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 20,
      color: Colors.fontPrimary,
    },
    normalText: {
      fontSize: 18,
      marginBottom: 20,
      color: Colors.fontPrimary,
    },
    inputContainer: {
      backgroundColor: '#F7F7F7',
      borderRadius: 5,
      marginBottom: 15,
    },
    input: {
      padding: 15,
      fontSize: 16,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    attachFilesSection: {
      backgroundColor: '#F7F7F7',
      borderRadius: 5,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
    },
    attachButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    attachText: {
      marginLeft: 10,
      fontSize: 16,
      color: Colors.mainPurple,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    uploadButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    imageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      marginBottom: 10,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 5,
    },
    removeButton: {
      position: 'absolute',
      top: -10,
      right: -10,
    },
    documentContainer: {
      marginBottom: 20,
      width: '80%',
    },
    documentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    documentName: {
      marginLeft: 10,
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      margin: 10
    },
    dateText: {
      fontSize: 16,
      marginBottom: 10,
      
    },
    dropdown: {
      marginBottom: 20,
    },
    submitButton: {
      marginTop: 20,
    },
    deadlineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#F7F7F7',
      borderRadius: 8,
    },
    dueDateLabel: {
      fontSize: 16,
      color: '#8E8E93',
    },
    dateDisplay: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
    },
    dateText: {
      fontSize: 16,
      color: '#000000', 
    },
    button: {
      backgroundColor: Colors.mainPurple,
      padding: 15,
      borderRadius: 15,
      alignItems: 'center',
      marginBottom: 10,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    goalCounterContainer: {
      alignItems: 'center',
      marginBottom: 20
    },
    counter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countDisplay: {
      paddingVertical: 6,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: 'lightgrey',
      borderRadius: 5,
      margin: 5,
    },
    counterText: {
      fontSize: 25,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    counterDisplay: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center', 
      alignItems: 'center', 
      marginLeft: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
    },
});