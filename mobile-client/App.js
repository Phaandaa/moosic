import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './screens/login';
import HomePage from './screens/home';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginPage} options={{title: 'Login'}}/>
        <Stack.Screen name="HomeScreen" component={HomePage} options={{title: 'Home'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;