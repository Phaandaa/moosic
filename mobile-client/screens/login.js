// LoginPage.js
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import theme from '../styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import { useAuth } from '../context/Authcontext';

import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const { expoPushToken } = route.params;

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log(expoPushToken);
      const response = await signIn(email, password, expoPushToken);
      
      if (response != null){
        // await checkStoredData();
        navigation.navigate('Home');
      }
      
    } catch (error) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  //Checking stored Data
  const checkStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('authData');
      const userData =  await AsyncStorage.getItem('userData');
      
      if (storedData !== null  && userData !== null) {
        // Data exists in AsyncStorage
        const parsedUserData = JSON.parse(userData);
        const parsedData = JSON.parse(storedData);
        console.log("Stored Auth Data:", parsedData);
        console.log("Stored User Data:", parsedUserData);

        // Print out the idToken
        const idToken = parsedData.idToken;
        console.log("Stored idToken:", idToken);

        return parsedData; // Return it if you need to use it
      } else {
        console.log("No data stored in AsyncStorage");
      }
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage', error);
    }
  };

  useEffect(() => {
    // Call this function to check the stored data
    checkStoredData();
  }, []);

  // Fonts are loaded, render the LoginPage
  return (
    
    <View style={theme.container}>
      <Image source={require('../assets/learn2playlogo.png')} style={{...theme.logo}} />
      <Text style={[theme.textTitle, {textAlign: 'center'}]}>Log Into Your Profile</Text>
      <Text style={{...theme.textSubtitle, marginBottom: 40, textAlign:'center'}}>Welcome Back!</Text>

      <AnimatedPlaceholderInput
        style={theme.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        secureTextEntry={false}
      />
      <AnimatedPlaceholderInput
        style={theme.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={{...theme.button, marginTop: 100}} onPress={handleLogin}>
        <Text style={theme.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};



export default LoginPage;
