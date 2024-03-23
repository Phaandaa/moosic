import AsyncStorage from '@react-native-async-storage/async-storage';

const saveNotification = async (notification) => {
  try {
    // Serialize the notification object
    const jsonValue = JSON.stringify(notification);
    // Save the serialized notification under a specific key, e.g., 'localNotifications'
    await AsyncStorage.setItem('localNotifications', jsonValue);
  } catch (e) {
    // Saving error
    console.error("Error saving notification", e);
  }
};

const getNotifications = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('localNotifications');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // Retrieving error
      console.error("Error retrieving notifications", e);
      return null;
    }
  };

export default { saveNotification, getNotifications };