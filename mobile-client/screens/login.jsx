// Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import theme from './styles/theme';
import Box from './styles/box';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    // For simplicity, let's assume login is successful
    // In a real app, you should perform authentication and handle success/failure accordingly

    // Navigate to the homepage if login is successful
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={theme.container}>
      <AnimatedPlaceholderInput placeholder="Email" secureTextEntry={false}/>
      <AnimatedPlaceholderInput placeholder="Password"secureTextEntry={true}/>
        
        <TouchableOpacity style={theme.button} onPress={handleLogin}>
          <Text style={theme.buttonText}>Log In</Text>
        </TouchableOpacity>
      
      
    </View>
  );
};



export default LoginPage;
