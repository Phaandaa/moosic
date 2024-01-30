// Login.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Stylesheet } from 'react-native';
import theme from './styles/theme';
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
