// Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    // For simplicity, let's assume login is successful
    // In a real app, you should perform authentication and handle success/failure accordingly

    // Navigate to the homepage if login is successful
    navigation.navigate('HomeScreen');
  };

  return (
    <View>
      <Text>Login Page</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginPage;
