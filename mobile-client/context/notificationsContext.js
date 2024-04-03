import AsyncStorage from '@react-native-async-storage/async-storage';

const saveNotification = async (notification) => {
  try {
    const jsonValue = JSON.stringify(notification);
    await AsyncStorage.setItem('localNotifications', jsonValue);
  } catch (e) {
    console.error("Error saving notification", e);
  }
};

const getNotifications = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('localNotifications');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.error("Error retrieving notifications", e);
      return null;
    }
  };

export default { saveNotification, getNotifications };