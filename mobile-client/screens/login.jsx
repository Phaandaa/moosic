// Login.js
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const LoginPage = ({ navigation }) => {
  // Your login component code here
  return (
    <View>
      <Text>Login Page</Text>
      <TextInput placeholder="Username" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default LoginPage;
