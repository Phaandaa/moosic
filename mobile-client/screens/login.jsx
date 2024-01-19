// Login.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import * as SplashScreen from 'expo-splash-screen';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Load fonts
 

  const handleLogin = () => {
    // Add your login logic here
    // For simplicity, let's assume login is successful
    // In a real app, you should perform authentication and handle success/failure accordingly

    // Navigate to the homepage if login is successful
    navigation.navigate('HomeScreen');
  };

  

  // Fonts are loaded, render the LoginPage
  return (
    <View style={theme.container}>
      <AnimatedPlaceholderInput
        style={theme.input}
        placeholder="Email"
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

      <TouchableOpacity style={theme.button} onPress={handleLogin}>
        <Text style={theme.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;
