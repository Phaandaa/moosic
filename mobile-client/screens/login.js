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
      const cachedExpoToken = await AsyncStorage.getItem('expoPushToken');
      const response = await signIn(email, password, cachedExpoToken || "");
      
      if (response != null){
        navigation.navigate('Home');
      }
      
    } catch (error) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  const checkStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('authData');
      
      if (storedData !== null) {
        const parsedData = JSON.parse(storedData);
        return parsedData;
      } else {
        console.log("login.js line 51, No data stored in AsyncStorage");
      }
    } catch (error) {
      console.error('login.js line 54, Error retrieving data from AsyncStorage', error);
    }
  };

  useEffect(() => {
    checkStoredData();
  }, []);

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
