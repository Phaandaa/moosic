import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from './context/Authcontext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {

  const {signOut} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setuserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const checkStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('authData');
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        return parsedData;
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage', error);
    }
    return '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkStoredData();
        setuserName(data.name);
        setUserEmail(data.email);
      } catch (error) {
        console.error('Error processing stored data', error);
      }
    };
    fetchData();
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out', error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <View style={styles.container}>
      {/* <Image
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style={styles.profileImage}
      /> */}
      <Text style={styles.name}>{userName}</Text>
      <Text style={styles.email}>{userEmail}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProfileScreen;
