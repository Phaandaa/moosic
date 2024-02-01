// LoginPage.js
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import theme from './styles/theme';
import AnimatedPlaceholderInput from '../components/ui/animateTextInput';
import { useAuth } from './context/Authcontext';
import LottieView from 'lottie-react-native';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);

  console.log(email)
  console.log(password)

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await signIn(email, password);
      console.log(response)
      
      if (response != null){
        navigation.navigate('MainApp');
      }
    } catch (error) {
      alert("Wrong email or password");
      setIsLoading(false);
    }
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
